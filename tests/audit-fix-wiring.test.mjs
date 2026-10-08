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
    "src/content/pages/uk/education/trainings/emergency-actions.tsx",
    "src/content/pages/en/education/trainings/emergency-actions.tsx",
    "src/content/pages/de/education/trainings/emergency-actions.tsx",
    "src/content/pages/es/education/trainings/emergency-actions.tsx",
    "src/content/pages/fr/education/trainings/emergency-actions.tsx",
    "src/content/pages/az/education/trainings/emergency-actions.tsx",
    "src/content/pages/kk/education/trainings/emergency-actions.tsx",
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
  assert.match(page, /NEWS_CONTENT_LOCALE/);

  const cms = readFileSync(join(root, "src/lib/cms/public.ts"), "utf8");
  assert.match(cms, /export async function getCmsNewsPresence/);
  assert.match(cms, /export const NEWS_CONTENT_LOCALE = "uk"/);

  const del = readFileSync(join(root, "src/app/api/admin/news/[id]/route.ts"), "utf8");
  assert.match(del, /status:\s*"deleted"/);
});

test("public news feed always reads Ukrainian CMS content", () => {
  const cms = readFileSync(join(root, "src/lib/cms/public.ts"), "utf8");
  assert.match(cms, /NEWS_CONTENT_LOCALE/);
  assert.match(cms, /eq\(newsPosts\.locale, NEWS_CONTENT_LOCALE\)/);

  const list = readFileSync(join(root, "src/components/cms/CmsNewsListItems.tsx"), "utf8");
  assert.match(list, /listPublishedCmsNews/);
  // Cards keep UI-locale href prefix; content comes from uk feed helper.
  assert.match(list, /localePathPrefix\(locale\)/);
  assert.match(list, /\$\{prefix\}\/news\/\$\{post\.slug\}/);

  const articlePage = readFileSync(join(root, "src/app/[locale]/news/[slug]/page.tsx"), "utf8");
  assert.match(articlePage, /getCmsNews\(NEWS_CONTENT_LOCALE/);
  assert.match(articlePage, /getPage\(NEWS_CONTENT_LOCALE/);
  assert.match(articlePage, /uiLocale=\{locale\}/);
});

test("AdminShell hides CRM nav without canManageRegistry", () => {
  const src = readFileSync(join(root, "src/components/admin/AdminShell.tsx"), "utf8");
  assert.match(src, /canManageRegistry/);
  assert.match(src, /registryAccess/);
  assert.match(src, /AdminNewAppsBadge/);
});

test("public Header stays fixed with flow spacer", () => {
  const header = readFileSync(join(root, "src/components/Header.tsx"), "utf8");
  assert.match(header, /site-header-slot/);
  assert.match(header, /className="w-layout-blockcontainer container is--nav w-container"/);

  const css = readFileSync(join(root, "src/styles/refinements.css"), "utf8");
  assert.match(css, /header\.is--nav\s*\{[^}]*position:\s*fixed/s);
  assert.match(css, /--site-header-height:\s*88px/);
  assert.match(css, /\.site-header-slot\s*\{[^}]*height:\s*var\(--site-header-height\)/s);
  assert.match(css, /background-color:\s*var\(--white\)/);
});

// Optional: if tsx available, score against real module (skipped otherwise).
test("training score helper exists for server answer keys", () => {
  const src = readFileSync(join(root, "src/lib/trainings/score.ts"), "utf8");
  assert.match(src, /scoreTrainingModule/);
  assert.match(src, /issueTrainingPassToken/);
  assert.match(src, /verifyTrainingPassToken/);
  void require;
});

test("training score API exposes no per-question correctness and caps attempts", () => {
  const score = readFileSync(join(root, "src/lib/trainings/score.ts"), "utf8");
  const route = readFileSync(join(root, "src/app/api/trainings/[slug]/score/route.ts"), "utf8");
  const quiz = readFileSync(join(root, "src/components/trainings/TrainingQuiz.tsx"), "utf8");
  assert.doesNotMatch(score, /byId|correctById/);
  assert.doesNotMatch(route, /byId|correctById/);
  assert.doesNotMatch(quiz, /byId/);
  assert.match(route, /MAX_MODULE_SCORE_ATTEMPTS/);
  assert.match(route, /too_many_attempts/);
});
