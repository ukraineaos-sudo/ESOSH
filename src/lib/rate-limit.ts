import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { bumpWindowCounter } from "@/lib/rate-limit-counter";
import { consumeModuleAttempt } from "@/lib/trainings/module-attempt-budget";

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
  training_score: { limit: 60, windowMs: 60 * 60 * 1000 },
};

/**
 * RU: Серверний бюджет спроб на (IP, курс, модуль) у Neon; cookie не впливає. Production без DB — 503.
 * EN: Server-side attempt budget per (IP, course, module) in Neon; cookie-independent. No DB in production → 503.
 */
export async function assertModuleScoreBudget(
  request: Request,
  slug: string,
  moduleId: string,
): Promise<NextResponse | null> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || !getDb()) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
    }
    return null;
  }

  let decision;
  try {
    decision = await consumeModuleAttempt(
      neon(databaseUrl),
      clientIpFromRequest(request),
      slug,
      moduleId,
    );
  } catch {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
  if (decision.allowed) return null;
  return NextResponse.json(
    { ok: false, error: "too_many_attempts" },
    { status: 429, headers: { "Retry-After": String(decision.retryAfterSec) } },
  );
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
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  return null;
}
