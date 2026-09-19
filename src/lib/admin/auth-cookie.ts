export const ADMIN_SESSION_COOKIE = "esosh_admin_session";

/** RU: Есть ли cookie сессии (Edge-safe). EN: Edge-safe session cookie presence check. */
export function hasAdminSessionCookie(value: string | undefined): boolean {
  return Boolean(value && value.length > 16);
}
