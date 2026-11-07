import assert from "node:assert/strict";
import test from "node:test";

/** Mirrors builders from src/lib/enrollment/brevo.ts (no TS path-alias import in node:test). */
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

function buildCandidateApplicationReceivedEmail(input) {
  const lang = input.locale === "uk" ? "uk" : "en";
  const name = input.fullName.trim() || (lang === "uk" ? "Кандидат" : "Candidate");
  if (lang === "uk") {
    return {
      subject: `ESOSH: заявку отримано — ${input.applicationPublicId}`,
      htmlContent: [
        `<p>Вітаємо, <strong>${escapeHtml(name)}</strong>!</p>`,
        `<li><strong>ID заявки:</strong> ${escapeHtml(input.applicationPublicId)}</li>`,
        `<li><strong>Попередній професійний рівень:</strong> ${escapeHtml(input.autoLevelLabelUk)}</li>`,
      ].join(""),
      textContent: name,
    };
  }
  return {
    subject: `ESOSH: application received — ${input.applicationPublicId}`,
    htmlContent: `<p>Hello, <strong>${escapeHtml(name)}</strong>!</p>`,
    textContent: name,
  };
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

test("candidate received email uses locale and escapes html", () => {
  const uk = buildCandidateApplicationReceivedEmail({
    fullName: 'Олена <b>Test</b>',
    applicationPublicId: "ESOSH-APP-9",
    autoLevelLabelUk: "Фахівець",
    locale: "uk",
  });
  assert.match(uk.subject, /заявку отримано/);
  assert.match(uk.htmlContent, /ESOSH-APP-9/);
  assert.match(uk.htmlContent, /&lt;b&gt;/);

  const en = buildCandidateApplicationReceivedEmail({
    fullName: "Alex",
    applicationPublicId: "ESOSH-APP-9",
    autoLevelLabelUk: "Specialist",
    locale: "en",
  });
  assert.match(en.subject, /application received/);
});

test("notify.ts prefers Brevo for candidate application_submitted", async () => {
  const { readFileSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const { dirname, join } = await import("node:path");
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const src = readFileSync(join(root, "src/lib/enrollment/notify.ts"), "utf8");
  assert.match(src, /deliverBrevoCandidateApplicationReceived/);
  assert.match(src, /to === "candidate"/);
  assert.match(src, /deliverBrevoCandidateStatusChanged/);
});
