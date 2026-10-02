import type { ApplicationStatus } from "./levels";

const CONFIRMED_APPLICATION_STATUSES = new Set<ApplicationStatus>([
  "confirmed",
  "confirmed_no_level",
]);

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
 * RU: Статус/рівень member після confirm.
 * EN: Member fields after confirm decision.
 */
export function memberFieldsAfterConfirm(status: "confirmed" | "confirmed_no_level", approvedLevel: string | null, autoLevel: string | null) {
  if (status === "confirmed") {
    return {
      status: "active" as const,
      level: approvedLevel || autoLevel,
    };
  }
  return {
    status: "active_no_level" as const,
    level: "community" as const,
  };
}
