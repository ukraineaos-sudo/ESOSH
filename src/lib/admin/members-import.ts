import { and, eq, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { members } from "@/db/schema";
import { createPublicId } from "@/lib/enrollment/ids";
import { LEVEL_CODES, MEMBER_STATUSES, type LevelCode, type MemberStatus } from "@/lib/enrollment/levels";
import { normalizePersonNamePart } from "@/lib/enrollment/members";
import { MEMBER_EXCEL_COLUMNS, type MemberExcelColumnKey } from "@/lib/admin/members-excel";

export type MemberImportDraft = {
  rowNumber: number;
  publicId: string | null;
  registrationNumber: string | null;
  registeredAt: Date | null;
  lastName: string;
  firstName: string;
  middleName: string;
  primaryEmail: string | null;
  secondaryEmail: string | null;
  phone: string | null;
  status: MemberStatus;
  level: LevelCode | null;
  organization: string;
  jobTitle: string;
  legacyResume: boolean | null;
  legacyTest: boolean | null;
  legacyCertificate: boolean | null;
  source: string;
  notes: string[];
};

export type MemberImportAction = "create" | "update" | "skip";

export type MemberImportPlanItem = {
  draft: MemberImportDraft;
  action: MemberImportAction;
  matchBy: "registration_number" | "public_id" | "name_email" | null;
  existingId: number | null;
  reason: string;
};

export type MemberImportApplyResult = {
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{ rowNumber: number; message: string }>;
  plan: MemberImportPlanItem[];
};

const LEVEL_FROM_SHORT: Record<string, LevelCode> = {
  S: "specialist",
  AS: "accredited",
  CE: "certified",
  CHE: "diplomate",
};

const HEADER_TO_KEY = new Map<string, MemberExcelColumnKey>(
  MEMBER_EXCEL_COLUMNS.map((col) => [col.header.toLowerCase(), col.key]),
);

function mapCyrillicLetters(raw: string): string {
  const map: Record<string, string> = {
    А: "A",
    а: "a",
    С: "C",
    с: "c",
    Е: "E",
    е: "e",
    Н: "H",
    н: "h",
  };
  return [...raw].map((ch) => map[ch] || ch).join("");
}

/** RU: Нормалізація коду рівня з Excel/легасі. EN: Normalize level code from Excel/legacy. */
export function parseLevelCode(raw: string | null | undefined): LevelCode | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if ((LEVEL_CODES as readonly string[]).includes(trimmed)) return trimmed as LevelCode;
  const short = mapCyrillicLetters(trimmed).toUpperCase();
  return LEVEL_FROM_SHORT[short] ?? null;
}

function parseBoolCell(raw: string | null | undefined): boolean | null {
  if (raw == null) return null;
  const t = String(raw).trim().toLowerCase();
  if (!t) return null;
  if (["так", "yes", "true", "1"].includes(t)) return true;
  if (["ні", "no", "false", "0"].includes(t)) return false;
  return null;
}

function parseEmail(raw: string | null | undefined): { email: string | null; fixed: boolean; broken: boolean } {
  const e = String(raw || "").trim();
  if (!e) return { email: null, fixed: false, broken: false };
  if (e.includes("@")) return { email: e.toLowerCase(), fixed: false, broken: false };
  const m = e.match(
    /^(.+?)(gmail\.com|ukr\.net|i\.ua|gmail\.net|esosh\.net|eosh\.net|dtek\.com|ppc\.net\.ua|snu\.edu\.ua)$/i,
  );
  if (m) return { email: `${m[1]}@${m[2]}`.toLowerCase(), fixed: true, broken: true };
  return { email: null, fixed: false, broken: true };
}

function parseDateCell(raw: unknown): Date | null {
  if (raw == null || raw === "") return null;
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw;
  const s = String(raw).trim().replace(/^"|"$/g, "");
  if (!s) return null;
  // DD.MM.YYYY
  const dmy = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dmy) {
    const d = new Date(Date.UTC(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function cellToString(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") {
    const v = value as { text?: string; result?: unknown; richText?: Array<{ text: string }>; hyperlink?: string };
    if (typeof v.text === "string") return v.text.trim();
    if (v.result != null) return String(v.result).trim();
    if (Array.isArray(v.richText)) return v.richText.map((t) => t.text).join("").trim();
    if (typeof v.hyperlink === "string") return (v.text || v.hyperlink).trim();
  }
  return String(value).trim();
}

/** RU: Розбір ПІБ з легасі-рядка. EN: Split legacy full-name cell. */
export function splitLegacyFio(raw: string): {
  lastName: string;
  firstName: string;
  middleName: string;
  jobTitle: string;
  isBoard: boolean;
} {
  let s = raw.replace(/\u00a0/g, " ").replace(/^\d+\.\s*/, "").trim();
  const isBoard = /рада\s*директор/i.test(s);
  s = s.replace(/\s*Рада Директорів\s*/gi, " ").trim();
  let jobTitle = "";
  const partsDash = s.split(/\s+[–—-]\s+/);
  if (partsDash.length > 1) {
    jobTitle = partsDash.slice(1).join(" - ").trim();
    s = partsDash[0].trim();
  }
  const parts = s.split(/\s+/).filter(Boolean);
  return {
    lastName: parts[0] || "",
    firstName: parts[1] || "",
    middleName: parts.slice(2).join(" "),
    jobTitle,
    isBoard,
  };
}

function statusForLevel(level: LevelCode | null): MemberStatus {
  if (level && level !== "community") return "active";
  return "active_no_level";
}

function levelForEmpty(): LevelCode {
  return "community";
}

/** RU: Чернетка з канонічного рядка Excel. EN: Draft from canonical Excel row. */
export function draftFromCanonicalRow(
  rowNumber: number,
  cells: Partial<Record<MemberExcelColumnKey, string>>,
): MemberImportDraft {
  const notes: string[] = [];
  const emailParsed = parseEmail(cells.primaryEmail);
  if (emailParsed.fixed) notes.push(`email_fixed:${cells.primaryEmail}->${emailParsed.email}`);
  if (emailParsed.broken && !emailParsed.email) notes.push("email_broken_unfixed");

  let level = parseLevelCode(cells.level) || parseLevelCode(cells.levelShort) || null;

  let status = (cells.status || "").trim() as MemberStatus;
  if (!(MEMBER_STATUSES as readonly string[]).includes(status)) {
    status = statusForLevel(level);
  }
  if (!level) {
    level = status === "active_no_level" ? levelForEmpty() : null;
    if (!level) {
      level = levelForEmpty();
      status = "active_no_level";
    }
  }

  return {
    rowNumber,
    publicId: cells.publicId?.trim() || null,
    registrationNumber: cells.registrationNumber?.trim() || null,
    registeredAt: parseDateCell(cells.registeredAt),
    lastName: cells.lastName?.trim() || "",
    firstName: cells.firstName?.trim() || "",
    middleName: cells.middleName?.trim() || "",
    primaryEmail: emailParsed.email,
    secondaryEmail: parseEmail(cells.secondaryEmail).email,
    phone: cells.phone?.trim() || null,
    status,
    level,
    organization: cells.organization?.trim() || "",
    jobTitle: cells.jobTitle?.trim() || "",
    legacyResume: parseBoolCell(cells.hasResume),
    legacyTest: parseBoolCell(cells.testCodex),
    legacyCertificate: parseBoolCell(cells.hasCertificate),
    source: cells.source?.trim() || "excel_import",
    notes,
  };
}

/** RU: Чернетка з легасі-файлу клієнта. EN: Draft from client legacy workbook row. */
export function draftFromLegacyRow(input: {
  rowNumber: number;
  fio: string;
  registeredAt: unknown;
  registrationNumber: string;
  phone: string;
  email: string;
  statusRaw: string;
  resume: string;
  test: string;
  certificate: string;
  organization: string;
}): MemberImportDraft {
  const notes: string[] = [];
  const fio = splitLegacyFio(input.fio);
  if (fio.isBoard) notes.push("board_of_directors");
  const emailParsed = parseEmail(input.email);
  if (emailParsed.fixed) notes.push(`email_fixed:${input.email}->${emailParsed.email}`);
  if (emailParsed.broken && !emailParsed.email) notes.push("email_broken_unfixed");
  if (!emailParsed.email) notes.push("no_email");

  const level = parseLevelCode(input.statusRaw);
  if (input.statusRaw.trim() && !level) notes.push(`unknown_level:${input.statusRaw}`);
  const status = statusForLevel(level);
  const resolvedLevel = level ?? levelForEmpty();

  return {
    rowNumber: input.rowNumber,
    publicId: null,
    registrationNumber: input.registrationNumber.trim() || null,
    registeredAt: parseDateCell(input.registeredAt),
    lastName: fio.lastName,
    firstName: fio.firstName || (fio.lastName ? "—" : ""),
    middleName: fio.middleName,
    primaryEmail: emailParsed.email,
    secondaryEmail: null,
    phone: input.phone.trim() || null,
    status,
    level: resolvedLevel,
    organization: input.organization.trim(),
    jobTitle: fio.jobTitle,
    legacyResume: parseBoolCell(input.resume),
    legacyTest: parseBoolCell(input.test),
    legacyCertificate: parseBoolCell(input.certificate),
    source: "legacy_registry_2019_2026",
    notes,
  };
}

function buildProfile(draft: MemberImportDraft, existingProfile: unknown): Record<string, unknown> {
  const prev =
    existingProfile && typeof existingProfile === "object" && !Array.isArray(existingProfile)
      ? { ...(existingProfile as Record<string, unknown>) }
      : {};
  return {
    ...prev,
    middleName: draft.middleName || prev.middleName || null,
    organization: draft.organization || prev.organization || null,
    jobTitle: draft.jobTitle || prev.jobTitle || null,
    legacyResume: draft.legacyResume,
    legacyTest: draft.legacyTest,
    legacyCertificate: draft.legacyCertificate,
    source: draft.source || prev.source || null,
    importNotes: draft.notes,
  };
}

/** RU: Мапінг заголовків канонічного Excel → ключі. EN: Map canonical Excel headers to keys. */
export function mapCanonicalHeaderRow(headers: string[]): Map<number, MemberExcelColumnKey> {
  const map = new Map<number, MemberExcelColumnKey>();
  headers.forEach((header, index) => {
    const key = HEADER_TO_KEY.get(header.trim().toLowerCase());
    if (key) map.set(index, key);
  });
  return map;
}

export function cellToStringExport(value: unknown): string {
  return cellToString(value);
}

/** RU: План імпорту без запису. EN: Build import plan without writes. */
export async function planMemberImport(db: Db, drafts: MemberImportDraft[]): Promise<MemberImportPlanItem[]> {
  const existing = await db.select().from(members);
  const byReg = new Map<string, (typeof existing)[number]>();
  const byPublic = new Map<string, (typeof existing)[number]>();
  const byNameEmail = new Map<string, (typeof existing)[number]>();

  for (const row of existing) {
    if (row.registrationNumber) byReg.set(row.registrationNumber, row);
    byPublic.set(row.publicId, row);
    if (row.primaryEmail) {
      const key = `${normalizePersonNamePart(row.lastName)}|${normalizePersonNamePart(row.firstName)}|${row.primaryEmail.toLowerCase()}`;
      byNameEmail.set(key, row);
    }
  }

  const plan: MemberImportPlanItem[] = [];
  for (const draft of drafts) {
    if (!draft.lastName && !draft.firstName && !draft.primaryEmail && !draft.registrationNumber) {
      plan.push({
        draft,
        action: "skip",
        matchBy: null,
        existingId: null,
        reason: "empty_row",
      });
      continue;
    }
    if (!draft.lastName && !draft.firstName) {
      draft.lastName =
        draft.primaryEmail?.split("@")[0] || draft.registrationNumber || "Без ПІБ";
      draft.firstName = "—";
      draft.notes.push("missing_name_placeholder");
    }

    let match = draft.registrationNumber ? byReg.get(draft.registrationNumber) : undefined;
    let matchBy: MemberImportPlanItem["matchBy"] = match ? "registration_number" : null;
    if (!match && draft.publicId) {
      match = byPublic.get(draft.publicId);
      if (match) matchBy = "public_id";
    }
    if (!match && draft.primaryEmail) {
      const key = `${normalizePersonNamePart(draft.lastName)}|${normalizePersonNamePart(draft.firstName)}|${draft.primaryEmail}`;
      match = byNameEmail.get(key);
      if (match) matchBy = "name_email";
    }

    if (match) {
      plan.push({
        draft,
        action: "update",
        matchBy,
        existingId: match.id,
        reason: `match_${matchBy}`,
      });
    } else {
      plan.push({
        draft,
        action: "create",
        matchBy: null,
        existingId: null,
        reason: "new",
      });
    }
  }
  return plan;
}

/** RU: Застосувати план імпорту. EN: Apply import plan. */
export async function applyMemberImport(
  db: Db,
  plan: MemberImportPlanItem[],
  options: { dryRun: boolean },
): Promise<MemberImportApplyResult> {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: Array<{ rowNumber: number; message: string }> = [];

  if (options.dryRun) {
    for (const item of plan) {
      if (item.action === "create") created += 1;
      else if (item.action === "update") updated += 1;
      else skipped += 1;
    }
    return { created, updated, skipped, errors, plan };
  }

  for (const item of plan) {
    try {
      if (item.action === "skip") {
        skipped += 1;
        continue;
      }
      const profile = buildProfile(item.draft, null);
      if (item.action === "create") {
        const publicId = item.draft.publicId || createPublicId("MBR");
        await db.insert(members).values({
          publicId,
          firstName: item.draft.firstName || "—",
          lastName: item.draft.lastName || "—",
          primaryEmail: item.draft.primaryEmail,
          secondaryEmail: item.draft.secondaryEmail,
          phone: item.draft.phone,
          status: item.draft.status,
          level: item.draft.level,
          registrationNumber: item.draft.registrationNumber,
          registeredAt: item.draft.registeredAt,
          profile,
          updatedAt: new Date(),
        });
        created += 1;
      } else if (item.action === "update" && item.existingId != null) {
        const [current] = await db.select().from(members).where(eq(members.id, item.existingId)).limit(1);
        const nextProfile = buildProfile(item.draft, current?.profile);
        await db
          .update(members)
          .set({
            firstName: item.draft.firstName || current?.firstName || "—",
            lastName: item.draft.lastName || current?.lastName || "—",
            primaryEmail: item.draft.primaryEmail ?? current?.primaryEmail ?? null,
            secondaryEmail: item.draft.secondaryEmail ?? current?.secondaryEmail ?? null,
            phone: item.draft.phone ?? current?.phone ?? null,
            status: item.draft.status,
            level: item.draft.level,
            registrationNumber: item.draft.registrationNumber ?? current?.registrationNumber ?? null,
            registeredAt: item.draft.registeredAt ?? current?.registeredAt ?? null,
            profile: nextProfile,
            updatedAt: new Date(),
          })
          .where(eq(members.id, item.existingId));
        updated += 1;
      }
    } catch (error) {
      errors.push({
        rowNumber: item.draft.rowNumber,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { created, updated, skipped, errors, plan };
}

/** RU: Знайти member за якіром імпорту (для тестів/діагностики). EN: Find member by import anchors. */
export async function findMemberForImportDraft(db: Db, draft: MemberImportDraft) {
  if (draft.registrationNumber) {
    const rows = await db
      .select()
      .from(members)
      .where(eq(members.registrationNumber, draft.registrationNumber))
      .limit(1);
    if (rows[0]) return rows[0];
  }
  if (draft.publicId) {
    const rows = await db.select().from(members).where(eq(members.publicId, draft.publicId)).limit(1);
    if (rows[0]) return rows[0];
  }
  if (draft.primaryEmail) {
    const last = normalizePersonNamePart(draft.lastName);
    const first = normalizePersonNamePart(draft.firstName);
    const rows = await db
      .select()
      .from(members)
      .where(
        and(
          eq(members.primaryEmail, draft.primaryEmail),
          sql`lower(trim(regexp_replace(${members.lastName}, '\\s+', ' ', 'g'))) = ${last}`,
          sql`lower(trim(regexp_replace(${members.firstName}, '\\s+', ' ', 'g'))) = ${first}`,
        ),
      )
      .limit(1);
    return rows[0] ?? null;
  }
  return null;
}
