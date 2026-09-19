import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { adminUsers } from "@/db/schema";
import { getAdminSession, requireAdmin } from "@/lib/admin/auth";
import { hashPassword } from "@/lib/admin/password";

/** RU: Список пользователей админки. EN: List admin users. */
export async function GET() {
  const user = await getAdminSession();
  if (!user || !requireAdmin(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const items = await db.select({
    id: adminUsers.id,
    email: adminUsers.email,
    role: adminUsers.role,
    active: adminUsers.active,
    createdAt: adminUsers.createdAt,
  }).from(adminUsers);
  return NextResponse.json({ ok: true, items });
}

/** RU: Создать editor/admin. EN: Create an admin user. */
export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user || !requireAdmin(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const role = body.role === "admin" ? "admin" : "editor";
  if (!email || password.length < 8) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const [row] = await db.insert(adminUsers).values({
    email,
    passwordHash: hashPassword(password),
    role,
    active: true,
  }).returning({ id: adminUsers.id, email: adminUsers.email, role: adminUsers.role });
  return NextResponse.json({ ok: true, item: row });
}

/** RU: Активировать/деактивировать. EN: Toggle user active flag. */
export async function PATCH(request: Request) {
  const user = await getAdminSession();
  if (!user || !requireAdmin(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const body = await request.json();
  const id = Number(body.id);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false }, { status: 400 });
  await db.update(adminUsers).set({ active: Boolean(body.active) }).where(eq(adminUsers.id, id));
  return NextResponse.json({ ok: true });
}
