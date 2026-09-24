import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { applicationFiles } from "@/db/schema";
import { canEditContent, getAdminSession, passwordChangeRequiredResponse } from "@/lib/admin/auth";
import { getEnrollmentBlob } from "@/lib/enrollment/files";

type Ctx = { params: Promise<{ id: string; fileId: string }> };

/** RU: Проксі приватного файлу заявки. EN: Proxy private application file. */
export async function GET(request: Request, ctx: Ctx) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const { id: idRaw, fileId: fileRaw } = await ctx.params;
  const applicationId = Number(idRaw);
  const fileId = Number(fileRaw);
  if (!Number.isFinite(applicationId) || !Number.isFinite(fileId)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(applicationFiles)
    .where(and(eq(applicationFiles.id, fileId), eq(applicationFiles.applicationId, applicationId)))
    .limit(1);
  const file = rows[0];
  if (!file) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const blob = await getEnrollmentBlob(file.pathname);
  if (!blob?.stream) {
    return NextResponse.json({ ok: false, error: "blob_missing" }, { status: 404 });
  }

  const dispositionParam = new URL(request.url).searchParams.get("disposition");
  const disposition = dispositionParam === "inline" ? "inline" : "attachment";
  const encodedName = encodeURIComponent(file.originalName);

  return new NextResponse(blob.stream, {
    headers: {
      "Content-Type": file.contentType || "application/octet-stream",
      "Content-Disposition": `${disposition}; filename*=UTF-8''${encodedName}`,
      "Cache-Control": "private, no-store",
    },
  });
}

/** RU: Статус перевірки документа. EN: Update document review status. */
export async function PATCH(request: Request, ctx: Ctx) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const passwordBlock = passwordChangeRequiredResponse(user);
  if (passwordBlock) return passwordBlock;
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const { id: idRaw, fileId: fileRaw } = await ctx.params;
  const applicationId = Number(idRaw);
  const fileId = Number(fileRaw);
  if (!Number.isFinite(applicationId) || !Number.isFinite(fileId)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  let body: { reviewStatus?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const allowed = ["pending", "verified", "rejected", "needs_info"] as const;
  if (!body.reviewStatus || !allowed.includes(body.reviewStatus as (typeof allowed)[number])) {
    return NextResponse.json({ ok: false, error: "bad_status" }, { status: 400 });
  }

  const [updated] = await db
    .update(applicationFiles)
    .set({ reviewStatus: body.reviewStatus })
    .where(and(eq(applicationFiles.id, fileId), eq(applicationFiles.applicationId, applicationId)))
    .returning();

  if (!updated) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, item: updated });
}
