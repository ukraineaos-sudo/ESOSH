import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  MODULE_ATTEMPT_LIMIT,
  MODULE_ATTEMPT_WINDOW_MS,
  MODULE_IP_ATTEMPT_LIMIT,
  consumeModuleAttempt,
  consumeVisitorModuleAttempt,
  fingerprintModuleAnswers,
  moduleAttemptKey,
  moduleVisitorAttemptKey,
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

describe("durable per-module attempt budget (cookie-independent IP ceiling)", () => {
  it("blocks after MODULE_IP_ATTEMPT_LIMIT+1 for the same IP+course+module", async () => {
    const { sql } = fakeNeon();
    const now = Date.now();
    const decisions = [];
    for (let i = 0; i < MODULE_IP_ATTEMPT_LIMIT + 1; i++) {
      decisions.push(await consumeModuleAttempt(sql, "203.0.113.7", "risk-assessment", "m1", now));
    }
    assert.equal(decisions.filter((d) => d.allowed).length, MODULE_IP_ATTEMPT_LIMIT);
    assert.equal(decisions[MODULE_IP_ATTEMPT_LIMIT].allowed, false);
  });

  it("visitor bucket is independent per visitor id (NAT-friendly)", async () => {
    const { sql } = fakeNeon();
    const now = Date.now();
    for (let i = 0; i < MODULE_ATTEMPT_LIMIT; i++) {
      await consumeVisitorModuleAttempt(sql, "visitor-a", "risk-assessment", "part-2", now);
    }
    assert.equal(
      (await consumeVisitorModuleAttempt(sql, "visitor-a", "risk-assessment", "part-2", now)).allowed,
      false,
    );
    assert.equal(
      (await consumeVisitorModuleAttempt(sql, "visitor-b", "risk-assessment", "part-2", now)).allowed,
      true,
    );
  });

  it("isolates IP budgets by IP, course and module", async () => {
    const { sql } = fakeNeon();
    const now = Date.now();
    for (let i = 0; i < MODULE_IP_ATTEMPT_LIMIT; i++) {
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
      await consumeVisitorModuleAttempt(sql, "v1", "s", "m", now);
    }
    const justBefore = await consumeVisitorModuleAttempt(
      sql,
      "v1",
      "s",
      "m",
      now + MODULE_ATTEMPT_WINDOW_MS - 1000,
    );
    assert.equal(justBefore.allowed, false);
    const after = await consumeVisitorModuleAttempt(
      sql,
      "v1",
      "s",
      "m",
      now + MODULE_ATTEMPT_WINDOW_MS + 1,
    );
    assert.equal(after.allowed, true);
  });

  it("fails closed when the DB returns no row", async () => {
    await assert.rejects(
      consumeModuleAttempt(async () => [], "1.1.1.1", "s", "m"),
      /module_attempt_budget_unavailable/,
    );
  });

  it("hashes keys: fits varchar(191), no raw IP, distinct visitor vs IP namespaces", () => {
    const longModule = "x".repeat(128);
    const a = moduleAttemptKey("2001:db8::1", "risk-assessment", longModule);
    const b = moduleAttemptKey("2001:db8::1", "risk-assessment", longModule.slice(0, -1) + "y");
    const v = moduleVisitorAttemptKey("visitor-1", "risk-assessment", longModule);
    assert.ok(a.length <= 191);
    assert.ok(v.length <= 191);
    assert.notEqual(a, b);
    assert.notEqual(a, v);
    assert.ok(a.startsWith("training_module_score:"));
    assert.ok(v.startsWith("training_module_score_v:"));
    assert.ok(!a.includes("2001:db8"));
  });

  it("fingerprintModuleAnswers is stable and order-independent", () => {
    const a = fingerprintModuleAnswers({ "2": "B", "1": "A" });
    const b = fingerprintModuleAnswers({ "1": "A", "2": "B" });
    const c = fingerprintModuleAnswers({ "1": "A", "2": "C" });
    assert.equal(a, b);
    assert.notEqual(a, c);
    assert.equal(a.length, 64);
  });
});

describe("score route wiring", () => {
  it("consumes the durable budget before scoring is persisted, only for non-replayed modules", () => {
    const route = readFileSync(join(root, "src/app/api/trainings/[slug]/score/route.ts"), "utf8");
    const budget = route.indexOf("assertModuleScoreBudget(request, slug, moduleId)");
    const write = route.indexOf("writeTrainingProgressModule(slug, moduleId");
    assert.ok(budget > 0 && write > budget, "budget must be checked before progress write/response");
    assert.match(route, /if \(!skipBudget\)\s*\{[\s\S]*assertModuleScoreBudget/);
    assert.match(route, /fingerprintModuleAnswers/);

    const limiter = readFileSync(join(root, "src/lib/rate-limit.ts"), "utf8");
    assert.match(limiter, /export async function assertModuleScoreBudget/);
    assert.match(limiter, /consumeVisitorModuleAttempt\(/);
    assert.match(limiter, /consumeModuleAttempt\(/);
    assert.match(limiter, /ensureTrainingVisitorId/);
  });

  it("progress GET restores aggregates without answer keys", () => {
    const progress = readFileSync(join(root, "src/app/api/trainings/[slug]/progress/route.ts"), "utf8");
    assert.match(progress, /readTrainingProgress/);
    assert.match(progress, /certificateToken/);
    assert.doesNotMatch(progress, /answersFp|correct/);
  });
});
