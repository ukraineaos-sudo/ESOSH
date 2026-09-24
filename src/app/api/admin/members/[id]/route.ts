import { NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { applications, members } from "@/db/schema";
import { getAdminSession, passwordChangeRequiredResponse, requireAdmin } from "@/lib/admin/auth";
import { isAdminDeleteConfirm } from "@/lib/admin/confirm-delete";

type Ctx = { params: Promise<{ id: string }> };

/** RU: Видалення картки члена (заявки лишаються, member_id → null). EN: Delete member; unlink apps. */
export async function DELETE(request: Request, ctx: Ctx) {
  const user = await getAdminSession();
  if (!user || !requireAdmin(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
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
    .select({ id: members.id })
    .from(members)
    .where(eq(members.id, id))
    .limit(1);
  if (!existing[0]) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const linked = await db
    .select({ value: count() })
    .from(applications)
    .where(eq(applications.memberId, id));
  const linkedCount = Number(linked[0]?.value ?? 0);

  await db.delete(members).where(eq(members.id, id));

  return NextResponse.json({ ok: true, unlinkedApplications: linkedCount });
}
