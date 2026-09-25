/**
 * One-time / idempotent import of legacy news TSX → news_posts.
 *
 * Usage (from repo root, with DATABASE_URL in .env):
 *   npm run db:import-news
 *   npm run db:import-news -- --dry-run
 *   npm run db:import-news -- --upsert
 *
 * Default: insert missing (locale+slug); skip existing.
 * --upsert: refresh title/cover/body/publishedAt; keep status if already draft.
 * --dry-run: parse and print, no DB writes.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const ROOT = process.cwd();
const LOCALES = ["uk", "en"];
const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry-run");
const UPSERT = args.has("--upsert");

function listNewsFiles(locale) {
  const dir = path.join(ROOT, "src", "content", "pages", locale, "news");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".tsx"))
    .map((name) => ({
      locale,
      slug: name.replace(/\.tsx$/, ""),
      filePath: path.join(dir, name),
    }));
}

function decodeJsString(raw) {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}

function collectQuoted(text) {
  const parts = [];
  const re = /\{\s*"((?:\\.|[^"\\])*)"\s*\}/g;
  let m;
  while ((m = re.exec(text))) {
    parts.push(decodeJsString(m[1]));
  }
  return parts.join("");
}

function parseUaDate(text) {
  const m = String(text || "")
    .trim()
    .match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  if (!day || !month || !year) return null;
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function extractTitle(source) {
  const h1 = source.match(/<h1[\s\S]*?>\s*([\s\S]*?)\s*<\/h1>/);
  if (!h1) return "";
  return collectQuoted(h1[1]).trim() || collectQuoted(h1[0]).trim();
}

function extractDate(source) {
  const cut = source.search(/className=\{?"rich-news-text/);
  const head = cut >= 0 ? source.slice(0, cut) : source.slice(0, Math.min(source.length, 4000));
  const grey = head.match(
    /className=\{?"[^"]*(?:regular-s|regular-xs)[^"]*is--grey-20[^"]*"\}?\s*>\s*\{\s*"([^"]+)"\s*\}/,
  );
  if (grey) return parseUaDate(grey[1]);
  const any = head.match(/\{\s*"(\d{1,2}\.\d{1,2}\.\d{4})"\s*\}/);
  return any ? parseUaDate(any[1]) : null;
}

function extractCover(source) {
  const cut = source.search(/className=\{?"rich-news-text/);
  const head = cut >= 0 ? source.slice(0, cut) : source.slice(0, Math.min(source.length, 5000));
  const hero = head.match(
    /className=\{?"[^"]*image[^"]*is--w-100p[^"]*"\}?[^>]*src=\{?"([^"]+)"\}?/,
  );
  if (hero) return hero[1];
  const any = head.match(/src=\{?"(\/images\/[^"]+)"\}?/);
  return any ? any[1] : null;
}

function jsxFragmentToHtml(fragment) {
  let html = fragment;
  html = html.replace(/\{\s*"((?:\\.|[^"\\])*)"\s*\}/g, (_, raw) => {
    const text = decodeJsString(raw);
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  });
  html = html.replace(/\s+(className|loading|width|height|decoding|id)=\{[^}]*\}/g, "");
  html = html.replace(/\s+(className|loading|width|height|decoding|id)="[^"]*"/g, "");
  html = html.replace(/src=\{"([^"]+)"\}/g, 'src="$1"');
  html = html.replace(/href=\{"([^"]+)"\}/g, 'href="$1"');
  html = html.replace(/alt=\{"([^"]*)"\}/g, 'alt="$1"');
  html = html.replace(/<(\w+)([^>]*)\/>/g, "<$1$2 />");
  html = html.replace(/\n\s+/g, "\n").trim();
  return html;
}

function extractBodyHtml(source) {
  const start = source.search(/className=\{?"rich-news-text[^"]*"\}?/);
  if (start < 0) {
    const title = extractTitle(source);
    return title ? `<p>${title}</p>` : "<p></p>";
  }
  const openGt = source.indexOf(">", start);
  if (openGt < 0) return "<p></p>";
  let i = openGt + 1;
  let depth = 1;
  while (i < source.length && depth > 0) {
    const nextOpen = source.indexOf("<div", i);
    const nextClose = source.indexOf("</div>", i);
    if (nextClose < 0) break;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 4;
    } else {
      depth -= 1;
      if (depth === 0) {
        const inner = source.slice(openGt + 1, nextClose);
        return jsxFragmentToHtml(inner) || "<p></p>";
      }
      i = nextClose + 6;
    }
  }
  return "<p></p>";
}

function parseFile(entry) {
  const source = fs.readFileSync(entry.filePath, "utf8");
  const title = extractTitle(source) || entry.slug;
  const publishedAt = extractDate(source);
  const coverUrl = extractCover(source);
  const html = extractBodyHtml(source);
  const body = [{ id: `import_${entry.locale}_${entry.slug}`.slice(0, 40), type: "richText", html }];
  return {
    locale: entry.locale,
    slug: entry.slug,
    title,
    excerpt: "",
    coverUrl,
    body,
    status: "published",
    publishedAt,
  };
}

async function main() {
  const files = LOCALES.flatMap(listNewsFiles);
  console.log(`Found ${files.length} legacy news files.`);
  const parsed = files.map((f) => {
    try {
      return { ok: true, entry: f, post: parseFile(f) };
    } catch (err) {
      return { ok: false, entry: f, error: String(err) };
    }
  });

  const failed = parsed.filter((p) => !p.ok);
  for (const f of failed) {
    console.error(`FAIL parse ${f.entry.locale}/${f.entry.slug}: ${f.error}`);
  }
  const posts = parsed.filter((p) => p.ok).map((p) => p.post);

  function reportLocaleParity(list) {
    const bySlug = new Map();
    for (const p of list) {
      const set = bySlug.get(p.slug) || new Set();
      set.add(p.locale);
      bySlug.set(p.slug, set);
    }
    const enOnly = [];
    const ukOnly = [];
    for (const [slug, locales] of bySlug) {
      if (locales.has("en") && !locales.has("uk")) enOnly.push(slug);
      if (locales.has("uk") && !locales.has("en")) ukOnly.push(slug);
    }
    if (enOnly.length || ukOnly.length) {
      console.log("Locale parity gaps (content, not import failures):");
      if (enOnly.length) console.log(`  EN-only (no UK TSX): ${enOnly.join(", ")}`);
      if (ukOnly.length) console.log(`  UK-only (no EN TSX): ${ukOnly.join(", ")}`);
    } else {
      console.log("Locale parity: every slug has both uk and en files.");
    }
  }

  if (DRY) {
    for (const p of posts) {
      console.log(
        `[dry-run] ${p.locale}/${p.slug} | ${p.title.slice(0, 60)} | cover=${p.coverUrl ? "yes" : "no"} | date=${p.publishedAt ? p.publishedAt.toISOString().slice(0, 10) : "null"} | html=${p.body[0].html.length}c`,
      );
    }
    reportLocaleParity(posts);
    console.log(`Dry-run done: ${posts.length} ok, ${failed.length} failed.`);
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required (set in .env).");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    const existing = await sql`
      select id, status from news_posts
      where locale = ${post.locale} and slug = ${post.slug}
      limit 1
    `;
    const row = existing[0];
    const publishedAt = post.publishedAt ? post.publishedAt.toISOString() : null;

    if (!row) {
      await sql`
        insert into news_posts (locale, slug, title, excerpt, cover_url, body, status, published_at)
        values (
          ${post.locale},
          ${post.slug},
          ${post.title},
          ${post.excerpt},
          ${post.coverUrl},
          ${JSON.stringify(post.body)},
          'published',
          ${publishedAt}
        )
      `;
      inserted += 1;
      console.log(`INSERT ${post.locale}/${post.slug}`);
      continue;
    }

    if (!UPSERT) {
      skipped += 1;
      console.log(`SKIP  ${post.locale}/${post.slug}`);
      continue;
    }

    const keepDraft = row.status === "draft";
    const nextStatus = keepDraft ? "draft" : "published";
    const nextPublished = keepDraft ? null : publishedAt;
    await sql`
      update news_posts set
        title = ${post.title},
        excerpt = ${post.excerpt},
        cover_url = ${post.coverUrl},
        body = ${JSON.stringify(post.body)},
        status = ${nextStatus},
        published_at = ${nextPublished},
        updated_at = now()
      where id = ${row.id}
    `;
    updated += 1;
    console.log(`UPDATE ${post.locale}/${post.slug}${keepDraft ? " (kept draft)" : ""}`);
  }

  reportLocaleParity(posts);
  console.log(`Done. inserted=${inserted} updated=${updated} skipped=${skipped} failed=${failed.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
