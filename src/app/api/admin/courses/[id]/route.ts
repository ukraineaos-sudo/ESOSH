import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { educationCourses } from "@/db/schema";
import {
  canEditContent,
  getAdminSession,
  passwordChangeRequiredResponse,
} from "@/lib/admin/auth";
import { isAdminDeleteConfirm } from "@/lib/admin/confirm-delete";
import { assertSameOrigin } from "@/lib/http/same-origin";

type Ctx = { params: Promise<{ id: string }> };

/** RU: Видалення картки курсу («так»). EN: Delete education course card. */
export async function DELETE(request: Request, ctx: Ctx) {
  const originBlock = assertSameOrigin(request);
  if (originBlock) return originBlock;
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const passwordBlock = passwordChangeRequiredResponse(user);
  if (passwordBlock) return passwordBlock;
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

  const { id: idRaw } = await ctx.params;
  const id = Number(idRaw);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  let body: { confirm?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!isAdminDeleteConfirm(body.confirm)) {
    return NextResponse.json({ ok: false, error: "confirm_required" }, { status: 400 });
  }

  const existing = await db
    .select({ id: educationCourses.id })
    .from(educationCourses)
    .where(eq(educationCourses.id, id))
    .limit(1);
  if (!existing[0]) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  await db.delete(educationCourses).where(eq(educationCourses.id, id));
  return NextResponse.json({ ok: true });
}
