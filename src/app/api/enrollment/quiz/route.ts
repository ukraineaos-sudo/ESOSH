import { NextResponse } from "next/server";
import { publicCodexQuiz } from "@/lib/enrollment/quiz";

/** RU: Питання тесту Кодексу без правильних відповідей. EN: Public codex quiz without answers. */
export async function GET() {
  return NextResponse.json({ ok: true, quiz: publicCodexQuiz() });
}
