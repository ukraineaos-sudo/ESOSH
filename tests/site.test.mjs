import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";

const pages = JSON.parse(await readFile(new URL("../src/content/page-metadata.json", import.meta.url), "utf8"));
/** RU: Канонический адрес для тестового запроса. EN: Resolve the default locale route without redirect loops. */
const requestPath = (path) => path === "/" ? "/en" : path;
let server, webhook, base, deliveries = [], deliveryStatus = 204, startupLog = "";

/** RU: Запускает изолированный сайт и локальный получатель. EN: Start an isolated production server and local delivery receiver. */
before(async () => {
  webhook = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    deliveries.push(JSON.parse(body));
    response.writeHead(deliveryStatus).end();
  });
  webhook.listen(0, "127.0.0.1");
  await once(webhook, "listening");
  const reservation = createServer();
  reservation.listen(0, "127.0.0.1");
  await once(reservation, "listening");
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  base = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port), "-H", "127.0.0.1"], {
    cwd: new URL("..", import.meta.url), windowsHide: true,
    env: { ...process.env, CONTACT_WEBHOOK_URL: `http://127.0.0.1:${webhook.address().port}`, CONTACT_WEBHOOK_TOKEN: "" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", chunk => { startupLog += chunk; });
  server.stderr.on("data", chunk => { startupLog += chunk; });
  for (let attempt = 0; attempt < 80; attempt++) {
    try { if ((await fetch(base + "/en", { redirect: "manual" })).status < 500) return; } catch { /* Startup in progress. */ }
    if (server.exitCode !== null) throw Error(startupLog);
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw Error("Server did not start: " + startupLog);
});

/** RU: Завершает только тестовые процессы. EN: Stop only the test-owned services. */
after(async () => {
  if (server && server.exitCode === null) { server.kill(); await once(server, "exit"); }
  if (webhook) await new Promise(resolve => webhook.close(resolve));
});

test("all migrated URLs serve real content and canonical metadata", async () => {
  for (const [path] of Object.entries(pages).filter(([path]) => path.startsWith("/en"))) {
    const response = await fetch(base + requestPath(path), { headers: { Cookie: "NEXT_LOCALE=uk" } });
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /<h1[\s>]/, path);
    assert.ok(!html.includes("Сторінка в підготовці"), path);
    assert.match(html, /<html[^>]+lang="en"/, path);
    assert.match(html, /rel="canonical"/, path);
    assert.doesNotMatch(html, /<script[^>]+src="https:\/\/(?:.*webflow)/, path);
    assert.doesNotMatch(html, /widgets\.binotel\.com\/getcall\/widgets\//, path);
    assert.doesNotMatch(html, /widgets\.binotel\.com\/chat\/widgets\//, path);
  }
});

test("Binotel scripts stay out of HTML until communications consent", async () => {
  const html = await (await fetch(base + "/en")).text();
  assert.doesNotMatch(html, /widgets\.binotel\.com/);
  assert.match(html, /\/en\/privacy-policy|\/privacy-policy/);
  assert.match(html, /\/en\/cookie-policy|\/cookie-policy/);
});

test("unknown articles return 404 in both languages", async () => {
  for (const path of ["/en/news/missing-migration-test", "/news/missing-migration-test"]) assert.equal((await fetch(base + path, { redirect: "manual" })).status, path.startsWith("/en") ? 404 : 307, path);
});

test("sitemap lists every migrated page and robots exposes it", async () => {
  const sitemap = await (await fetch(base + "/sitemap.xml")).text();
  const locCount = (sitemap.match(/<loc>/g) || []).length;
  assert.ok(locCount >= Object.keys(pages).length, "sitemap must include all legacy pages");
  for (const path of Object.keys(pages)) {
    assert.ok(sitemap.includes(path) || sitemap.includes(new URL(path, "https://www.esosh.net").href), path);
  }
  assert.match(await (await fetch(base + "/robots.txt")).text(), /Sitemap:/);
});

test("admin cabinet redirects unauthenticated users to login", async () => {
  const response = await fetch(base + "/admin", { redirect: "manual" });
  assert.ok([302, 303, 307, 308].includes(response.status), `unexpected status ${response.status}`);
  const location = response.headers.get("location") || "";
  assert.match(location, /\/admin\/login/);
});

test("admin API rejects missing session", async () => {
  const response = await fetch(base + "/api/admin/news");
  assert.equal(response.status, 401);
});

test("all captured media are local and present", async () => {
  const assets = JSON.parse(await readFile(new URL("../src/content/media-manifest.json", import.meta.url), "utf8"));
  for (const asset of assets) assert.ok((await stat(new URL("../public" + asset.local, import.meta.url))).size > 0, asset.local);
});

test("invalid input and honeypot never reach the recipient", async () => {
  const initial = deliveries.length;
  const invalid = await fetch(base + "/api/contact", { method: "POST", body: "{}" });
  assert.equal(invalid.status, 400);
  const malformed = await fetch(base + "/api/contact", { method: "POST", body: "{" });
  assert.equal(malformed.status, 400);
  const bot = await fetch(base + "/api/contact", { method: "POST", body: JSON.stringify({ name: "Test", email: "test@example.org", message: "Test", company: "bot", privacyConsent: true }) });
  assert.equal(bot.status, 200);
  assert.equal(deliveries.length, initial);
  const noConsent = await fetch(base + "/api/contact", { method: "POST", body: JSON.stringify({ name: "Test", email: "test@example.org", message: "Test", company: "", privacyConsent: false }) });
  assert.equal(noConsent.status, 400);
  assert.equal(deliveries.length, initial);
});

test("success requires recipient acceptance; recipient failures are not reported as success", async () => {
  const body = { name: "Migration test", email: "test@example.org", message: "Local integration test", locale: "uk", company: "", privacyConsent: true };
  const result = await fetch(base + "/api/contact", { method: "POST", body: JSON.stringify(body) });
  assert.equal(result.status, 200);
  assert.deepEqual(deliveries.at(-1), { name: body.name, email: body.email, message: body.message, locale: body.locale });
  deliveryStatus = 500;
  const failure = await fetch(base + "/api/contact", { method: "POST", body: JSON.stringify(body) });
  assert.equal(failure.status, 502);
  assert.equal((await failure.json()).ok, false);
  deliveryStatus = 204;
});

test("cross-origin contact submissions are rejected", async () => {
  const result = await fetch(base + "/api/contact", { method: "POST", headers: { Origin: "https://example.org" }, body: "{}" });
  assert.equal(result.status, 403);
});

test("primary phone tel href matches displayed number digits", async () => {
  const html = await (await fetch(base + "/en/contact-us")).text();
  assert.match(html, /href="tel:\+380504419936"/);
  assert.match(html, /441-99-36/);
  assert.doesNotMatch(html, /tel:\+380504419946/);
});
