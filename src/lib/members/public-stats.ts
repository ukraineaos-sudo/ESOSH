import { count } from "drizzle-orm";
import { getDb } from "@/db";
import { members } from "@/db/schema";

/**
 * RU: Кількість усіх записів у реєстрі членів для публічного лічильника (заготовка).
 * EN: All member-registry rows for the homepage stub (any status).
 */
export async function countJoinedMembers(): Promise<number | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const [row] = await db.select({ value: count() }).from(members);
    return Number(row?.value ?? 0);
  } catch {
    return null;
  }
}
