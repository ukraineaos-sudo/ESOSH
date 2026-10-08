import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { rateLimitBuckets } from "@/db/schema";

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
 * RU: Перевірка rate limit у Neon. Без DB — пропускаємо (публічний сайт без Neon).
 * EN: Neon-backed rate limit; skip when DB unavailable.
 */
export async function assertRateLimit(
  request: Request,
  bucket: RateLimitBucket,
): Promise<NextResponse | null> {
  const db = getDb();
  if (!db) return null;

  const { limit, windowMs } = LIMITS[bucket];
  const ip = clientIpFromRequest(request);
  const key = `${bucket}:${ip}`.slice(0, 191);
  const now = Date.now();

  const rows = await db
    .select()
    .from(rateLimitBuckets)
    .where(eq(rateLimitBuckets.key, key))
    .limit(1);
  const row = rows[0];
  const windowStartMs = row ? new Date(row.windowStart).getTime() : 0;
  const inWindow = row && now - windowStartMs < windowMs;

  if (!row || !inWindow) {
    await db
      .insert(rateLimitBuckets)
      .values({ key, windowStart: new Date(now), count: 1 })
      .onConflictDoUpdate({
        target: rateLimitBuckets.key,
        set: { windowStart: new Date(now), count: 1 },
      });
    return null;
  }

  if (row.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((windowStartMs + windowMs - now) / 1000));
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  await db
    .update(rateLimitBuckets)
    .set({ count: row.count + 1 })
    .where(eq(rateLimitBuckets.key, key));
  return null;
}
