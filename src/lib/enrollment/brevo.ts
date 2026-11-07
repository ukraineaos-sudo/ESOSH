/** RU: Транзакційні листи через Brevo (Sendinblue). EN: Transactional email via Brevo API. */

import { SITE } from "@/lib/site";
import {
  LEVEL_LABELS_EN,
  LEVEL_LABELS_UK,
  REVIEW_BUSINESS_DAYS,
  STATUS_LABELS_UK,
  type ApplicationStatus,
  type LevelCode,
} from "./levels";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function emailLocale(locale: string | undefined): "uk" | "en" {
  return locale === "uk" ? "uk" : "en";
}

function levelLabelForEmail(level: LevelCode | string, locale: "uk" | "en"): string {
  if (level in LEVEL_LABELS_UK) {
    const code = level as LevelCode;
    return locale === "uk" ? LEVEL_LABELS_UK[code] : LEVEL_LABELS_EN[code];
  }
  return level;
}

export type BrevoAdminApplicationEmailInput = {
  fullName: string;
  email: string;
  organization?: string;
  autoLevelLabelUk: string;
  applicationPublicId: string;
  adminUrl?: string;
};

/** RU: Тема та HTML листа адміну про нову заявку. EN: Admin new-application email subject/body. */
export function buildAdminNewApplicationEmail(input: BrevoAdminApplicationEmailInput): {
  subject: string;
  htmlContent: string;
  textContent: string;
} {
  const name = input.fullName.trim() || "Кандидат";
  const subject = `ESOSH: нова заявка — ${name}`;
  const orgLine = input.organization?.trim()
    ? `Організація: ${input.organization.trim()}`
    : null;
  const link = input.adminUrl?.trim() || null;

  const textParts = [
    "Надійшла нова заявка на вступ до ESOSH.",
    "",
    `ПІБ: ${name}`,
    `Email кандидата: ${input.email}`,
    orgLine,
    `Попередній рівень: ${input.autoLevelLabelUk}`,
    `ID заявки: ${input.applicationPublicId}`,
    link ? `Адмінка: ${link}` : null,
    "",
    "Відкрийте заявку в адмінці для перевірки та подальших дій.",
  ].filter((line): line is string => Boolean(line));

  const htmlParts = [
    "<p>Надійшла нова заявка на вступ до ESOSH.</p>",
    "<ul>",
    `<li><strong>ПІБ:</strong> ${escapeHtml(name)}</li>`,
    `<li><strong>Email кандидата:</strong> ${escapeHtml(input.email)}</li>`,
    orgLine
      ? `<li><strong>Організація:</strong> ${escapeHtml(input.organization!.trim())}</li>`
      : null,
    `<li><strong>Попередній рівень:</strong> ${escapeHtml(input.autoLevelLabelUk)}</li>`,
    `<li><strong>ID заявки:</strong> ${escapeHtml(input.applicationPublicId)}</li>`,
    "</ul>",
    link
      ? `<p><a href="${escapeHtml(link)}">Відкрити заявку в адмінці</a></p>`
      : null,
    "<p>Перевірте матеріали та виконайте подальші дії в адмінці.</p>",
  ].filter((line): line is string => Boolean(line));

  return {
    subject,
    htmlContent: htmlParts.join(""),
    textContent: textParts.join("\n"),
  };
}

type BrevoSendResult = "delivered" | "unavailable" | "failed";

/** RU: Надсилає транзакційний лист через Brevo SMTP API. EN: Send transactional email via Brevo. */
export async function sendBrevoTransactionalEmail(input: {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: { email: string; name?: string };
  tags?: string[];
}): Promise<BrevoSendResult> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "ESOSH";
  if (!apiKey || !senderEmail || !input.toEmail.trim()) return "unavailable";

  const replyToEmail = input.replyTo?.email?.trim();
  const tags = input.tags?.length ? input.tags : ["enrollment", "admin-notify"];

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: input.toEmail.trim(), ...(input.toName ? { name: input.toName } : {}) }],
        subject: input.subject,
        htmlContent: input.htmlContent,
        ...(input.textContent ? { textContent: input.textContent } : {}),
        ...(replyToEmail
          ? {
              replyTo: {
                email: replyToEmail,
                ...(input.replyTo?.name ? { name: input.replyTo.name } : {}),
              },
            }
          : {}),
        tags,
      }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    return response.ok ? "delivered" : "failed";
  } catch {
    return "failed";
  }
}

/** RU: Лист адміну про нову заявку. EN: Notify admin about a new application. */
export async function deliverBrevoAdminNewApplication(
  input: BrevoAdminApplicationEmailInput,
): Promise<BrevoSendResult> {
  const toEmail = process.env.ENROLLMENT_ADMIN_EMAIL?.trim();
  if (!toEmail) return "unavailable";
  const email = buildAdminNewApplicationEmail(input);
  return sendBrevoTransactionalEmail({
    toEmail,
    toName: "ESOSH Admin",
    ...email,
    tags: ["enrollment", "admin-notify"],
  });
}

export type BrevoCandidateApplicationEmailInput = {
  fullName: string;
  email: string;
  applicationPublicId: string;
  autoLevel: LevelCode | string;
  autoLevelLabelUk?: string;
  locale: string;
};

/** RU: Підтвердження кандидату після подання заявки. EN: Candidate application-received email. */
export function buildCandidateApplicationReceivedEmail(
  input: BrevoCandidateApplicationEmailInput,
): { subject: string; htmlContent: string; textContent: string } {
  const lang = emailLocale(input.locale);
  const name = input.fullName.trim() || (lang === "uk" ? "Кандидат" : "Candidate");
  const level =
    input.autoLevelLabelUk?.trim() ||
    levelLabelForEmail(input.autoLevel, lang);
  const contacts = `${SITE.email}, ${SITE.phones.map((p) => p.display).join(", ")}`;

  if (lang === "uk") {
    const subject = `ESOSH: заявку отримано — ${input.applicationPublicId}`;
    const textContent = [
      `Вітаємо, ${name}!`,
      "",
      "Дякуємо! Вашу заявку на вступ до ESOSH отримано.",
      `ID заявки: ${input.applicationPublicId}`,
      `Попередній професійний рівень: ${level}`,
      "",
      `Розгляд зазвичай триває ${REVIEW_BUSINESS_DAYS} робочих днів. Остаточний рівень підтвердить адміністратор після перевірки документів.`,
      "",
      `Контакти ESOSH: ${contacts}`,
    ].join("\n");
    const htmlContent = [
      `<p>Вітаємо, <strong>${escapeHtml(name)}</strong>!</p>`,
      "<p>Дякуємо! Вашу заявку на вступ до ESOSH отримано.</p>",
      "<ul>",
      `<li><strong>ID заявки:</strong> ${escapeHtml(input.applicationPublicId)}</li>`,
      `<li><strong>Попередній професійний рівень:</strong> ${escapeHtml(level)}</li>`,
      "</ul>",
      `<p>Розгляд зазвичай триває <strong>${escapeHtml(REVIEW_BUSINESS_DAYS)}</strong> робочих днів. Остаточний рівень підтвердить адміністратор після перевірки документів.</p>`,
      `<p>Контакти ESOSH: ${escapeHtml(contacts)}</p>`,
    ].join("");
    return { subject, htmlContent, textContent };
  }

  const subject = `ESOSH: application received — ${input.applicationPublicId}`;
  const textContent = [
    `Hello, ${name}!`,
    "",
    "Thank you! Your ESOSH membership application has been received.",
    `Application ID: ${input.applicationPublicId}`,
    `Preliminary professional level: ${level}`,
    "",
    `Review usually takes ${REVIEW_BUSINESS_DAYS} business days. The final level will be confirmed by an administrator after document review.`,
    "",
    `ESOSH contacts: ${contacts}`,
  ].join("\n");
  const htmlContent = [
    `<p>Hello, <strong>${escapeHtml(name)}</strong>!</p>`,
    "<p>Thank you! Your ESOSH membership application has been received.</p>",
    "<ul>",
    `<li><strong>Application ID:</strong> ${escapeHtml(input.applicationPublicId)}</li>`,
    `<li><strong>Preliminary professional level:</strong> ${escapeHtml(level)}</li>`,
    "</ul>",
    `<p>Review usually takes <strong>${escapeHtml(REVIEW_BUSINESS_DAYS)}</strong> business days. The final level will be confirmed by an administrator after document review.</p>`,
    `<p>ESOSH contacts: ${escapeHtml(contacts)}</p>`,
  ].join("");
  return { subject, htmlContent, textContent };
}

/** RU: Надсилає кандидату підтвердження подання заявки. EN: Send candidate application-received email. */
export async function deliverBrevoCandidateApplicationReceived(
  input: BrevoCandidateApplicationEmailInput,
): Promise<BrevoSendResult> {
  if (!input.email.trim()) return "unavailable";
  const email = buildCandidateApplicationReceivedEmail(input);
  return sendBrevoTransactionalEmail({
    toEmail: input.email,
    toName: input.fullName.trim() || undefined,
    ...email,
    replyTo: { email: SITE.email, name: SITE.name },
    tags: ["enrollment", "candidate-received"],
  });
}

export type BrevoCandidateStatusEmailInput = {
  fullName: string;
  email: string;
  applicationPublicId: string;
  status: string;
  approvedLevel?: LevelCode | null;
  message?: string;
  locale: string;
};

/** RU: Лист кандидату про зміну статусу заявки. EN: Candidate status-change email. */
export function buildCandidateStatusChangedEmail(
  input: BrevoCandidateStatusEmailInput,
): { subject: string; htmlContent: string; textContent: string } {
  const lang = emailLocale(input.locale);
  const name = input.fullName.trim() || (lang === "uk" ? "Кандидат" : "Candidate");
  const statusLabel =
    lang === "uk" && (input.status in STATUS_LABELS_UK)
      ? STATUS_LABELS_UK[input.status as ApplicationStatus]
      : input.status;
  const levelLine = input.approvedLevel
    ? levelLabelForEmail(input.approvedLevel, lang)
    : null;
  const note = input.message?.trim() || null;

  if (lang === "uk") {
    const subject = `ESOSH: оновлення заявки ${input.applicationPublicId}`;
    const textContent = [
      `Вітаємо, ${name}!`,
      "",
      `Статус вашої заявки ${input.applicationPublicId}: ${statusLabel}.`,
      levelLine ? `Затверджений рівень: ${levelLine}` : null,
      note ? `Повідомлення: ${note}` : null,
      "",
      `Контакти ESOSH: ${SITE.email}`,
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");
    const htmlContent = [
      `<p>Вітаємо, <strong>${escapeHtml(name)}</strong>!</p>`,
      `<p>Статус вашої заявки <strong>${escapeHtml(input.applicationPublicId)}</strong>: <strong>${escapeHtml(statusLabel)}</strong>.</p>`,
      levelLine
        ? `<p><strong>Затверджений рівень:</strong> ${escapeHtml(levelLine)}</p>`
        : null,
      note ? `<p>${escapeHtml(note)}</p>` : null,
      `<p>Контакти ESOSH: ${escapeHtml(SITE.email)}</p>`,
    ]
      .filter((line): line is string => Boolean(line))
      .join("");
    return { subject, htmlContent, textContent };
  }

  const subject = `ESOSH: application update ${input.applicationPublicId}`;
  const textContent = [
    `Hello, ${name}!`,
    "",
    `Status of your application ${input.applicationPublicId}: ${statusLabel}.`,
    levelLine ? `Approved level: ${levelLine}` : null,
    note ? `Message: ${note}` : null,
    "",
    `ESOSH contacts: ${SITE.email}`,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
  const htmlContent = [
    `<p>Hello, <strong>${escapeHtml(name)}</strong>!</p>`,
    `<p>Status of your application <strong>${escapeHtml(input.applicationPublicId)}</strong>: <strong>${escapeHtml(statusLabel)}</strong>.</p>`,
    levelLine
      ? `<p><strong>Approved level:</strong> ${escapeHtml(levelLine)}</p>`
      : null,
    note ? `<p>${escapeHtml(note)}</p>` : null,
    `<p>ESOSH contacts: ${escapeHtml(SITE.email)}</p>`,
  ]
    .filter((line): line is string => Boolean(line))
    .join("");
  return { subject, htmlContent, textContent };
}

/** RU: Надсилає кандидату лист про зміну статусу. EN: Send candidate status-change email. */
export async function deliverBrevoCandidateStatusChanged(
  input: BrevoCandidateStatusEmailInput,
): Promise<BrevoSendResult> {
  if (!input.email.trim()) return "unavailable";
  const email = buildCandidateStatusChangedEmail(input);
  return sendBrevoTransactionalEmail({
    toEmail: input.email,
    toName: input.fullName.trim() || undefined,
    ...email,
    replyTo: { email: SITE.email, name: SITE.name },
    tags: ["enrollment", "candidate-status"],
  });
}
