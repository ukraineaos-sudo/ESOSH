import "dotenv/config";
import { randomBytes, scryptSync } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const username = (process.env.ADMIN_BOOTSTRAP_USERNAME || "admin").trim().toLowerCase();
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || "admin";
const url = process.env.DATABASE_URL;

if (!url || !username || !password) {
  console.error("missing DATABASE_URL / ADMIN_BOOTSTRAP_USERNAME / ADMIN_BOOTSTRAP_PASSWORD");
  process.exit(1);
}

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64, SCRYPT_PARAMS).toString("hex");
const passwordHash = `scrypt$${salt}$${hash}`;
const mustChange = password === "admin" || password.length < 8;
const sql = neon(url);

const rows = await sql`
  select id, username from admin_users where username = ${username} limit 1
`;

if (!rows.length) {
  await sql`
    insert into admin_users (username, email, password_hash, role, active, must_change_password)
    values (${username}, null, ${passwordHash}, 'admin', true, ${mustChange})
  `;
  console.log("created admin", username);
} else {
  await sql`
    update admin_users
    set password_hash = ${passwordHash}, active = true, must_change_password = ${mustChange}
    where username = ${username}
  `;
  console.log("updated password for", username, "id", rows[0].id);
}
