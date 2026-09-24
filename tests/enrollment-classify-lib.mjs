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

  const criteria = [
    { id: "osh_practice", labelUk: "Практичний досвід функцій з БЗР", state: oshPractice ? "met" : "missing" },
    { id: "profile_higher", labelUk: "Профільна вища освіта", state: profileHigher ? "met" : "missing" },
    { id: "test_100", labelUk: "Тест Кодексу поведінки 100%", state: testOk ? "met" : "missing" },
    {
      id: "l2_exp_or_edu",
      labelUk: "Досвід ≥2 роки в org >20 або профільний бакалавр+",
      state: l2Experience || l2Education ? "met" : "missing",
    },
    {
      id: "l2_course",
      labelUk: "Курс ESOSH ≥21 / IOSH MS / NEBOSH Award",
      state: l2Course ? "met" : "missing",
    },
    {
      id: "l3_exp",
      labelUk: "Досвід ≥5 років у org >50",
      state: input.oshYears >= 5 && sizeGt50 ? "met" : "missing",
    },
    {
      id: "l3_course",
      labelUk: "Курс ESOSH ≥130 / NEBOSH IGC",
      state: l3Course ? "met" : "missing",
    },
    { id: "cpd", labelUk: "Участь або готовність до БПР", state: cpd ? "met" : "missing" },
    {
      id: "l4_course",
      labelUk: "ESOSH ≥1,5 року / NEBOSH Diploma / NVQ5",
      state: l4Course ? "met" : "missing",
    },
  ];

  if (otherClaim) {
    criteria.push({
      id: "equivalent_course",
      labelUk: "Заявлено курс «інше / еквівалент»",
      state: "pending_docs",
      detailUk:
        "Сертифікат уже може бути в файлах заявки — адмін вирішує, чи зарахувати як еквівалент визнаного курсу.",
    });
  }

  const rules = [];
  if (otherClaim) rules.push("equivalent_course_needs_review");

  let level = "community";
  if (input.oshYears >= 5 && sizeGt50 && l4Course && cpd) {
    level = "diplomate";
    rules.push("level4_experience", "level4_org_size", "level4_course", "level4_cpd");
  } else if (input.oshYears >= 5 && sizeGt50 && l3Course && cpd) {
    level = "certified";
    rules.push("level3_experience", "level3_org_size", "level3_course", "level3_cpd");
  } else if ((l2Experience || l2Education) && l2Course) {
    level = "accredited";
    rules.push(l2Experience ? "level2_experience" : "level2_education", "level2_course");
  } else if ((oshPractice || profileHigher) && testOk) {
    level = "specialist";
    rules.push(oshPractice ? "level1_practice" : "level1_education", "level1_test");
  } else {
    rules.push("community_fallback");
  }

  if (otherClaim && (level === "community" || level === "specialist")) {
    requiresManualReview = true;
  }

  return {
    level,
    requiresManualReview,
    matchedRules: rules,
    criteria,
    labelUk: level,
    nextLevelHintUk: null,
  };
}
