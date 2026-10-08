import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { trainingCertificates } from "@/db/schema";
import { knownNamedCourseCodes } from "@/lib/trainings/certificate-catalog";

export type AdminListMeta = {
  limit: number;
  total: number;
  truncated: boolean;
};

export type AdminCertificateListItem = {
  id: number;
  courseSlug: string;
  courseCode: string;
  participantName: string;
  courseTitleUk: string;
  courseTitleEn: string;
  completionDate: string;
  certificateNumber: string;
  score: number;
  scoreTotal: number;
  scorePercent: number;
  issuedAt: string;
};

export type AdminCertificateCourseStat = {
  courseCode: string;
  slug: string | null;
  titleUk: string;
  titleEn: string;
  count: number;
  known: boolean;
};

/** RU: Список сертифікатів для адмінки. EN: Certificate list for admin. */
export async function listAdminCertificates(params: {
  courseCode?: string;
  q?: string;
  limit?: number;
}): Promise<{ items: AdminCertificateListItem[]; meta: AdminListMeta } | null> {
  const db = getDb();
  if (!db) return null;

  const limit = Math.min(Math.max(params.limit ?? 500, 1), 5000);
  const code = params.courseCode?.trim().toUpperCase() || "";
  const q = params.q?.trim() || "";

  const filters = [];
  if (code) filters.push(eq(trainingCertificates.courseCode, code));
  if (q) {
    const pattern = `%${q}%`;
    filters.push(
      or(
        ilike(trainingCertificates.participantName, pattern),
        ilike(trainingCertificates.certificateNumber, pattern),
      )!,
    );
  }
  const where = filters.length ? and(...filters) : undefined;

  const [rows, totalRows] = await Promise.all([
    db
      .select({
        id: trainingCertificates.id,
        courseSlug: trainingCertificates.courseSlug,
        courseCode: trainingCertificates.courseCode,
        participantName: trainingCertificates.participantName,
        courseTitleUk: trainingCertificates.courseTitleUk,
        courseTitleEn: trainingCertificates.courseTitleEn,
        completionDate: trainingCertificates.completionDate,
        certificateNumber: trainingCertificates.certificateNumber,
        score: trainingCertificates.score,
        scoreTotal: trainingCertificates.scoreTotal,
        scorePercent: trainingCertificates.scorePercent,
        issuedAt: trainingCertificates.issuedAt,
      })
      .from(trainingCertificates)
      .where(where)
      .orderBy(desc(trainingCertificates.issuedAt))
      .limit(limit),
    db.select({ value: count() }).from(trainingCertificates).where(where),
  ]);

  const total = Number(totalRows[0]?.value ?? 0);
  return {
    items: rows.map((row) => ({
      ...row,
      issuedAt: row.issuedAt?.toISOString?.() || "",
    })),
    meta: { limit, total, truncated: total > limit },
  };
}

/** RU: Агрегати по кодах курсів (+ заготовка відомих). EN: Per-course counts + known stubs. */
export async function listAdminCertificateCourseStats(): Promise<AdminCertificateCourseStat[] | null> {
  const db = getDb();
  if (!db) return null;

  const known = knownNamedCourseCodes();
  const knownByCode = new Map(known.map((k) => [k.courseCode, k]));

  const rows = await db
    .select({
      courseCode: trainingCertificates.courseCode,
      count: sql<number>`count(*)::int`,
      titleUk: sql<string>`max(${trainingCertificates.courseTitleUk})`,
      titleEn: sql<string>`max(${trainingCertificates.courseTitleEn})`,
      slug: sql<string>`max(${trainingCertificates.courseSlug})`,
    })
    .from(trainingCertificates)
    .groupBy(trainingCertificates.courseCode);

  const byCode = new Map<string, AdminCertificateCourseStat>();
  for (const row of rows) {
    const code = row.courseCode.toUpperCase();
    const meta = knownByCode.get(code);
    byCode.set(code, {
      courseCode: code,
      slug: meta?.slug ?? row.slug ?? null,
      titleUk: meta?.titleUk ?? row.titleUk ?? code,
      titleEn: meta?.titleEn ?? row.titleEn ?? code,
      count: Number(row.count ?? 0),
      known: Boolean(meta),
    });
  }

  for (const meta of known) {
    if (byCode.has(meta.courseCode)) continue;
    byCode.set(meta.courseCode, {
      courseCode: meta.courseCode,
      slug: meta.slug,
      titleUk: meta.titleUk,
      titleEn: meta.titleEn,
      count: 0,
      known: true,
    });
  }

  return [...byCode.values()].sort((a, b) => a.courseCode.localeCompare(b.courseCode));
}

/** RU: Видалення сертифікатів; лічильники НЕ чіпаємо. EN: Delete certs; never touch counters. */
export async function deleteAdminCertificates(params: {
  mode: "one" | "course" | "all";
  id?: number;
  courseCode?: string;
}): Promise<{ deleted: number } | { error: "unavailable" | "invalid" | "not_found" }> {
  const db = getDb();
  if (!db) return { error: "unavailable" };

  if (params.mode === "one") {
    const id = params.id;
    if (!id || !Number.isFinite(id)) return { error: "invalid" };
    const removed = await db
      .delete(trainingCertificates)
      .where(eq(trainingCertificates.id, id))
      .returning({ id: trainingCertificates.id });
    if (removed.length === 0) return { error: "not_found" };
    return { deleted: removed.length };
  }

  if (params.mode === "course") {
    const code = params.courseCode?.trim().toUpperCase() || "";
    if (!code) return { error: "invalid" };
    const removed = await db
      .delete(trainingCertificates)
      .where(eq(trainingCertificates.courseCode, code))
      .returning({ id: trainingCertificates.id });
    return { deleted: removed.length };
  }

  if (params.mode === "all") {
    const removed = await db
      .delete(trainingCertificates)
      .returning({ id: trainingCertificates.id });
    return { deleted: removed.length };
  }

  return { error: "invalid" };
}
