/** RU: Публічна згода на cookies / треті сторони. EN: Public cookie & third-party consent. */

export const CONSENT_COOKIE_NAME = "esosh_consent";
export const CONSENT_STORAGE_KEY = "esosh_consent";
/** Bump when policy/categories change — banner shows again. */
export const CONSENT_POLICY_VERSION = "1.0-draft";
/** Privacy notice version stored with enrollment/contact consents. */
export const PRIVACY_NOTICE_VERSION = "1.0-draft";

export const CONSENT_CATEGORIES = [
  "necessary",
  "communications",
  "analytics",
  "marketing",
] as const;

export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

export type ConsentState = {
  version: string;
  ts: number;
  necessary: true;
  communications: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentChoice = {
  communications?: boolean;
  analytics?: boolean;
  marketing?: boolean;
};

export function defaultNecessaryConsent(): ConsentState {
  return {
    version: CONSENT_POLICY_VERSION,
    ts: Date.now(),
    necessary: true,
    communications: false,
    analytics: false,
    marketing: false,
  };
}

export function acceptAllConsent(): ConsentState {
  return {
    version: CONSENT_POLICY_VERSION,
    ts: Date.now(),
    necessary: true,
    communications: true,
    analytics: true,
    marketing: true,
  };
}

export function buildConsent(choice: ConsentChoice): ConsentState {
  return {
    version: CONSENT_POLICY_VERSION,
    ts: Date.now(),
    necessary: true,
    communications: Boolean(choice.communications),
    analytics: Boolean(choice.analytics),
    marketing: Boolean(choice.marketing),
  };
}

/** RU: Чи валідний збережений запис згоди. EN: Whether stored consent matches current policy. */
export function isConsentCurrent(state: ConsentState | null | undefined): state is ConsentState {
  return Boolean(state && state.version === CONSENT_POLICY_VERSION && state.necessary === true);
}

export function hasConsent(
  state: ConsentState | null | undefined,
  category: ConsentCategory,
): boolean {
  if (!isConsentCurrent(state)) return category === "necessary";
  if (category === "necessary") return true;
  return Boolean(state[category]);
}

export function serializeConsent(state: ConsentState): string {
  return JSON.stringify(state);
}

/** RU: Парсить JSON згоди з cookie/localStorage. EN: Parse consent JSON from storage. */
export function parseConsent(raw: string | null | undefined): ConsentState | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<ConsentState>;
    if (!data || typeof data !== "object") return null;
    if (data.necessary !== true) return null;
    if (typeof data.version !== "string" || typeof data.ts !== "number") return null;
    return {
      version: data.version,
      ts: data.ts,
      necessary: true,
      communications: Boolean(data.communications),
      analytics: Boolean(data.analytics),
      marketing: Boolean(data.marketing),
    };
  } catch {
    return null;
  }
}

/**
 * Cache for useSyncExternalStore getSnapshot — must return a stable
 * reference when storage contents are unchanged (React error #185).
 */
let consentSnapshotRaw: string | null | undefined;
let consentSnapshot: ConsentState | null = null;

function readConsentRawFromDocument(): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (!part.startsWith(`${CONSENT_COOKIE_NAME}=`)) continue;
    return decodeURIComponent(part.slice(CONSENT_COOKIE_NAME.length + 1));
  }
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** RU: Зчитати згоду з cookie/localStorage (стабільний snapshot). EN: Read consent with stable snapshot. */
export function readConsentFromDocument(): ConsentState | null {
  const raw = readConsentRawFromDocument();
  if (raw === consentSnapshotRaw) return consentSnapshot;
  consentSnapshotRaw = raw;
  consentSnapshot = parseConsent(raw);
  return consentSnapshot;
}

/** RU: Зберігає згоду в cookie + localStorage. EN: Persist consent to cookie and localStorage. */
export function persistConsent(state: ConsentState): void {
  if (typeof document === "undefined") return;
  const raw = serializeConsent(state);
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(raw)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, raw);
  } catch {
    /* ignore quota */
  }
  // Keep snapshot cache in sync so getSnapshot stays stable after write.
  consentSnapshotRaw = raw;
  consentSnapshot = state;
}

export const OPEN_CONSENT_EVENT = "esosh:open-consent";

export function openConsentSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
