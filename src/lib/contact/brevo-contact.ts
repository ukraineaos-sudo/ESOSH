import type { ContactPayload } from "@/lib/contact";
import { sendBrevoTransactionalEmail } from "@/lib/enrollment/brevo";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export type BrevoContactEmailInput = {
  name: string;
  email: string;
  message: string;
  locale?: string;
};

/** RU: Тема та тіло листа адміну з контактної форми. EN: Admin contact-form email subject/body. */
export function buildContactEmail(input: BrevoContactEmailInput): {
  subject: string;
  htmlContent: string;
  textContent: string;
} {
  const name = input.name.trim() || "Contact";
  const subject = `ESOSH: повідомлення з сайту — ${name}`;
  const locale = input.locale?.trim() || "—";

  const textContent = [
    "Нове повідомлення з контактної форми ESOSH.",
    "",
    `Ім'я: ${name}`,
    `Email: ${input.email}`,
    `Locale: ${locale}`,
    "",
    "Повідомлення:",
    input.message.trim(),
  ].join("\n");

  const htmlContent = [
    "<p>Нове повідомлення з контактної форми ESOSH.</p>",
    "<ul>",
    `<li><strong>Ім'я:</strong> ${escapeHtml(name)}</li>`,
    `<li><strong>Email:</strong> ${escapeHtml(input.email)}</li>`,
    `<li><strong>Locale:</strong> ${escapeHtml(locale)}</li>`,
    "</ul>",
    `<p><strong>Повідомлення:</strong></p><p>${escapeHtml(input.message.trim()).replaceAll("\n", "<br>")}</p>`,
  ].join("");

  return { subject, htmlContent, textContent };
}

/** RU: Лист адміну з контактної форми через Brevo. EN: Deliver contact form via Brevo. */
export async function deliverBrevoContact(
  payload: ContactPayload,
): Promise<"delivered" | "unavailable" | "failed"> {
  const toEmail =
    process.env.CONTACT_ADMIN_EMAIL?.trim() ||
    process.env.ENROLLMENT_ADMIN_EMAIL?.trim();
  if (!toEmail) return "unavailable";

  const email = buildContactEmail({
    name: payload.name,
    email: payload.email,
    message: payload.message,
    locale: payload.locale,
  });

  return sendBrevoTransactionalEmail({
    toEmail,
    toName: "ESOSH Admin",
    replyTo: { email: payload.email, name: payload.name },
    tags: ["contact", "admin-notify"],
    ...email,
  });
}
