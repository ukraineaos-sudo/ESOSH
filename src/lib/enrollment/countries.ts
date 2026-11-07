import type { AppLocale } from "@/i18n/routing";

/**
 * Countries available in enrollment.
 * Excluded (Ukraine sanctions / aggression-related, product policy):
 * RU, BY, KP, IR.
 * Display name = endonym (native). English kept for search only.
 */
const ENROLLMENT_COUNTRY_ROWS = [
  ["AD", "Andorra", "Andorra"],
  ["AE", "الإمارات العربية المتحدة", "United Arab Emirates"],
  ["AF", "افغانستان", "Afghanistan"],
  ["AG", "Antigua and Barbuda", "Antigua and Barbuda"],
  ["AL", "Shqipëri", "Albania"],
  ["AM", "Հայաստան", "Armenia"],
  ["AO", "Angola", "Angola"],
  ["AR", "Argentina", "Argentina"],
  ["AT", "Österreich", "Austria"],
  ["AU", "Australia", "Australia"],
  ["AZ", "Azərbaycan", "Azerbaijan"],
  ["BA", "Bosna i Hercegovina", "Bosnia and Herzegovina"],
  ["BB", "Barbados", "Barbados"],
  ["BD", "বাংলাদেশ", "Bangladesh"],
  ["BE", "België / Belgique", "Belgium"],
  ["BF", "Burkina Faso", "Burkina Faso"],
  ["BG", "България", "Bulgaria"],
  ["BH", "البحرين", "Bahrain"],
  ["BI", "Burundi", "Burundi"],
  ["BJ", "Bénin", "Benin"],
  ["BN", "Brunei", "Brunei"],
  ["BO", "Bolivia", "Bolivia"],
  ["BR", "Brasil", "Brazil"],
  ["BS", "Bahamas", "Bahamas"],
  ["BT", "འབྲུག", "Bhutan"],
  ["BW", "Botswana", "Botswana"],
  ["BZ", "Belize", "Belize"],
  ["CA", "Canada", "Canada"],
  ["CD", "République démocratique du Congo", "DR Congo"],
  ["CF", "République centrafricaine", "Central African Republic"],
  ["CG", "Congo", "Congo"],
  ["CH", "Schweiz / Suisse", "Switzerland"],
  ["CI", "Côte d’Ivoire", "Côte d’Ivoire"],
  ["CL", "Chile", "Chile"],
  ["CM", "Cameroun", "Cameroon"],
  ["CN", "中国", "China"],
  ["CO", "Colombia", "Colombia"],
  ["CR", "Costa Rica", "Costa Rica"],
  ["CV", "Cabo Verde", "Cabo Verde"],
  ["CY", "Κύπρος", "Cyprus"],
  ["CZ", "Česko", "Czechia"],
  ["DE", "Deutschland", "Germany"],
  ["DJ", "Djibouti", "Djibouti"],
  ["DK", "Danmark", "Denmark"],
  ["DM", "Dominica", "Dominica"],
  ["DO", "República Dominicana", "Dominican Republic"],
  ["DZ", "الجزائر", "Algeria"],
  ["EC", "Ecuador", "Ecuador"],
  ["EE", "Eesti", "Estonia"],
  ["EG", "مصر", "Egypt"],
  ["EH", "الصحراء الغربية", "Western Sahara"],
  ["ER", "ኤርትራ", "Eritrea"],
  ["ES", "España", "Spain"],
  ["ET", "ኢትዮጵያ", "Ethiopia"],
  ["FI", "Suomi", "Finland"],
  ["FJ", "Fiji", "Fiji"],
  ["FM", "Micronesia", "Micronesia"],
  ["FR", "France", "France"],
  ["GA", "Gabon", "Gabon"],
  ["GB", "United Kingdom", "United Kingdom"],
  ["GD", "Grenada", "Grenada"],
  ["GE", "საქართველო", "Georgia"],
  ["GH", "Ghana", "Ghana"],
  ["GM", "Gambia", "Gambia"],
  ["GN", "Guinée", "Guinea"],
  ["GQ", "Guinea Ecuatorial", "Equatorial Guinea"],
  ["GR", "Ελλάδα", "Greece"],
  ["GT", "Guatemala", "Guatemala"],
  ["GW", "Guiné-Bissau", "Guinea-Bissau"],
  ["GY", "Guyana", "Guyana"],
  ["HN", "Honduras", "Honduras"],
  ["HR", "Hrvatska", "Croatia"],
  ["HT", "Haïti", "Haiti"],
  ["HU", "Magyarország", "Hungary"],
  ["ID", "Indonesia", "Indonesia"],
  ["IE", "Éire / Ireland", "Ireland"],
  ["IL", "ישראל", "Israel"],
  ["IN", "भारत", "India"],
  ["IQ", "العراق", "Iraq"],
  ["IS", "Ísland", "Iceland"],
  ["IT", "Italia", "Italy"],
  ["JM", "Jamaica", "Jamaica"],
  ["JO", "الأردن", "Jordan"],
  ["JP", "日本", "Japan"],
  ["KE", "Kenya", "Kenya"],
  ["KG", "Кыргызстан", "Kyrgyzstan"],
  ["KH", "កម្ពុជា", "Cambodia"],
  ["KI", "Kiribati", "Kiribati"],
  ["KM", "Comores", "Comoros"],
  ["KN", "Saint Kitts and Nevis", "Saint Kitts and Nevis"],
  ["KR", "대한민국", "South Korea"],
  ["KW", "الكويت", "Kuwait"],
  ["KZ", "Қазақстан", "Kazakhstan"],
  ["LA", "ລາວ", "Laos"],
  ["LB", "لبنان", "Lebanon"],
  ["LC", "Saint Lucia", "Saint Lucia"],
  ["LI", "Liechtenstein", "Liechtenstein"],
  ["LK", "ශ්‍රී ලංකාව", "Sri Lanka"],
  ["LR", "Liberia", "Liberia"],
  ["LS", "Lesotho", "Lesotho"],
  ["LT", "Lietuva", "Lithuania"],
  ["LU", "Luxembourg", "Luxembourg"],
  ["LV", "Latvija", "Latvia"],
  ["LY", "ليبيا", "Libya"],
  ["MA", "المغرب", "Morocco"],
  ["MC", "Monaco", "Monaco"],
  ["MD", "Moldova", "Moldova"],
  ["ME", "Crna Gora", "Montenegro"],
  ["MG", "Madagasikara", "Madagascar"],
  ["MH", "Marshall Islands", "Marshall Islands"],
  ["MK", "Северна Македонија", "North Macedonia"],
  ["ML", "Mali", "Mali"],
  ["MM", "မြန်မာ", "Myanmar"],
  ["MN", "Монгол Улс", "Mongolia"],
  ["MR", "موريتانيا", "Mauritania"],
  ["MT", "Malta", "Malta"],
  ["MU", "Maurice", "Mauritius"],
  ["MV", "ދިވެހިރާއްޖެ", "Maldives"],
  ["MW", "Malawi", "Malawi"],
  ["MX", "México", "Mexico"],
  ["MY", "Malaysia", "Malaysia"],
  ["MZ", "Moçambique", "Mozambique"],
  ["NA", "Namibia", "Namibia"],
  ["NE", "Niger", "Niger"],
  ["NG", "Nigeria", "Nigeria"],
  ["NI", "Nicaragua", "Nicaragua"],
  ["NL", "Nederland", "Netherlands"],
  ["NO", "Norge", "Norway"],
  ["NP", "नेपाल", "Nepal"],
  ["NR", "Nauru", "Nauru"],
  ["NZ", "New Zealand / Aotearoa", "New Zealand"],
  ["OM", "عُمان", "Oman"],
  ["PA", "Panamá", "Panama"],
  ["PE", "Perú", "Peru"],
  ["PG", "Papua New Guinea", "Papua New Guinea"],
  ["PH", "Pilipinas", "Philippines"],
  ["PK", "پاکستان", "Pakistan"],
  ["PL", "Polska", "Poland"],
  ["PT", "Portugal", "Portugal"],
  ["PW", "Palau", "Palau"],
  ["PY", "Paraguay", "Paraguay"],
  ["QA", "قطر", "Qatar"],
  ["RO", "România", "Romania"],
  ["RS", "Србија", "Serbia"],
  ["RW", "Rwanda", "Rwanda"],
  ["SA", "المملكة العربية السعودية", "Saudi Arabia"],
  ["SB", "Solomon Islands", "Solomon Islands"],
  ["SC", "Seychelles", "Seychelles"],
  ["SD", "السودان", "Sudan"],
  ["SE", "Sverige", "Sweden"],
  ["SG", "Singapore", "Singapore"],
  ["SI", "Slovenija", "Slovenia"],
  ["SK", "Slovensko", "Slovakia"],
  ["SL", "Sierra Leone", "Sierra Leone"],
  ["SM", "San Marino", "San Marino"],
  ["SN", "Sénégal", "Senegal"],
  ["SO", "Soomaaliya", "Somalia"],
  ["SR", "Suriname", "Suriname"],
  ["SS", "South Sudan", "South Sudan"],
  ["ST", "São Tomé e Príncipe", "São Tomé and Príncipe"],
  ["SV", "El Salvador", "El Salvador"],
  ["SZ", "Eswatini", "Eswatini"],
  ["TD", "Tchad", "Chad"],
  ["TG", "Togo", "Togo"],
  ["TH", "ประเทศไทย", "Thailand"],
  ["TJ", "Тоҷикистон", "Tajikistan"],
  ["TL", "Timor-Leste", "Timor-Leste"],
  ["TM", "Türkmenistan", "Turkmenistan"],
  ["TN", "تونس", "Tunisia"],
  ["TO", "Tonga", "Tonga"],
  ["TR", "Türkiye", "Türkiye"],
  ["TT", "Trinidad and Tobago", "Trinidad and Tobago"],
  ["TV", "Tuvalu", "Tuvalu"],
  ["TW", "臺灣", "Taiwan"],
  ["TZ", "Tanzania", "Tanzania"],
  ["UA", "Україна", "Ukraine"],
  ["UG", "Uganda", "Uganda"],
  ["US", "United States", "United States"],
  ["UY", "Uruguay", "Uruguay"],
  ["UZ", "Oʻzbekiston", "Uzbekistan"],
  ["VA", "Città del Vaticano", "Vatican City"],
  ["VC", "Saint Vincent and the Grenadines", "Saint Vincent and the Grenadines"],
  ["VE", "Venezuela", "Venezuela"],
  ["VN", "Việt Nam", "Vietnam"],
  ["VU", "Vanuatu", "Vanuatu"],
  ["WS", "Samoa", "Samoa"],
  ["XK", "Kosova", "Kosovo"],
  ["YE", "اليمن", "Yemen"],
  ["ZA", "South Africa", "South Africa"],
  ["ZM", "Zambia", "Zambia"],
  ["ZW", "Zimbabwe", "Zimbabwe"],
] as const;

export type EnrollmentCountryCode = (typeof ENROLLMENT_COUNTRY_ROWS)[number][0];

export const ENROLLMENT_COUNTRY_CODES: EnrollmentCountryCode[] = ENROLLMENT_COUNTRY_ROWS.map(
  (row) => row[0],
);

/** Explicit product exclusions (do not add back without client decision). */
export const ENROLLMENT_EXCLUDED_COUNTRY_CODES = ["RU", "BY", "KP", "IR"] as const;

type CountryMeta = {
  code: EnrollmentCountryCode;
  native: string;
  en: string;
};

const COUNTRY_BY_CODE: Record<EnrollmentCountryCode, CountryMeta> = Object.fromEntries(
  ENROLLMENT_COUNTRY_ROWS.map(([code, native, en]) => [code, { code, native, en }]),
) as Record<EnrollmentCountryCode, CountryMeta>;

const LOCALE_DEFAULT_COUNTRY: Record<AppLocale, EnrollmentCountryCode> = {
  uk: "UA",
  en: "GB",
  de: "DE",
  es: "ES",
  fr: "FR",
  az: "AZ",
  kk: "KZ",
};

export function isEnrollmentCountryCode(value: string): value is EnrollmentCountryCode {
  return Object.prototype.hasOwnProperty.call(COUNTRY_BY_CODE, value);
}

/**
 * RU: URL прапора (flagcdn). Emoji на Windows часто показує «DE» замість 🇩🇪.
 * EN: Flag image URL; emoji often renders as letters on Windows.
 */
export function countryFlagUrl(code: string, width = 40): string {
  const cc = code.trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(cc)) return "";
  return `https://flagcdn.com/w${width}/${cc}.png`;
}

/** @deprecated Prefer countryFlagUrl — emoji unreliable on Windows. */
export function countryFlagEmoji(code: string): string {
  const cc = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return "";
  return String.fromCodePoint(...[...cc].map((ch) => 0x1f1e6 - 65 + ch.charCodeAt(0)));
}

/** RU: Рідна назва країни (для UI). EN: Native country name for UI. */
export function countryLabel(code: EnrollmentCountryCode, _locale?: AppLocale): string {
  void _locale;
  return COUNTRY_BY_CODE[code]?.native ?? code;
}

export function countryEnglishName(code: EnrollmentCountryCode): string {
  return COUNTRY_BY_CODE[code]?.en ?? code;
}

export function countryMeta(code: EnrollmentCountryCode): CountryMeta {
  return COUNTRY_BY_CODE[code];
}

/** RU: Країна за замовчуванням за локаллю сайту. EN: Default country from site locale. */
export function defaultCountryForLocale(locale: AppLocale): EnrollmentCountryCode {
  return LOCALE_DEFAULT_COUNTRY[locale] ?? "UA";
}

/** RU: Список країн за рідною назвою. EN: Countries sorted by native name. */
export function sortedEnrollmentCountries(_locale?: AppLocale): EnrollmentCountryCode[] {
  void _locale;
  return [...ENROLLMENT_COUNTRY_CODES].sort((a, b) =>
    countryLabel(a).localeCompare(countryLabel(b), "en", { sensitivity: "base" }),
  );
}

/** RU: Пошук за рідною / англійською назвою або кодом. EN: Search by native/English/code. */
export function filterEnrollmentCountries(query: string): EnrollmentCountryCode[] {
  const q = query.trim().toLowerCase();
  const base = sortedEnrollmentCountries();
  if (!q) return base;
  return base.filter((code) => {
    const meta = COUNTRY_BY_CODE[code];
    return (
      code.toLowerCase().includes(q) ||
      meta.native.toLowerCase().includes(q) ||
      meta.en.toLowerCase().includes(q)
    );
  });
}
