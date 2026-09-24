import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { mediaAssets } from "@/db/schema";
import { canEditContent, getAdminSession, passwordChangeRequiredResponse } from "@/lib/admin/auth";

/** RU: Список медиа. EN: List media assets. */
export async function GET() {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const items = await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).limit(200);
  return NextResponse.json({ ok: true, items });
}

/** RU: Загрузка файла в Blob. EN: Upload a file to Vercel Blob. */
export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const passwordBlock = passwordChangeRequiredResponse(user);
  if (passwordBlock) return passwordBlock;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ ok: false, error: "blob_unavailable" }, { status: 503 });
  }
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  const alt = String(form.get("alt") || "");
  const blob = await put(`esosh/${Date.now()}-${file.name.replace(/[^\w.\-]+/g, "_")}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  const [row] = await db.insert(mediaAssets).values({
    url: blob.url,
    pathname: blob.pathname,
    alt,
    contentType: file.type,
    sizeBytes: file.size,
  }).returning();
  return NextResponse.json({ ok: true, item: row });
}
