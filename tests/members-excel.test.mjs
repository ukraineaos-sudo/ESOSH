import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("members excel columns cover registry + legacy fields", () => {
  const src = readFileSync(join(root, "src/lib/admin/members-excel.ts"), "utf8");
  for (const header of [
    "publicId",
    "Реєстраційний номер",
    "Прізвище",
    "Імʼя",
    "Email",
    "Рівень короткий",
    "Організація",
    "Тест кодексу",
    "Резюме",
    "Створено",
  ]) {
    assert.match(src, new RegExp(header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(src, /specialist:\s*"S"/);
  assert.match(src, /accredited:\s*"As"/);
  assert.match(src, /certified:\s*"CE"/);
  assert.match(src, /diplomate:\s*"ChE"/);
});

test("members export route is registry-gated xlsx", () => {
  const src = readFileSync(join(root, "src/app/api/admin/members/export/route.ts"), "utf8");
  assert.match(src, /canManageRegistry/);
  assert.match(src, /exceljs/i);
  assert.match(src, /MEMBER_EXCEL_COLUMNS/);
  assert.match(src, /esosh-members-/);
});
