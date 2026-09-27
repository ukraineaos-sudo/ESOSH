/** RU: Cloudflare Turnstile siteverify. EN: Cloudflare Turnstile server verification. */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileVerifyResult =
  | { ok: true }
  | { ok: false; error: "captcha_required" | "captcha_invalid" | "captcha_unavailable" };

/**
 * RU: Turnstile лише в production (на localhost віджет дає 110200 без hostname).
 * EN: Turnstile only in production (localhost needs Cloudflare hostname allowlist).
 */
export function isTurnstileActive(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY?.trim() || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
  );
}

/** RU: Чи увімкнена серверна перевірка Turnstile. EN: Whether Turnstile secret is enforced. */
export function isTurnstileEnforced(): boolean {
  return isTurnstileActive() && Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}

/** RU: Публічний site key для віджета (null поза production). EN: Public site key or null off-prod. */
export function getTurnstileSiteKey(): string | null {
  if (!isTurnstileActive()) return null;
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  return key || null;
}

/**
 * RU: Перевірити токен Turnstile на сайті Cloudflare.
 * EN: Verify a Turnstile token with Cloudflare siteverify.
 */
export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteip?: string | null,
): Promise<TurnstileVerifyResult> {
  if (!isTurnstileEnforced()) {
    return { ok: true };
  }
  const secret = process.env.TURNSTILE_SECRET_KEY!.trim();
  if (!token || typeof token !== "string" || token.length < 10 || token.length > 2048) {
    return { ok: false, error: "captcha_required" };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteip) body.set("remoteip", remoteip);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      return { ok: false, error: "captcha_unavailable" };
    }
    const data = (await response.json()) as { success?: boolean };
    if (data.success === true) return { ok: true };
    return { ok: false, error: "captcha_invalid" };
  } catch {
    return { ok: false, error: "captcha_unavailable" };
  }
}
