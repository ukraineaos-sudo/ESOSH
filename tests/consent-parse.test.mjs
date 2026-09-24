import { test } from "node:test";
import assert from "node:assert/strict";

// Mirrors src/lib/consent.ts parse/helpers (keep in sync).
const CONSENT_POLICY_VERSION = "1.0-draft";

function parseConsent(raw) {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
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

function isConsentCurrent(state) {
  return Boolean(state && state.version === CONSENT_POLICY_VERSION && state.necessary === true);
}

function hasConsent(state, category) {
  if (!isConsentCurrent(state)) return category === "necessary";
  if (category === "necessary") return true;
  return Boolean(state[category]);
}

test("parseConsent accepts valid consent JSON", () => {
  const state = parseConsent(
    JSON.stringify({
      version: CONSENT_POLICY_VERSION,
      ts: 1,
      necessary: true,
      communications: true,
      analytics: false,
      marketing: false,
    }),
  );
  assert.equal(state?.communications, true);
  assert.equal(isConsentCurrent(state), true);
  assert.equal(hasConsent(state, "communications"), true);
});

test("parseConsent rejects invalid or incomplete payloads", () => {
  assert.equal(parseConsent(null), null);
  assert.equal(parseConsent("{"), null);
  assert.equal(parseConsent(JSON.stringify({ version: "x", ts: 1 })), null);
  assert.equal(parseConsent(JSON.stringify({ version: "x", ts: 1, necessary: false })), null);
});

test("stale policy version denies optional categories", () => {
  const stale = parseConsent(
    JSON.stringify({
      version: "0.9",
      ts: 1,
      necessary: true,
      communications: true,
      analytics: true,
      marketing: true,
    }),
  );
  assert.equal(isConsentCurrent(stale), false);
  assert.equal(hasConsent(stale, "necessary"), true);
  assert.equal(hasConsent(stale, "communications"), false);
});
