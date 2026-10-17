import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { count, desc, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { applications, members } from "@/db/schema";
import { canManageRegistry, getAdminSession } from "@/lib/admin/auth";
import {
  filterMemberRegistryItems,
  isLevelCodeOrNone,
  isMemberStatus,
  readMemberProfileSlice,
  readPayloadProfileSlice,
  type MemberRegistryFilters,
  type MemberRegistryItem,
} from "@/lib/admin/member-registry";
import { MEMBER_EXCEL_COLUMNS, memberToExcelRow } from "@/lib/admin/members-excel";

const EXPORT_LIMIT = 10_000;

/** RU: Повний .xlsx експорт реєстру членів (канон анкети + легасі поля). EN: Full members .xlsx export. */
export async function GET(request: Request) {
  const user = await getAdminSession();
  if (!user || !canManageRegistry(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

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

  const [rows, totalRows] = await Promise.all([
    db.select().from(members).orderBy(desc(members.createdAt)).limit(EXPORT_LIMIT),
    db.select({ value: count() }).from(members),
  ]);
  const totalMembers = Number(totalRows[0]?.value ?? 0);
  const ids = rows.map((row) => row.id);
  const linkedMap = new Map<number, number>();
  const latestPayloadByMember = new Map<number, unknown>();
  const latestTestByMember = new Map<
    number,
    { testScore: number | null; testPassedAt: Date | null }
  >();

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
        testScore: applications.testScore,
        testPassedAt: applications.testPassedAt,
        createdAt: applications.createdAt,
      })
      .from(applications)
      .where(inArray(applications.memberId, ids))
      .orderBy(desc(applications.createdAt));
    for (const row of appRows) {
      if (row.memberId == null) continue;
      if (!latestPayloadByMember.has(row.memberId)) {
        latestPayloadByMember.set(row.memberId, row.payload);
        latestTestByMember.set(row.memberId, {
          testScore: row.testScore,
          testPassedAt: row.testPassedAt,
        });
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

  const filtered = filterMemberRegistryItems(hydrated, filters);
  const allowedIds = new Set(filtered.map((item) => item.id));
  const exportRows = rows.filter((row) => allowedIds.has(row.id));

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ESOSH";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Члени", {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  sheet.columns = MEMBER_EXCEL_COLUMNS.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width,
  }));

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, name: "Calibri", size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9E2F3" },
  };
  headerRow.alignment = { vertical: "middle", wrapText: true, horizontal: "left" };
  headerRow.height = 28;

  for (const row of exportRows) {
    const excelRow = sheet.addRow(
      memberToExcelRow({
        publicId: row.publicId,
        registrationNumber: row.registrationNumber,
        registeredAt: row.registeredAt,
        lastName: row.lastName,
        firstName: row.firstName,
        primaryEmail: row.primaryEmail,
        secondaryEmail: row.secondaryEmail,
        phone: row.phone,
        status: row.status,
        level: row.level,
        profile: row.profile,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        linkedApplications: linkedMap.get(row.id) ?? 0,
        payloadFallback: latestPayloadByMember.get(row.id),
        latestTest: latestTestByMember.get(row.id) ?? null,
      }),
    );
    excelRow.font = { name: "Calibri", size: 11 };
    excelRow.alignment = { vertical: "middle", wrapText: false };
  }

  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: Math.max(1, exportRows.length + 1), column: MEMBER_EXCEL_COLUMNS.length },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const stamp = new Date().toISOString().slice(0, 10);
  const truncated = totalMembers > EXPORT_LIMIT;

  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="esosh-members-${stamp}.xlsx"`,
      "Cache-Control": "no-store",
      ...(truncated ? { "X-ESOSH-Export-Truncated": "1" } : {}),
    },
  });
}

function normalizeOshFilter(raw: string | null): "" | "yes" | "no" {
  if (raw === "yes" || raw === "no") return raw;
  return "";
}

function parseMinYears(raw: string | null): number | null {
  if (raw == null || raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
