import type { TrainingListItem } from "./types";
import { uavAttacksTraining } from "./uav-attacks";

/** RU: Каталог тренінгів для лістингу. EN: Training catalog for the listing page. */
export const trainingsCatalog: TrainingListItem[] = [
  {
    slug: uavAttacksTraining.slug,
    href: uavAttacksTraining.href,
    title: uavAttacksTraining.title,
    summary: uavAttacksTraining.summary,
  },
];

export { uavAttacksTraining } from "./uav-attacks";
export type {
  LocaleCode,
  LocalizedString,
  QuizOptionId,
  QuizQuestion,
  TrainingDetail,
  TrainingListItem,
  TrainingQuizUi,
} from "./types";
