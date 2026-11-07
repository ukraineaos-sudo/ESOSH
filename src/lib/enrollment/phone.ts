import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import type { EnrollmentCountryCode } from "./countries";

const LIB_COUNTRIES = new Set<string>(getCountries());

function asLibCountry(country: EnrollmentCountryCode): CountryCode | undefined {
  if (country === "XK") return undefined; // not in all metadata builds
  return LIB_COUNTRIES.has(country) ? (country as CountryCode) : undefined;
}

/** RU: Префікс виклику країни, напр. +380. EN: Country calling prefix, e.g. +380. */
export function countryDialPrefix(country: EnrollmentCountryCode): string {
  if (country === "XK") return "+383";
  const lib = asLibCountry(country);
  if (!lib) return "+";
  return `+${getCountryCallingCode(lib)}`;
}

/**
 * RU: Підставляє / замінює код країни в полі телефону.
 * EN: Insert or swap country dial code in the phone field.
 */
export function withCountryDialPrefix(
  phone: string,
  nextCountry: EnrollmentCountryCode,
  prevCountry?: EnrollmentCountryCode,
): string {
  const nextPrefix = countryDialPrefix(nextCountry);
  const trimmed = phone.trim();
  const prevPrefix = prevCountry ? countryDialPrefix(prevCountry) : "";

  if (!trimmed || trimmed === "+" || (prevPrefix && trimmed === prevPrefix)) {
    return nextPrefix;
  }
  // Only a short +code typed — replace entirely.
  if (/^\+\d{1,4}$/.test(trimmed)) {
    return nextPrefix;
  }
  if (prevPrefix && trimmed.startsWith(prevPrefix)) {
    return `${nextPrefix}${trimmed.slice(prevPrefix.length)}`;
  }
  return trimmed;
}

/**
 * RU: Міжнародний номер з «+», валідний саме для обраної країни.
 * Національний без коду країни (напр. 095…) — не приймаємо: інакше blur «мовчить».
 * EN: Require explicit + international format matching selected country.
 */
export function isValidEnrollmentPhone(
  phone: string,
  country: EnrollmentCountryCode,
): boolean {
  const trimmed = phone.trim();
  if (!trimmed.startsWith("+")) return false;
  const defaultCountry = asLibCountry(country);
  const parsed = defaultCountry
    ? parsePhoneNumberFromString(trimmed, defaultCountry)
    : parsePhoneNumberFromString(trimmed);
  if (!parsed || !parsed.isValid()) return false;
  if (country === "XK") {
    return parsed.countryCallingCode === "383" || parsed.country === "XK";
  }
  return parsed.country === country;
}

/** RU: Нормалізація в E.164 (+…). EN: Normalize to E.164. */
export function formatEnrollmentPhoneE164(
  phone: string,
  country: EnrollmentCountryCode,
): string | null {
  if (!isValidEnrollmentPhone(phone, country)) return null;
  const parsed = parsePhoneNumberFromString(phone.trim());
  return parsed?.format("E.164") ?? null;
}
