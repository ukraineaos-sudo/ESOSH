/** RU: Формат обкладинки новини. EN: News cover aspect format. */
export const NEWS_COVER_FORMATS = ["auto", "landscape", "portrait", "square"] as const;

export type NewsCoverFormat = (typeof NEWS_COVER_FORMATS)[number];

export const NEWS_COVER_FORMAT_DEFAULT: NewsCoverFormat = "auto";

export const NEWS_COVER_FORMAT_LABELS_UK: Record<NewsCoverFormat, string> = {
  auto: "Авто (як завантажили)",
  landscape: "Горизонтальна",
  portrait: "Вертикальна",
  square: "Квадратна",
};

/** RU: Нормалізація значення з БД/API. EN: Normalize cover format from DB/API. */
export function parseNewsCoverFormat(value: unknown): NewsCoverFormat {
  if (typeof value === "string" && (NEWS_COVER_FORMATS as readonly string[]).includes(value)) {
    return value as NewsCoverFormat;
  }
  return NEWS_COVER_FORMAT_DEFAULT;
}

/** RU: CSS-клас обкладинки на сторінці новини. EN: Article cover CSS class. */
export function newsCoverArticleClass(format: NewsCoverFormat): string {
  return `cms-news-cover cms-news-cover--${format}`;
}

/** RU: CSS-клас мініатюри в стрічці. EN: List-card cover CSS class. */
export function newsCoverListClass(format: NewsCoverFormat): string {
  return `collection-image cms-news-cover-list cms-news-cover-list--${format}`;
}
