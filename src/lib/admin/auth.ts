import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { adminSessions, adminUsers } from "@/db/schema";
import { ADMIN_SESSION_COOKIE } from "./auth-cookie";
import { createSessionToken, hashPassword, hashToken, verifyPassword } from "./password";

export { ADMIN_SESSION_COOKIE };

const SESSION_DAYS = 14;

export type AdminRole = "admin" | "editor";
export type AdminSessionUser = { id: number; email: string; role: AdminRole };

/** RU: Текущий админ из cookie. EN: Resolve the signed-in admin from the session cookie. */
export async function getAdminSession(): Promise<AdminSessionUser | null> {
  const db = getDb();
  if (!db) return null;
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const tokenHash = hashToken(token);
  const rows = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      role: adminUsers.role,
      active: adminUsers.active,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
    .where(and(eq(adminSessions.tokenHash, tokenHash), gt(adminSessions.expiresAt, new Date())))
    .limit(1);
  const row = rows[0];
  if (!row || !row.active) return null;
  if (row.role !== "admin" && row.role !== "editor") return null;
  return { id: row.id, email: row.email, role: row.role };
}

/** RU: Создаёт первого admin из bootstrap env. EN: Bootstrap the first admin from env. */
export async function ensureBootstrapAdmin(): Promise<void> {
  const db = getDb();
  if (!db) return;
  const existing = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
  if (existing.length > 0) return;
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!email || !password) return;
  await db.insert(adminUsers).values({
    email,
    passwordHash: hashPassword(password),
    role: "admin",
    active: true,
  });
}

/** RU: Вход по email/паролю. EN: Authenticate and create a session. */
export async function loginAdmin(emailRaw: string, password: string): Promise<"ok" | "invalid" | "unavailable"> {
  const db = getDb();
  if (!db) return "unavailable";
  await ensureBootstrapAdmin();
  const email = emailRaw.trim().toLowerCase();
  const rows = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  const user = rows[0];
  if (!user || !user.active || !verifyPassword(password, user.passwordHash)) return "invalid";
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(adminSessions).values({
    tokenHash: hashToken(token),
    userId: user.id,
    expiresAt,
  });
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return "ok";
}

/** RU: Выход и удаление сессии. EN: Clear session cookie and revoke token. */
export async function logoutAdmin(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  const db = getDb();
  if (db && token) {
    await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hashToken(token)));
  }
  jar.delete(ADMIN_SESSION_COOKIE);
}

/** RU: Требует роль admin. EN: Require admin role. */
export function requireAdmin(user: AdminSessionUser): boolean {
  return user.role === "admin";
}

/** RU: Редактор или админ. EN: Editor or admin may manage content. */
export function canEditContent(user: AdminSessionUser): boolean {
  return user.role === "admin" || user.role === "editor";
}
