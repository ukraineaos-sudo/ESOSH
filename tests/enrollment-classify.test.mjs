import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyEnrollment } from "./enrollment-classify-lib.mjs";

test("classify: specialist with practice + 100% test", () => {
  assert.equal(
    classifyEnrollment({
      oshFunctions: true,
      oshYears: 1,
      companySize: "le20",
      profileEducation: false,
      educationLevel: "vocational",
      courses: [],
      cpdStatus: "not_ready",
      testScorePercent: 100,
    }).level,
    "specialist",
  );
});

test("classify: accredited with experience + esosh_21", () => {
  assert.equal(
    classifyEnrollment({
      oshFunctions: true,
      oshYears: 2,
      companySize: "21_50",
      profileEducation: false,
      educationLevel: "bachelor",
      courses: [{ courseType: "esosh_21" }],
      cpdStatus: "ready",
      testScorePercent: 80,
    }).level,
    "accredited",
  );
});

test("classify: certified", () => {
  assert.equal(
    classifyEnrollment({
      oshFunctions: true,
      oshYears: 5,
      companySize: "gt50",
      profileEducation: false,
      educationLevel: "master",
      courses: [{ courseType: "esosh_130" }],
      cpdStatus: "participating",
      testScorePercent: 100,
    }).level,
    "certified",
  );
});

test("classify: diplomate", () => {
  assert.equal(
    classifyEnrollment({
      oshFunctions: true,
      oshYears: 6,
      companySize: "gt50",
      profileEducation: true,
      educationLevel: "master",
      courses: [{ courseType: "nebosh_diploma" }],
      cpdStatus: "ready",
      testScorePercent: 100,
    }).level,
    "diplomate",
  );
});

test("classify: other course flags review and does not auto-credit L2", () => {
  const result = classifyEnrollment({
    oshFunctions: true,
    oshYears: 2,
    companySize: "21_50",
    profileEducation: false,
    educationLevel: "bachelor",
    courses: [{ courseType: "other" }],
    cpdStatus: "ready",
    testScorePercent: 100,
  });
  assert.notEqual(result.level, "accredited");
  assert.equal(result.requiresManualReview, true);
  assert.equal(result.criteria.find((c) => c.id === "l2_course")?.state, "missing");
  assert.equal(result.criteria.find((c) => c.id === "l3_course")?.state, "missing");
  assert.equal(result.criteria.find((c) => c.id === "l4_course")?.state, "missing");
  assert.equal(result.criteria.find((c) => c.id === "equivalent_course")?.state, "pending_docs");
});
