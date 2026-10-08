import {
  emergencyActionsTraining,
  riskAssessmentTraining,
  uavAttacksTraining,
} from "@/content/trainings";
import type { TrainingDetail } from "@/content/trainings/types";

export type TrainingCourseCodeOption = {
  courseCode: string;
  slug: string;
  titleUk: string;
  titleEn: string;
};

const KNOWN: TrainingDetail[] = [
  riskAssessmentTraining,
  uavAttacksTraining,
  emergencyActionsTraining,
];

/** RU: Відомі коди курсів з контенту (заготовка під майбутні тренінги). EN: Known course codes from content. */
export function knownNamedCourseCodes(): TrainingCourseCodeOption[] {
  const out: TrainingCourseCodeOption[] = [];
  for (const training of KNOWN) {
    const code = training.courseCode?.trim().toUpperCase();
    if (!code) continue;
    out.push({
      courseCode: code,
      slug: training.slug,
      titleUk: training.certificateTitles?.uk ?? training.title.uk,
      titleEn: training.certificateTitles?.en ?? training.title.en,
    });
  }
  return out.sort((a, b) => a.courseCode.localeCompare(b.courseCode));
}
