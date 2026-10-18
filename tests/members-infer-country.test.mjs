import assert from "node:assert/strict";
import test from "node:test";

const { inferMemberCountry, inferCountryFromPhone, inferCountryFromEmail, normalizeProfileCountry } =
  await import("../src/lib/members/infer-country.ts");

test("profile country wins over phone", () => {
  assert.equal(
    inferMemberCountry({
      profileCountry: "Україна",
      phone: "+48123456789",
      email: "a@example.com",
    }),
    "UA",
  );
});

test("phone 380 and local 0XX map to UA", () => {
  assert.equal(inferCountryFromPhone("380504419936"), "UA");
  assert.equal(inferCountryFromPhone("38(067)5100214"), "UA");
  assert.equal(inferCountryFromPhone("+38 067 461 58 09"), "UA");
  assert.equal(inferCountryFromPhone("(050) 347-71-91"), "UA");
});

test("email .ua / ukr.net map to UA; esosh.net ignored", () => {
  assert.equal(inferCountryFromEmail("a@company.com.ua"), "UA");
  assert.equal(inferCountryFromEmail("tdushko@ukr.net"), "UA");
  assert.equal(inferCountryFromEmail("olga.bogdanova@esosh.net"), null);
});

test("fallback UNKNOWN when no signals", () => {
  assert.equal(inferMemberCountry({ email: "jjprice1@gmail.com" }), "UNKNOWN");
});

test("normalize Nigeria as OTHER", () => {
  assert.equal(normalizeProfileCountry("Nigeria"), "OTHER");
});
