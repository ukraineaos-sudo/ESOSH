import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { leadershipPeople } from "@/db/schema";

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

/** RU: Опублікований керівний склад (порядок sortOrder). EN: Published leadership, sorted. */
export async function listPublishedLeadership(): Promise<LeadershipPerson[]> {
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
  } catch {
    return [];
  }
}
