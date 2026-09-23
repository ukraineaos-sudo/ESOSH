import { test } from "node:test";
import assert from "node:assert/strict";

// Mirrors src/lib/admin/password-policy.ts (keep in sync).
const ADMIN_NEW_PASSWORD_MIN_LENGTH = 8;
const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{0,63}$/;

function normalizeUsername(raw) {
  return raw.trim().toLowerCase();
}
function isValidUsername(username) {
  return USERNAME_RE.test(username);
}
function isValidNewPassword(password) {
  return typeof password === "string" && password.length >= ADMIN_NEW_PASSWORD_MIN_LENGTH;
}
function isWeakBootstrapPassword(password) {
  return password === "admin" || password.length < ADMIN_NEW_PASSWORD_MIN_LENGTH;
}

test("normalizeUsername trims and lowercases", () => {
  assert.equal(normalizeUsername("  Admin "), "admin");
});

test("isValidUsername accepts admin-like logins", () => {
  assert.equal(isValidUsername("admin"), true);
  assert.equal(isValidUsername("editor_1"), true);
  assert.equal(isValidUsername("a"), true);
});

test("isValidUsername rejects bad forms", () => {
  assert.equal(isValidUsername(""), false);
  assert.equal(isValidUsername("Admin"), false);
  assert.equal(isValidUsername("bad user"), false);
  assert.equal(isValidUsername("-admin"), false);
});

test("new password min length is 8; bootstrap admin is weak", () => {
  assert.equal(isValidNewPassword("short"), false);
  assert.equal(isValidNewPassword("12345678"), true);
  assert.equal(isWeakBootstrapPassword("admin"), true);
  assert.equal(isWeakBootstrapPassword("12345678"), false);
});
