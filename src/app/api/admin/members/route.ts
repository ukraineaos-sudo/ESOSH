import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { members } from "@/db/schema";
import { getAdminSession, requireAdmin } from "@/lib/admin/auth";

/** RU: Список членів (admin). EN: List members (admin). */
export async function GET() {
  const user = await getAdminSession();
  if (!user || !requireAdmin(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const items = await db.select().from(members).orderBy(desc(members.createdAt)).limit(200);
  return NextResponse.json({ ok: true, items });
}
