import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { adminUsers } from "@/db/schema";
import { getAdminSession, requireAdmin } from "@/lib/admin/auth";
import { hashPassword } from "@/lib/admin/password";
import { isValidNewPassword, isValidUsername, normalizeUsername } from "@/lib/admin/password-policy";

/** RU: Список пользователей админки. EN: List admin users. */
export async function GET() {
  const user = await getAdminSession();
  if (!user || !requireAdmin(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const items = await db.select({
    id: adminUsers.id,
    username: adminUsers.username,
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
  const username = normalizeUsername(String(body.username || ""));
  const emailRaw = String(body.email || "").trim().toLowerCase();
  const email = emailRaw.includes("@") ? emailRaw : null;
  const password = String(body.password || "");
  const role = body.role === "admin" ? "admin" : "editor";
  if (!isValidUsername(username) || !isValidNewPassword(password)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  try {
    const [row] = await db.insert(adminUsers).values({
      username,
      email,
      passwordHash: hashPassword(password),
      role,
      active: true,
      mustChangePassword: false,
    }).returning({
      id: adminUsers.id,
      username: adminUsers.username,
      email: adminUsers.email,
      role: adminUsers.role,
    });
    return NextResponse.json({ ok: true, item: row });
  } catch {
    return NextResponse.json({ ok: false, error: "duplicate" }, { status: 409 });
  }
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
