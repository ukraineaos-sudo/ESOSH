import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { educationCourses } from "@/db/schema";

export type EducationCourseCard = {
  id: number;
  sortOrder: number;
  slug: string;
  imageUrl: string;
  levelUk: string;
  levelEn: string;
  titleUk: string;
  titleEn: string;
  descriptionUk: string;
  descriptionEn: string;
  descriptionExtraUk: string;
  descriptionExtraEn: string;
  ctaUrl: string;
  ctaLabelUk: string;
  ctaLabelEn: string;
  status: string;
};

function mapRow(row: typeof educationCourses.$inferSelect): EducationCourseCard {
  return {
    id: row.id,
    sortOrder: row.sortOrder,
    slug: row.slug || "",
    imageUrl: row.imageUrl || "",
    levelUk: row.levelUk,
    levelEn: row.levelEn,
    titleUk: row.titleUk,
    titleEn: row.titleEn,
    descriptionUk: row.descriptionUk,
    descriptionEn: row.descriptionEn,
    descriptionExtraUk: row.descriptionExtraUk,
    descriptionExtraEn: row.descriptionExtraEn,
    ctaUrl: row.ctaUrl || "",
    ctaLabelUk: row.ctaLabelUk || "",
    ctaLabelEn: row.ctaLabelEn || "",
    status: row.status,
  };
}

/** RU: Опубліковані курси каталогу. EN: Published education course cards. */
export async function listPublishedEducationCourses(): Promise<EducationCourseCard[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select()
      .from(educationCourses)
      .where(eq(educationCourses.status, "published"))
      .orderBy(asc(educationCourses.sortOrder), asc(educationCourses.id));
    return rows.map(mapRow);
  } catch {
    return [];
  }
}

/** RU: Опублікований курс за slug. EN: Published course by slug. */
export async function getPublishedEducationCourseBySlug(
  slug: string,
): Promise<EducationCourseCard | null> {
  const db = getDb();
  if (!db || !slug.trim()) return null;
  try {
    const rows = await db
      .select()
      .from(educationCourses)
      .where(
        and(eq(educationCourses.slug, slug.trim()), eq(educationCourses.status, "published")),
      )
      .limit(1);
    return rows[0] ? mapRow(rows[0]) : null;
  } catch {
    return null;
  }
}
