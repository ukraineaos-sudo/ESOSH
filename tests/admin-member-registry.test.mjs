/**
 * Contract tests for member registry filter/stats.
 * Keep algorithms in sync with src/lib/admin/member-registry.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const MEMBER_STATUSES = ["candidate", "active", "active_no_level"];
const LEVEL_CODES = ["diplomate", "certified", "accredited", "specialist", "community"];

function computeMemberRegistryStats(items) {
  const byStatus = Object.fromEntries(MEMBER_STATUSES.map((s) => [s, 0]));
  const byLevel = Object.fromEntries([...LEVEL_CODES, "none"].map((l) => [l, 0]));
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] ?? 0) + 1;
    if (item.level && LEVEL_CODES.includes(item.level)) {
      byLevel[item.level] = (byLevel[item.level] ?? 0) + 1;
    } else {
      byLevel.none += 1;
    }
  }
  return { total: items.length, byStatus, byLevel };
}

function filterMemberRegistryItems(items, filters) {
  const q = filters.q?.trim().toLowerCase() || "";
  const industry = filters.industry?.trim().toLowerCase() || "";
  const minYears =
    filters.minOshYears != null && Number.isFinite(filters.minOshYears)
      ? Number(filters.minOshYears)
      : null;

  return items.filter((item) => {
    if (filters.status && item.status !== filters.status) return false;
    if (filters.level === "none") {
      if (item.level) return false;
    } else if (filters.level && item.level !== filters.level) {
      return false;
    }
    if (filters.oshFunctions === "yes" && item.oshFunctions !== true) return false;
    if (filters.oshFunctions === "no" && item.oshFunctions !== false) return false;
    if (minYears != null && (item.oshYears == null || item.oshYears < minYears)) return false;
    if (industry && (item.industry || "").toLowerCase() !== industry) return false;
    if (q) {
      const hay = [
        item.publicId,
        item.firstName,
        item.lastName,
        item.primaryEmail,
        item.secondaryEmail || "",
        item.phone || "",
        item.jobTitle || "",
        item.organization || "",
        item.industry || "",
        item.country || "",
        item.city || "",
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function sample() {
  return [
    {
      publicId: "MBR-1",
      firstName: "Анна",
      lastName: "Коваленко",
      primaryEmail: "anna@example.com",
      secondaryEmail: null,
      phone: "+380501112233",
      status: "active",
      level: "certified",
      jobTitle: "Інженер БЗР",
      organization: "Агро",
      industry: "АПК",
      oshYears: 6,
      oshFunctions: true,
      country: "UA",
      city: "Київ",
    },
    {
      publicId: "MBR-2",
      firstName: "Богдан",
      lastName: "Петренко",
      primaryEmail: "bogdan@example.com",
      secondaryEmail: null,
      phone: null,
      status: "candidate",
      level: null,
      jobTitle: "Електрик",
      organization: "Будівельна",
      industry: "Будівництво",
      oshYears: 2,
      oshFunctions: false,
      country: "UA",
      city: "Львів",
    },
    {
      publicId: "MBR-3",
      firstName: "Олена",
      lastName: "Сидоренко",
      primaryEmail: "olena@example.com",
      secondaryEmail: "o.sid@example.com",
      phone: null,
      status: "active_no_level",
      level: null,
      jobTitle: "Спеціаліст з ОП",
      organization: "Метал",
      industry: "АПК",
      oshYears: 5,
      oshFunctions: true,
      country: "UA",
      city: "Одеса",
    },
  ];
}

test("stats: totals by status and level for full set", () => {
  const stats = computeMemberRegistryStats(sample());
  assert.equal(stats.total, 3);
  assert.equal(stats.byStatus.active, 1);
  assert.equal(stats.byStatus.candidate, 1);
  assert.equal(stats.byStatus.active_no_level, 1);
  assert.equal(stats.byLevel.certified, 1);
  assert.equal(stats.byLevel.none, 2);
});

test("stats: update with filtered set (industry)", () => {
  const filtered = filterMemberRegistryItems(sample(), { industry: "АПК" });
  const stats = computeMemberRegistryStats(filtered);
  assert.equal(stats.total, 2);
  assert.equal(stats.byStatus.active, 1);
  assert.equal(stats.byStatus.active_no_level, 1);
  assert.equal(stats.byStatus.candidate, 0);
  assert.equal(stats.byLevel.certified, 1);
  assert.equal(stats.byLevel.none, 1);
});

test("filter: status + minOshYears + oshFunctions", () => {
  const filtered = filterMemberRegistryItems(sample(), {
    status: "active",
    minOshYears: 5,
    oshFunctions: "yes",
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].publicId, "MBR-1");
});

test("filter: level none", () => {
  const filtered = filterMemberRegistryItems(sample(), { level: "none" });
  assert.equal(filtered.length, 2);
  assert.ok(filtered.every((row) => !row.level));
});

test("filter: q matches job title and email", () => {
  const byJob = filterMemberRegistryItems(sample(), { q: "електрик" });
  assert.equal(byJob.length, 1);
  assert.equal(byJob[0].publicId, "MBR-2");
  const byEmail = filterMemberRegistryItems(sample(), { q: "o.sid@" });
  assert.equal(byEmail.length, 1);
  assert.equal(byEmail[0].publicId, "MBR-3");
});

test("filter: industry exact match (case-insensitive)", () => {
  const filtered = filterMemberRegistryItems(sample(), { industry: "апк" });
  assert.equal(filtered.length, 2);
  assert.ok(filtered.every((row) => row.industry === "АПК"));
});
