import { NextResponse } from "next/server";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { applications, members } from "@/db/schema";
import { canEditContent, getAdminSession } from "@/lib/admin/auth";

/** RU: Список заявок з фільтрами. EN: Filtered applications list. */
export async function GET(request: Request) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const status = url.searchParams.get("status")?.trim() || "";
  const autoLevel = url.searchParams.get("autoLevel")?.trim() || "";

  const conditions = [];
  if (status) conditions.push(eq(applications.status, status));
  if (autoLevel) conditions.push(eq(applications.autoLevel, autoLevel));
  if (q) {
    const like = `%${q}%`;
    conditions.push(
      or(
        ilike(applications.publicId, like),
        ilike(members.lastName, like),
        ilike(members.firstName, like),
        ilike(members.primaryEmail, like),
        sql`(${applications.payload}->>'organization') ILIKE ${like}`,
        sql`(${applications.payload}->>'industry') ILIKE ${like}`,
      ),
    );
  }

  const rows = await db
    .select({
      id: applications.id,
      publicId: applications.publicId,
      status: applications.status,
      autoLevel: applications.autoLevel,
      approvedLevel: applications.approvedLevel,
      requiresManualReview: applications.requiresManualReview,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      memberPublicId: members.publicId,
      firstName: members.firstName,
      lastName: members.lastName,
      email: members.primaryEmail,
      organization: sql<string>`${applications.payload}->>'organization'`,
      industry: sql<string>`${applications.payload}->>'industry'`,
    })
    .from(applications)
    .leftJoin(members, eq(applications.memberId, members.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(applications.createdAt))
    .limit(300);

  return NextResponse.json({ ok: true, items: rows });
}
