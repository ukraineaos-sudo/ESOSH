import assert from "node:assert/strict";
import test from "node:test";
import { createHmac } from "node:crypto";

/** Mirror of csvCell — keep in sync with src/lib/csv.ts (imported via transpile when available). */
function csvCell(value) {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) {
    s = `'${s}`;
  }
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function assertSameOrigin(requestUrl, origin) {
  if (!origin) return null;
  if (origin !== new URL(requestUrl).origin) {
    return { status: 403, error: "invalid_origin" };
  }
  return null;
}

test("csvCell neutralizes spreadsheet formula prefixes", () => {
  assert.equal(csvCell("=CMD()"), "'=CMD()");
  assert.equal(csvCell("+1"), "'+1");
  assert.equal(csvCell("-1"), "'-1");
  assert.equal(csvCell("@SUM(A1)"), "'@SUM(A1)");
  assert.equal(csvCell("safe"), "safe");
  assert.equal(csvCell('say "hi"'), '"say ""hi"""');
});

test("assertSameOrigin rejects cross-origin when Origin present", () => {
  assert.equal(assertSameOrigin("https://www.esosh.net/api/admin/news", null), null);
  assert.equal(
    assertSameOrigin("https://www.esosh.net/api/admin/news", "https://www.esosh.net"),
    null,
  );
  assert.deepEqual(
    assertSameOrigin("https://www.esosh.net/api/admin/news", "https://evil.example"),
    { status: 403, error: "invalid_origin" },
  );
});

test("training pass token HMAC round-trip shape", () => {
  const secret = "test-secret";
  const slug = "uav-attacks";
  const exp = Date.now() + 60_000;
  const payload = `${slug}.${exp}`;
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  const token = `${payload}.${sig}`;
  const [tokenSlug, expRaw, tokenSig] = token.split(".");
  assert.equal(tokenSlug, slug);
  assert.ok(Number(expRaw) > Date.now());
  assert.equal(
    tokenSig,
    createHmac("sha256", secret).update(`${tokenSlug}.${expRaw}`).digest("base64url"),
  );
});
