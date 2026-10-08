import type { LocaleCode, LocalizedString, TrainingListItem, TrainingTier } from "./types";
import { emergencyActionsTraining } from "./emergency-actions";
import { riskAssessmentTraining } from "./risk-assessment";
import { uavAttacksTraining } from "./uav-attacks";

/** RU: Підписи секцій лістингу тренінгів. EN: Trainings listing section labels. */
export const trainingsListingCopy = {
  basicTitle: {
    uk: "Базові тренінги",
    en: "Basic trainings",
    de: "Grundlagenschulungen",
    es: "Entrenamientos básicos",
    fr: "Formations de base",
    az: "Əsas təlimlər",
    kk: "Негізгі тренингтер",
  } satisfies Record<LocaleCode, string>,
  professionalTitle: {
    uk: "Професійні тренінги",
    en: "Professional trainings",
    de: "Professionelle Schulungen",
    es: "Entrenamientos profesionales",
    fr: "Formations professionnelles",
    az: "Peşəkar təlimlər",
    kk: "Кәсіби тренингтер",
  } satisfies Record<LocaleCode, string>,
  comingSoon: {
    uk: "Незабаром",
    en: "Coming soon",
    de: "Demnächst",
    es: "Próximamente",
    fr: "Bientôt disponible",
    az: "Tezliklə",
    kk: "Жақында",
  } satisfies Record<LocaleCode, string>,
} as const satisfies Record<string, LocalizedString>;

/** RU: Каталог тренінгів для лістингу. EN: Training catalog for the listing page. */
export const trainingsCatalog: TrainingListItem[] = [
  {
    slug: riskAssessmentTraining.slug,
    href: riskAssessmentTraining.href,
    title: riskAssessmentTraining.title,
    summary: riskAssessmentTraining.summary,
    tier: "basic",
  },
  {
    slug: uavAttacksTraining.slug,
    href: uavAttacksTraining.href,
    title: uavAttacksTraining.title,
    summary: uavAttacksTraining.summary,
    tier: "basic",
  },
  {
    slug: emergencyActionsTraining.slug,
    href: emergencyActionsTraining.href,
    title: emergencyActionsTraining.title,
    summary: emergencyActionsTraining.summary,
    tier: "basic",
  },
];

/** RU: Фільтр каталогу за рівнем. EN: Filter catalog by tier. */
export function trainingsByTier(tier: TrainingTier): TrainingListItem[] {
  return trainingsCatalog.filter((item) => item.tier === tier);
}

export { emergencyActionsTraining } from "./emergency-actions";
export { riskAssessmentTraining } from "./risk-assessment";
export { riskAssessmentIntro } from "./risk-assessment-intro";
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
  TrainingTier,
} from "./types";
export { pickLocalized, pickQuizText, QUIZ_OPTION_IDS } from "./types";
