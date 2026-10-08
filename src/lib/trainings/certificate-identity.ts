import { createHash, randomBytes } from "node:crypto";

/** RU: Нормалізація ПІБ для identity / PDF. EN: Normalize participant name. */
export function normalizeParticipantName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

/**
 * RU: Хеш courseSlug + ім’я + jti pass-токена (унікальність спроби).
 * EN: Hash of courseSlug + name + pass jti (per-attempt uniqueness).
 */
export function certificateIdentityHash(
  courseSlug: string,
  participantName: string,
  jti: string,
): string {
  const normalized = normalizeParticipantName(participantName).toLocaleLowerCase("uk-UA");
  const safeJti = jti.trim();
  return createHash("sha256")
    .update(`${courseSlug}\0${normalized}\0${safeJti}`, "utf8")
    .digest("hex");
}

/** RU: Довгоживучий токен завантаження PDF. EN: Long-lived PDF download token. */
export function issueDownloadToken(): string {
  return randomBytes(32).toString("hex");
}

/** RU: Дата завершення DD.MM.YYYY (Europe/Kyiv). EN: Completion date DD.MM.YYYY (Kyiv). */
export function formatCompletionDate(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Kyiv",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  return `${day}.${month}.${year}`;
}

export function stripModuleIndexPrefix(title: string): string {
  return title
    .replace(/^Модуль\s*\d+\.\s*/i, "")
    .replace(/^Module\s*\d+\.\s*/i, "")
    .trim();
}
