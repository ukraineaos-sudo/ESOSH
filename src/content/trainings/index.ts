import type { TrainingListItem } from "./types";
import { riskAssessmentTraining } from "./risk-assessment";
import { uavAttacksTraining } from "./uav-attacks";

/** RU: Каталог тренінгів для лістингу. EN: Training catalog for the listing page. */
export const trainingsCatalog: TrainingListItem[] = [
  {
    slug: riskAssessmentTraining.slug,
    href: riskAssessmentTraining.href,
    title: riskAssessmentTraining.title,
    summary: riskAssessmentTraining.summary,
  },
  {
    slug: uavAttacksTraining.slug,
    href: uavAttacksTraining.href,
    title: uavAttacksTraining.title,
    summary: uavAttacksTraining.summary,
  },
];

export { riskAssessmentTraining } from "./risk-assessment";
export { uavAttacksTraining } from "./uav-attacks";
export type {
  LocaleCode,
  LocalizedString,
  PublicQuizQuestion,
  PublicTrainingDetail,
  PublicTrainingModule,
  QuizOptionId,
  QuizQuestion,
  QuizText,
  TrainingDetail,
  TrainingListItem,
  TrainingModule,
  TrainingQuizUi,
} from "./types";
export { pickLocalized, pickQuizText, QUIZ_OPTION_IDS } from "./types";
