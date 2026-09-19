import { SITE } from "@/lib/site";
import { LEVEL_LABELS_UK, REVIEW_BUSINESS_DAYS, type LevelCode } from "./levels";

export type EnrollmentNotifyEvent =
  | {
      type: "application_submitted";
      to: "candidate" | "admin";
      applicationPublicId: string;
      memberPublicId: string;
      email: string;
      fullName: string;
      organization?: string;
      autoLevel: LevelCode;
      autoLevelLabelUk: string;
      locale: "uk" | "en";
      adminUrl?: string;
    }
  | {
      type: "status_changed";
      to: "candidate";
      applicationPublicId: string;
      email: string;
      fullName: string;
      status: string;
      approvedLevel?: LevelCode | null;
      message?: string;
      locale: "uk" | "en";
    };

/** RU: Доставляє подію форми вступу (webhook). EN: Deliver enrollment notification via webhook. */
export async function deliverEnrollmentNotify(
  event: EnrollmentNotifyEvent,
): Promise<"delivered" | "unavailable" | "failed"> {
  const endpoint =
    process.env.ENROLLMENT_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) return "unavailable";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ENROLLMENT_WEBHOOK_TOKEN || process.env.CONTACT_WEBHOOK_TOKEN
          ? {
              Authorization: `Bearer ${
                process.env.ENROLLMENT_WEBHOOK_TOKEN || process.env.CONTACT_WEBHOOK_TOKEN
              }`,
            }
          : {}),
      },
      body: JSON.stringify({
        channel: "enrollment",
        site: SITE.name,
        reviewBusinessDays: REVIEW_BUSINESS_DAYS,
        ...event,
        levelLabels: LEVEL_LABELS_UK,
      }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    return response.ok ? "delivered" : "failed";
  } catch {
    return "failed";
  }
}
