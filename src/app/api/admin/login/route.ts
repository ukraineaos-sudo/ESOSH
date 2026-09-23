import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/admin/auth";

/** RU: Вход в админку по логіну. EN: Admin login endpoint (username). */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username =
    body && typeof body.username === "string"
      ? body.username
      : body && typeof body.login === "string"
        ? body.login
        : null;
  if (!username || typeof body?.password !== "string") {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const result = await loginAdmin(username, body.password);
  if (result === "unavailable") return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  if (result === "invalid") return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
