/**
 * RU: Попереднє визначення країни з profile / телефону / email (поки клієнт не заповнить дані).
 * EN: Provisional country inference from profile / phone / email until client data lands.
 */

export type InferredCountryCode =
  | "UA"
  | "PL"
  | "DE"
  | "GB"
  | "US"
  | "AZ"
  | "KZ"
  | "TR"
  | "RO"
  | "MD"
  | "OTHER"
  | "UNKNOWN";

const PROFILE_ALIASES: Record<string, InferredCountryCode> = {
  ua: "UA",
  ukr: "UA",
  ukraine: "UA",
  україна: "UA",
  украина: "UA",
  pl: "PL",
  poland: "PL",
  польща: "PL",
  польша: "PL",
  de: "DE",
  germany: "DE",
  німеччина: "DE",
  германия: "DE",
  gb: "GB",
  uk: "GB",
  "united kingdom": "GB",
  англія: "GB",
  великобританія: "GB",
  us: "US",
  usa: "US",
  "united states": "US",
  сша: "US",
  az: "AZ",
  azerbaijan: "AZ",
  азербайджан: "AZ",
  kz: "KZ",
  kazakhstan: "KZ",
  казахстан: "KZ",
  tr: "TR",
  turkey: "TR",
  türkiye: "TR",
  турція: "TR",
  ro: "RO",
  romania: "RO",
  румунія: "RO",
  md: "MD",
  moldova: "MD",
  молдова: "MD",
  nigeria: "OTHER",
  нігерія: "OTHER",
};

/** Calling-code prefixes (longest first). +7 left as OTHER (RU/KZ ambiguous). */
const PHONE_PREFIXES: Array<[string, InferredCountryCode]> = [
  ["380", "UA"],
  ["994", "AZ"],
  ["996", "OTHER"],
  ["373", "MD"],
  ["359", "OTHER"],
  ["48", "PL"],
  ["49", "DE"],
  ["44", "GB"],
  ["40", "RO"],
  ["90", "TR"],
  ["1", "US"],
];

const EMAIL_TLD: Array<[RegExp, InferredCountryCode]> = [
  [/\.ua$/i, "UA"],
  [/@ukr\.net$/i, "UA"],
  [/@i\.ua$/i, "UA"],
  [/@meta\.ua$/i, "UA"],
  [/@email\.ua$/i, "UA"],
  [/\.com\.ua$/i, "UA"],
  [/\.pl$/i, "PL"],
  [/\.de$/i, "DE"],
  [/\.co\.uk$/i, "GB"],
  [/\.uk$/i, "GB"],
  [/\.az$/i, "AZ"],
  [/\.kz$/i, "KZ"],
  [/\.ro$/i, "RO"],
  [/\.md$/i, "MD"],
  [/\.tr$/i, "TR"],
];

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** RU: Нормалізація рядка країни з профілю. EN: Normalize free-text country from profile. */
export function normalizeProfileCountry(raw: string | null | undefined): InferredCountryCode | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  if (!key) return null;
  return PROFILE_ALIASES[key] ?? null;
}

/** RU: Країна з телефону (коди / локальні UA-номери). EN: Country from phone digits. */
export function inferCountryFromPhone(phone: string | null | undefined): InferredCountryCode | null {
  if (!phone?.trim()) return null;
  let d = digitsOnly(phone);
  if (!d) return null;

  // Strip leading 00 international prefix
  if (d.startsWith("00")) d = d.slice(2);

  for (const [prefix, code] of PHONE_PREFIXES) {
    if (d.startsWith(prefix) && d.length >= prefix.length + 6) return code;
  }

  // Local UA mobiles: 0XX XXX XX XX (10 digits)
  if (/^0\d{9}$/.test(d)) return "UA";

  // Bare 9-digit mobiles sometimes stored without leading 0 (UA)
  if (/^[5-9]\d{8}$/.test(d)) return "UA";

  return null;
}

/** RU: Країна з домену email (слабкий сигнал). EN: Country from email domain (weak). */
export function inferCountryFromEmail(email: string | null | undefined): InferredCountryCode | null {
  if (!email?.trim()) return null;
  const addr = email.trim().toLowerCase();
  if (!addr.includes("@")) return null;
  // Org mailboxes are not geographic signals
  if (addr.endsWith("@esosh.net") || addr.endsWith("@eosh.net")) return null;

  for (const [re, code] of EMAIL_TLD) {
    if (re.test(addr)) return code;
  }
  return null;
}

/**
 * RU: Країна: profile → phone → email → UNKNOWN.
 * EN: Country: profile → phone → email → UNKNOWN.
 */
export function inferMemberCountry(input: {
  profileCountry?: string | null;
  phone?: string | null;
  email?: string | null;
}): InferredCountryCode {
  return (
    normalizeProfileCountry(input.profileCountry) ??
    inferCountryFromPhone(input.phone) ??
    inferCountryFromEmail(input.email) ??
    "UNKNOWN"
  );
}
