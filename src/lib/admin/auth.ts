import { cookies } from "next/headers";
import { and, eq, gt, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { adminSessions, adminUsers } from "@/db/schema";
import { ADMIN_SESSION_COOKIE } from "./auth-cookie";
import {
  isValidNewPassword,
  isValidUsername,
  isWeakBootstrapPassword,
  normalizeUsername,
} from "./password-policy";
import { createSessionToken, hashPassword, hashToken, verifyPassword } from "./password";

export { ADMIN_SESSION_COOKIE };

const SESSION_DAYS = 14;

export type AdminRole = "admin" | "editor";
export type AdminSessionUser = {
  id: number;
  username: string;
  email: string | null;
  role: AdminRole;
  mustChangePassword: boolean;
};

function sessionExpiry(): Date {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

async function createSession(userId: number): Promise<"ok" | "unavailable"> {
  const db = getDb();
  if (!db) return "unavailable";
  const token = createSessionToken();
  const expiresAt = sessionExpiry();
  await db.insert(adminSessions).values({
    tokenHash: hashToken(token),
    userId,
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
      username: adminUsers.username,
      email: adminUsers.email,
      role: adminUsers.role,
      active: adminUsers.active,
      mustChangePassword: adminUsers.mustChangePassword,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
    .where(and(eq(adminSessions.tokenHash, tokenHash), gt(adminSessions.expiresAt, new Date())))
    .limit(1);
  const row = rows[0];
  if (!row || !row.active) return null;
  if (row.role !== "admin" && row.role !== "editor") return null;
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    mustChangePassword: row.mustChangePassword,
  };
}

/** RU: Создаёт первого admin из bootstrap env (default admin/admin). EN: Bootstrap first admin from env. */
export async function ensureBootstrapAdmin(): Promise<void> {
  const db = getDb();
  if (!db) return;
  const existing = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
  if (existing.length > 0) return;

  const username = normalizeUsername(process.env.ADMIN_BOOTSTRAP_USERNAME || "admin");
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "admin";

  if (!isValidUsername(username) || !password) return;

  await db.insert(adminUsers).values({
    username,
    email: null,
    passwordHash: hashPassword(password),
    role: "admin",
    active: true,
    mustChangePassword: isWeakBootstrapPassword(password),
  });
}

/** RU: Вход по username/паролю. EN: Authenticate by username and create a session. */
export async function loginAdmin(
  usernameRaw: string,
  password: string,
): Promise<"ok" | "invalid" | "unavailable"> {
  const db = getDb();
  if (!db) return "unavailable";
  await ensureBootstrapAdmin();
  const username = normalizeUsername(usernameRaw);
  if (!isValidUsername(username) || !password) return "invalid";
  const rows = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
  const user = rows[0];
  if (!user || !user.active || !verifyPassword(password, user.passwordHash)) return "invalid";
  return createSession(user.id);
}

export type ChangePasswordResult =
  | "ok"
  | "invalid_current"
  | "invalid_new"
  | "mismatch"
  | "unavailable"
  | "unauthorized";

/**
 * RU: Смена пароля; отзывает другие сессии (Löwen-like).
 * EN: Change password and revoke other sessions.
 */
export async function changeAdminPassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ChangePasswordResult> {
  const db = getDb();
  if (!db) return "unavailable";
  const user = await getAdminSession();
  if (!user) return "unauthorized";

  if (input.newPassword !== input.confirmPassword) return "mismatch";
  if (!isValidNewPassword(input.newPassword)) return "invalid_new";
  if (input.newPassword === input.currentPassword) return "invalid_new";

  const rows = await db.select().from(adminUsers).where(eq(adminUsers.id, user.id)).limit(1);
  const row = rows[0];
  if (!row || !row.active || !verifyPassword(input.currentPassword, row.passwordHash)) {
    return "invalid_current";
  }

  const jar = await cookies();
  const currentToken = jar.get(ADMIN_SESSION_COOKIE)?.value;
  const currentHash = currentToken ? hashToken(currentToken) : null;

  await db
    .update(adminUsers)
    .set({
      passwordHash: hashPassword(input.newPassword),
      mustChangePassword: false,
    })
    .where(eq(adminUsers.id, user.id));

  // Invalidate other sessions; keep this browser's session if present.
  if (currentHash) {
    await db
      .delete(adminSessions)
      .where(and(eq(adminSessions.userId, user.id), ne(adminSessions.tokenHash, currentHash)));
  } else {
    await db.delete(adminSessions).where(eq(adminSessions.userId, user.id));
    return (await createSession(user.id)) === "ok" ? "ok" : "unavailable";
  }

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
