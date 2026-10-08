import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getTrainingBySlug,
  issueTrainingPassToken,
  scoreTrainingModule,
} from "@/lib/trainings/score";
import {
  aggregateProgressScore,
  MAX_MODULE_SCORE_ATTEMPTS,
  readTrainingProgress,
  writeTrainingProgressModule,
} from "@/lib/trainings/progress-cookie";
import { assertSameOrigin } from "@/lib/http/same-origin";
import { assertModuleScoreBudget, assertRateLimit } from "@/lib/rate-limit";

type Ctx = { params: Promise<{ slug: string }> };

const scoreBodySchema = z.object({
  moduleId: z.string().min(1).max(128),
  answers: z.record(z.string(), z.string()),
});

/** RU: Серверна оцінка квізу модуля (+ unlock сертифіката через progress cookie). */
export async function POST(request: Request, ctx: Ctx) {
  const originBlock = assertSameOrigin(request);
  if (originBlock) return originBlock;

  const rateBlock = await assertRateLimit(request, "training_score");
  if (rateBlock) return rateBlock;

  const { slug } = await ctx.params;
  const training = getTrainingBySlug(slug);
  if (!training) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = scoreBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const { moduleId, answers } = parsed.data;
  const result = scoreTrainingModule(slug, moduleId, answers);
  if (!result) {
    return NextResponse.json({ ok: false, error: "invalid_module" }, { status: 400 });
  }

  // Модуль, уже зданий на поріг курсу, не переоцінюємо: повторні спроби не дають oracle і не знижують бал.
  // A module already recorded at/above the course threshold is not re-scored: replays give no oracle.
  const threshold = training.passThresholdPercent ?? 80;
  const previous = (await readTrainingProgress(slug))?.modules[moduleId];
  let effective = { score: result.score, total: result.total, scorePercent: result.scorePercent };
  let attempts = 1;
  let skipWrite = false;

  const previousPercent =
    previous && previous.total > 0 ? (previous.score / previous.total) * 100 : null;
  if (previous && previousPercent !== null && previousPercent >= threshold) {
    effective = { score: previous.score, total: previous.total, scorePercent: previousPercent };
    skipWrite = true;
  }

  if (!skipWrite) {
    // Авторитетний бюджет: Neon, ключ IP+курс+модуль, списується ДО відповіді; cookie його не скидає.
    // Authoritative budget: Neon per IP+course+module, consumed BEFORE responding; cookies cannot reset it.
    const budgetBlock = await assertModuleScoreBudget(request, slug, moduleId);
    if (budgetBlock) return budgetBlock;

    if (previous && previousPercent !== null) {
      attempts = (previous.attempts ?? 1) + 1;
      if (attempts > MAX_MODULE_SCORE_ATTEMPTS) {
        return NextResponse.json({ ok: false, error: "too_many_attempts" }, { status: 429 });
      }
    }
  }

  const progress = skipWrite
    ? await readTrainingProgress(slug)
    : await writeTrainingProgressModule(slug, moduleId, {
        score: effective.score,
        total: effective.total,
        attempts,
      });

  let certificateToken: string | null = null;
  if (progress) {
    const course = aggregateProgressScore(slug, progress);
    if (course?.passed) {
      certificateToken = issueTrainingPassToken(slug, course.score, course.total);
    }
  }

  // Лише агрегат модуля: без мапи «питання → правильність» і без ключів відповідей.
  // Aggregate only: never return per-question correctness or answer keys.
  return NextResponse.json({
    ok: true,
    score: effective.score,
    total: effective.total,
    scorePercent: effective.scorePercent,
    certificateToken,
  });
}
