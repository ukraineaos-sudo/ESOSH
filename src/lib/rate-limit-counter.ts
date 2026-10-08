/**
 * RU: Атомарний лічильник вікна у `rate_limit_buckets` (спільний для assertRateLimit та бюджету спроб).
 * EN: Atomic windowed counter on `rate_limit_buckets` (shared by assertRateLimit and the attempt budget).
 * Без імпортів `@/*`, щоб модуль можна було перевірити node:test.
 */

/** Neon-сумісний tagged-template виконавець SQL. Neon-compatible tagged-template SQL runner. */
export type SqlTag = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;

type UpsertRow = {
  count: number | string;
  window_start: string | Date;
};

export type CounterResult = {
  count: number;
  windowStartMs: number;
};

/**
 * RU: INSERT … ON CONFLICT: +1 у поточному вікні або скидання після закінчення вікна.
 * EN: INSERT … ON CONFLICT: +1 inside the current window, reset once the window has expired.
 */
export async function bumpWindowCounter(
  sql: SqlTag,
  key: string,
  windowMs: number,
  nowMs: number = Date.now(),
): Promise<CounterResult | null> {
  const windowStart = new Date(nowMs);
  const cutoff = new Date(nowMs - windowMs);
  const rows = (await sql`
    INSERT INTO rate_limit_buckets AS rl (key, window_start, count)
    VALUES (${key}, ${windowStart}, 1)
    ON CONFLICT (key) DO UPDATE SET
      window_start = CASE
        WHEN rl.window_start <= ${cutoff} THEN EXCLUDED.window_start
        ELSE rl.window_start
      END,
      count = CASE
        WHEN rl.window_start <= ${cutoff} THEN 1
        ELSE rl.count + 1
      END
    RETURNING count, window_start
  `) as UpsertRow[];

  const row = rows[0];
  if (!row) return null;
  return { count: Number(row.count), windowStartMs: new Date(row.window_start).getTime() };
}
