/** RU: Нормалізація slug для /education/courses/[slug]. EN: Slug for course detail URLs. */
export function slugifyCourseTitle(input: string): string {
  const base = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[''`ʼ]/g, "")
    .replace(/[^a-z0-9а-яёіїєґәғқңөұүһ]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
  if (!base) return "course";
  // Prefer latin-ish for URLs: transliterate common uk chars if result is mostly cyrillic
  const mapped = base
    .replace(/а/g, "a")
    .replace(/б/g, "b")
    .replace(/в/g, "v")
    .replace(/г/g, "h")
    .replace(/ґ/g, "g")
    .replace(/д/g, "d")
    .replace(/е/g, "e")
    .replace(/є/g, "ye")
    .replace(/ж/g, "zh")
    .replace(/з/g, "z")
    .replace(/и/g, "y")
    .replace(/і/g, "i")
    .replace(/ї/g, "yi")
    .replace(/й/g, "y")
    .replace(/к/g, "k")
    .replace(/л/g, "l")
    .replace(/м/g, "m")
    .replace(/н/g, "n")
    .replace(/о/g, "o")
    .replace(/п/g, "p")
    .replace(/р/g, "r")
    .replace(/с/g, "s")
    .replace(/т/g, "t")
    .replace(/у/g, "u")
    .replace(/ф/g, "f")
    .replace(/х/g, "kh")
    .replace(/ц/g, "ts")
    .replace(/ч/g, "ch")
    .replace(/ш/g, "sh")
    .replace(/щ/g, "shch")
    .replace(/ь/g, "")
    .replace(/ю/g, "yu")
    .replace(/я/g, "ya")
    .replace(/ё/g, "yo")
    .replace(/ә/g, "a")
    .replace(/ғ/g, "g")
    .replace(/қ/g, "q")
    .replace(/ң/g, "n")
    .replace(/ө/g, "o")
    .replace(/ұ/g, "u")
    .replace(/ү/g, "u")
    .replace(/һ/g, "h")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
  return mapped || "course";
}

export function normalizeCourseSlug(raw: string, fallbackTitle = ""): string {
  const fromRaw = slugifyCourseTitle(raw.trim());
  if (fromRaw && fromRaw !== "course") return fromRaw;
  return slugifyCourseTitle(fallbackTitle);
}
