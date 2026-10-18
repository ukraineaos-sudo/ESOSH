import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_MEMBER_LEVEL,
  memberFieldsAfterConfirm,
  shouldDemoteMemberAfterApplicationDecision,
} from "../src/lib/enrollment/member-status.ts";

test("reject does not demote when another application stays confirmed", () => {
  assert.equal(
    shouldDemoteMemberAfterApplicationDecision({
      decidedStatus: "rejected",
      otherApplicationStatuses: ["confirmed", "new"],
    }),
    false,
  );
});

test("reject demotes when no confirmed siblings remain", () => {
  assert.equal(
    shouldDemoteMemberAfterApplicationDecision({
      decidedStatus: "rejected",
      otherApplicationStatuses: ["new", "needs_info"],
    }),
    true,
  );
});

test("confirm with empty levels defaults to specialist", () => {
  assert.deepEqual(memberFieldsAfterConfirm("confirmed", null, null), {
    status: "active",
    level: DEFAULT_MEMBER_LEVEL,
  });
});

test("confirmed_no_level also lands as active specialist", () => {
  assert.deepEqual(memberFieldsAfterConfirm("confirmed_no_level", null, null), {
    status: "active",
    level: "specialist",
  });
});

test("admin approvedLevel always wins over autoLevel", () => {
  assert.deepEqual(memberFieldsAfterConfirm("confirmed", "accredited", "specialist"), {
    status: "active",
    level: "accredited",
  });
  assert.deepEqual(memberFieldsAfterConfirm("confirmed", "diplomate", "certified"), {
    status: "active",
    level: "diplomate",
  });
});

test("API route no longer enforces comment_required for level changes", async () => {
  const { readFileSync } = await import("node:fs");
  const { dirname, join } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const src = readFileSync(join(root, "src/app/api/admin/applications/[id]/route.ts"), "utf8");
  assert.equal(src.includes("comment_required"), false);
  assert.equal(src.includes("isLevelChangeCommentRequired"), false);
});
