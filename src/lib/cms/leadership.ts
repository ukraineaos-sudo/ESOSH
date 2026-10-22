import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import { leadershipPeople } from "@/db/schema";
import { DbUnavailableError, isDbUnavailable } from "@/lib/cache/db-unavailable";
import { CACHE_TAGS } from "@/lib/cache/tags";

export type LeadershipPerson = {
  id: number;
  sortOrder: number;
  photoUrl: string;
  photoClass: string;
  nameUk: string;
  nameEn: string;
  roleUk: string;
  roleEn: string;
  status: string;
};

const LEADERSHIP_REVALIDATE_SEC = 60 * 60;

async function loadPublishedLeadershipFromDb(): Promise<LeadershipPerson[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select()
      .from(leadershipPeople)
      .where(eq(leadershipPeople.status, "published"))
      .orderBy(asc(leadershipPeople.sortOrder), asc(leadershipPeople.id));
    return rows.map((row) => ({
      id: row.id,
      sortOrder: row.sortOrder,
      photoUrl: row.photoUrl || "",
      photoClass: row.photoClass || "",
      nameUk: row.nameUk,
      nameEn: row.nameEn,
      roleUk: row.roleUk,
      roleEn: row.roleEn,
      status: row.status,
    }));
  } catch (err) {
    throw new DbUnavailableError(err);
  }
}

const listPublishedLeadershipCached = unstable_cache(
  async () => loadPublishedLeadershipFromDb(),
  ["cms-leadership-v1"],
  { revalidate: LEADERSHIP_REVALIDATE_SEC, tags: [CACHE_TAGS.cmsLeadership] },
);

/** RU: Опублікований керівний склад (порядок sortOrder). EN: Published leadership, sorted. */
export async function listPublishedLeadership(): Promise<LeadershipPerson[]> {
  try {
    return await listPublishedLeadershipCached();
  } catch (err) {
    if (isDbUnavailable(err)) return [];
    throw err;
  }
}
