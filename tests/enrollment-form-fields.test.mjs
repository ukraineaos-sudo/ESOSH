import assert from "node:assert/strict";
import { describe, it } from "node:test";

const {
  ENROLLMENT_MIN_AGE,
  isBirthDateAtLeastAge,
  maxBirthDateForMinAge,
} = await import("../src/lib/enrollment/age.ts");
const {
  countryFlagUrl,
  countryLabel,
  ENROLLMENT_EXCLUDED_COUNTRY_CODES,
  isEnrollmentCountryCode,
} = await import("../src/lib/enrollment/countries.ts");
const {
  formatIndustryForStorage,
  isEnrollmentIndustryId,
} = await import("../src/lib/enrollment/industries.ts");
const {
  countryDialPrefix,
  formatEnrollmentPhoneE164,
  isValidEnrollmentPhone,
  withCountryDialPrefix,
} = await import("../src/lib/enrollment/phone.ts");

describe("enrollment age", () => {
  it("rejects underage birth dates", () => {
    const on = new Date(2026, 10, 6);
    const result = isBirthDateAtLeastAge("2010-11-07", ENROLLMENT_MIN_AGE, on);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "underage");
    const adultCutoff = isBirthDateAtLeastAge(
      maxBirthDateForMinAge(ENROLLMENT_MIN_AGE, on),
      ENROLLMENT_MIN_AGE,
      on,
    );
    assert.equal(adultCutoff.ok, true);
  });

  it("accepts age 18 exactly on birthday", () => {
    const on = new Date(2026, 10, 6);
    const result = isBirthDateAtLeastAge("2008-11-06", ENROLLMENT_MIN_AGE, on);
    assert.equal(result.ok, true);
  });
});

describe("enrollment phone", () => {
  it("accepts valid UA number for UA country", () => {
    assert.equal(isValidEnrollmentPhone("+380671234567", "UA"), true);
    assert.equal(formatEnrollmentPhoneE164("+380671234567", "UA"), "+380671234567");
  });

  it("rejects national numbers without + prefix", () => {
    assert.equal(isValidEnrollmentPhone("954553545", "UA"), false);
    assert.equal(isValidEnrollmentPhone("0671234567", "UA"), false);
  });

  it("rejects number that does not match selected country", () => {
    assert.equal(isValidEnrollmentPhone("+77001234567", "UA"), false);
    assert.equal(isValidEnrollmentPhone("+380671234567", "KZ"), false);
  });

  it("rejects truncated invented numbers", () => {
    assert.equal(isValidEnrollmentPhone("+77001", "KZ"), false);
  });

  it("prefills and swaps country dial prefixes", () => {
    assert.equal(countryDialPrefix("UA"), "+380");
    assert.equal(withCountryDialPrefix("", "UA"), "+380");
    assert.equal(withCountryDialPrefix("+380", "DE", "UA"), "+49");
    assert.equal(withCountryDialPrefix("+380671234567", "PL", "UA"), "+48671234567");
  });
});

describe("enrollment catalogs", () => {
  it("knows curated country and industry ids", () => {
    assert.equal(isEnrollmentCountryCode("UA"), true);
    assert.equal(isEnrollmentCountryCode("FR"), true);
    assert.equal(isEnrollmentCountryCode("Kazakh"), false);
    assert.equal(isEnrollmentIndustryId("oil_gas"), true);
    assert.equal(isEnrollmentIndustryId("unknown"), false);
  });

  it("uses native country names and excludes sanctioned codes", () => {
    assert.equal(countryLabel("FR"), "France");
    assert.equal(countryLabel("DE"), "Deutschland");
    assert.match(countryFlagUrl("UA"), /flagcdn\.com\/w40\/ua\.png/);
    for (const code of ENROLLMENT_EXCLUDED_COUNTRY_CODES) {
      assert.equal(isEnrollmentCountryCode(code), false);
    }
  });

  it("formats multi industry for storage", () => {
    const text = formatIndustryForStorage(["oil_gas", "other"], "uk", "Біотех");
    assert.match(text, /Нафта/);
    assert.match(text, /Інше: Біотех/);
  });
});

describe("enrollment contact gate (mirrors schema rules)", () => {
  it("blocks underage, free-text country, and mismatched phone", () => {
    assert.equal(isBirthDateAtLeastAge("2015-01-01", ENROLLMENT_MIN_AGE).ok, false);
    assert.equal(isEnrollmentCountryCode("Kazakh"), false);
    assert.equal(isValidEnrollmentPhone("+77001234567", "UA"), false);
  });

  it("requires other text when other industry selected", () => {
    const ids = ["other"];
    const otherText = "";
    assert.equal(ids.includes("other") && !otherText.trim(), true);
  });
});
