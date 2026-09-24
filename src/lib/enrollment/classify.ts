import type { LevelCode } from "./levels";
import { LEVEL_LABELS_UK } from "./levels";

export const COURSE_TYPES = [
  "esosh_21",
  "iosh_ms",
  "nebosh_award",
  "esosh_130",
  "nebosh_igc",
  "esosh_15y",
  "nebosh_diploma",
  "nvq5",
  "other",
] as const;

export type CourseType = (typeof COURSE_TYPES)[number];

export const COMPANY_SIZES = ["le20", "21_50", "gt50"] as const;
export type CompanySize = (typeof COMPANY_SIZES)[number];

export const EDUCATION_LEVELS = [
  "vocational",
  "junior_bachelor",
  "bachelor",
  "master",
  "phd",
  "doctor",
  "other",
] as const;

export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export const CPD_STATUSES = [
  "participating",
  "ready",
  "want_info",
  "not_ready",
] as const;

export type CpdStatus = (typeof CPD_STATUSES)[number];

export type EnrollmentCourseInput = {
  courseType: CourseType;
  courseName: string;
  provider: string;
  courseYear: number;
  hours?: number | null;
  certificateNo?: string | null;
};

export type ClassifyInput = {
  oshFunctions: boolean;
  oshYears: number;
  companySize: CompanySize;
  profileEducation: boolean;
  educationLevel: EducationLevel;
  courses: EnrollmentCourseInput[];
  cpdStatus: CpdStatus;
  testScorePercent: number;
};

export type CriterionState = "met" | "pending_docs" | "missing";

export type CriterionResult = {
  id: string;
  labelUk: string;
  state: CriterionState;
  detailUk?: string;
};

export type ClassifyResult = {
  level: LevelCode;
  labelUk: string;
  requiresManualReview: boolean;
  matchedRules: string[];
  criteria: CriterionResult[];
  nextLevelHintUk: string | null;
};

const L2_COURSES: CourseType[] = ["esosh_21", "iosh_ms", "nebosh_award"];
const L3_COURSES: CourseType[] = ["esosh_130", "nebosh_igc"];
const L4_COURSES: CourseType[] = ["esosh_15y", "nebosh_diploma", "nvq5"];
const HIGHER_ED: EducationLevel[] = ["bachelor", "master", "phd", "doctor"];

/** RU: Есть ли признанный курс из списка (без «інше»). EN: Has a recognized course type. */
function hasRecognized(courses: EnrollmentCourseInput[], allowed: CourseType[]): boolean {
  return courses.some((c) => allowed.includes(c.courseType));
}

/** RU: Есть ли «інше/еквівалент». EN: Candidate claimed an equivalent course. */
function hasOther(courses: EnrollmentCourseInput[]): boolean {
  return courses.some((c) => c.courseType === "other");
}

/** RU: БПР для рівнів 3–4. EN: CPD participation for levels 3–4. */
function cpdOk(status: CpdStatus): boolean {
  return status === "participating" || status === "ready";
}

/** RU: Попередній рівень за ТЗ (від 4 до 1). EN: Preliminary level per TZ top-down. */
export function classifyEnrollment(input: ClassifyInput): ClassifyResult {
  const rules: string[] = [];
  const criteria: CriterionResult[] = [];
  const otherClaim = hasOther(input.courses);
  let requiresManualReview = otherClaim;

  const oshPractice = input.oshFunctions || input.oshYears > 0;
  const profileHigher = input.profileEducation && HIGHER_ED.includes(input.educationLevel);
  const testOk = input.testScorePercent >= 100;
  const sizeGt20 = input.companySize === "21_50" || input.companySize === "gt50";
  const sizeGt50 = input.companySize === "gt50";
  const l2Experience = input.oshYears >= 2 && sizeGt20;
  const l2Education = profileHigher;
  const l2Course = hasRecognized(input.courses, L2_COURSES);
  const l3Course = hasRecognized(input.courses, L3_COURSES);
  const l4Course = hasRecognized(input.courses, L4_COURSES);
  const cpd = cpdOk(input.cpdStatus);

  criteria.push(
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
  );

  // «Інше/еквівалент» не зараховує автоматично жоден рівень курсу — одна позначка для ручної перевірки сертифіката.
  if (otherClaim) {
    criteria.push({
      id: "equivalent_course",
      labelUk: "Заявлено курс «інше / еквівалент»",
      state: "pending_docs",
      detailUk: "Сертифікат уже може бути в файлах заявки — адмін вирішує, чи зарахувати як еквівалент визнаного курсу.",
    });
  }

  if (otherClaim) {
    rules.push("equivalent_course_needs_review");
  }

  let level: LevelCode = "community";

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

  const nextLevelHintUk =
    level === "diplomate"
      ? null
      : level === "certified"
        ? "Для рівня «Дипломований експерт» потрібна довгострокова програма ESOSH ≥1,5 року, NEBOSH Diploma або NVQ5."
        : level === "accredited"
          ? "Для рівня «Сертифікований експерт» потрібні ≥5 років досвіду в org >50, курс ESOSH ≥130 / NEBOSH IGC та БПР."
          : level === "specialist"
            ? "Для рівня «Акредитований спеціаліст» потрібні досвід ≥2 роки (org >20) або профільний бакалавр+ і базовий курс ESOSH/IOSH/NEBOSH Award."
            : "Для рівня «Фахівець» підтвердіть досвід або профільну освіту та пройдіть тест Кодексу на 100%.";

  return {
    level,
    labelUk: LEVEL_LABELS_UK[level],
    requiresManualReview,
    matchedRules: rules,
    criteria,
    nextLevelHintUk,
  };
}
