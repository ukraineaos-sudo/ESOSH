export type CmsBlock =
  | { id: string; type: "hero"; title: string; accent?: string; lead?: string; ctaLabel?: string; ctaHref?: string }
  | { id: string; type: "richText"; html: string }
  | { id: string; type: "image"; src: string; alt: string; width?: number; height?: number }
  | { id: string; type: "cta"; label: string; href: string }
  | { id: string; type: "cards"; items: { title: string; text: string; href?: string }[] }
  | { id: string; type: "spacer"; size: "s" | "m" | "l" }
  | { id: string; type: "pdfLink"; label: string; href: string };

/** RU: Новый id блока. EN: Create a block id. */
export function newBlockId(): string {
  return `b_${Math.random().toString(36).slice(2, 10)}`;
}

/** RU: Пустой набор блоков. EN: Empty page blocks. */
export function emptyBlocks(): CmsBlock[] {
  return [{ id: newBlockId(), type: "hero", title: "Нова сторінка", lead: "" }];
}
