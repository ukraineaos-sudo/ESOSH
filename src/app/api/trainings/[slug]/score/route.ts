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
import { fingerprintModuleAnswers } from "@/lib/trainings/module-attempt-budget";
import { assertSameOrigin } from "@/lib/http/same-origin";
import { assertModuleScoreBudget, assertRateLimit } from "@/lib/rate-limit";

type Ctx = { params: Promise<{ slug: string }> };

const scoreBodySchema = z.object({
  moduleId: z.string().min(1).max(128),
  answers: z.record(z.string(), z.string()),
});

function scoreLog(
  level: "info" | "warn",
  payload: Record<string, string | number | boolean | null | undefined>,
) {
  const line = JSON.stringify({ scope: "training_score", ...payload });
  if (level === "warn") console.warn(line);
  else console.info(line);
}

/** RU: Серверна оцінка квізу модуля (+ unlock сертифіката через progress cookie). */
export async function POST(request: Request, ctx: Ctx) {
  const originBlock = assertSameOrigin(request);
  if (originBlock) {
    scoreLog("warn", { event: "reject", error: "invalid_origin" });
    return originBlock;
  }

  const rateBlock = await assertRateLimit(request, "training_score");
  if (rateBlock) {
    scoreLog("warn", { event: "reject", error: "rate_limited", status: rateBlock.status });
    return rateBlock;
  }

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

  const answersFp = fingerprintModuleAnswers(answers);
  const threshold = training.passThresholdPercent ?? 80;
  const previous = (await readTrainingProgress(slug))?.modules[moduleId];
  let effective = { score: result.score, total: result.total, scorePercent: result.scorePercent };
  let attempts = 1;
  let skipWrite = false;
  let skipBudget = false;
  let attemptsRemaining: number | null = null;

  const previousPercent =
    previous && previous.total > 0 ? (previous.score / previous.total) * 100 : null;

  // Ідемпотентний повтор тих самих відповідей — без нового списання бюджету (подвійний клік / retry після обриву).
  // Idempotent replay of the same answers — no new budget consume (double-click / retry after drop).
  if (previous && previous.answersFp && previous.answersFp === answersFp && previous.total > 0) {
    effective = {
      score: previous.score,
      total: previous.total,
      scorePercent: previousPercent ?? (previous.score / previous.total) * 100,
    };
    skipWrite = true;
    skipBudget = true;
    attempts = previous.attempts ?? 1;
  } else if (previous && previousPercent !== null && previousPercent >= threshold) {
    // Модуль уже зданий на поріг курсу: повторні спроби не дають oracle і не знижують бал.
    effective = { score: previous.score, total: previous.total, scorePercent: previousPercent };
    skipWrite = true;
    skipBudget = true;
    attempts = previous.attempts ?? 1;
  }

  if (!skipBudget) {
    const budget = await assertModuleScoreBudget(request, slug, moduleId);
    if (!budget.ok) {
      scoreLog("warn", { event: "reject", error: "budget", slug, moduleId, status: budget.response.status });
      return budget.response;
    }
    attemptsRemaining = budget.attemptsRemaining;

    if (previous && previousPercent !== null) {
      attempts = (previous.attempts ?? 1) + 1;
      if (attempts > MAX_MODULE_SCORE_ATTEMPTS) {
        scoreLog("warn", { event: "reject", error: "too_many_attempts_cookie", slug, moduleId, attempts });
        return NextResponse.json(
          { ok: false, error: "too_many_attempts", retryAfterSec: 3600 },
          { status: 429, headers: { "Retry-After": "3600" } },
        );
      }
    }
  }

  const progress = skipWrite
    ? await readTrainingProgress(slug)
    : await writeTrainingProgressModule(slug, moduleId, {
        score: effective.score,
        total: effective.total,
        attempts,
        answersFp,
      });

  let certificateToken: string | null = null;
  if (progress) {
    const course = aggregateProgressScore(slug, progress);
    if (course?.passed) {
      certificateToken = issueTrainingPassToken(slug, course.score, course.total);
    }
  }

  scoreLog("info", {
    event: "scored",
    slug,
    moduleId,
    skipBudget,
    skipWrite,
    attemptsRemaining,
  });

  // Лише агрегат модуля: без мапи «питання → правильність» і без ключів відповідей.
  return NextResponse.json({
    ok: true,
    score: effective.score,
    total: effective.total,
    scorePercent: effective.scorePercent,
    certificateToken,
    attemptsRemaining,
  });
}
