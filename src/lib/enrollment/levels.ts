/** RU: Коды уровней ESOSH. EN: ESOSH professional level codes. */
import { PRIVACY_NOTICE_VERSION } from "@/lib/consent";

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

export const MEMBER_STATUSES = [
  "candidate",
  "active",
  "active_no_level",
] as const;

export type MemberStatus = (typeof MEMBER_STATUSES)[number];

export const MEMBER_STATUS_LABELS_UK: Record<MemberStatus, string> = {
  candidate: "Кандидат",
  active: "Активний",
  active_no_level: "Активний без рівня",
};

/** RU: Підпис статусу члена (невідомий код — як є). EN: Member status label fallback. */
export function memberStatusLabelUk(status: string): string {
  if ((MEMBER_STATUSES as readonly string[]).includes(status)) {
    return MEMBER_STATUS_LABELS_UK[status as MemberStatus];
  }
  return status;
}

/** Stored with enrollment applications; aligned with public privacy notice. */
export const CONSENT_VERSION = PRIVACY_NOTICE_VERSION;
export const REVIEW_BUSINESS_DAYS = "5–10";
