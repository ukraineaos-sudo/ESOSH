/** RU: Слово підтвердження небезпечних дій у кабінеті. EN: Admin destructive confirm word. */
export const ADMIN_DELETE_CONFIRM = "так";

/** RU: Перевірка тіла DELETE: рівно «так». EN: Validate delete confirm payload («так»). */
export function isAdminDeleteConfirm(value: unknown): boolean {
  return typeof value === "string" && value.trim() === ADMIN_DELETE_CONFIRM;
}
