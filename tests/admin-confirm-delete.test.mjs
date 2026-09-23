import { test } from "node:test";
import assert from "node:assert/strict";

// Mirrors src/lib/admin/confirm-delete.ts contract (exact Ukrainian «так»).
const ADMIN_DELETE_CONFIRM = "так";
function isAdminDeleteConfirm(value) {
  return typeof value === "string" && value.trim() === ADMIN_DELETE_CONFIRM;
}

test("admin delete confirm accepts exact «так»", () => {
  assert.equal(isAdminDeleteConfirm("так"), true);
  assert.equal(isAdminDeleteConfirm("  так  "), true);
});

test("admin delete confirm rejects lookalikes", () => {
  assert.equal(isAdminDeleteConfirm("Так"), false);
  assert.equal(isAdminDeleteConfirm("да"), false);
  assert.equal(isAdminDeleteConfirm("yes"), false);
  assert.equal(isAdminDeleteConfirm(""), false);
  assert.equal(isAdminDeleteConfirm(null), false);
  assert.equal(isAdminDeleteConfirm({ confirm: "так" }), false);
});
