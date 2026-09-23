import { test } from "node:test";
import assert from "node:assert/strict";

// Mirrors src/lib/admin/confirm-delete.ts contract (exact Ukrainian «да»).
const ADMIN_DELETE_CONFIRM = "да";
function isAdminDeleteConfirm(value) {
  return typeof value === "string" && value.trim() === ADMIN_DELETE_CONFIRM;
}

test("admin delete confirm accepts exact «да»", () => {
  assert.equal(isAdminDeleteConfirm("да"), true);
  assert.equal(isAdminDeleteConfirm("  да  "), true);
});

test("admin delete confirm rejects lookalikes", () => {
  assert.equal(isAdminDeleteConfirm("Да"), false);
  assert.equal(isAdminDeleteConfirm("yes"), false);
  assert.equal(isAdminDeleteConfirm(""), false);
  assert.equal(isAdminDeleteConfirm(null), false);
  assert.equal(isAdminDeleteConfirm({ confirm: "да" }), false);
});
