import type { ApplicationStatus, LevelCode } from "./levels";

const CONFIRMED_APPLICATION_STATUSES = new Set<ApplicationStatus>([
  "confirmed",
  "confirmed_no_level",
]);

/** Default professional level when none was chosen (product: no “empty” members). */
export const DEFAULT_MEMBER_LEVEL: LevelCode = "specialist";

/**
 * RU: Чи можна відкатити member у candidate після reject/needs_info по одній заявці.
 * EN: Whether reject/needs_info on one application may demote the member card.
 */
export function shouldDemoteMemberAfterApplicationDecision(input: {
  decidedStatus: ApplicationStatus;
  otherApplicationStatuses: ApplicationStatus[];
}): boolean {
  if (input.decidedStatus !== "rejected" && input.decidedStatus !== "needs_info") {
    return false;
  }
  return !input.otherApplicationStatuses.some((status) =>
    CONFIRMED_APPLICATION_STATUSES.has(status),
  );
}

/**
 * RU: Статус/рівень member після рішення адміна.
 * Рішення адміна (approvedLevel) має повний пріоритет над autoLevel.
 * Порожній рівень → specialist (не community).
 * EN: Member fields after admin decision. Admin approvedLevel always wins over autoLevel.
 */
export function memberFieldsAfterConfirm(
  status: "confirmed" | "confirmed_no_level",
  approvedLevel: string | null,
  autoLevel: string | null,
) {
  // Admin choice first; classifier only fills a gap; never leave empty.
  const resolved =
    (approvedLevel as LevelCode | null) ||
    (autoLevel as LevelCode | null) ||
    DEFAULT_MEMBER_LEVEL;

  const level = resolved === "community" ? DEFAULT_MEMBER_LEVEL : resolved;

  // Product: no “empty level” members — both confirm paths become active + level.
  void status;
  return {
    status: "active" as const,
    level,
  };
}
