/**
 * Apply flat key→string maps onto messages/en.json structure.
 * Usage: node scripts/apply-locale-flats.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const en = JSON.parse(readFileSync(join(root, "messages/en.json"), "utf8"));

function unflat(flat) {
  const out = structuredClone(en);
  for (const [path, value] of Object.entries(flat)) {
    const parts = path.split(".");
    let cur = out;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]] || typeof cur[parts[i]] !== "object") {
        throw new Error(`Missing path ${path}`);
      }
      cur = cur[parts[i]];
    }
    const leaf = parts[parts.length - 1];
    if (!(leaf in cur)) throw new Error(`Unknown key ${path}`);
    cur[leaf] = value;
  }
  return out;
}

function flatKeys(obj, p = "", a = []) {
  for (const [k, v] of Object.entries(obj)) {
    const n = p ? `${p}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatKeys(v, n, a);
    else a.push(n);
  }
  return a;
}

const enKeys = new Set(flatKeys(en));

for (const locale of ["es", "fr", "az", "kk"]) {
  const flatPath = join(root, `scripts/locale-flats/${locale}.json`);
  if (!existsSync(flatPath)) {
    console.error("Missing", flatPath);
    process.exit(1);
  }
  const flat = JSON.parse(readFileSync(flatPath, "utf8"));
  const keys = Object.keys(flat);
  const missing = [...enKeys].filter((k) => !(k in flat));
  const extra = keys.filter((k) => !enKeys.has(k));
  if (missing.length || extra.length) {
    console.error(locale, "missing", missing.length, missing.slice(0, 10));
    console.error(locale, "extra", extra.length, extra.slice(0, 10));
    process.exit(1);
  }
  writeFileSync(join(root, `messages/${locale}.json`), JSON.stringify(unflat(flat), null, 2) + "\n");
  console.log("wrote messages/" + locale + ".json");
}
