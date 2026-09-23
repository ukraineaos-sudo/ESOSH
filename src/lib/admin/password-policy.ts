/** RU: Минимальная длина нового пароля. EN: Minimum length for a new password. */
export const ADMIN_NEW_PASSWORD_MIN_LENGTH = 8;

const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{0,63}$/;

/** RU: Нормализация логина. EN: Normalize a login username. */
export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

/** RU: Валидный username для входа/создания. EN: Valid username for login/create. */
export function isValidUsername(username: string): boolean {
  return USERNAME_RE.test(username);
}

/** RU: Новый пароль (не bootstrap). EN: New password strength gate (not bootstrap). */
export function isValidNewPassword(password: string): boolean {
  return typeof password === "string" && password.length >= ADMIN_NEW_PASSWORD_MIN_LENGTH;
}

/**
 * RU: Слабый bootstrap-пароль (нужно сменить после первого входа).
 * EN: Weak bootstrap password that should be changed after first login.
 */
export function isWeakBootstrapPassword(password: string): boolean {
  return password === "admin" || password.length < ADMIN_NEW_PASSWORD_MIN_LENGTH;
}
