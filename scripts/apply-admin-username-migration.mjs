import "dotenv/config";
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("NO_DATABASE_URL");
  process.exit(1);
}

const sql = neon(url);
const raw = readFileSync("drizzle/0001_admin_username.sql", "utf8");
const statements = raw
  .split(/-->\s*statement-breakpoint/)
  .map((s) => s.replace(/^--.*$/gm, "").trim())
  .filter(Boolean);

for (let i = 0; i < statements.length; i++) {
  const st = statements[i];
  process.stdout.write(`[${i + 1}/${statements.length}] `);
  try {
    await sql.query(st);
    console.log("ok");
  } catch (e) {
    console.error("FAIL:", e instanceof Error ? e.message : e);
    process.exit(1);
  }
}

const rows = await sql`
  select id, username, email, role, active, must_change_password
  from admin_users
  order by id
`;
console.log(
  "admin_users:",
  rows.map((r) => ({
    id: r.id,
    username: r.username,
    role: r.role,
    active: r.active,
    must_change: r.must_change_password,
  })),
);
