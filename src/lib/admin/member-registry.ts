import {
  LEVEL_CODES,
  MEMBER_STATUSES,
  type LevelCode,
  type MemberStatus,
} from "@/lib/enrollment/levels";

export type MemberRegistryItem = {
  id: number;
  publicId: string;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  secondaryEmail: string | null;
  phone: string | null;
  status: string;
  level: string | null;
  linkedApplications: number;
  jobTitle: string | null;
  organization: string | null;
  industry: string | null;
  companySize: string | null;
  oshYears: number | null;
  oshFunctions: boolean | null;
  country: string | null;
  city: string | null;
};

export type MemberRegistryStats = {
  total: number;
  byStatus: Record<string, number>;
  byLevel: Record<string, number>;
};

export type MemberRegistryFilters = {
  q?: string;
  status?: string;
  level?: string;
  industry?: string;
  oshFunctions?: "" | "yes" | "no";
  minOshYears?: number | null;
};

/** RU: Читає зріз профілю з jsonb. EN: Read filterable profile slice. */
export function readMemberProfileSlice(profile: unknown): {
  jobTitle: string | null;
  organization: string | null;
  industry: string | null;
  companySize: string | null;
  oshYears: number | null;
  oshFunctions: boolean | null;
  country: string | null;
  city: string | null;
} {
  const p =
    profile && typeof profile === "object" && !Array.isArray(profile)
      ? (profile as Record<string, unknown>)
      : {};
  const oshYearsRaw = p.oshYears;
  const oshYears =
    typeof oshYearsRaw === "number"
      ? oshYearsRaw
      : typeof oshYearsRaw === "string" && oshYearsRaw.trim() !== "" && !Number.isNaN(Number(oshYearsRaw))
        ? Number(oshYearsRaw)
        : null;
  return {
    jobTitle: strOrNull(p.jobTitle),
    organization: strOrNull(p.organization),
    industry: strOrNull(p.industry),
    companySize: strOrNull(p.companySize),
    oshYears,
    oshFunctions: typeof p.oshFunctions === "boolean" ? p.oshFunctions : null,
    country: strOrNull(p.country),
    city: strOrNull(p.city),
  };
}

/** RU: Зріз з payload заявки (fallback для старих карток). EN: Slice from application payload. */
export function readPayloadProfileSlice(payload: unknown): ReturnType<typeof readMemberProfileSlice> {
  return readMemberProfileSlice(payload);
}

function strOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

/** RU: Статистика по відфільтрованому набору. EN: Stats for a member set. */
export function computeMemberRegistryStats(
  items: Pick<MemberRegistryItem, "status" | "level">[],
): MemberRegistryStats {
  const byStatus: Record<string, number> = {};
  for (const status of MEMBER_STATUSES) byStatus[status] = 0;
  const byLevel: Record<string, number> = {};
  for (const level of LEVEL_CODES) byLevel[level] = 0;
  byLevel.none = 0;

  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] ?? 0) + 1;
    if (item.level && (LEVEL_CODES as readonly string[]).includes(item.level)) {
      byLevel[item.level] = (byLevel[item.level] ?? 0) + 1;
    } else {
      byLevel.none = (byLevel.none ?? 0) + 1;
    }
  }

  return { total: items.length, byStatus, byLevel };
}

/** RU: Клієнтська/серверна фільтрація зрізу. EN: Filter hydrated member rows. */
export function filterMemberRegistryItems(
  items: MemberRegistryItem[],
  filters: MemberRegistryFilters,
): MemberRegistryItem[] {
  const q = filters.q?.trim().toLowerCase() || "";
  const industry = filters.industry?.trim().toLowerCase() || "";
  const minYears =
    filters.minOshYears != null && Number.isFinite(filters.minOshYears)
      ? Number(filters.minOshYears)
      : null;

  return items.filter((item) => {
    if (filters.status && item.status !== filters.status) return false;
    if (filters.level === "none") {
      if (item.level) return false;
    } else if (filters.level && item.level !== filters.level) {
      return false;
    }
    if (filters.oshFunctions === "yes" && item.oshFunctions !== true) return false;
    if (filters.oshFunctions === "no" && item.oshFunctions !== false) return false;
    if (minYears != null && (item.oshYears == null || item.oshYears < minYears)) return false;
    if (industry && (item.industry || "").toLowerCase() !== industry) return false;
    if (q) {
      const hay = [
        item.publicId,
        item.firstName,
        item.lastName,
        item.primaryEmail,
        item.secondaryEmail || "",
        item.phone || "",
        item.jobTitle || "",
        item.organization || "",
        item.industry || "",
        item.country || "",
        item.city || "",
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/** RU: Унікальні галузі для фасетів. EN: Distinct industries for facets. */
export function collectIndustryFacets(items: MemberRegistryItem[]): string[] {
  const set = new Set<string>();
  for (const item of items) {
    if (item.industry) set.add(item.industry);
  }
  return [...set].sort((a, b) => a.localeCompare(b, "uk"));
}

export function isMemberStatus(value: string): value is MemberStatus {
  return (MEMBER_STATUSES as readonly string[]).includes(value);
}

export function isLevelCodeOrNone(value: string): boolean {
  return value === "none" || (LEVEL_CODES as readonly string[]).includes(value);
}

export type { LevelCode, MemberStatus };
