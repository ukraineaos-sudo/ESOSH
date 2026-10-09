/**
 * RU: Безпечний розбір markdown-посилань `[текст](url)` у описах курсів.
 * EN: Safe `[text](url)` parsing for education course descriptions.
 */

export type RichTextPart =
  | { type: "text"; value: string }
  | { type: "link"; href: string; label: string; external: boolean };

const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Allow http(s), mailto, or same-site path starting with a single `/`. */
export function isSafeContentHref(href: string): boolean {
  const t = href.trim();
  if (!t) return false;
  if (t.startsWith("/") && !t.startsWith("//") && !t.includes("\\")) return true;
  if (/^https?:\/\//i.test(t)) return true;
  if (/^mailto:[^\s<>"]+@[^\s<>"]+$/i.test(t)) return true;
  return false;
}

export function isExternalContentHref(href: string): boolean {
  return /^https?:\/\//i.test(href.trim()) || /^mailto:/i.test(href.trim());
}

/** Split plain text into text/link parts; unsafe URLs stay as literal `[label](url)`. */
export function parseRichTextLinks(input: string): RichTextPart[] {
  const source = String(input || "");
  if (!source) return [];
  const parts: RichTextPart[] = [];
  let last = 0;
  LINK_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = LINK_RE.exec(source)) !== null) {
    const [full, labelRaw, hrefRaw] = match;
    const start = match.index;
    if (start > last) {
      pushText(parts, source.slice(last, start));
    }
    const label = String(labelRaw || "").trim();
    const href = String(hrefRaw || "").trim();
    if (label && isSafeContentHref(href)) {
      parts.push({
        type: "link",
        href,
        label,
        external: isExternalContentHref(href),
      });
    } else {
      pushText(parts, full);
    }
    last = start + full.length;
  }
  if (last < source.length) {
    pushText(parts, source.slice(last));
  }
  return parts.length > 0 ? parts : [{ type: "text", value: source }];
}

function pushText(parts: RichTextPart[], value: string) {
  if (!value) return;
  const prev = parts[parts.length - 1];
  if (prev && prev.type === "text") {
    prev.value += value;
    return;
  }
  parts.push({ type: "text", value });
}
