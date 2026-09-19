import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/** RU: Клиент Neon, если задан DATABASE_URL. EN: Neon client when DATABASE_URL is set. */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export type Db = NonNullable<ReturnType<typeof getDb>>;
