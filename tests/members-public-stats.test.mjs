import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("homepage members count only includes joined statuses", () => {
  const src = readFileSync(join(root, "src/lib/members/public-stats.ts"), "utf8");
  assert.match(src, /JOINED_MEMBER_STATUSES\s*=\s*\[\s*"active"\s*,\s*"active_no_level"\s*\]/);
  assert.match(src, /getJoinedMembersBreakdown/);
  assert.match(src, /inferMemberCountry/);
  assert.equal(src.includes('"candidate"'), false);
});

test("HomeMembersStat is wired on all locale home pages", () => {
  for (const locale of ["uk", "en", "de", "es", "fr", "az", "kk"]) {
    const src = readFileSync(join(root, `src/content/pages/${locale}/home.tsx`), "utf8");
    assert.match(src, /HomeMembersStat/);
    assert.match(src, new RegExp(`locale="${locale}"`));
  }
});

test("HomeMembersStat renders three breakdown columns", () => {
  const src = readFileSync(join(root, "src/components/cms/HomeMembersStat.tsx"), "utf8");
  assert.match(src, /home-members-stat__grid/);
  assert.match(src, /getJoinedMembersBreakdown/);
  assert.match(src, /captionLine2/);
  assert.match(src, /code !== "community"/);
  assert.doesNotMatch(src, /home-members-stat__col-title/);
  assert.doesNotMatch(src, /countriesNote/);
  assert.doesNotMatch(src, /Не визначено/);
});

test("public stats fold UNKNOWN countries into OTHER", () => {
  const src = readFileSync(join(root, "src/lib/members/public-stats.ts"), "utf8");
  assert.match(src, /UNKNOWN.*OTHER|code === "UNKNOWN"/);
  assert.match(src, /LEVEL_CODES\.map/);
});
