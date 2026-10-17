import {
  LEVEL_LABELS_UK,
  MEMBER_STATUS_LABELS_UK,
  type LevelCode,
  type MemberStatus,
} from "@/lib/enrollment/levels";

/** Stable Excel headers for members registry export/import round-trip. */
export const MEMBER_EXCEL_COLUMNS = [
  { header: "publicId", key: "publicId", width: 18 },
  { header: "Реєстраційний номер", key: "registrationNumber", width: 18 },
  { header: "Дата реєстрації", key: "registeredAt", width: 14 },
  { header: "Прізвище", key: "lastName", width: 18 },
  { header: "Імʼя", key: "firstName", width: 16 },
  { header: "По батькові", key: "middleName", width: 16 },
  { header: "Email", key: "primaryEmail", width: 28 },
  { header: "Email додатковий", key: "secondaryEmail", width: 24 },
  { header: "Телефон", key: "phone", width: 18 },
  { header: "Статус код", key: "status", width: 14 },
  { header: "Статус", key: "statusLabel", width: 18 },
  { header: "Рівень код", key: "level", width: 14 },
  { header: "Рівень короткий", key: "levelShort", width: 12 },
  { header: "Рівень", key: "levelLabel", width: 28 },
  { header: "Країна", key: "country", width: 14 },
  { header: "Місто", key: "city", width: 14 },
  { header: "Посада", key: "jobTitle", width: 24 },
  { header: "Організація", key: "organization", width: 28 },
  { header: "Галузь", key: "industry", width: 18 },
  { header: "Розмір компанії", key: "companySize", width: 14 },
  { header: "Функції БЗР", key: "oshFunctions", width: 12 },
  { header: "Стаж БЗР (років)", key: "oshYears", width: 12 },
  { header: "Загальний стаж (років)", key: "totalYears", width: 12 },
  { header: "Обовʼязки", key: "responsibilities", width: 36 },
  { header: "Освіта рівень", key: "educationLevel", width: 14 },
  { header: "Профільна освіта", key: "profileEducation", width: 12 },
  { header: "Заклад", key: "institution", width: 24 },
  { header: "Спеціальність", key: "speciality", width: 20 },
  { header: "Рік випуску", key: "graduationYear", width: 12 },
  { header: "Дата народження", key: "birthDate", width: 14 },
  { header: "Профіль URL", key: "profileUrl", width: 28 },
  { header: "CPD статус", key: "cpdStatus", width: 14 },
  { header: "Тест кодексу", key: "testCodex", width: 12 },
  { header: "Бал тесту", key: "testScore", width: 10 },
  { header: "Резюме", key: "hasResume", width: 12 },
  { header: "Сертифікат (відмітка)", key: "hasCertificate", width: 14 },
  { header: "Джерело", key: "source", width: 16 },
  { header: "Заявок", key: "linkedApplications", width: 10 },
  { header: "Створено", key: "createdAt", width: 20 },
  { header: "Оновлено", key: "updatedAt", width: 20 },
] as const;

export type MemberExcelColumnKey = (typeof MEMBER_EXCEL_COLUMNS)[number]["key"];

export type MemberExcelRow = Record<MemberExcelColumnKey, string | number | null>;

const LEVEL_SHORT: Record<string, string> = {
  specialist: "S",
  accredited: "As",
  certified: "CE",
  diplomate: "ChE",
  community: "",
};

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function str(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function boolLabel(value: unknown): string {
  if (typeof value === "boolean") return value ? "так" : "ні";
  if (typeof value === "string") {
    const t = value.trim().toLowerCase();
    if (t === "так" || t === "yes" || t === "true" || t === "1") return "так";
    if (t === "ні" || t === "no" || t === "false" || t === "0") return "ні";
  }
  return "";
}

function numOrEmpty(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return null;
}

function formatDateOnly(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    return typeof value === "string" ? value.trim() : "";
  }
  return d.toISOString().slice(0, 10);
}

function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

function statusLabel(status: string): string {
  if ((Object.keys(MEMBER_STATUS_LABELS_UK) as string[]).includes(status)) {
    return MEMBER_STATUS_LABELS_UK[status as MemberStatus];
  }
  return status;
}

function levelLabel(level: string | null | undefined): string {
  if (!level) return "";
  if ((Object.keys(LEVEL_LABELS_UK) as string[]).includes(level)) {
    return LEVEL_LABELS_UK[level as LevelCode];
  }
  return level;
}

export type MemberExcelSourceRow = {
  publicId: string;
  registrationNumber: string | null;
  registeredAt: Date | string | null;
  lastName: string;
  firstName: string;
  primaryEmail: string | null;
  secondaryEmail: string | null;
  phone: string | null;
  status: string;
  level: string | null;
  profile: unknown;
  createdAt: Date | string;
  updatedAt: Date | string;
  linkedApplications?: number;
  /** Fallback from latest application payload when profile is thin. */
  payloadFallback?: unknown;
  /** Latest linked application test fields (new enrollment). */
  latestTest?: {
    testScore: number | null;
    testPassedAt: Date | string | null;
  } | null;
};

function resolveTestCodex(
  latestTest: MemberExcelSourceRow["latestTest"],
  legacyFlag: string,
): { label: string; score: number | null } {
  if (latestTest?.testPassedAt) {
    return { label: "так", score: latestTest.testScore };
  }
  if (latestTest?.testScore != null) {
    return { label: "так", score: latestTest.testScore };
  }
  if (legacyFlag) {
    return { label: legacyFlag, score: null };
  }
  return { label: "", score: null };
}

/** RU: Рядок Excel з картки члена (+ profile/payload). EN: Excel row from member card. */
export function memberToExcelRow(row: MemberExcelSourceRow): MemberExcelRow {
  const profile = asRecord(row.profile);
  const payload = asRecord(row.payloadFallback);
  const pick = (key: string): unknown =>
    profile[key] !== undefined && profile[key] !== null && profile[key] !== ""
      ? profile[key]
      : payload[key];

  const level = row.level || "";
  const legacyTest = boolLabel(pick("legacyTest") ?? pick("test"));
  const test = resolveTestCodex(row.latestTest, legacyTest);

  return {
    publicId: row.publicId,
    registrationNumber: row.registrationNumber || "",
    registeredAt: formatDateOnly(row.registeredAt),
    lastName: row.lastName || "",
    firstName: row.firstName || "",
    middleName: str(pick("middleName")),
    primaryEmail: row.primaryEmail || "",
    secondaryEmail: row.secondaryEmail || "",
    phone: row.phone || "",
    status: row.status || "",
    statusLabel: statusLabel(row.status || ""),
    level,
    levelShort: LEVEL_SHORT[level] ?? "",
    levelLabel: levelLabel(row.level),
    country: str(pick("country")),
    city: str(pick("city")),
    jobTitle: str(pick("jobTitle")),
    organization: str(pick("organization")),
    industry: str(pick("industry")),
    companySize: str(pick("companySize")),
    oshFunctions: boolLabel(pick("oshFunctions")),
    oshYears: numOrEmpty(pick("oshYears")),
    totalYears: numOrEmpty(pick("totalYears")),
    responsibilities: str(pick("responsibilities")),
    educationLevel: str(pick("educationLevel")),
    profileEducation: boolLabel(pick("profileEducation")),
    institution: str(pick("institution")),
    speciality: str(pick("speciality")),
    graduationYear: numOrEmpty(pick("graduationYear")),
    birthDate: str(pick("birthDate")),
    profileUrl: str(pick("profileUrl")),
    cpdStatus: str(pick("cpdStatus")),
    testCodex: test.label,
    testScore: test.score,
    hasResume: boolLabel(pick("legacyResume") ?? pick("resume")),
    hasCertificate: boolLabel(pick("legacyCertificate") ?? pick("certificate")),
    source: str(pick("source")),
    linkedApplications: row.linkedApplications ?? 0,
    createdAt: formatDateTime(row.createdAt),
    updatedAt: formatDateTime(row.updatedAt),
  };
}
