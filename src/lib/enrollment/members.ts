import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import { members } from "@/db/schema";
import { createPublicId } from "./ids";
import type { EnrollmentPayload } from "./schema";

/** RU: Знаходить учасника за primary email. EN: Find member by primary email only. */
export async function findMemberByPrimaryEmail(db: Db, email: string) {
  const normalized = email.trim().toLowerCase();
  const rows = await db
    .select()
    .from(members)
    .where(eq(members.primaryEmail, normalized))
    .limit(1);
  return rows[0] ?? null;
}

/** RU: Знаходить учасника за secondary email. EN: Find member by secondary email. */
export async function findMemberBySecondaryEmail(db: Db, email: string) {
  const normalized = email.trim().toLowerCase();
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
 * RU: Upsert лише за primary email; secondary — тільки conflict-check (без overwrite чужої картки).
 * EN: Upsert by primary only; secondary used for conflict, never as overwrite key.
 */
export async function upsertMemberFromEnrollment(
  db: Db,
  payload: EnrollmentPayload,
  profileExtra: Record<string, unknown> = {},
): Promise<{ memberId: number; publicId: string; created: boolean }> {
  const email = payload.email.trim().toLowerCase();
  const secondary = payload.secondaryEmail?.trim().toLowerCase() || null;
  const nextProfile = buildMemberProfileFromEnrollment(payload, profileExtra);

  const byPrimary = await findMemberByPrimaryEmail(db, email);
  const emailAsOthersSecondary = await findMemberBySecondaryEmail(db, email);
  if (emailAsOthersSecondary && emailAsOthersSecondary.id !== byPrimary?.id) {
    throw new Error("email_conflict");
  }

  if (secondary) {
    if (secondary === email) {
      // same as primary — ignore duplicate secondary
    } else {
      const secAsPrimary = await findMemberByPrimaryEmail(db, secondary);
      const secAsSecondary = await findMemberBySecondaryEmail(db, secondary);
      if (secAsPrimary && secAsPrimary.id !== byPrimary?.id) {
        throw new Error("email_conflict");
      }
      if (secAsSecondary && secAsSecondary.id !== byPrimary?.id) {
        throw new Error("email_conflict");
      }
    }
  }

  if (byPrimary) {
    const nextSecondary =
      secondary && secondary !== byPrimary.primaryEmail ? secondary : byPrimary.secondaryEmail;
    await db
      .update(members)
      .set({
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        secondaryEmail: nextSecondary,
        profile: {
          ...(typeof byPrimary.profile === "object" && byPrimary.profile
            ? (byPrimary.profile as object)
            : {}),
          ...nextProfile,
        },
        updatedAt: new Date(),
      })
      .where(eq(members.id, byPrimary.id));
    return { memberId: byPrimary.id, publicId: byPrimary.publicId, created: false };
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
