import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/admin/auth";

/** RU: Вход в админку. EN: Admin login endpoint. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const result = await loginAdmin(body.email, body.password);
  if (result === "unavailable") return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  if (result === "invalid") return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
