import { and, eq, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { members } from "@/db/schema";
import { createPublicId } from "./ids";
import type { EnrollmentPayload } from "./schema";

/** RU: Нормалізація ПІБ для зіставлення. EN: Normalize person name for matching. */
export function normalizePersonNamePart(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

/** RU: Знаходить учасників за primary email (email може повторюватися). EN: Find members by primary email. */
export async function findMembersByPrimaryEmail(db: Db, email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return [];
  return db.select().from(members).where(eq(members.primaryEmail, normalized));
}

/** RU: Знаходить учасника за primary email. EN: Find member by primary email only. */
export async function findMemberByPrimaryEmail(db: Db, email: string) {
  const rows = await findMembersByPrimaryEmail(db, email);
  return rows[0] ?? null;
}

/**
 * RU: Якір людини для публічної анкети / імпорту: нормалізовані прізвище+ім’я+email.
 * EN: Person anchor: normalized last+first+email.
 */
export async function findMemberByNameAndPrimaryEmail(
  db: Db,
  lastName: string,
  firstName: string,
  email: string,
) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;
  const last = normalizePersonNamePart(lastName);
  const first = normalizePersonNamePart(firstName);
  if (!last && !first) return null;

  const rows = await db
    .select()
    .from(members)
    .where(
      and(
        eq(members.primaryEmail, normalizedEmail),
        sql`lower(trim(regexp_replace(${members.lastName}, '\\s+', ' ', 'g'))) = ${last}`,
        sql`lower(trim(regexp_replace(${members.firstName}, '\\s+', ' ', 'g'))) = ${first}`,
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

/** RU: Знаходить учасника за secondary email. EN: Find member by secondary email. */
export async function findMemberBySecondaryEmail(db: Db, email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  const rows = await db
    .select()
    .from(members)
    .where(eq(members.secondaryEmail, normalized))
    .limit(1);
  return rows[0] ?? null;
}

/** RU: Поля анкети для фільтрів/статистики в profile. EN: Filterable profile fields from enrollment. */
export function buildMemberProfileFromEnrollment(
  payload: EnrollmentPayload,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    ...extra,
    middleName: payload.middleName || null,
    country: payload.country,
    city: payload.city,
    jobTitle: payload.jobTitle,
    organization: payload.organization || null,
    industry: payload.industry,
    companySize: payload.companySize,
    oshYears: payload.oshYears,
    oshFunctions: payload.oshFunctions,
    educationLevel: payload.educationLevel,
    profileEducation: payload.profileEducation,
  };
}

/**
 * RU: Публічна анкета: новий member або link за якіром прізвище+ім’я+primary email.
 * Існуючу картку НЕ оновлює (PII лише в applications.payload → merge адміном).
 * Той самий email + інше ПІБ → нова картка (оргпошта).
 * Secondary — тільки conflict-check, ніколи ключ overwrite.
 * EN: Public enrollment links by name+email; same email different name creates a new card.
 */
export async function upsertMemberFromEnrollment(
  db: Db,
  payload: EnrollmentPayload,
  profileExtra: Record<string, unknown> = {},
): Promise<{ memberId: number; publicId: string; created: boolean }> {
  const email = payload.email.trim().toLowerCase();
  const secondary = payload.secondaryEmail?.trim().toLowerCase() || null;
  const nextProfile = buildMemberProfileFromEnrollment(payload, profileExtra);

  const byNameEmail = await findMemberByNameAndPrimaryEmail(
    db,
    payload.lastName,
    payload.firstName,
    email,
  );

  const emailAsOthersSecondary = await findMemberBySecondaryEmail(db, email);
  if (emailAsOthersSecondary && emailAsOthersSecondary.id !== byNameEmail?.id) {
    throw new Error("email_conflict");
  }

  if (secondary && secondary !== email) {
    const secAsPrimary = await findMembersByPrimaryEmail(db, secondary);
    const secAsSecondary = await findMemberBySecondaryEmail(db, secondary);
    const conflictsPrimary = secAsPrimary.some((row) => row.id !== byNameEmail?.id);
    if (conflictsPrimary) {
      throw new Error("email_conflict");
    }
    if (secAsSecondary && secAsSecondary.id !== byNameEmail?.id) {
      throw new Error("email_conflict");
    }
  }

  // Existing member (same name + email): link application only — no unauthenticated profile overwrite.
  if (byNameEmail) {
    return { memberId: byNameEmail.id, publicId: byNameEmail.publicId, created: false };
  }

  const publicId = createPublicId("MBR");
  const [created] = await db
    .insert(members)
    .values({
      publicId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      primaryEmail: email,
      secondaryEmail: secondary && secondary !== email ? secondary : null,
      phone: payload.phone,
      status: "candidate",
      profile: nextProfile,
    })
    .returning({ id: members.id, publicId: members.publicId });

  return { memberId: created.id, publicId: created.publicId, created: true };
}
