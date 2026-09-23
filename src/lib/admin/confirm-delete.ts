/** RU: Слово підтвердження небезпечних дій у кабінеті. EN: Admin destructive confirm word. */
export const ADMIN_DELETE_CONFIRM = "да";

/** RU: Перевірка тіла DELETE: рівно «да». EN: Validate delete confirm payload. */
export function isAdminDeleteConfirm(value: unknown): boolean {
  return typeof value === "string" && value.trim() === ADMIN_DELETE_CONFIRM;
}
