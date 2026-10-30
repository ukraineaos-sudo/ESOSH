import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const TRAINING_VISITOR_COOKIE = "esosh_tv";
const VISITOR_TTL_SEC = 30 * 24 * 60 * 60;
const VISITOR_ID_RE = /^[A-Za-z0-9_-]{16,64}$/;

/**
 * RU: Стабільний анонімний visitor id (HttpOnly). Ділить бюджет спроб між людьми за одним NAT.
 * EN: Stable anonymous visitor id (HttpOnly). Splits attempt budgets across people behind one NAT.
 */
export async function ensureTrainingVisitorId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(TRAINING_VISITOR_COOKIE)?.value?.trim() ?? "";
  if (VISITOR_ID_RE.test(existing)) return existing;

  const id = randomBytes(18).toString("base64url");
  jar.set(TRAINING_VISITOR_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: VISITOR_TTL_SEC,
  });
  return id;
}
