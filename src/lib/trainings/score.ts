import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import {
  emergencyActionsTraining,
  riskAssessmentTraining,
  uavAttacksTraining,
} from "@/content/trainings";
import type { TrainingDetail } from "@/content/trainings/types";
import { answerKeyForModule } from "@/lib/trainings/public";

const PASS_TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

const TRAININGS_BY_SLUG: Record<string, TrainingDetail> = {
  [riskAssessmentTraining.slug]: riskAssessmentTraining,
  [uavAttacksTraining.slug]: uavAttacksTraining,
  [emergencyActionsTraining.slug]: emergencyActionsTraining,
};

/** RU: Тренінг за slug (server-only). EN: Resolve training by slug (server-only). */
export function getTrainingBySlug(slug: string): TrainingDetail | null {
  return TRAININGS_BY_SLUG[slug] ?? null;
}

export type ModuleScoreResult = {
  score: number;
  total: number;
  scorePercent: number;
};

/**
 * RU: Оцінка модуля на сервері. Повертає лише агрегат (без відповідності питання→правильність).
 * EN: Score one module server-side. Aggregate only — no per-question correctness map.
 */
export function scoreTrainingModule(
  slug: string,
  moduleId: string,
  answers: Record<string, string>,
): ModuleScoreResult | null {
  const training = getTrainingBySlug(slug);
  if (!training) return null;
  const key = answerKeyForModule(training, moduleId);
  if (!key) return null;

  let score = 0;
  for (const [id, correct] of key) {
    const raw = answers[String(id)] ?? answers[id as unknown as string];
    if (raw === correct) score += 1;
  }
  const total = key.size;
  const scorePercent = total > 0 ? (score / total) * 100 : 0;
  return { score, total, scorePercent };
}

/** RU: Сумарний бал курсу. EN: Overall course score from module answers. */
export function scoreTrainingCourse(
  slug: string,
  moduleAnswers: Record<string, Record<string, string>>,
): { score: number; total: number; scorePercent: number; passed: boolean } | null {
  const training = getTrainingBySlug(slug);
  if (!training) return null;
  let score = 0;
  let total = 0;
  for (const mod of training.modules) {
    if (mod.quiz.length === 0) continue;
    const result = scoreTrainingModule(slug, mod.id, moduleAnswers[mod.id] ?? {});
    if (!result) return null;
    score += result.score;
    total += result.total;
  }
  const scorePercent = total > 0 ? (score / total) * 100 : 0;
  const threshold = training.passThresholdPercent ?? 80;
  return { score, total, scorePercent, passed: total > 0 && scorePercent >= threshold };
}

/**
 * RU: Секрет pass/progress. У production лише TRAINING_PASS_SECRET.
 * EN: Pass/progress secret. Production requires TRAINING_PASS_SECRET only.
 */
export function resolveTrainingPassSecret(): string | null {
  const dedicated = process.env.TRAINING_PASS_SECRET?.trim();
  if (dedicated) return dedicated;
  if (process.env.NODE_ENV === "production") return null;
  return "esosh-training-dev-secret";
}

function passSecret(): string | null {
  return resolveTrainingPassSecret();
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export type TrainingPassClaims = {
  slug: string;
  score: number;
  total: number;
  scorePercent: number;
  jti: string;
};

/** RU: Підписаний одноразовий токен (slug + бал + jti). EN: Signed one-time pass token. */
export function issueTrainingPassToken(slug: string, score: number, total: number): string | null {
  const secret = passSecret();
  if (!secret) return null;
  const exp = Date.now() + PASS_TOKEN_TTL_MS;
  const safeScore = Math.max(0, Math.trunc(score));
  const safeTotal = Math.max(0, Math.trunc(total));
  const jti = randomBytes(16).toString("base64url");
  const payload = `${slug}.${exp}.${safeScore}.${safeTotal}.${jti}`;
  return `${payload}.${signPayload(payload, secret)}`;
}

/**
 * RU: Перевірка токена; повертає claims або null.
 * EN: Verify pass token; returns claims or null.
 */
export function verifyTrainingPassToken(slug: string, token: string): TrainingPassClaims | null {
  const secret = passSecret();
  if (!secret) return null;
  const parts = token.split(".");
  if (parts.length !== 6) return null;
  const [tokenSlug, expRaw, scoreRaw, totalRaw, jti, sig] = parts;
  if (tokenSlug !== slug) return null;
  if (!jti || jti.length < 8 || jti.length > 64) return null;
  const exp = Number(expRaw);
  const score = Number(scoreRaw);
  const total = Number(totalRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  if (!Number.isFinite(score) || !Number.isFinite(total) || score < 0 || total < 1 || score > total) {
    return null;
  }
  const payload = `${tokenSlug}.${expRaw}.${scoreRaw}.${totalRaw}.${jti}`;
  const expected = signPayload(payload, secret);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  const scorePercent = Math.round((score / total) * 100);
  return { slug: tokenSlug, score, total, scorePercent, jti };
}

/** RU: Чи бал токена проходить поріг курсу. EN: Whether token score meets course threshold. */
export function passMeetsThreshold(slug: string, scorePercent: number): boolean {
  const training = getTrainingBySlug(slug);
  if (!training) return false;
  const threshold = training.passThresholdPercent ?? 80;
  return scorePercent >= threshold;
}
