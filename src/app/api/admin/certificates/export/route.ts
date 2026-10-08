import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { canManageRegistry, getAdminSession } from "@/lib/admin/auth";
import { formatExcelDateTimeKyiv } from "@/lib/admin/excel-xml";
import { listAdminCertificates } from "@/lib/admin/training-certificates";

/** RU: Справжній .xlsx експорт сертифікатів. EN: Real .xlsx certificates export. */
export async function GET(request: Request) {
  const user = await getAdminSession();
  if (!user || !canManageRegistry(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const url = new URL(request.url);
  const courseCode = url.searchParams.get("courseCode") || undefined;
  const q = url.searchParams.get("q") || undefined;

  const items = await listAdminCertificates({ courseCode, q, limit: 5000 });
  if (!items) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ESOSH";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Сертифікати", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  sheet.columns = [
    { header: "Номер сертифіката", key: "number", width: 28 },
    { header: "ПІБ", key: "name", width: 28 },
    { header: "Код курсу", key: "code", width: 12 },
    { header: "Slug курсу", key: "slug", width: 22 },
    { header: "Назва курсу", key: "title", width: 56 },
    { header: "Бал", key: "score", width: 10 },
    { header: "Макс. бал", key: "total", width: 12 },
    { header: "Результат, %", key: "percent", width: 14 },
    { header: "Дата завершення", key: "completed", width: 16 },
    { header: "Дата видачі", key: "issued", width: 22 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, name: "Calibri", size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9E2F3" },
  };
  headerRow.alignment = { vertical: "middle", wrapText: false, horizontal: "left" };
  headerRow.height = 20;

  for (const row of items) {
    const excelRow = sheet.addRow({
      number: row.certificateNumber,
      name: row.participantName,
      code: row.courseCode,
      slug: row.courseSlug,
      title: row.courseTitleUk,
      score: row.score,
      total: row.scoreTotal,
      percent: row.scorePercent,
      completed: row.completionDate,
      issued: formatExcelDateTimeKyiv(row.issuedAt),
    });
    excelRow.alignment = { vertical: "middle", wrapText: false };
    excelRow.font = { name: "Calibri", size: 11 };
    excelRow.getCell("score").alignment = { horizontal: "right", vertical: "middle" };
    excelRow.getCell("total").alignment = { horizontal: "right", vertical: "middle" };
    excelRow.getCell("percent").alignment = { horizontal: "right", vertical: "middle" };
  }

  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: Math.max(1, items.length + 1), column: 10 },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const stamp = new Date().toISOString().slice(0, 10);
  const codePart = courseCode?.trim().toUpperCase() || "all";

  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="esosh-certificates-${codePart}-${stamp}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
