import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { pages } from "@/db/schema";
import { canEditContent, getAdminSession } from "@/lib/admin/auth";
import { emptyBlocks } from "@/lib/cms/blocks";

/** RU: Список CMS-страниц. EN: List CMS pages. */
export async function GET() {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const items = await db.select().from(pages).orderBy(desc(pages.updatedAt)).limit(500);
  return NextResponse.json({ ok: true, items });
}

/** RU: Создать/обновить CMS-страницу. EN: Upsert a CMS page document. */
export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const body = await request.json();
  const locale = body.locale === "en" ? "en" : "uk";
  const route = String(body.route || "/").trim() || "/";
  const title = String(body.title || route);
  const status = body.status === "published" ? "published" : "draft";
  const blocks = Array.isArray(body.blocks) ? body.blocks : emptyBlocks();
  const existing = await db.select().from(pages).where(and(eq(pages.locale, locale), eq(pages.route, route))).limit(1);
  if (existing[0]) {
    const [row] = await db.update(pages).set({ title, status, blocks, updatedAt: new Date() }).where(eq(pages.id, existing[0].id)).returning();
    return NextResponse.json({ ok: true, item: row });
  }
  const [row] = await db.insert(pages).values({ locale, route, title, status, blocks }).returning();
  return NextResponse.json({ ok: true, item: row });
}
