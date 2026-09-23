import { NextResponse } from "next/server";
import { changeAdminPassword } from "@/lib/admin/auth";

/** RU: Зміна пароля поточного користувача. EN: Change password for the signed-in admin. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.currentPassword !== "string" ||
    typeof body.newPassword !== "string" ||
    typeof body.confirmPassword !== "string"
  ) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const result = await changeAdminPassword({
    currentPassword: body.currentPassword,
    newPassword: body.newPassword,
    confirmPassword: body.confirmPassword,
  });

  if (result === "unavailable") {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
  if (result === "unauthorized") {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (result === "invalid_current") {
    return NextResponse.json({ ok: false, error: "invalid_current" }, { status: 400 });
  }
  if (result === "mismatch") {
    return NextResponse.json({ ok: false, error: "mismatch" }, { status: 400 });
  }
  if (result === "invalid_new") {
    return NextResponse.json({ ok: false, error: "invalid_new" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
