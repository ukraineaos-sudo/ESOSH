/**
 * RU: Лёгкая санитизация HTML CMS без jsdom (isomorphic-dompurify тормозит/роняет Next compile+SSR).
 * EN: Lightweight CMS HTML sanitize without jsdom (DOMPurify hangs Next compile/SSR).
 */
const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "a",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "span",
  "div",
  "img",
]);

const VOID_TAGS = new Set(["br", "img"]);

function isSafeUrl(value: string): boolean {
  const v = value.trim().toLowerCase();
  if (!v) return false;
  if (v.startsWith("javascript:") || v.startsWith("data:") || v.startsWith("vbscript:")) return false;
  return /^(https?:|mailto:|tel:|\/|#)/i.test(v);
}

function sanitizeAttrs(tag: string, rawAttrs: string): string {
  const attrs: string[] = [];
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rawAttrs))) {
    const name = m[1].toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? "";
    if (name.startsWith("on")) continue;
    if (name.startsWith("data-")) continue;
    if (tag === "a" && (name === "href" || name === "title" || name === "target" || name === "rel")) {
      if (name === "href" && !isSafeUrl(value)) continue;
      if (name === "target" && value !== "_blank" && value !== "_self") continue;
      attrs.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
      continue;
    }
    if (tag === "img" && (name === "src" || name === "alt" || name === "width" || name === "height" || name === "loading")) {
      if (name === "src" && !isSafeUrl(value)) continue;
      attrs.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
      continue;
    }
    if (name === "class" || name === "title") {
      attrs.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
    }
  }
  if (tag === "a" && attrs.some((a) => a.startsWith("target=")) && !attrs.some((a) => a.startsWith("rel="))) {
    attrs.push('rel="noopener noreferrer"');
  }
  return attrs.length ? ` ${attrs.join(" ")}` : "";
}

/** RU: Санитизация HTML CMS перед публичным рендером. EN: Sanitize CMS HTML before public render. */
export function sanitizeCmsHtml(html: string): string {
  if (typeof html !== "string") return "";
  const input = html.trim();
  if (!input) return "";

  // Drop whole dangerous blocks first.
  let src = input
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  return src.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (full, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    const closing = full.startsWith("</");
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (closing) return VOID_TAGS.has(tag) ? "" : `</${tag}>`;
    const selfClosing = VOID_TAGS.has(tag) || /\/\s*$/.test(rawAttrs);
    const attrs = sanitizeAttrs(tag, rawAttrs);
    if (VOID_TAGS.has(tag) || selfClosing) return `<${tag}${attrs} />`;
    return `<${tag}${attrs}>`;
  });
}
