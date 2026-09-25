import { test } from "node:test";
import assert from "node:assert/strict";

/**
 * Mirrors the stable-snapshot contract required by useSyncExternalStore
 * (React error #185 when getSnapshot returns a new object every call).
 */
function createConsentSnapshotReader(readRaw, parse) {
  let consentSnapshotRaw;
  let consentSnapshot = null;
  return function readConsentFromDocument() {
    const raw = readRaw();
    if (raw === consentSnapshotRaw) return consentSnapshot;
    consentSnapshotRaw = raw;
    consentSnapshot = parse(raw);
    return consentSnapshot;
  };
}

test("consent getSnapshot returns the same reference when storage is unchanged", () => {
  const raw = JSON.stringify({
    version: "1.0-draft",
    ts: 1,
    necessary: true,
    communications: false,
    analytics: false,
    marketing: false,
  });
  const parse = (value) => (value ? JSON.parse(value) : null);
  const read = createConsentSnapshotReader(() => raw, parse);

  const a = read();
  const b = read();
  assert.equal(a, b);
  assert.equal(a.version, "1.0-draft");
});

test("consent getSnapshot updates when storage contents change", () => {
  let raw = JSON.stringify({
    version: "1.0-draft",
    ts: 1,
    necessary: true,
    communications: false,
    analytics: false,
    marketing: false,
  });
  const parse = (value) => (value ? JSON.parse(value) : null);
  const read = createConsentSnapshotReader(() => raw, parse);

  const first = read();
  raw = JSON.stringify({
    version: "1.0-draft",
    ts: 2,
    necessary: true,
    communications: true,
    analytics: false,
    marketing: false,
  });
  const second = read();
  assert.notEqual(first, second);
  assert.equal(second.communications, true);
});
