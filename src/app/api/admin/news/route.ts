import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { newsPosts } from "@/db/schema";
import { canEditContent, getAdminSession, passwordChangeRequiredResponse } from "@/lib/admin/auth";
import { emptyBlocks } from "@/lib/cms/blocks";

/** RU: Список новостей CMS. EN: List CMS news posts. */
export async function GET() {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const items = await db.select().from(newsPosts).orderBy(desc(newsPosts.updatedAt)).limit(500);
  return NextResponse.json({ ok: true, items });
}

/** RU: Создание новости. EN: Create a news post. */
export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const passwordBlock = passwordChangeRequiredResponse(user);
  if (passwordBlock) return passwordBlock;
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const body = await request.json();
  const locale = body.locale === "en" ? "en" : "uk";
  const slug = String(body.slug || "").trim().replace(/^\/+|\/+$/g, "");
  const title = String(body.title || "").trim();
  if (!slug || !title) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const [row] = await db.insert(newsPosts).values({
    locale,
    slug,
    title,
    excerpt: String(body.excerpt || ""),
    coverUrl: body.coverUrl || null,
    body: Array.isArray(body.body) ? body.body : emptyBlocks(),
    status: body.status === "published" ? "published" : "draft",
    publishedAt: body.status === "published" ? new Date() : null,
  }).returning();
  return NextResponse.json({ ok: true, item: row });
}

/** RU: Обновление новости. EN: Update a news post. */
export async function PUT(request: Request) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const passwordBlock = passwordChangeRequiredResponse(user);
  if (passwordBlock) return passwordBlock;
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const body = await request.json();
  const id = Number(body.id);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const status = body.status === "published" ? "published" : "draft";
  const [row] = await db.update(newsPosts).set({
    title: String(body.title || ""),
    excerpt: String(body.excerpt || ""),
    coverUrl: body.coverUrl || null,
    body: Array.isArray(body.body) ? body.body : emptyBlocks(),
    status,
    publishedAt: status === "published" ? (body.publishedAt ? new Date(body.publishedAt) : new Date()) : null,
    updatedAt: new Date(),
    slug: String(body.slug || "").trim(),
    locale: body.locale === "en" ? "en" : "uk",
  }).where(eq(newsPosts.id, id)).returning();
  return NextResponse.json({ ok: true, item: row });
}
