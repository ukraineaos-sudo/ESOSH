import type {
  LocaleCode,
  LocalizedString,
  TrainingDetail,
  TrainingListItem,
  TrainingTier,
} from "./types";
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
  /** Empty professional section CTA; `{email}` → mailto link. */
  professionalContact: {
    uk: "Ласкаво просимо {email}",
    en: "Welcome {email}",
    de: "Willkommen {email}",
    es: "Bienvenidos {email}",
    fr: "Bienvenue {email}",
    az: "Xoş gəlmisiniz {email}",
    kk: "Қош келдіңіз {email}",
  } satisfies Record<LocaleCode, string>,
  professionalContactEmail: "office@esosh.net",
} as const;

function toListItem(training: TrainingDetail, tier: TrainingTier): TrainingListItem | null {
  if (training.published === false) return null;
  return {
    slug: training.slug,
    href: training.href,
    title: training.title,
    summary: training.summary,
    tier,
  };
}

/** RU: Каталог тренінгів для лістингу (лише published). EN: Listing catalog (published only). */
export const trainingsCatalog: TrainingListItem[] = [
  toListItem(riskAssessmentTraining, "basic"),
  toListItem(uavAttacksTraining, "basic"),
  toListItem(emergencyActionsTraining, "basic"),
].filter((item): item is TrainingListItem => item !== null);

/** RU: Фільтр каталогу за рівнем. EN: Filter catalog by tier. */
export function trainingsByTier(tier: TrainingTier): TrainingListItem[] {
  return trainingsCatalog.filter((item) => item.tier === tier);
}

export { emergencyActionsTraining } from "./emergency-actions";
export { riskAssessmentTraining } from "./risk-assessment";
export { emergencyActionsIntro } from "./emergency-actions-intro";
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
