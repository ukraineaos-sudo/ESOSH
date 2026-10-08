import { NextResponse } from "next/server";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { applications, members } from "@/db/schema";
import { canManageRegistry, getAdminSession } from "@/lib/admin/auth";

const LIST_LIMIT = 300;

/** RU: Список заявок з фільтрами. EN: Filtered applications list. */
export async function GET(request: Request) {
  const user = await getAdminSession();
  if (!user || !canManageRegistry(user)) {
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
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, totalRows] = await Promise.all([
    db
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
      .where(where)
      .orderBy(desc(applications.createdAt))
      .limit(LIST_LIMIT),
    db
      .select({ value: count() })
      .from(applications)
      .leftJoin(members, eq(applications.memberId, members.id))
      .where(where),
  ]);

  const total = Number(totalRows[0]?.value ?? 0);
  return NextResponse.json({
    ok: true,
    items: rows,
    limit: LIST_LIMIT,
    total,
    truncated: total > LIST_LIMIT,
  });
}
