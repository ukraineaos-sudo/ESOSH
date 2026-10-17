import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("members import maps legacy short levels including cyrillic lookalikes", () => {
  const src = readFileSync(join(root, "src/lib/admin/members-import.ts"), "utf8");
  assert.match(src, /parseLevelCode/);
  assert.match(src, /draftFromLegacyRow/);
  assert.match(src, /planMemberImport/);
  assert.match(src, /applyMemberImport/);
  assert.match(src, /registration_number/);
  assert.match(src, /name_email/);
});

test("members import API requires confirm for commit", () => {
  const src = readFileSync(join(root, "src/app/api/admin/members/import/route.ts"), "utf8");
  assert.match(src, /canManageRegistry/);
  assert.match(src, /assertSameOrigin/);
  assert.match(src, /confirm_required/);
  assert.match(src, /IMPORT/);
});
