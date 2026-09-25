import { put, get, del } from "@vercel/blob";
import { createPublicId, safeFileName } from "./ids";
import {
  ALLOWED_DOC_TYPES,
  ALLOWED_PHOTO_TYPES,
  DOC_MAX_BYTES,
  PHOTO_MAX_BYTES,
} from "./schema";

export type StoredEnrollmentFile = {
  fieldKey: string;
  originalName: string;
  pathname: string;
  contentType: string;
  sizeBytes: number;
};

/** Max files per enrollment application (photo + docs). */
export const ENROLLMENT_MAX_FILES = 20;
/** Max total upload size per application. */
export const ENROLLMENT_MAX_TOTAL_BYTES = 40 * 1024 * 1024;

/** RU: access Blob: за замовчуванням private; public лише явно. EN: Default private; opt-in public. */
function blobAccessForRead(): "public" | "private" {
  return process.env.ENROLLMENT_BLOB_ACCESS === "public" ? "public" : "private";
}

function blobAccessForWrite(): "public" | "private" {
  if (process.env.ENROLLMENT_BLOB_ACCESS === "public") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("blob_public_forbidden");
    }
    return "public";
  }
  return "private";
}

function extOk(name: string, kind: "photo" | "document"): boolean {
  const lower = name.toLowerCase();
  if (kind === "photo") return /\.(jpe?g|png)$/.test(lower);
  return /\.(pdf|jpe?g|png)$/.test(lower);
}

/** RU: Сигнатура файла (magic bytes). EN: Sniff file signature. */
export async function sniffEnrollmentFileKind(
  file: File,
): Promise<"jpeg" | "png" | "pdf" | null> {
  const buf = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (
    buf.length >= 4 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "png";
  }
  if (
    buf.length >= 4 &&
    buf[0] === 0x25 &&
    buf[1] === 0x50 &&
    buf[2] === 0x44 &&
    buf[3] === 0x46
  ) {
    return "pdf";
  }
  return null;
}

/** RU: Перевірка типу/розміру файлу заявки. EN: Validate enrollment upload constraints. */
export function validateEnrollmentFile(
  file: File,
  kind: "photo" | "document",
): string | null {
  const max = kind === "photo" ? PHOTO_MAX_BYTES : DOC_MAX_BYTES;
  const allowed = kind === "photo" ? ALLOWED_PHOTO_TYPES : ALLOWED_DOC_TYPES;
  if (file.size <= 0 || file.size > max) return "too_large";
  const type = file.type === "image/jpg" ? "image/jpeg" : file.type;
  if (!allowed.has(type) && !allowed.has(file.type)) {
    if (!extOk(file.name, kind)) return "bad_type";
  }
  return null;
}

/**
 * RU: Полная проверка файла включая magic bytes.
 * EN: Full file check including magic-byte sniff.
 */
export async function validateEnrollmentFileStrict(
  file: File,
  kind: "photo" | "document",
): Promise<string | null> {
  const basic = validateEnrollmentFile(file, kind);
  if (basic) return basic;
  const sniffed = await sniffEnrollmentFileKind(file);
  if (!sniffed) return "bad_signature";
  if (kind === "photo" && sniffed === "pdf") return "bad_signature";
  if (kind === "document" && sniffed !== "pdf" && sniffed !== "jpeg" && sniffed !== "png") {
    return "bad_signature";
  }
  return null;
}

/** RU: Лимиты числа и суммарного размера файлов заявки. EN: Per-application file budget. */
export function validateEnrollmentFileBatch(
  files: { size: number }[],
): string | null {
  if (files.length > ENROLLMENT_MAX_FILES) return "too_many_files";
  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > ENROLLMENT_MAX_TOTAL_BYTES) return "total_too_large";
  return null;
}

/** RU: Завантаження файлу заявки в Blob (непублічний UI). EN: Store enrollment blob. */
export async function putEnrollmentBlob(
  applicationPublicId: string,
  fieldKey: string,
  file: File,
): Promise<StoredEnrollmentFile> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("blob_unavailable");
  const access = blobAccessForWrite();
  const pathname = `enrollment/${applicationPublicId}/${fieldKey}-${createPublicId("APP").slice(4)}-${safeFileName(file.name)}`;
  const result = await put(pathname, file, {
    access,
    token,
    contentType: file.type || undefined,
    addRandomSuffix: false,
  });
  return {
    fieldKey,
    originalName: file.name,
    pathname: result.pathname,
    contentType: file.type || "application/octet-stream",
    sizeBytes: file.size,
  };
}

/** RU: Читає файл заявки з Blob. EN: Read enrollment blob stream. */
export async function getEnrollmentBlob(pathname: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  return get(pathname, { access: blobAccessForRead(), token });
}

/** RU: Best-effort видалення blob-файлів заявки. EN: Best-effort enrollment blob cleanup. */
export async function deleteEnrollmentBlobs(pathnames: string[]): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const unique = [...new Set(pathnames.filter(Boolean))];
  if (!token || unique.length === 0) return;
  try {
    await del(unique, { token });
  } catch {
    // DB cascade already owns truth; orphan blobs are acceptable.
  }
}
