import { NextResponse } from "next/server";
import {
  getTrainingBySlug,
  issueTrainingPassToken,
  scoreTrainingCourse,
  scoreTrainingModule,
} from "@/lib/trainings/score";
import { assertSameOrigin } from "@/lib/http/same-origin";
import { assertRateLimit } from "@/lib/rate-limit";

type Ctx = { params: Promise<{ slug: string }> };

/** RU: Серверна оцінка квізу модуля (+ unlock сертифіката). EN: Server-side module quiz score. */
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

  let body: {
    moduleId?: string;
    answers?: Record<string, string>;
    allModuleAnswers?: Record<string, Record<string, string>>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const moduleId = typeof body.moduleId === "string" ? body.moduleId : "";
  const answers =
    body.answers && typeof body.answers === "object" && !Array.isArray(body.answers)
      ? body.answers
      : null;
  if (!moduleId || !answers) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const result = scoreTrainingModule(slug, moduleId, answers);
  if (!result) {
    return NextResponse.json({ ok: false, error: "invalid_module" }, { status: 400 });
  }

  let certificateToken: string | undefined;
  if (body.allModuleAnswers && typeof body.allModuleAnswers === "object") {
    const course = scoreTrainingCourse(slug, body.allModuleAnswers);
    if (course?.passed) {
      certificateToken = issueTrainingPassToken(slug, course.score, course.total);
    }
  }

  // Do not return correctById — keys are stripped from public page payload; leaking them here
  // lets a client harvest answers on a failed attempt and re-submit for a pass token.
  const { correctById: _correctById, ...publicResult } = result;
  void _correctById;

  return NextResponse.json({
    ok: true,
    ...publicResult,
    certificateToken: certificateToken ?? null,
  });
}
