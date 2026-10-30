import { NextResponse } from "next/server";
import {
  aggregateProgressScore,
  quizModuleIds,
  readTrainingProgress,
} from "@/lib/trainings/progress-cookie";
import { getTrainingBySlug, issueTrainingPassToken } from "@/lib/trainings/score";

type Ctx = { params: Promise<{ slug: string }> };

/**
 * RU: GET — відновити агрегати модулів з progress cookie (після reload; без ключів відповідей).
 * EN: GET — restore module aggregates from progress cookie (after reload; no answer keys).
 */
export async function GET(_request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const training = getTrainingBySlug(slug);
  if (!training) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const progress = await readTrainingProgress(slug);
  if (!progress) {
    return NextResponse.json({
      ok: true,
      modules: {},
      certificateToken: null,
      passed: false,
    });
  }

  const modules: Record<string, { score: number; total: number; scorePercent: number }> = {};
  for (const id of quizModuleIds(training)) {
    const entry = progress.modules[id];
    if (!entry || entry.total < 1) continue;
    modules[id] = {
      score: entry.score,
      total: entry.total,
      scorePercent: (entry.score / entry.total) * 100,
    };
  }

  const course = aggregateProgressScore(slug, progress);
  let certificateToken: string | null = null;
  if (course?.passed) {
    certificateToken = issueTrainingPassToken(slug, course.score, course.total);
  }

  return NextResponse.json({
    ok: true,
    modules,
    certificateToken,
    passed: Boolean(course?.passed),
  });
}
