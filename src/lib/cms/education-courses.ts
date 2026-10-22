import { and, asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import { educationCourses } from "@/db/schema";
import { DbUnavailableError, isDbUnavailable } from "@/lib/cache/db-unavailable";
import { CACHE_TAGS } from "@/lib/cache/tags";

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

const COURSES_REVALIDATE_SEC = 60 * 60;

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

async function loadPublishedEducationCoursesFromDb(): Promise<EducationCourseCard[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select()
      .from(educationCourses)
      .where(eq(educationCourses.status, "published"))
      .orderBy(asc(educationCourses.sortOrder), asc(educationCourses.id));
    return rows.map(mapRow);
  } catch (err) {
    throw new DbUnavailableError(err);
  }
}

const listPublishedEducationCoursesCached = unstable_cache(
  async () => loadPublishedEducationCoursesFromDb(),
  ["cms-courses-list-v1"],
  { revalidate: COURSES_REVALIDATE_SEC, tags: [CACHE_TAGS.cmsCourses] },
);

/** RU: Опубліковані курси каталогу. EN: Published education course cards. */
export async function listPublishedEducationCourses(): Promise<EducationCourseCard[]> {
  try {
    return await listPublishedEducationCoursesCached();
  } catch (err) {
    if (isDbUnavailable(err)) return [];
    throw err;
  }
}

/** RU: Опублікований курс за slug. EN: Published course by slug. */
export async function getPublishedEducationCourseBySlug(
  slug: string,
): Promise<EducationCourseCard | null> {
  const trimmed = slug.trim();
  if (!trimmed) return null;
  try {
    return await unstable_cache(
      async () => {
        const db = getDb();
        if (!db) return null;
        try {
          const rows = await db
            .select()
            .from(educationCourses)
            .where(
              and(eq(educationCourses.slug, trimmed), eq(educationCourses.status, "published")),
            )
            .limit(1);
          return rows[0] ? mapRow(rows[0]) : null;
        } catch (err) {
          throw new DbUnavailableError(err);
        }
      },
      ["cms-course-slug-v1", trimmed],
      { revalidate: COURSES_REVALIDATE_SEC, tags: [CACHE_TAGS.cmsCourses] },
    )();
  } catch (err) {
    if (isDbUnavailable(err)) return null;
    throw err;
  }
}
