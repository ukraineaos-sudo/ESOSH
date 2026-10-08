import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { TrainingDetail } from "@/content/trainings/types";
import { MODULE_ATTEMPT_LIMIT } from "@/lib/trainings/module-attempt-budget";
import { getTrainingBySlug } from "@/lib/trainings/score";

export const TRAINING_PROGRESS_COOKIE = "esosh_tp";
const PROGRESS_TTL_MS = 12 * 60 * 60 * 1000;

/**
 * RU: Другорядний cookie-ліміт (UX); авторитетний бюджет — серверний, див. module-attempt-budget.
 * EN: Secondary cookie-side cap (UX only); the authoritative budget is server-side, see module-attempt-budget.
 */
export const MAX_MODULE_SCORE_ATTEMPTS = MODULE_ATTEMPT_LIMIT;

export type ModuleProgressEntry = {
  score: number;
  total: number;
  /** Кількість спроб; відсутнє у старих cookie → 1. Attempts so far; absent in legacy cookies → 1. */
  attempts?: number;
};

export type TrainingProgressPayload = {
  slug: string;
  modules: Record<string, ModuleProgressEntry>;
  exp: number;
};

function progressSecret(): string | null {
  const dedicated = process.env.TRAINING_PASS_SECRET?.trim();
  if (dedicated) return dedicated;
  if (process.env.NODE_ENV === "production") return null;
  return "esosh-training-dev-secret";
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodeCookie(payload: TrainingProgressPayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

function decodeCookie(raw: string, secret: string): TrainingProgressPayload | null {
  const dot = raw.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = sign(body, secret);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const json = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as TrainingProgressPayload;
    if (!json || typeof json !== "object") return null;
    if (typeof json.slug !== "string" || typeof json.exp !== "number") return null;
    if (!json.modules || typeof json.modules !== "object") return null;
    if (Date.now() > json.exp) return null;
    return json;
  } catch {
    return null;
  }
}

/** RU: Quiz-модулі курсу (з питаннями). EN: Course modules that have a quiz. */
export function quizModuleIds(training: TrainingDetail): string[] {
  return training.modules.filter((m) => m.quiz.length > 0).map((m) => m.id);
}

/**
 * RU: Прочитати підписаний progress cookie для slug.
 * EN: Read signed progress cookie for slug.
 */
export async function readTrainingProgress(slug: string): Promise<TrainingProgressPayload | null> {
  const secret = progressSecret();
  if (!secret) return null;
  const jar = await cookies();
  const raw = jar.get(TRAINING_PROGRESS_COOKIE)?.value;
  if (!raw) return null;
  const payload = decodeCookie(raw, secret);
  if (!payload || payload.slug !== slug) return null;
  return payload;
}

/**
 * RU: Записати/оновити бал модуля в progress cookie.
 * EN: Upsert module score into progress cookie.
 */
export async function writeTrainingProgressModule(
  slug: string,
  moduleId: string,
  entry: ModuleProgressEntry,
): Promise<TrainingProgressPayload | null> {
  const secret = progressSecret();
  if (!secret) return null;

  const prev = await readTrainingProgress(slug);
  const next: TrainingProgressPayload = {
    slug,
    modules: { ...(prev?.modules ?? {}), [moduleId]: entry },
    exp: Date.now() + PROGRESS_TTL_MS,
  };

  const jar = await cookies();
  jar.set(TRAINING_PROGRESS_COOKIE, encodeCookie(next, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(PROGRESS_TTL_MS / 1000),
  });
  return next;
}

/**
 * RU: Сумарний бал з progress cookie; null якщо не всі quiz-модулі здані.
 * EN: Aggregate score from progress; null if any quiz module is missing.
 */
export function aggregateProgressScore(
  slug: string,
  progress: TrainingProgressPayload,
): { score: number; total: number; scorePercent: number; passed: boolean } | null {
  const training = getTrainingBySlug(slug);
  if (!training || progress.slug !== slug) return null;
  const ids = quizModuleIds(training);
  if (ids.length === 0) return null;

  let score = 0;
  let total = 0;
  for (const id of ids) {
    const entry = progress.modules[id];
    if (!entry || entry.total < 1) return null;
    score += entry.score;
    total += entry.total;
  }
  const scorePercent = total > 0 ? (score / total) * 100 : 0;
  const threshold = training.passThresholdPercent ?? 80;
  return { score, total, scorePercent, passed: total > 0 && scorePercent >= threshold };
}
