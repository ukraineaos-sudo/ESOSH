const UK_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  є: "ye",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  ї: "yi",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
  ю: "yu",
  я: "ya",
  "'": "",
  "’": "",
  "ʼ": "",
};

/** RU: URL-slug из заголовка (uk/en). EN: URL slug from title. */
export function slugifyTitle(title: string): string {
  const lower = title.trim().toLowerCase();
  let out = "";
  for (const ch of lower) {
    if (UK_MAP[ch] !== undefined) out += UK_MAP[ch];
    else if (/[a-z0-9]/.test(ch)) out += ch;
    else if (/[\s._/—–-]+/.test(ch)) out += "-";
    else out += "";
  }
  return out
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}

/** RU: Публичный путь новости. EN: Public news path. */
export function newsPublicPath(locale: string, slug: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, "");
  return locale === "en" ? `/en/news/${clean}` : `/news/${clean}`;
}
