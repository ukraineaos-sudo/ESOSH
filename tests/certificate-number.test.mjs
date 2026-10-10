import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Mirror of formatCertificateNumber contract used by SQL / lib helper.
 */
function formatCertificateNumber(courseCode, year, seq) {
  const code = String(courseCode).trim().toUpperCase();
  if (!code || seq < 1 || seq > 999_999) throw new Error("invalid_certificate_sequence");
  return `ESOSH-${code}-${year}-${String(seq).padStart(6, "0")}`;
}

const NUMBER_RE = /^ESOSH-([A-Z0-9]{1,16})-(\d{4})-(\d{6})$/;

describe("training certificate number format", () => {
  it("formats ESOSH-RA-YEAR-######", () => {
    assert.equal(formatCertificateNumber("RA", 2026, 483), "ESOSH-RA-2026-000483");
    assert.equal(formatCertificateNumber("ra", 2026, 1), "ESOSH-RA-2026-000001");
    assert.match(formatCertificateNumber("CS", 2026, 999999), NUMBER_RE);
  });

  it("rejects invalid sequences", () => {
    assert.throws(() => formatCertificateNumber("RA", 2026, 0));
    assert.throws(() => formatCertificateNumber("", 2026, 1));
  });
});

describe("certificate admin registry wiring", () => {
  it("exposes admin certificates GET/DELETE and score columns", () => {
    const adminRoute = readFileSync(
      join(root, "src/app/api/admin/certificates/route.ts"),
      "utf8",
    );
    assert.match(adminRoute, /export async function GET/);
    assert.match(adminRoute, /export async function DELETE/);
    assert.match(adminRoute, /mode: z\.enum\(\["one", "course", "all"\]\)/);

    const schema = readFileSync(join(root, "src/db/schema.ts"), "utf8");
    assert.match(schema, /scoreTotal/);
    assert.match(schema, /scorePercent/);
    assert.match(schema, /trainingPassRedemptions/);

    const scoreLib = readFileSync(join(root, "src/lib/trainings/score.ts"), "utf8");
    assert.match(scoreLib, /scorePercent/);
    assert.match(scoreLib, /parts\.length !== 6/);
    assert.match(scoreLib, /TRAINING_PASS_SECRET/);
    assert.match(scoreLib, /jti/);

    const progress = readFileSync(join(root, "src/lib/trainings/progress-cookie.ts"), "utf8");
    assert.match(progress, /aggregateProgressScore/);
    assert.match(progress, /writeTrainingProgressModule/);
  });
});

describe("certificate API wiring", () => {
  it("exposes POST issue and GET downloadToken paths", () => {
    const route = readFileSync(
      join(root, "src/app/api/trainings/[slug]/certificate/route.ts"),
      "utf8",
    );
    assert.match(route, /export async function POST/);
    assert.match(route, /downloadToken/);
    assert.match(route, /redeemPassAndIssueCertificate/);
    assert.match(route, /passMeetsThreshold/);
    assert.match(route, /assertSameOrigin/);
    assert.match(route, /assertRateLimit/);

    const risk = readFileSync(join(root, "src/content/trainings/risk-assessment.ts"), "utf8");
    assert.match(risk, /courseCode:\s*"RA"/);
    assert.match(risk, /1 академічна година/);
    assert.match(risk, /1 academic hour/);

    const uav = readFileSync(join(root, "src/content/trainings/uav-attacks.ts"), "utf8");
    assert.match(uav, /courseCode:\s*"UAV"/);
    assert.match(uav, /10 хвилин/);
    assert.match(uav, /10 minutes/);

    const emergency = readFileSync(
      join(root, "src/content/trainings/emergency-actions.ts"),
      "utf8",
    );
    assert.match(emergency, /courseCode:\s*"EA"/);
    assert.match(emergency, /1 академічна година/);
    assert.match(emergency, /1 academic hour/);

    const lesson = readFileSync(join(root, "src/components/trainings/TrainingLesson.tsx"), "utf8");
    assert.match(lesson, /certificateGenerating/);
    assert.match(lesson, /downloadToken/);
  });
});
