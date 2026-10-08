import { createHash } from "node:crypto";
import { bumpWindowCounter, type SqlTag } from "../rate-limit-counter.ts";

/** RU: Макс. спроб оцінки одного модуля на (IP, курс, модуль). EN: Max score attempts per (IP, course, module). */
export const MODULE_ATTEMPT_LIMIT = 5;
/** RU: Вікно бюджету = TTL progress cookie. EN: Budget window matches the progress cookie TTL. */
export const MODULE_ATTEMPT_WINDOW_MS = 12 * 60 * 60 * 1000;

export type ModuleAttemptDecision =
  | { allowed: true; used: number }
  | { allowed: false; used: number; retryAfterSec: number };

/**
 * RU: Ключ бакета `training_module_score:{sha256(ip,slug,moduleId)}`; хеш — щоб вкластися в varchar(191)
 * без усікання (колізій) і не зберігати IP у відкритому вигляді.
 * EN: Bucket key; hashed to fit varchar(191) without truncation collisions and to avoid storing raw IPs.
 */
export function moduleAttemptKey(ip: string, slug: string, moduleId: string): string {
  const digest = createHash("sha256").update(`${ip}\0${slug}\0${moduleId}`).digest("hex");
  return `training_module_score:${digest}`;
}

/**
 * RU: Атомарно списує одну спробу в Neon ДО оцінювання. Не залежить від cookie: очищення cookie
 * бюджет не скидає. Кидає, якщо БД не відповіла (caller → 503, fail-closed).
 * EN: Atomically consumes one attempt in Neon BEFORE scoring. Cookie-independent: wiping cookies does
 * not reset the budget. Throws when the DB gives no row (caller maps to 503, fail-closed).
 */
export async function consumeModuleAttempt(
  sql: SqlTag,
  ip: string,
  slug: string,
  moduleId: string,
  nowMs: number = Date.now(),
): Promise<ModuleAttemptDecision> {
  const result = await bumpWindowCounter(
    sql,
    moduleAttemptKey(ip, slug, moduleId),
    MODULE_ATTEMPT_WINDOW_MS,
    nowMs,
  );
  if (!result) throw new Error("module_attempt_budget_unavailable");

  if (result.count > MODULE_ATTEMPT_LIMIT) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((result.windowStartMs + MODULE_ATTEMPT_WINDOW_MS - nowMs) / 1000),
    );
    return { allowed: false, used: result.count, retryAfterSec };
  }
  return { allowed: true, used: result.count };
}
