/** RU: Транзакційні листи через Brevo (Sendinblue). EN: Transactional email via Brevo API. */

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
}): Promise<BrevoSendResult> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "ESOSH";
  if (!apiKey || !senderEmail || !input.toEmail.trim()) return "unavailable";

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
        tags: ["enrollment", "admin-notify"],
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
  });
}
