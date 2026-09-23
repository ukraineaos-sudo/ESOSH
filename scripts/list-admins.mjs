import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`
  select id, username, email, role, active, must_change_password, created_at
  from admin_users
  order by id
`;
console.log(JSON.stringify(rows, null, 2));
