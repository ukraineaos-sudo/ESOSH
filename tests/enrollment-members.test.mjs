import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("public enrollment links by name+email and does not UPDATE members on match", () => {
  const src = readFileSync(join(root, "src/lib/enrollment/members.ts"), "utf8");
  const fnStart = src.indexOf("export async function upsertMemberFromEnrollment");
  assert.ok(fnStart >= 0, "upsertMemberFromEnrollment must exist");
  const fnBody = src.slice(fnStart);
  assert.match(fnBody, /findMemberByNameAndPrimaryEmail/);
  const byName = fnBody.indexOf("if (byNameEmail)");
  assert.ok(byName >= 0, "must branch on existing name+email match");
  const after = fnBody.slice(byName);
  const insertIdx = after.indexOf(".insert(members)");
  const branch = insertIdx >= 0 ? after.slice(0, insertIdx) : after;
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

test("members schema allows nullable non-unique primary email and registration number", () => {
  const src = readFileSync(join(root, "src/db/schema.ts"), "utf8");
  assert.match(src, /primaryEmail:\s*varchar\("primary_email"/);
  assert.doesNotMatch(src, /members_primary_email_uidx/);
  assert.match(src, /registrationNumber:\s*varchar\("registration_number"/);
  assert.match(src, /members_registration_number_uidx/);
});
