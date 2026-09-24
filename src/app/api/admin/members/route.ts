import { NextResponse } from "next/server";
import { count, desc, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { applications, members } from "@/db/schema";
import { canEditContent, getAdminSession } from "@/lib/admin/auth";
import {
  collectIndustryFacets,
  computeMemberRegistryStats,
  filterMemberRegistryItems,
  isLevelCodeOrNone,
  isMemberStatus,
  readMemberProfileSlice,
  readPayloadProfileSlice,
  type MemberRegistryFilters,
  type MemberRegistryItem,
} from "@/lib/admin/member-registry";

/** RU: Реєстр членів зі статистикою та фільтрами. EN: Members registry with stats/filters. */
export async function GET(request: Request) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

  const url = new URL(request.url);
  const filters: MemberRegistryFilters = {
    q: url.searchParams.get("q")?.trim() || "",
    status: url.searchParams.get("status")?.trim() || "",
    level: url.searchParams.get("level")?.trim() || "",
    industry: url.searchParams.get("industry")?.trim() || "",
    oshFunctions: normalizeOshFilter(url.searchParams.get("oshFunctions")),
    minOshYears: parseMinYears(url.searchParams.get("minOshYears")),
  };

  if (filters.status && !isMemberStatus(filters.status)) {
    return NextResponse.json({ ok: false, error: "bad_status" }, { status: 400 });
  }
  if (filters.level && !isLevelCodeOrNone(filters.level)) {
    return NextResponse.json({ ok: false, error: "bad_level" }, { status: 400 });
  }

  const rows = await db.select().from(members).orderBy(desc(members.createdAt)).limit(500);
  const ids = rows.map((row) => row.id);
  const linkedMap = new Map<number, number>();
  const latestPayloadByMember = new Map<number, unknown>();

  if (ids.length > 0) {
    const linkedRows = await db
      .select({
        memberId: applications.memberId,
        value: count(),
      })
      .from(applications)
      .where(inArray(applications.memberId, ids))
      .groupBy(applications.memberId);
    for (const row of linkedRows) {
      if (row.memberId != null) linkedMap.set(row.memberId, Number(row.value));
    }

    const appRows = await db
      .select({
        memberId: applications.memberId,
        payload: applications.payload,
        createdAt: applications.createdAt,
      })
      .from(applications)
      .where(inArray(applications.memberId, ids))
      .orderBy(desc(applications.createdAt));
    for (const row of appRows) {
      if (row.memberId == null) continue;
      if (!latestPayloadByMember.has(row.memberId)) {
        latestPayloadByMember.set(row.memberId, row.payload);
      }
    }
  }

  const hydrated: MemberRegistryItem[] = rows.map((row) => {
    const fromProfile = readMemberProfileSlice(row.profile);
    const fromPayload = readPayloadProfileSlice(latestPayloadByMember.get(row.id));
    return {
      id: row.id,
      publicId: row.publicId,
      firstName: row.firstName,
      lastName: row.lastName,
      primaryEmail: row.primaryEmail,
      secondaryEmail: row.secondaryEmail,
      phone: row.phone,
      status: row.status,
      level: row.level,
      linkedApplications: linkedMap.get(row.id) ?? 0,
      jobTitle: fromProfile.jobTitle || fromPayload.jobTitle,
      organization: fromProfile.organization || fromPayload.organization,
      industry: fromProfile.industry || fromPayload.industry,
      companySize: fromProfile.companySize || fromPayload.companySize,
      oshYears: fromProfile.oshYears ?? fromPayload.oshYears,
      oshFunctions: fromProfile.oshFunctions ?? fromPayload.oshFunctions,
      country: fromProfile.country || fromPayload.country,
      city: fromProfile.city || fromPayload.city,
    };
  });

  const facets = { industries: collectIndustryFacets(hydrated) };
  const items = filterMemberRegistryItems(hydrated, filters);
  const stats = computeMemberRegistryStats(items);

  return NextResponse.json({ ok: true, items, stats, facets });
}

function normalizeOshFilter(value: string | null): "" | "yes" | "no" {
  if (value === "yes" || value === "no") return value;
  return "";
}

function parseMinYears(value: string | null): number | null {
  if (value == null || value.trim() === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}
