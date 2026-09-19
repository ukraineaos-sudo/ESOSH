import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 } as const;

/** RU: Хеш пароля scrypt. EN: Hash a password with scrypt. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64, SCRYPT_PARAMS).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

/** RU: Проверка пароля. EN: Verify password against stored hash. */
export function verifyPassword(password: string, stored: string): boolean {
  const [algo, salt, hash] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const next = scryptSync(password, salt, 64, SCRYPT_PARAMS);
  const prev = Buffer.from(hash, "hex");
  if (prev.length !== next.length) return false;
  return timingSafeEqual(prev, next);
}

/** RU: Хеш токена сессии. EN: Hash a session token for storage. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** RU: Случайный токен сессии. EN: Create a random session token. */
export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}
