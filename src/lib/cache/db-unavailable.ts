/** RU: Тимчасова недоступність Neon — не класти в Data Cache. EN: Transient Neon failure — do not cache. */
export class DbUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("db_unavailable");
    this.name = "DbUnavailableError";
    if (cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = cause;
    }
  }
}

export function isDbUnavailable(err: unknown): boolean {
  return err instanceof DbUnavailableError || (err instanceof Error && err.name === "DbUnavailableError");
}
