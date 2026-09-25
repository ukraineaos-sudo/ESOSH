import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { newsPosts } from "@/db/schema";
import {
  canEditContent,
  getAdminSession,
  passwordChangeRequiredResponse,
} from "@/lib/admin/auth";
import { isAdminDeleteConfirm } from "@/lib/admin/confirm-delete";

type Ctx = { params: Promise<{ id: string }> };

/** RU: Видалення новини (підтвердження «так»). EN: Delete news with «так» confirm. */
export async function DELETE(request: Request, ctx: Ctx) {
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

  const existing = await db.select({ id: newsPosts.id }).from(newsPosts).where(eq(newsPosts.id, id)).limit(1);
  if (!existing[0]) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  await db.delete(newsPosts).where(eq(newsPosts.id, id));
  return NextResponse.json({ ok: true });
}
