import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("public enrollment does not UPDATE members when primary email already exists", () => {
  const src = readFileSync(join(root, "src/lib/enrollment/members.ts"), "utf8");
  const fnStart = src.indexOf("export async function upsertMemberFromEnrollment");
  assert.ok(fnStart >= 0, "upsertMemberFromEnrollment must exist");
  const fnBody = src.slice(fnStart);
  const byPrimary = fnBody.indexOf("if (byPrimary)");
  assert.ok(byPrimary >= 0, "must branch on existing primary email");
  const afterByPrimary = fnBody.slice(byPrimary);
  const insertIdx = afterByPrimary.indexOf(".insert(members)");
  const branch = insertIdx >= 0 ? afterByPrimary.slice(0, insertIdx) : afterByPrimary;
  assert.doesNotMatch(
    branch,
    /\.update\(\s*members\s*\)/,
    "existing-member branch must not call db.update(members)",
  );
  assert.match(branch, /created:\s*false/);
});

test("enrollment API flags existing member link without profile overwrite", () => {
  const src = readFileSync(join(root, "src/app/api/enrollment/route.ts"), "utf8");
  assert.match(src, /existingMemberLinked/);
  assert.match(src, /memberProfileUnchanged/);
  assert.match(src, /memberProfileUpdated:\s*false/);
});
