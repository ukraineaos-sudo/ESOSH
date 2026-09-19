/**
 * Pure JS mirror of classifyEnrollment for node:test (no TS loader).
 * Keep in sync with src/lib/enrollment/classify.ts
 */
function hasRecognized(courses, allowed) {
  return courses.some((c) => allowed.includes(c.courseType));
}
function hasOther(courses) {
  return courses.some((c) => c.courseType === "other");
}
function cpdOk(status) {
  return status === "participating" || status === "ready";
}

export function classifyEnrollment(input) {
  const L2 = ["esosh_21", "iosh_ms", "nebosh_award"];
  const L3 = ["esosh_130", "nebosh_igc"];
  const L4 = ["esosh_15y", "nebosh_diploma", "nvq5"];
  const HIGHER = ["bachelor", "master", "phd", "doctor"];
  const otherClaim = hasOther(input.courses);
  let requiresManualReview = otherClaim;
  const oshPractice = input.oshFunctions || input.oshYears > 0;
  const profileHigher = input.profileEducation && HIGHER.includes(input.educationLevel);
  const testOk = input.testScorePercent >= 100;
  const sizeGt20 = input.companySize === "21_50" || input.companySize === "gt50";
  const sizeGt50 = input.companySize === "gt50";
  const l2Experience = input.oshYears >= 2 && sizeGt20;
  const l2Education = profileHigher;
  const l2Course = hasRecognized(input.courses, L2);
  const l3Course = hasRecognized(input.courses, L3);
  const l4Course = hasRecognized(input.courses, L4);
  const cpd = cpdOk(input.cpdStatus);
  let level = "community";
  if (input.oshYears >= 5 && sizeGt50 && l4Course && cpd) level = "diplomate";
  else if (input.oshYears >= 5 && sizeGt50 && l3Course && cpd) level = "certified";
  else if ((l2Experience || l2Education) && l2Course) level = "accredited";
  else if ((oshPractice || profileHigher) && testOk) level = "specialist";
  if (otherClaim && (level === "community" || level === "specialist")) requiresManualReview = true;
  return { level, requiresManualReview };
}
