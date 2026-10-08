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

describe("certificate API wiring", () => {
  it("exposes POST issue and GET downloadToken paths", () => {
    const route = readFileSync(
      join(root, "src/app/api/trainings/[slug]/certificate/route.ts"),
      "utf8",
    );
    assert.match(route, /export async function POST/);
    assert.match(route, /downloadToken/);
    assert.match(route, /issueOrGetNamedCertificate/);
    assert.match(route, /assertSameOrigin/);
    assert.match(route, /assertRateLimit/);

    const risk = readFileSync(join(root, "src/content/trainings/risk-assessment.ts"), "utf8");
    assert.match(risk, /courseCode:\s*"RA"/);
    assert.match(risk, /30 хвилин/);
    assert.match(risk, /30 minutes/);

    const uav = readFileSync(join(root, "src/content/trainings/uav-attacks.ts"), "utf8");
    assert.match(uav, /courseCode:\s*"UAV"/);
    assert.match(uav, /10 хвилин/);
    assert.match(uav, /10 minutes/);

    const emergency = readFileSync(
      join(root, "src/content/trainings/emergency-actions.ts"),
      "utf8",
    );
    assert.match(emergency, /courseCode:\s*"EA"/);
    assert.match(emergency, /30 хвилин/);
    assert.match(emergency, /30 minutes/);

    const lesson = readFileSync(join(root, "src/components/trainings/TrainingLesson.tsx"), "utf8");
    assert.match(lesson, /certificateGenerating/);
    assert.match(lesson, /downloadToken/);
  });
});
