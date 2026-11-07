/** Membership minimum age (ESOSH terms: 18+). */
export const ENROLLMENT_MIN_AGE = 18;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** RU: Парсинг YYYY-MM-DD як локальна дата (без TZ зсуву). EN: Parse YYYY-MM-DD as local calendar date. */
export function parseIsoDateOnly(value: string): Date | null {
  if (!ISO_DATE.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

/** RU: Вік у повних роках на дату `on` (за замовчуванням сьогодні). EN: Full years of age on date. */
export function ageInFullYears(birthDate: Date, on: Date = new Date()): number {
  let age = on.getFullYear() - birthDate.getFullYear();
  const monthDiff = on.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && on.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

/** RU: Дата народження валідна і вік ≥ minAge. EN: Birth date valid and age ≥ minAge. */
export function isBirthDateAtLeastAge(
  value: string,
  minAge: number,
  on: Date = new Date(),
): { ok: true; date: Date } | { ok: false; reason: "invalid" | "future" | "underage" } {
  const date = parseIsoDateOnly(value);
  if (!date) return { ok: false, reason: "invalid" };
  const today = new Date(on.getFullYear(), on.getMonth(), on.getDate());
  if (date > today) return { ok: false, reason: "future" };
  if (ageInFullYears(date, today) < minAge) return { ok: false, reason: "underage" };
  return { ok: true, date };
}

/** RU: Максимальна дата народження для minAge (для input max). EN: Latest allowed birth date for minAge. */
export function maxBirthDateForMinAge(minAge: number, on: Date = new Date()): string {
  const d = new Date(on.getFullYear() - minAge, on.getMonth(), on.getDate());
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
