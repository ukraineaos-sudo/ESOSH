import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isSafeContentHref,
  parseRichTextLinks,
} from "../src/lib/cms/rich-text-links.ts";

describe("isSafeContentHref", () => {
  it("allows http(s), mailto, and same-site paths", () => {
    assert.equal(isSafeContentHref("https://example.com/a"), true);
    assert.equal(isSafeContentHref("http://example.com"), true);
    assert.equal(isSafeContentHref("/contact-us"), true);
    assert.equal(isSafeContentHref("mailto:a@b.c"), true);
  });

  it("rejects javascript and protocol-relative URLs", () => {
    assert.equal(isSafeContentHref("javascript:alert(1)"), false);
    assert.equal(isSafeContentHref("//evil.example"), false);
    assert.equal(isSafeContentHref("data:text/html,x"), false);
  });
});

describe("parseRichTextLinks", () => {
  it("parses markdown links and keeps surrounding text", () => {
    const parts = parseRichTextLinks(
      "Для занять [замовте навчання](/contact-us). Або [курс](https://ilo.example/x).",
    );
    assert.deepEqual(parts, [
      { type: "text", value: "Для занять " },
      { type: "link", href: "/contact-us", label: "замовте навчання", external: false },
      { type: "text", value: ". Або " },
      { type: "link", href: "https://ilo.example/x", label: "курс", external: true },
      { type: "text", value: "." },
    ]);
  });

  it("leaves unsafe markdown as plain text", () => {
    const parts = parseRichTextLinks("Bad [x](javascript:alert(1)) here");
    assert.deepEqual(parts, [{ type: "text", value: "Bad [x](javascript:alert(1)) here" }]);
  });
});
