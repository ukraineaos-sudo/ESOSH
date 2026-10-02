import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Mirrors src/lib/enrollment/files.ts safeServeContentType */
function normalizeClientMime(type) {
  const t = type.trim().toLowerCase();
  if (t === "image/jpg") return "image/jpeg";
  return t;
}

function safeServeContentType(storedContentType, originalName) {
  const SAFE = new Set(["application/pdf", "image/jpeg", "image/png"]);
  const stored = normalizeClientMime(storedContentType || "");
  if (SAFE.has(stored)) return { contentType: stored, allowInline: true };
  const lower = originalName.toLowerCase();
  if (/\.pdf$/i.test(lower)) return { contentType: "application/pdf", allowInline: true };
  if (/\.png$/i.test(lower)) return { contentType: "image/png", allowInline: true };
  if (/\.jpe?g$/i.test(lower)) return { contentType: "image/jpeg", allowInline: true };
  return { contentType: "application/octet-stream", allowInline: false };
}

test("safeServeContentType never returns text/html", () => {
  const evil = safeServeContentType("text/html", "doc.pdf");
  assert.equal(evil.contentType, "application/pdf");
  assert.equal(evil.allowInline, true);
  const unknown = safeServeContentType("text/html", "payload.bin");
  assert.equal(unknown.contentType, "application/octet-stream");
  assert.equal(unknown.allowInline, false);
});

test("enrollment files.ts stores sniff MIME and rejects client MIME mismatch", () => {
  const src = readFileSync(join(root, "src/lib/enrollment/files.ts"), "utf8");
  assert.match(src, /canonicalContentTypeFromSniff/);
  assert.match(src, /if \(client !== expected\) return "bad_type"/);
  assert.match(src, /contentType,\s*\n\s*addRandomSuffix/);
  assert.doesNotMatch(
    src,
    /contentType:\s*file\.type/,
    "must not persist browser-declared file.type",
  );
});

test("admin file proxy sets nosniff and uses safeServeContentType", () => {
  const src = readFileSync(
    join(root, "src/app/api/admin/applications/[id]/files/[fileId]/route.ts"),
    "utf8",
  );
  assert.match(src, /safeServeContentType/);
  assert.match(src, /X-Content-Type-Options["']?\s*:\s*["']nosniff["']/);
  assert.doesNotMatch(src, /"Content-Type":\s*file\.contentType/);
});
