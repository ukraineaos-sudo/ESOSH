import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  MODULE_ATTEMPT_LIMIT,
  MODULE_ATTEMPT_WINDOW_MS,
  consumeModuleAttempt,
  moduleAttemptKey,
} from "../src/lib/trainings/module-attempt-budget.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * In-memory stand-in for the Neon tagged template that mirrors the
 * `INSERT … ON CONFLICT` window semantics in src/lib/rate-limit-counter.ts.
 * Template values: [key, windowStart, cutoff, cutoff, cutoff].
 */
function fakeNeon() {
  const table = new Map();
  const sql = async (_strings, key, windowStart, cutoff) => {
    const row = table.get(key);
    if (!row || row.window_start <= cutoff) {
      const fresh = { window_start: windowStart, count: 1 };
      table.set(key, fresh);
      return [{ ...fresh }];
    }
    row.count += 1;
    return [{ ...row }];
  };
  return { sql, table };
}

describe("durable per-module attempt budget (cookie-independent)", () => {
  it("blocks the 6th attempt for the same IP+course+module; no cookie input exists", async () => {
    const { sql } = fakeNeon();
    const now = Date.now();
    const decisions = [];
    // No cookie/progress argument is accepted at all: every call is a "fresh browser".
    for (let i = 0; i < MODULE_ATTEMPT_LIMIT + 1; i++) {
      decisions.push(await consumeModuleAttempt(sql, "203.0.113.7", "risk-assessment", "m1", now));
    }
    assert.deepEqual(
      decisions.map((d) => d.allowed),
      [true, true, true, true, true, false],
    );
    const blocked = decisions[5];
    assert.equal(blocked.allowed, false);
    assert.ok(blocked.retryAfterSec > 0 && blocked.retryAfterSec <= MODULE_ATTEMPT_WINDOW_MS / 1000);
    // Further attempts stay blocked (window does not slide on rejected hits).
    const again = await consumeModuleAttempt(sql, "203.0.113.7", "risk-assessment", "m1", now + 1000);
    assert.equal(again.allowed, false);
  });

  it("isolates budgets by IP, course and module", async () => {
    const { sql } = fakeNeon();
    const now = Date.now();
    for (let i = 0; i < MODULE_ATTEMPT_LIMIT; i++) {
      await consumeModuleAttempt(sql, "203.0.113.7", "risk-assessment", "m1", now);
    }
    assert.equal((await consumeModuleAttempt(sql, "203.0.113.7", "risk-assessment", "m1", now)).allowed, false);
    assert.equal((await consumeModuleAttempt(sql, "203.0.113.7", "risk-assessment", "m2", now)).allowed, true);
    assert.equal((await consumeModuleAttempt(sql, "203.0.113.7", "uav-attacks", "m1", now)).allowed, true);
    assert.equal((await consumeModuleAttempt(sql, "198.51.100.9", "risk-assessment", "m1", now)).allowed, true);
  });

  it("resets only after the 12h window expires", async () => {
    const { sql } = fakeNeon();
    const now = Date.now();
    for (let i = 0; i < MODULE_ATTEMPT_LIMIT + 1; i++) {
      await consumeModuleAttempt(sql, "203.0.113.7", "s", "m", now);
    }
    const justBefore = await consumeModuleAttempt(sql, "203.0.113.7", "s", "m", now + MODULE_ATTEMPT_WINDOW_MS - 1000);
    assert.equal(justBefore.allowed, false);
    const after = await consumeModuleAttempt(sql, "203.0.113.7", "s", "m", now + MODULE_ATTEMPT_WINDOW_MS + 1);
    assert.equal(after.allowed, true);
  });

  it("fails closed when the DB returns no row", async () => {
    await assert.rejects(
      consumeModuleAttempt(async () => [], "1.1.1.1", "s", "m"),
      /module_attempt_budget_unavailable/,
    );
  });

  it("hashes the key: fits varchar(191), no raw IP, no truncation collisions", () => {
    const longModule = "x".repeat(128);
    const a = moduleAttemptKey("2001:db8::1", "risk-assessment", longModule);
    const b = moduleAttemptKey("2001:db8::1", "risk-assessment", longModule.slice(0, -1) + "y");
    assert.ok(a.length <= 191);
    assert.notEqual(a, b);
    assert.ok(a.startsWith("training_module_score:"));
    assert.ok(!a.includes("2001:db8"));
  });
});

describe("score route wiring", () => {
  it("consumes the durable budget before scoring is persisted, only for non-replayed modules", () => {
    const route = readFileSync(join(root, "src/app/api/trainings/[slug]/score/route.ts"), "utf8");
    const budget = route.indexOf("assertModuleScoreBudget(request, slug, moduleId)");
    const write = route.indexOf("writeTrainingProgressModule(slug, moduleId");
    assert.ok(budget > 0 && write > budget, "budget must be checked before progress write/response");
    assert.match(route, /if \(!skipWrite\)\s*\{[\s\S]*assertModuleScoreBudget/);

    const limiter = readFileSync(join(root, "src/lib/rate-limit.ts"), "utf8");
    assert.match(limiter, /export async function assertModuleScoreBudget/);
    assert.match(limiter, /consumeModuleAttempt\(/);
  });
});
