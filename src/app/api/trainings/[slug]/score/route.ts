import { NextResponse } from "next/server";
import {
  getTrainingBySlug,
  issueTrainingPassToken,
  scoreTrainingCourse,
  scoreTrainingModule,
} from "@/lib/trainings/score";

type Ctx = { params: Promise<{ slug: string }> };

/** RU: Серверна оцінка квізу модуля (+ unlock сертифіката). EN: Server-side module quiz score. */
export async function POST(request: Request, ctx: Ctx) {
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
      certificateToken = issueTrainingPassToken(slug);
    }
  }

  return NextResponse.json({
    ok: true,
    ...result,
    certificateToken: certificateToken ?? null,
  });
}
