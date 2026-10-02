import { createHmac, timingSafeEqual } from "node:crypto";
import { riskAssessmentTraining, uavAttacksTraining } from "@/content/trainings";
import type { QuizOptionId, TrainingDetail } from "@/content/trainings/types";
import { answerKeyForModule } from "@/lib/trainings/public";

const PASS_TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

const TRAININGS_BY_SLUG: Record<string, TrainingDetail> = {
  [riskAssessmentTraining.slug]: riskAssessmentTraining,
  [uavAttacksTraining.slug]: uavAttacksTraining,
};

/** RU: Тренінг за slug (server-only). EN: Resolve training by slug (server-only). */
export function getTrainingBySlug(slug: string): TrainingDetail | null {
  return TRAININGS_BY_SLUG[slug] ?? null;
}

export type ModuleScoreResult = {
  score: number;
  total: number;
  scorePercent: number;
  byId: Record<number, boolean>;
  correctById: Record<number, QuizOptionId>;
};

/** RU: Оцінка модуля на сервері. EN: Score one module server-side. */
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
  const byId: Record<number, boolean> = {};
  const correctById: Record<number, QuizOptionId> = {};
  for (const [id, correct] of key) {
    correctById[id] = correct;
    const raw = answers[String(id)] ?? answers[id as unknown as string];
    const ok = raw === correct;
    byId[id] = ok;
    if (ok) score += 1;
  }
  const total = key.size;
  const scorePercent = total > 0 ? (score / total) * 100 : 0;
  return { score, total, scorePercent, byId, correctById };
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

function passSecret(): string {
  return (
    process.env.TRAINING_PASS_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.TURNSTILE_SECRET_KEY ||
    "esosh-training-dev-secret"
  );
}

function signPayload(payload: string): string {
  return createHmac("sha256", passSecret()).update(payload).digest("base64url");
}

/** RU: Підписаний токен доступу до сертифіката. EN: Signed certificate access token. */
export function issueTrainingPassToken(slug: string): string {
  const exp = Date.now() + PASS_TOKEN_TTL_MS;
  const payload = `${slug}.${exp}`;
  return `${payload}.${signPayload(payload)}`;
}

/** RU: Перевірка токена сертифіката. EN: Verify certificate access token. */
export function verifyTrainingPassToken(slug: string, token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [tokenSlug, expRaw, sig] = parts;
  if (tokenSlug !== slug) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const payload = `${tokenSlug}.${expRaw}`;
  const expected = signPayload(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
