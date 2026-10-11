import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("search indexing host policy", () => {
  it("blocks *.vercel.app in seo-host helper", () => {
    const src = readFileSync(join(root, "src/lib/seo-host.ts"), "utf8");
    assert.match(src, /endsWith\("\.vercel\.app"\)/);
    assert.match(src, /localhost/);
    assert.match(src, /VERCEL_ENV/);
  });

  it("robots.txt disallows all on blocked hosts", () => {
    const src = readFileSync(join(root, "src/app/robots.ts"), "utf8");
    assert.match(src, /shouldBlockSearchIndexing/);
    assert.match(src, /disallow:\s*"\/"/);
  });

  it("middleware sets X-Robots-Tag noindex on blocked hosts", () => {
    const src = readFileSync(join(root, "src/middleware.ts"), "utf8");
    assert.match(src, /shouldBlockSearchIndexing/);
    assert.match(src, /X-Robots-Tag/);
    assert.match(src, /noindex,\s*nofollow/);
  });
});
