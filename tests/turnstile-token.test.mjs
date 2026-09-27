import { test } from "node:test";
import assert from "node:assert/strict";

/** Mirrors length gate in src/lib/turnstile.ts (no network). */
function isPlausibleTurnstileToken(token) {
  return typeof token === "string" && token.length >= 10 && token.length <= 2048;
}

test("turnstile token length gate accepts plausible tokens", () => {
  assert.equal(isPlausibleTurnstileToken("x".repeat(10)), true);
  assert.equal(isPlausibleTurnstileToken("short"), false);
  assert.equal(isPlausibleTurnstileToken(""), false);
  assert.equal(isPlausibleTurnstileToken(null), false);
  assert.equal(isPlausibleTurnstileToken("x".repeat(2049)), false);
});
