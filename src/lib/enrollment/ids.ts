import { randomBytes } from "node:crypto";

/** RU: Публічний ID заявки/члена. EN: Public application/member ID. */
export function createPublicId(prefix: "APP" | "MBR"): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

/** RU: Безпечне ім’я файлу для Blob. EN: Safe blob pathname segment. */
export function safeFileName(name: string): string {
  const base = name.replace(/[^\w.\-]+/g, "_").slice(0, 80);
  return base || "file";
}
