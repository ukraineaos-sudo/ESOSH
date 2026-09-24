import { eq, or } from "drizzle-orm";
import type { Db } from "@/db";
import { members } from "@/db/schema";
import { createPublicId } from "./ids";
import type { EnrollmentPayload } from "./schema";

/** RU: Знаходить учасника за email (primary або secondary). EN: Find member by either email. */
export async function findMemberByEmail(db: Db, email: string) {
  const normalized = email.trim().toLowerCase();
  const rows = await db
    .select()
    .from(members)
    .where(or(eq(members.primaryEmail, normalized), eq(members.secondaryEmail, normalized)))
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

/** RU: Знаходить або створює картку учасника (ID якорь, до 2 email). EN: Find/create member by email anchor. */
export async function upsertMemberFromEnrollment(
  db: Db,
  payload: EnrollmentPayload,
  profileExtra: Record<string, unknown> = {},
): Promise<{ memberId: number; publicId: string; created: boolean }> {
  const email = payload.email.trim().toLowerCase();
  const secondary = payload.secondaryEmail?.trim().toLowerCase() || null;
  const nextProfile = buildMemberProfileFromEnrollment(payload, profileExtra);

  const byPrimary = await findMemberByEmail(db, email);
  const bySecondary = secondary ? await findMemberByEmail(db, secondary) : null;

  if (byPrimary && bySecondary && byPrimary.id !== bySecondary.id) {
    throw new Error("email_conflict");
  }

  const row = byPrimary || bySecondary;
  if (row) {
    const nextSecondary =
      secondary && secondary !== row.primaryEmail ? secondary : row.secondaryEmail;
    await db
      .update(members)
      .set({
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        secondaryEmail: nextSecondary,
        profile: {
          ...(typeof row.profile === "object" && row.profile ? (row.profile as object) : {}),
          ...nextProfile,
        },
        updatedAt: new Date(),
      })
      .where(eq(members.id, row.id));
    return { memberId: row.id, publicId: row.publicId, created: false };
  }

  const publicId = createPublicId("MBR");
  const [created] = await db
    .insert(members)
    .values({
      publicId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      primaryEmail: email,
      secondaryEmail: secondary,
      phone: payload.phone,
      status: "candidate",
      profile: nextProfile,
    })
    .returning({ id: members.id, publicId: members.publicId });

  return { memberId: created.id, publicId: created.publicId, created: true };
}
