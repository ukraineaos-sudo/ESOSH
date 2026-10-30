import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { bumpWindowCounter } from "@/lib/rate-limit-counter";
import {
  MODULE_ATTEMPT_LIMIT,
  consumeModuleAttempt,
  consumeVisitorModuleAttempt,
} from "@/lib/trainings/module-attempt-budget";
import { ensureTrainingVisitorId } from "@/lib/trainings/training-visitor";

export type RateLimitBucket =
  | "admin_login"
  | "contact"
  | "enrollment"
  | "enrollment_preview"
  | "training_certificate"
  | "training_score";

const LIMITS: Record<RateLimitBucket, { limit: number; windowMs: number }> = {
  admin_login: { limit: 5, windowMs: 15 * 60 * 1000 },
  contact: { limit: 10, windowMs: 60 * 60 * 1000 },
  enrollment: { limit: 5, windowMs: 60 * 60 * 1000 },
  enrollment_preview: { limit: 30, windowMs: 60 * 60 * 1000 },
  training_certificate: { limit: 20, windowMs: 60 * 60 * 1000 },
  // Align with dual module budgets (visitor × modules × retries under shared IP).
  training_score: { limit: 180, windowMs: 60 * 60 * 1000 },
};

export type ModuleScoreBudgetOk = {
  ok: true;
  visitorUsed: number;
  ipUsed: number;
  attemptsRemaining: number;
};

export type ModuleScoreBudgetResult = ModuleScoreBudgetOk | { ok: false; response: NextResponse };

function tooManyAttemptsResponse(retryAfterSec: number): NextResponse {
  return NextResponse.json(
    { ok: false, error: "too_many_attempts", retryAfterSec },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
  );
}

/**
 * RU: Подвійний бюджет: visitor cookie (справедливий за NAT) + IP-стеля (анти-wipe).
 * Production без DB — 503.
 * EN: Dual budget: visitor cookie (fair under NAT) + IP ceiling (anti-wipe). No DB in production → 503.
 */
export async function assertModuleScoreBudget(
  request: Request,
  slug: string,
  moduleId: string,
): Promise<ModuleScoreBudgetResult> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || !getDb()) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        response: NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 }),
      };
    }
    return { ok: true, visitorUsed: 0, ipUsed: 0, attemptsRemaining: MODULE_ATTEMPT_LIMIT };
  }

  const sql = neon(databaseUrl);
  const ip = clientIpFromRequest(request);
  let visitorId: string;
  try {
    visitorId = await ensureTrainingVisitorId();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 }),
    };
  }

  let visitorDecision;
  let ipDecision;
  try {
    visitorDecision = await consumeVisitorModuleAttempt(sql, visitorId, slug, moduleId);
    if (!visitorDecision.allowed) {
      return { ok: false, response: tooManyAttemptsResponse(visitorDecision.retryAfterSec) };
    }
    ipDecision = await consumeModuleAttempt(sql, ip, slug, moduleId);
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 }),
    };
  }

  if (!ipDecision.allowed) {
    return { ok: false, response: tooManyAttemptsResponse(ipDecision.retryAfterSec) };
  }

  return {
    ok: true,
    visitorUsed: visitorDecision.used,
    ipUsed: ipDecision.used,
    attemptsRemaining: Math.max(0, MODULE_ATTEMPT_LIMIT - visitorDecision.used),
  };
}

/** RU: IP клієнта з proxy-заголовків. EN: Client IP from trusted proxy headers. */
export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 128);
  return "unknown";
}

/**
 * RU: Атомарний rate limit у Neon. Production без DB — 503 (fail-closed).
 * EN: Atomic Neon rate limit; production without DB → 503 (fail-closed).
 */
export async function assertRateLimit(
  request: Request,
  bucket: RateLimitBucket,
): Promise<NextResponse | null> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || !getDb()) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
    }
    return null;
  }

  const { limit, windowMs } = LIMITS[bucket];
  const ip = clientIpFromRequest(request);
  const key = `${bucket}:${ip}`.slice(0, 191);
  const now = Date.now();

  const counter = await bumpWindowCounter(neon(databaseUrl), key, windowMs, now);
  if (!counter) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  if (counter.count > limit) {
    const windowStartMs = counter.windowStartMs;
    const retryAfter = Math.max(1, Math.ceil((windowStartMs + windowMs - now) / 1000));
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfterSec: retryAfter },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  return null;
}
