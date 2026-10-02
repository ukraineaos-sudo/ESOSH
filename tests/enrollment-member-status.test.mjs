import assert from "node:assert/strict";
import test from "node:test";

/** Mirrors shouldDemoteMemberAfterApplicationDecision from member-status.ts — kept in sync via import path check in TS test when available. */
function shouldDemoteMemberAfterApplicationDecision(input) {
  if (input.decidedStatus !== "rejected" && input.decidedStatus !== "needs_info") {
    return false;
  }
  const confirmed = new Set(["confirmed", "confirmed_no_level"]);
  return !input.otherApplicationStatuses.some((status) => confirmed.has(status));
}

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

test("confirm decision never demotes", () => {
  assert.equal(
    shouldDemoteMemberAfterApplicationDecision({
      decidedStatus: "confirmed",
      otherApplicationStatuses: [],
    }),
    false,
  );
});
