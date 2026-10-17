/**
 * One-shot import of client legacy registry into members.
 * Usage:
 *   node scripts/import-legacy-members.mjs --dry-run
 *   node scripts/import-legacy-members.mjs --commit
 */
import { config } from "dotenv";
config({ path: ".env" });
import { createHash, randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import ExcelJS from "exceljs";
import { neon } from "@neondatabase/serverless";

const FILE =
  process.env.LEGACY_MEMBERS_XLSX ||
  "e:/Programming/Sites/Esosh_docs/Список участників ESOSH 2019-2026 (2).xlsx";
const OUT_DIR = "e:/Programming/Sites/Esosh_docs/backups";
const commit = process.argv.includes("--commit");
const dryRun = !commit;

const LEVEL_FROM_SHORT = { S: "specialist", AS: "accredited", CE: "certified", CHE: "diplomate" };

function mapCyr(raw) {
  const map = { А: "A", а: "a", С: "C", с: "c", Е: "E", е: "e", Н: "H", н: "h" };
  return [...String(raw)].map((ch) => map[ch] || ch).join("");
}

function parseLevel(raw) {
  const t = String(raw || "").trim();
  if (!t) return null;
  return LEVEL_FROM_SHORT[mapCyr(t).toUpperCase()] || null;
}

function parseBool(raw) {
  const t = String(raw || "").trim().toLowerCase();
  if (!t) return null;
  if (["так", "yes", "true", "1"].includes(t)) return true;
  if (["ні", "no", "false", "0"].includes(t)) return false;
  return null;
}

function fixEmail(raw) {
  const e = String(raw || "").trim();
  if (!e) return { email: null, note: "no_email" };
  if (e.includes("@")) return { email: e.toLowerCase(), note: null };
  const m = e.match(
    /^(.+?)(gmail\.com|ukr\.net|i\.ua|gmail\.net|esosh\.net|eosh\.net|dtek\.com|ppc\.net\.ua|snu\.edu\.ua)$/i,
  );
  if (m) return { email: `${m[1]}@${m[2]}`.toLowerCase(), note: `email_fixed:${e}` };
  return { email: null, note: "email_broken_unfixed" };
}

function cellText(cell) {
  if (!cell || cell.value == null || cell.value === "") return "";
  let v = cell.value;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") {
    if (v.text) return String(v.text).trim();
    if (v.result != null) return String(v.result).trim();
    if (v.richText) return v.richText.map((t) => t.text).join("").trim();
    if (v.hyperlink) return String(v.text || v.hyperlink).trim();
  }
  return String(v).trim();
}

function parseDate(raw) {
  if (!raw) return null;
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw;
  const s = String(raw).trim().replace(/^"|"$/g, "");
  const dmy = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dmy) return new Date(Date.UTC(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])));
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function splitFio(raw) {
  let s = String(raw || "").replace(/\u00a0/g, " ").replace(/^\d+\.\s*/, "").trim();
  const isBoard = /рада\s*директор/i.test(s);
  s = s.replace(/\s*Рада Директорів\s*/gi, " ").trim();
  let jobTitle = "";
  const dash = s.split(/\s+[–—-]\s+/);
  if (dash.length > 1) {
    jobTitle = dash.slice(1).join(" - ").trim();
    s = dash[0].trim();
  }
  const parts = s.split(/\s+/).filter(Boolean);
  return {
    lastName: parts[0] || "",
    firstName: parts[1] || "",
    middleName: parts.slice(2).join(" "),
    jobTitle,
    isBoard,
  };
}

function createPublicId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `MBR-${stamp}-${rand}`;
}

function normName(v) {
  return String(v || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

async function backupMembers(sql) {
  mkdirSync(OUT_DIR, { recursive: true });
  const rows = await sql`select * from members order by id`;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const path = join(OUT_DIR, `members-before-legacy-import-${stamp}.json`);
  writeFileSync(path, JSON.stringify(rows, null, 2), "utf8");
  return { path, count: rows.length };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }
  const sql = neon(process.env.DATABASE_URL);
  const backup = await backupMembers(sql);
  console.log(JSON.stringify({ mode: dryRun ? "dry-run" : "commit", file: FILE, backup }, null, 2));

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(FILE);
  const ws = wb.getWorksheet("Реєстрація ЄСОП");
  if (!ws) {
    console.error("Sheet not found");
    process.exit(1);
  }

  const drafts = [];
  for (let r = 3; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const fio = cellText(row.getCell(2));
    const email = cellText(row.getCell(6));
    const reg = cellText(row.getCell(4));
    if (!fio && !email && !reg) continue;
    const dateCell = row.getCell(3).value;
    const fioParts = splitFio(fio);
    const emailParsed = fixEmail(email);
    const level = parseLevel(cellText(row.getCell(7)));
    const notes = [];
    if (fioParts.isBoard) notes.push("board_of_directors");
    if (emailParsed.note) notes.push(emailParsed.note);
    if (cellText(row.getCell(7)) && !level) notes.push(`unknown_level:${cellText(row.getCell(7))}`);

    drafts.push({
      rowNumber: r,
      registrationNumber: reg || null,
      registeredAt: parseDate(dateCell instanceof Date ? dateCell : cellText(row.getCell(3))),
      lastName: fioParts.lastName,
      firstName: fioParts.firstName,
      middleName: fioParts.middleName,
      primaryEmail: emailParsed.email,
      phone: cellText(row.getCell(5)) || null,
      status: level ? "active" : "active_no_level",
      level: level || "community",
      organization: cellText(row.getCell(11)),
      jobTitle: fioParts.jobTitle,
      legacyResume: parseBool(cellText(row.getCell(8))),
      legacyTest: parseBool(cellText(row.getCell(9))),
      legacyCertificate: parseBool(cellText(row.getCell(10))),
      source: "legacy_registry_2019_2026",
      notes,
    });
  }

  const existing = await sql`
    select id, public_id, first_name, last_name, primary_email, registration_number, profile
    from members
  `;
  const byReg = new Map();
  const byNameEmail = new Map();
  for (const row of existing) {
    if (row.registration_number) byReg.set(String(row.registration_number), row);
    if (row.primary_email) {
      byNameEmail.set(
        `${normName(row.last_name)}|${normName(row.first_name)}|${String(row.primary_email).toLowerCase()}`,
        row,
      );
    }
  }

  const plan = [];
  for (const d of drafts) {
    if (!d.lastName && !d.firstName) {
      // Keep the row: client registry sometimes has email/reg without FIO.
      d.lastName = d.primaryEmail ? d.primaryEmail.split("@")[0] : d.registrationNumber || "Без ПІБ";
      d.firstName = "—";
      d.notes.push("missing_name_placeholder");
    }
    let match = d.registrationNumber ? byReg.get(d.registrationNumber) : null;
    let matchBy = match ? "registration_number" : null;
    if (!match && d.primaryEmail) {
      match = byNameEmail.get(`${normName(d.lastName)}|${normName(d.firstName)}|${d.primaryEmail}`);
      if (match) matchBy = "name_email";
    }
    if (match) {
      plan.push({ ...d, action: "update", reason: `match_${matchBy}`, existingId: match.id, existingProfile: match.profile });
    } else {
      plan.push({ ...d, action: "create", reason: "new", existingId: null });
    }
  }

  const summary = {
    totalDrafts: drafts.length,
    create: plan.filter((p) => p.action === "create").length,
    update: plan.filter((p) => p.action === "update").length,
    skip: plan.filter((p) => p.action === "skip").length,
    noEmail: plan.filter((p) => !p.primaryEmail).length,
    board: plan.filter((p) => p.notes.includes("board_of_directors")).length,
    emailFixed: plan.filter((p) => p.notes.some((n) => String(n).startsWith("email_fixed"))).length,
  };

  const reportPath = join(OUT_DIR, `legacy-import-plan-${new Date().toISOString().slice(0, 10)}.json`);
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        summary,
        sample: plan.slice(0, 5),
        skips: plan.filter((p) => p.action === "skip"),
        noEmailRows: plan.filter((p) => !p.primaryEmail).map((p) => ({
          row: p.rowNumber,
          fio: `${p.lastName} ${p.firstName}`,
          reg: p.registrationNumber,
          action: p.action,
        })),
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(JSON.stringify({ summary, reportPath, dryRun }, null, 2));

  if (dryRun) {
    console.log("Dry-run only. Re-run with --commit to write.");
    return;
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors = [];

  for (const item of plan) {
    try {
      if (item.action === "skip") {
        skipped += 1;
        continue;
      }
      const prev =
        item.existingProfile && typeof item.existingProfile === "object" ? item.existingProfile : {};
      const profile = {
        ...prev,
        middleName: item.middleName || prev.middleName || null,
        organization: item.organization || prev.organization || null,
        jobTitle: item.jobTitle || prev.jobTitle || null,
        legacyResume: item.legacyResume,
        legacyTest: item.legacyTest,
        legacyCertificate: item.legacyCertificate,
        source: item.source,
        importNotes: item.notes,
      };
      if (item.action === "create") {
        const publicId = createPublicId();
        await sql`
          insert into members (
            public_id, first_name, last_name, primary_email, phone, status, level,
            registration_number, registered_at, profile, updated_at
          ) values (
            ${publicId},
            ${item.firstName || "—"},
            ${item.lastName || "—"},
            ${item.primaryEmail},
            ${item.phone},
            ${item.status},
            ${item.level},
            ${item.registrationNumber},
            ${item.registeredAt ? item.registeredAt.toISOString() : null},
            ${JSON.stringify(profile)},
            now()
          )
        `;
        created += 1;
      } else {
        await sql`
          update members set
            first_name = ${item.firstName || "—"},
            last_name = ${item.lastName || "—"},
            primary_email = ${item.primaryEmail},
            phone = ${item.phone},
            status = ${item.status},
            level = ${item.level},
            registration_number = ${item.registrationNumber},
            registered_at = ${item.registeredAt ? item.registeredAt.toISOString() : null},
            profile = ${JSON.stringify(profile)}::jsonb,
            updated_at = now()
          where id = ${item.existingId}
        `;
        updated += 1;
      }
    } catch (e) {
      errors.push({ row: item.rowNumber, message: e instanceof Error ? e.message : String(e) });
    }
  }

  const after = await sql`select count(*)::int as n from members`;
  console.log(JSON.stringify({ created, updated, skipped, errors, membersTotal: after[0]?.n }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
