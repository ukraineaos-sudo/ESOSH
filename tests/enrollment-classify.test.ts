import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyEnrollment } from "../src/lib/enrollment/classify";
import { scoreCodexQuiz } from "../src/lib/enrollment/quiz";

test("classify: specialist with practice + 100% test", () => {
  const result = classifyEnrollment({
    oshFunctions: true,
    oshYears: 1,
    companySize: "le20",
    profileEducation: false,
    educationLevel: "vocational",
    courses: [],
    cpdStatus: "not_ready",
    testScorePercent: 100,
  });
  assert.equal(result.level, "specialist");
});

test("classify: accredited with experience + esosh_21", () => {
  const result = classifyEnrollment({
    oshFunctions: true,
    oshYears: 2,
    companySize: "21_50",
    profileEducation: false,
    educationLevel: "bachelor",
    courses: [{ courseType: "esosh_21", courseName: "Base", provider: "ESOSH", courseYear: 2024 }],
    cpdStatus: "ready",
    testScorePercent: 80,
  });
  assert.equal(result.level, "accredited");
});

test("classify: certified needs 5y + gt50 + 130h + cpd", () => {
  const result = classifyEnrollment({
    oshFunctions: true,
    oshYears: 5,
    companySize: "gt50",
    profileEducation: false,
    educationLevel: "master",
    courses: [{ courseType: "esosh_130", courseName: "Adv", provider: "ESOSH", courseYear: 2023 }],
    cpdStatus: "participating",
    testScorePercent: 100,
  });
  assert.equal(result.level, "certified");
});

test("classify: diplomate with diploma course", () => {
  const result = classifyEnrollment({
    oshFunctions: true,
    oshYears: 6,
    companySize: "gt50",
    profileEducation: true,
    educationLevel: "master",
    courses: [{ courseType: "nebosh_diploma", courseName: "Dip", provider: "NEBOSH", courseYear: 2022 }],
    cpdStatus: "ready",
    testScorePercent: 100,
  });
  assert.equal(result.level, "diplomate");
});

test("classify: other course does not auto-credit and flags review", () => {
  const result = classifyEnrollment({
    oshFunctions: true,
    oshYears: 2,
    companySize: "21_50",
    profileEducation: false,
    educationLevel: "bachelor",
    courses: [{ courseType: "other", courseName: "Local", provider: "X", courseYear: 2024 }],
    cpdStatus: "ready",
    testScorePercent: 100,
  });
  assert.notEqual(result.level, "accredited");
  assert.equal(result.requiresManualReview, true);
});

test("quiz scoring 100%", () => {
  assert.equal(
    scoreCodexQuiz({ q1: "a", q2: "c", q3: "b", q4: "a", q5: "b", q6: "a", q7: "c", q8: "a", q9: "a", q10: "c" }),
    100,
  );
  assert.equal(scoreCodexQuiz({ q1: "b", q2: "a", q3: "a", q4: "b", q5: "a" }), 0);
});
