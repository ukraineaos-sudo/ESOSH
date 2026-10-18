import { inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { members } from "@/db/schema";
import {
  inferMemberCountry,
  type InferredCountryCode,
} from "@/lib/members/infer-country";
import { LEVEL_CODES, type LevelCode } from "@/lib/enrollment/levels";

/** Statuses that count as «приєдналися» on the public homepage. */
export const JOINED_MEMBER_STATUSES = ["active", "active_no_level"] as const;

export type LevelCountRow = {
  code: LevelCode;
  count: number;
};

/** Public country codes (UNKNOWN folded into OTHER for display). */
export type PublicCountryCode = Exclude<InferredCountryCode, "UNKNOWN">;

export type CountryBucket = {
  code: PublicCountryCode;
  count: number;
};

export type JoinedMembersBreakdown = {
  total: number;
  /** All known levels in canonical order (zeros included). */
  levels: LevelCountRow[];
  countries: CountryBucket[];
};

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

/**
 * RU: Агрегати для блоку на головній: total / рівні / країни (без PII).
 * EN: Homepage aggregates: total / levels / countries (no PII).
 */
export async function getJoinedMembersBreakdown(): Promise<JoinedMembersBreakdown | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db
      .select({
        level: members.level,
        phone: members.phone,
        primaryEmail: members.primaryEmail,
        profile: members.profile,
      })
      .from(members)
      .where(inArray(members.status, [...JOINED_MEMBER_STATUSES]));

    const total = rows.length;
    const byLevel = Object.fromEntries(LEVEL_CODES.map((c) => [c, 0])) as Record<
      LevelCode,
      number
    >;
    const countryCounts = new Map<PublicCountryCode, number>();

    for (const row of rows) {
      const level = (row.level ?? "").trim();
      if ((LEVEL_CODES as readonly string[]).includes(level)) {
        byLevel[level as LevelCode] += 1;
      }

      const profile = asRecord(row.profile);
      const profileCountry =
        typeof profile.country === "string" ? profile.country : null;

      let code = inferMemberCountry({
        profileCountry,
        phone: row.phone,
        email: row.primaryEmail,
      });
      // Public site: unknown → other (same bucket for visitors).
      if (code === "UNKNOWN") code = "OTHER";

      countryCounts.set(code, (countryCounts.get(code) ?? 0) + 1);
    }

    const levels = LEVEL_CODES.map((code) => ({
      code,
      count: byLevel[code],
    }));

    const countries = [...countryCounts.entries()]
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => {
        if (a.code === "OTHER") return 1;
        if (b.code === "OTHER") return -1;
        return b.count - a.count;
      });

    return { total, levels, countries };
  } catch {
    return null;
  }
}

/**
 * RU: Кількість прийнятих членів для публічного лічильника на головній.
 * EN: Joined-member count for the homepage (active / active_no_level only).
 */
export async function countJoinedMembers(): Promise<number | null> {
  const breakdown = await getJoinedMembersBreakdown();
  return breakdown?.total ?? null;
}
