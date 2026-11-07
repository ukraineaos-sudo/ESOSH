import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("training quiz mistake review wiring", () => {
  it("score helper builds a per-question review after scoring", () => {
    const score = readFileSync(join(root, "src/lib/trainings/score.ts"), "utf8");
    assert.match(score, /review:\s*ModuleQuestionReview\[\]/);
    assert.match(score, /review\.push\(/);
    assert.match(score, /isCorrect/);
  });

  it("score API returns review for post-submit feedback", () => {
    const route = readFileSync(join(root, "src/app/api/trainings/[slug]/score/route.ts"), "utf8");
    assert.match(route, /review:\s*result\.review/);
  });

  it("quiz UI marks wrong and correct options after submit", () => {
    const quiz = readFileSync(join(root, "src/components/trainings/TrainingQuiz.tsx"), "utf8");
    assert.match(quiz, /parseReviewPayload/);
    assert.match(quiz, /is-picked-wrong/);
    assert.match(quiz, /is-key/);
    assert.match(quiz, /training-quiz__feedback/);
    assert.match(quiz, /ui\.wrongLabel/);
    assert.match(quiz, /ui\.correctLabel/);
  });
});
