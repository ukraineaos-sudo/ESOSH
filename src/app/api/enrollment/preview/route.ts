import { NextResponse } from "next/server";
import { z } from "zod";
import { classifyEnrollment, COMPANY_SIZES, COURSE_TYPES, CPD_STATUSES, EDUCATION_LEVELS } from "@/lib/enrollment/classify";
import { scoreCodexQuiz } from "@/lib/enrollment/quiz";

const previewSchema = z.object({
  oshFunctions: z.boolean(),
  oshYears: z.number().min(0).max(60),
  companySize: z.enum(COMPANY_SIZES),
  profileEducation: z.boolean(),
  educationLevel: z.enum(EDUCATION_LEVELS),
  courses: z.array(z.object({
    courseType: z.enum(COURSE_TYPES),
    courseName: z.string().optional(),
    provider: z.string().optional(),
    courseYear: z.number().optional(),
  })).default([]),
  cpdStatus: z.enum(CPD_STATUSES),
  testAnswers: z.record(z.string(), z.string()).default({}),
});

/** RU: Попередній розрахунок рівня без збереження. EN: Preview classification without persist. */
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ ok: false, error: "invalid_origin" }, { status: 403 });
  }
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = previewSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }
  const testScore = scoreCodexQuiz(parsed.data.testAnswers);
  const result = classifyEnrollment({
    ...parsed.data,
    courses: parsed.data.courses.map((c) => ({
      courseType: c.courseType,
      courseName: c.courseName || "",
      provider: c.provider || "",
      courseYear: c.courseYear || new Date().getFullYear(),
    })),
    testScorePercent: testScore,
  });
  return NextResponse.json({
    ok: true,
    testScore,
    ...result,
  });
}
