import assert from "node:assert/strict";
import test from "node:test";

/** Mirrors buildContactEmail from src/lib/contact/brevo-contact.ts */
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildContactEmail(input) {
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

test("contact Brevo email escapes html and keeps message newlines", () => {
  const email = buildContactEmail({
    name: 'Olha <script>alert("x")</script>',
    email: "visitor@example.com",
    message: "Line 1\nLine 2 & more",
    locale: "uk",
  });
  assert.match(email.subject, /повідомлення з сайту/);
  assert.doesNotMatch(email.htmlContent, /<script>/);
  assert.match(email.htmlContent, /&lt;script&gt;/);
  assert.match(email.htmlContent, /Line 1<br>Line 2 &amp; more/);
  assert.match(email.textContent, /visitor@example\.com/);
  assert.match(email.textContent, /Line 1\nLine 2 & more/);
});
