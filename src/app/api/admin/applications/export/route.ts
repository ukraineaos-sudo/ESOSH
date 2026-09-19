import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { applications, members } from "@/db/schema";
import { canEditContent, getAdminSession } from "@/lib/admin/auth";
import { LEVEL_LABELS_UK, STATUS_LABELS_UK } from "@/lib/enrollment/levels";

/** RU: CSV-експорт заявок (UTF-8 BOM). EN: CSV export with UA charset. */
export async function GET() {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

  const rows = await db
    .select({
      publicId: applications.publicId,
      status: applications.status,
      autoLevel: applications.autoLevel,
      approvedLevel: applications.approvedLevel,
      createdAt: applications.createdAt,
      lastName: members.lastName,
      firstName: members.firstName,
      email: members.primaryEmail,
      phone: members.phone,
      organization: sql<string>`${applications.payload}->>'organization'`,
      industry: sql<string>`${applications.payload}->>'industry'`,
      city: sql<string>`${applications.payload}->>'city'`,
      country: sql<string>`${applications.payload}->>'country'`,
    })
    .from(applications)
    .leftJoin(members, eq(applications.memberId, members.id))
    .orderBy(desc(applications.createdAt))
    .limit(5000);

  const header = [
    "public_id",
    "status",
    "status_uk",
    "auto_level",
    "auto_level_uk",
    "approved_level",
    "approved_level_uk",
    "last_name",
    "first_name",
    "email",
    "phone",
    "organization",
    "industry",
    "city",
    "country",
    "created_at",
  ];

  const escape = (value: unknown) => {
    const s = value == null ? "" : String(value);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [header.join(",")];
  for (const row of rows) {
    const auto = row.autoLevel as keyof typeof LEVEL_LABELS_UK | null;
    const approved = row.approvedLevel as keyof typeof LEVEL_LABELS_UK | null;
    const status = row.status as keyof typeof STATUS_LABELS_UK;
    lines.push(
      [
        row.publicId,
        row.status,
        STATUS_LABELS_UK[status] || row.status,
        row.autoLevel || "",
        auto ? LEVEL_LABELS_UK[auto] : "",
        row.approvedLevel || "",
        approved ? LEVEL_LABELS_UK[approved] : "",
        row.lastName || "",
        row.firstName || "",
        row.email || "",
        row.phone || "",
        row.organization || "",
        row.industry || "",
        row.city || "",
        row.country || "",
        row.createdAt?.toISOString?.() || "",
      ]
        .map(escape)
        .join(","),
    );
  }

  const csv = `\uFEFF${lines.join("\n")}`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="esosh-applications.csv"`,
    },
  });
}
