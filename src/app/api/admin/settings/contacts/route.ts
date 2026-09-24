import { NextResponse } from "next/server";
import { canEditContent, getAdminSession, passwordChangeRequiredResponse, requireAdmin } from "@/lib/admin/auth";
import { getContactSettings, saveContactSettings, type ContactSettings } from "@/lib/site-settings";

/** RU: Чтение настроек контактов. EN: Read contact settings. */
export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, settings: await getContactSettings() });
}

/** RU: Сохранение контактов (admin). EN: Save contacts (admin only). */
export async function PUT(request: Request) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (!requireAdmin(user) && !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 403 });
  const passwordBlock = passwordChangeRequiredResponse(user);
  if (passwordBlock) return passwordBlock;
  const body = (await request.json()) as ContactSettings;
  const result = await saveContactSettings(body);
  if (result !== "ok") return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  return NextResponse.json({ ok: true });
}
