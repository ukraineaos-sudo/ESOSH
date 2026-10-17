import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { canManageRegistry, getAdminSession } from "@/lib/admin/auth";
import type { MemberExcelColumnKey } from "@/lib/admin/members-excel";
import {
  applyMemberImport,
  cellToStringExport,
  draftFromCanonicalRow,
  mapCanonicalHeaderRow,
  planMemberImport,
  type MemberImportDraft,
} from "@/lib/admin/members-import";
import { assertSameOrigin } from "@/lib/http/same-origin";

export const runtime = "nodejs";

/** RU: Імпорт членів з канонічного Excel (dry-run або commit). EN: Canonical members Excel import. */
export async function POST(request: Request) {
  const originBlock = assertSameOrigin(request);
  if (originBlock) return originBlock;

  const user = await getAdminSession();
  if (!user || !canManageRegistry(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_form" }, { status: 400 });
  }

  const mode = String(form.get("mode") || "dry-run");
  const dryRun = mode !== "commit";
  if (mode === "commit" && String(form.get("confirm") || "") !== "IMPORT") {
    return NextResponse.json({ ok: false, error: "confirm_required" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "file_required" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "file_too_large" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) {
    return NextResponse.json({ ok: false, error: "empty_workbook" }, { status: 400 });
  }

  const headerRow = sheet.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell({ includeEmpty: true }, (cell, col) => {
    headers[col - 1] = cellToStringExport(cell.value);
  });
  const colMap = mapCanonicalHeaderRow(headers);
  if (colMap.size < 3) {
    return NextResponse.json({ ok: false, error: "bad_headers" }, { status: 400 });
  }

  const drafts: MemberImportDraft[] = [];
  for (let r = 2; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    const cells: Partial<Record<MemberExcelColumnKey, string>> = {};
    let any = false;
    for (const [colIndex, key] of colMap.entries()) {
      const value = cellToStringExport(row.getCell(colIndex + 1).value);
      if (value) any = true;
      cells[key] = value;
    }
    if (!any) continue;
    drafts.push(draftFromCanonicalRow(r, cells));
  }

  const plan = await planMemberImport(db, drafts);
  const result = await applyMemberImport(db, plan, { dryRun });

  return NextResponse.json({
    ok: true,
    dryRun,
    summary: {
      drafts: drafts.length,
      created: result.created,
      updated: result.updated,
      skipped: result.skipped,
      errors: result.errors.length,
    },
    errors: result.errors.slice(0, 50),
    preview: plan.slice(0, 30).map((item) => ({
      rowNumber: item.draft.rowNumber,
      action: item.action,
      reason: item.reason,
      name: `${item.draft.lastName} ${item.draft.firstName}`.trim(),
      email: item.draft.primaryEmail,
      level: item.draft.level,
      registrationNumber: item.draft.registrationNumber,
      notes: item.draft.notes,
    })),
  });
}
