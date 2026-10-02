import { NextResponse } from "next/server";

/**
 * RU: Same-origin для mutating admin API (при наявності Origin).
 * EN: Reject cross-origin mutating admin requests when Origin is present.
 */
export function assertSameOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  if (origin !== new URL(request.url).origin) {
    return NextResponse.json({ ok: false, error: "invalid_origin" }, { status: 403 });
  }
  return null;
}
