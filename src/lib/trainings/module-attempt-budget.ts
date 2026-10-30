import { createHash } from "node:crypto";
import { bumpWindowCounter, type SqlTag } from "../rate-limit-counter.ts";

/**
 * RU: Ліміт на браузер (visitor cookie). Офісний NAT не ділить цей бакет між людьми.
 * EN: Per-browser (visitor cookie) limit. Office NAT does not share this bucket across people.
 */
export const MODULE_ATTEMPT_LIMIT = 10;
/**
 * RU: Жорсткий стеля на IP (анти-wipe cookie / масовий oracle). ~12 людей × 10 спроб.
 * EN: Hard IP ceiling (anti cookie-wipe / mass oracle). ~12 people × 10 attempts.
 */
export const MODULE_IP_ATTEMPT_LIMIT = 120;
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
 * RU: Бакет на visitor cookie (окремий від IP), щоб NAT не блокував колег.
 * EN: Visitor-cookie bucket (separate from IP) so NAT does not block colleagues.
 */
export function moduleVisitorAttemptKey(visitorId: string, slug: string, moduleId: string): string {
  const digest = createHash("sha256").update(`${visitorId}\0${slug}\0${moduleId}`).digest("hex");
  return `training_module_score_v:${digest}`;
}

/**
 * RU: Атомарно списує одну спробу в Neon ДО оцінювання. Не залежить від progress cookie: очищення
 * `esosh_tp` бюджет не скидає. Кидає, якщо БД не відповіла (caller → 503, fail-closed).
 * EN: Atomically consumes one attempt in Neon BEFORE scoring. Independent of progress cookie: wiping
 * `esosh_tp` does not reset the budget. Throws when the DB gives no row (caller maps to 503, fail-closed).
 */
export async function consumeModuleAttempt(
  sql: SqlTag,
  ip: string,
  slug: string,
  moduleId: string,
  nowMs: number = Date.now(),
): Promise<ModuleAttemptDecision> {
  return consumeKeyedAttempt(sql, moduleAttemptKey(ip, slug, moduleId), MODULE_IP_ATTEMPT_LIMIT, nowMs);
}

/**
 * RU: Списання спроби в бакеті visitor cookie.
 * EN: Consume one attempt in the visitor-cookie bucket.
 */
export async function consumeVisitorModuleAttempt(
  sql: SqlTag,
  visitorId: string,
  slug: string,
  moduleId: string,
  nowMs: number = Date.now(),
): Promise<ModuleAttemptDecision> {
  return consumeKeyedAttempt(
    sql,
    moduleVisitorAttemptKey(visitorId, slug, moduleId),
    MODULE_ATTEMPT_LIMIT,
    nowMs,
  );
}

async function consumeKeyedAttempt(
  sql: SqlTag,
  key: string,
  limit: number,
  nowMs: number,
): Promise<ModuleAttemptDecision> {
  const result = await bumpWindowCounter(sql, key, MODULE_ATTEMPT_WINDOW_MS, nowMs);
  if (!result) throw new Error("module_attempt_budget_unavailable");

  if (result.count > limit) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((result.windowStartMs + MODULE_ATTEMPT_WINDOW_MS - nowMs) / 1000),
    );
    return { allowed: false, used: result.count, retryAfterSec };
  }
  return { allowed: true, used: result.count };
}

/** RU: Відбиток відповідей для ідемпотентного повтору. EN: Answers fingerprint for idempotent replay. */
export function fingerprintModuleAnswers(answers: Record<string, string>): string {
  const keys = Object.keys(answers).sort();
  const canonical = keys.map((k) => `${k}=${answers[k] ?? ""}`).join("\n");
  return createHash("sha256").update(canonical).digest("hex");
}
