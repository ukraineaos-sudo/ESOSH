/** RU: Коды уровней ESOSH. EN: ESOSH professional level codes. */
export const LEVEL_CODES = [
  "diplomate",
  "certified",
  "accredited",
  "specialist",
  "community",
] as const;

export type LevelCode = (typeof LEVEL_CODES)[number];

export const LEVEL_LABELS_UK: Record<LevelCode, string> = {
  diplomate: "Дипломований експерт",
  certified: "Сертифікований експерт",
  accredited: "Акредитований спеціаліст",
  specialist: "Фахівець",
  community: "Учасник спільноти без підтвердженого професійного рівня",
};

export const APPLICATION_STATUSES = [
  "new",
  "in_review",
  "needs_info",
  "confirmed",
  "confirmed_no_level",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STATUS_LABELS_UK: Record<ApplicationStatus, string> = {
  new: "Нова",
  in_review: "На перевірці",
  needs_info: "Потрібне уточнення",
  confirmed: "Підтверджено",
  confirmed_no_level: "Підтверджено без рівня",
  rejected: "Відхилено",
};

export const CONSENT_VERSION = "1.0";
export const REVIEW_BUSINESS_DAYS = "5–10";
