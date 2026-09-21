import assert from "node:assert/strict";
import test from "node:test";

/** Mirrors escape + link inclusion from src/lib/enrollment/brevo.ts (no TS import in node:test). */
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildAdminNewApplicationEmail(input) {
  const name = input.fullName.trim() || "Кандидат";
  const subject = `ESOSH: нова заявка — ${name}`;
  const htmlContent = [
    `<li><strong>ПІБ:</strong> ${escapeHtml(name)}</li>`,
    input.organization
      ? `<li><strong>Організація:</strong> ${escapeHtml(input.organization.trim())}</li>`
      : "",
    input.adminUrl
      ? `<p><a href="${escapeHtml(input.adminUrl)}">Відкрити заявку в адмінці</a></p>`
      : "",
  ].join("");
  return { subject, htmlContent, textContent: input.email };
}

test("admin Brevo email escapes html and keeps admin link", () => {
  const email = buildAdminNewApplicationEmail({
    fullName: 'Ivan <script>alert("x")</script>',
    email: "candidate@example.com",
    organization: "Acme & Co",
    adminUrl: "https://www.esosh.net/admin/applications/abc",
  });
  assert.match(email.subject, /нова заявка/);
  assert.doesNotMatch(email.htmlContent, /<script>/);
  assert.match(email.htmlContent, /&lt;script&gt;/);
  assert.match(email.htmlContent, /Acme &amp; Co/);
  assert.match(email.htmlContent, /https:\/\/www\.esosh\.net\/admin\/applications\/abc/);
});
