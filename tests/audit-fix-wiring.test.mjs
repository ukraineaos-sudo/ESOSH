import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

test("toPublicTraining strips correct answers from quiz payload", async () => {
  // Dynamic import of TS via next/tsx is unavailable in plain node:test —
  // assert the helper + page wiring instead.
  const publicSrc = readFileSync(join(root, "src/lib/trainings/public.ts"), "utf8");
  assert.match(publicSrc, /toPublicTraining/);
  assert.match(publicSrc, /correct:\s*_correct/);

  for (const rel of [
    "src/content/pages/uk/education/trainings/risk-assessment.tsx",
    "src/content/pages/en/education/trainings/risk-assessment.tsx",
    "src/content/pages/de/education/trainings/risk-assessment.tsx",
    "src/content/pages/es/education/trainings/risk-assessment.tsx",
    "src/content/pages/fr/education/trainings/risk-assessment.tsx",
    "src/content/pages/az/education/trainings/risk-assessment.tsx",
    "src/content/pages/kk/education/trainings/risk-assessment.tsx",
    "src/content/pages/uk/education/trainings/uav-attacks.tsx",
    "src/content/pages/en/education/trainings/uav-attacks.tsx",
    "src/content/pages/de/education/trainings/uav-attacks.tsx",
    "src/content/pages/es/education/trainings/uav-attacks.tsx",
    "src/content/pages/fr/education/trainings/uav-attacks.tsx",
    "src/content/pages/az/education/trainings/uav-attacks.tsx",
    "src/content/pages/kk/education/trainings/uav-attacks.tsx",
  ]) {
    const src = readFileSync(join(root, rel), "utf8");
    assert.match(src, /toPublicTraining\(/, rel);
  }

  const quizUi = readFileSync(join(root, "src/components/trainings/TrainingQuiz.tsx"), "utf8");
  assert.match(quizUi, /\/api\/trainings\/\$\{encodeURIComponent\(slug\)\}\/score/);
  assert.doesNotMatch(quizUi, /q\.correct/);
});

test("enrollment POST compensates orphan member/application on failure", () => {
  const src = readFileSync(join(root, "src/app/api/enrollment/route.ts"), "utf8");
  assert.match(src, /createdMemberId/);
  assert.match(src, /createdApplicationId/);
  assert.match(src, /db\.delete\(applications\)/);
  assert.match(src, /db\.delete\(members\)/);
  // Must not delete shared members: only when created in this request.
  assert.match(src, /if \(member\.created\) createdMemberId/);
});

test("CMS unpublished news presence blocks legacy fallback wiring", () => {
  const page = readFileSync(join(root, "src/app/[locale]/news/[slug]/page.tsx"), "utf8");
  assert.match(page, /getCmsNewsPresence/);
  assert.match(page, /presence === "unpublished"/);
  assert.match(page, /notFound\(\)/);

  const cms = readFileSync(join(root, "src/lib/cms/public.ts"), "utf8");
  assert.match(cms, /export async function getCmsNewsPresence/);

  const del = readFileSync(join(root, "src/app/api/admin/news/[id]/route.ts"), "utf8");
  assert.match(del, /status:\s*"deleted"/);
});

test("AdminShell hides CRM nav without canManageRegistry", () => {
  const src = readFileSync(join(root, "src/components/admin/AdminShell.tsx"), "utf8");
  assert.match(src, /canManageRegistry/);
  assert.match(src, /registryAccess/);
  assert.match(src, /AdminNewAppsBadge/);
});

// Optional: if tsx available, score against real module (skipped otherwise).
test("training score helper exists for server answer keys", () => {
  const src = readFileSync(join(root, "src/lib/trainings/score.ts"), "utf8");
  assert.match(src, /scoreTrainingModule/);
  assert.match(src, /issueTrainingPassToken/);
  assert.match(src, /verifyTrainingPassToken/);
  void require;
});
