import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { getDb } from "@/db";
import { trainingCertificates } from "@/db/schema";
import type { TrainingDetail } from "@/content/trainings/types";
import {
  certificateIdentityHash,
  formatCompletionDate,
  issueDownloadToken,
  normalizeParticipantName,
  stripModuleIndexPrefix,
} from "@/lib/trainings/certificate-identity";
import { formatCertificateNumber } from "@/lib/trainings/certificate-number";
import {
  buildNamedCertificatePdf,
  type CertificateModuleLine,
  type NamedCertificatePayload,
} from "@/lib/trainings/certificate-pdf";

export type IssuedCertificateRow = {
  id: number;
  courseSlug: string;
  courseCode: string;
  participantName: string;
  courseTitleUk: string;
  courseTitleEn: string;
  durationUk: string;
  durationEn: string;
  completionDate: string;
  certificateNumber: string;
  modulesSnapshot: CertificateModuleLine[];
  score: number;
  scoreTotal: number;
  scorePercent: number;
  downloadToken: string;
  issuedAt: Date;
};

export function isNamedCertificateTraining(training: TrainingDetail): boolean {
  return Boolean(training.courseCode?.trim() && training.duration?.uk && training.duration?.en);
}

export function buildCertificateModules(training: TrainingDetail): CertificateModuleLine[] {
  return training.modules.map((mod) => ({
    uk: stripModuleIndexPrefix(mod.title.uk),
    en: stripModuleIndexPrefix(mod.title.en),
  }));
}

export function resolveCertificateTitles(training: TrainingDetail): { uk: string; en: string } {
  if (training.certificateTitles) {
    return {
      uk: training.certificateTitles.uk,
      en: training.certificateTitles.en,
    };
  }
  return {
    uk: training.title.uk.toLocaleUpperCase("uk-UA"),
    en: training.title.en.toLocaleUpperCase("en-US"),
  };
}

function rowFromDb(row: typeof trainingCertificates.$inferSelect): IssuedCertificateRow {
  const modules = Array.isArray(row.modulesSnapshot)
    ? (row.modulesSnapshot as CertificateModuleLine[])
    : [];
  return {
    id: row.id,
    courseSlug: row.courseSlug,
    courseCode: row.courseCode,
    participantName: row.participantName,
    courseTitleUk: row.courseTitleUk,
    courseTitleEn: row.courseTitleEn,
    durationUk: row.durationUk,
    durationEn: row.durationEn,
    completionDate: row.completionDate,
    certificateNumber: row.certificateNumber,
    modulesSnapshot: modules,
    score: row.score,
    scoreTotal: row.scoreTotal,
    scorePercent: row.scorePercent,
    downloadToken: row.downloadToken,
    issuedAt: row.issuedAt,
  };
}

function toPayload(row: IssuedCertificateRow): NamedCertificatePayload {
  return {
    participantName: row.participantName,
    courseTitleUk: row.courseTitleUk,
    courseTitleEn: row.courseTitleEn,
    durationUk: row.durationUk,
    durationEn: row.durationEn,
    modules: row.modulesSnapshot,
    completionDate: row.completionDate,
    certificateNumber: row.certificateNumber,
  };
}

/** RU: Знайти сертифікат за downloadToken. EN: Lookup certificate by download token. */
export async function findCertificateByDownloadToken(
  downloadToken: string,
): Promise<IssuedCertificateRow | null> {
  const db = getDb();
  if (!db || !downloadToken) return null;
  const rows = await db
    .select()
    .from(trainingCertificates)
    .where(eq(trainingCertificates.downloadToken, downloadToken))
    .limit(1);
  const row = rows[0];
  return row ? rowFromDb(row) : null;
}

async function findByIdentityHash(identityHash: string): Promise<IssuedCertificateRow | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(trainingCertificates)
    .where(eq(trainingCertificates.identityHash, identityHash))
    .limit(1);
  const row = rows[0];
  return row ? rowFromDb(row) : null;
}

type NeonRow = {
  id: number;
  course_slug: string;
  course_code: string;
  participant_name: string;
  course_title_uk: string;
  course_title_en: string;
  duration_uk: string;
  duration_en: string;
  completion_date: string;
  certificate_number: string;
  modules_snapshot: CertificateModuleLine[] | string;
  score: number;
  score_total: number;
  score_percent: number;
  download_token: string;
  issued_at: string | Date;
};

function neonRowToIssued(row: NeonRow): IssuedCertificateRow {
  const modules =
    typeof row.modules_snapshot === "string"
      ? (JSON.parse(row.modules_snapshot) as CertificateModuleLine[])
      : row.modules_snapshot;
  return {
    id: Number(row.id),
    courseSlug: row.course_slug,
    courseCode: row.course_code,
    participantName: row.participant_name,
    courseTitleUk: row.course_title_uk,
    courseTitleEn: row.course_title_en,
    durationUk: row.duration_uk,
    durationEn: row.duration_en,
    completionDate: row.completion_date,
    certificateNumber: row.certificate_number,
    modulesSnapshot: Array.isArray(modules) ? modules : [],
    score: Number(row.score ?? 0),
    scoreTotal: Number(row.score_total ?? 0),
    scorePercent: Number(row.score_percent ?? 0),
    downloadToken: row.download_token,
    issuedAt: new Date(row.issued_at),
  };
}

/**
 * RU: Випустити або повернути існуючий сертифікат (ідемпотентно за identityHash).
 * EN: Issue or return existing certificate (idempotent by identityHash).
 */
export async function issueOrGetNamedCertificate(params: {
  training: TrainingDetail;
  participantName: string;
  score: number;
  scoreTotal: number;
  scorePercent: number;
}): Promise<{ row: IssuedCertificateRow; created: boolean } | { error: "unavailable" | "misconfigured" }> {
  const { training } = params;
  if (!isNamedCertificateTraining(training) || !training.courseCode || !training.duration) {
    return { error: "misconfigured" };
  }
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return { error: "unavailable" };

  const participantName = normalizeParticipantName(params.participantName);
  if (participantName.length < 3) return { error: "misconfigured" };

  const score = Math.max(0, Math.trunc(params.score));
  const scoreTotal = Math.max(0, Math.trunc(params.scoreTotal));
  const scorePercent = Math.min(100, Math.max(0, Math.trunc(params.scorePercent)));
  if (scoreTotal < 1 || score > scoreTotal) return { error: "misconfigured" };

  const identityHash = certificateIdentityHash(training.slug, participantName);
  const existing = await findByIdentityHash(identityHash);
  if (existing) return { row: existing, created: false };

  const titles = resolveCertificateTitles(training);
  const modules = buildCertificateModules(training);
  const completionDate = formatCompletionDate();
  const year = Number(completionDate.slice(6, 10));
  const courseCode = training.courseCode.trim().toUpperCase();
  const downloadToken = issueDownloadToken();
  const modulesJson = JSON.stringify(modules);

  const sql = neon(databaseUrl);

  try {
    const inserted = (await sql`
      WITH next AS (
        INSERT INTO training_certificate_counters (course_code, year, last_seq)
        VALUES (${courseCode}, ${year}, 1)
        ON CONFLICT (course_code, year)
        DO UPDATE SET last_seq = training_certificate_counters.last_seq + 1
        RETURNING last_seq
      )
      INSERT INTO training_certificates (
        course_slug,
        course_code,
        participant_name,
        identity_hash,
        course_title_uk,
        course_title_en,
        duration_uk,
        duration_en,
        completion_date,
        certificate_number,
        modules_snapshot,
        score,
        score_total,
        score_percent,
        download_token
      )
      SELECT
        ${training.slug},
        ${courseCode},
        ${participantName},
        ${identityHash},
        ${titles.uk},
        ${titles.en},
        ${training.duration.uk},
        ${training.duration.en},
        ${completionDate},
        ('ESOSH-' || ${courseCode} || '-' || ${year}::text || '-' || lpad(next.last_seq::text, 6, '0')),
        (${modulesJson})::jsonb,
        ${score},
        ${scoreTotal},
        ${scorePercent},
        ${downloadToken}
      FROM next
      RETURNING
        id,
        course_slug,
        course_code,
        participant_name,
        course_title_uk,
        course_title_en,
        duration_uk,
        duration_en,
        completion_date,
        certificate_number,
        modules_snapshot,
        score,
        score_total,
        score_percent,
        download_token,
        issued_at
    `) as NeonRow[];

    const row = inserted[0];
    if (!row) {
      // Race: another request inserted same identity — re-read
      const again = await findByIdentityHash(identityHash);
      if (again) return { row: again, created: false };
      return { error: "unavailable" };
    }
    return { row: neonRowToIssued(row), created: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    // Unique identity collision under concurrency
    if (message.includes("training_certificates_identity_uidx") || message.includes("duplicate key")) {
      const again = await findByIdentityHash(identityHash);
      if (again) return { row: again, created: false };
    }
    console.error("[trainings/certificate] issue failed", {
      hash: createHash("sha256").update(identityHash).digest("hex").slice(0, 8),
    });
    return { error: "unavailable" };
  }
}

/** RU: Згенерувати PDF з рядка БД. EN: Build PDF bytes from stored certificate row. */
export async function renderCertificatePdf(row: IssuedCertificateRow): Promise<Uint8Array> {
  return buildNamedCertificatePdf(toPayload(row));
}

/** Exported for unit tests of number assembly used in SQL. */
export function previewNextCertificateNumber(courseCode: string, year: number, seq: number): string {
  return formatCertificateNumber(courseCode, year, seq);
}
