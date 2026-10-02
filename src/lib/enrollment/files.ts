import { put, get, del } from "@vercel/blob";
import { createPublicId, safeFileName } from "./ids";
import {
  ALLOWED_DOC_TYPES,
  ALLOWED_PHOTO_TYPES,
  DOC_MAX_BYTES,
  ENROLLMENT_MAX_FILES,
  ENROLLMENT_MAX_TOTAL_BYTES,
  PHOTO_MAX_BYTES,
} from "./schema";

export type StoredEnrollmentFile = {
  fieldKey: string;
  originalName: string;
  pathname: string;
  contentType: string;
  sizeBytes: number;
};

export type EnrollmentSniffKind = "jpeg" | "png" | "pdf";

export { ENROLLMENT_MAX_FILES, ENROLLMENT_MAX_TOTAL_BYTES };

const SNIFF_TO_MIME: Record<EnrollmentSniffKind, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
};

const SAFE_SERVE_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

/** RU: Чи дозволений ключ multipart-файлу заявки. EN: Allowed enrollment multipart file keys. */
export function isEnrollmentUploadFieldKey(key: string): boolean {
  return (
    key === "photo" ||
    key.startsWith("attachment_") ||
    key.startsWith("experience_") ||
    key.startsWith("diploma_") ||
    key.startsWith("certificate_")
  );
}

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

/** RU: Нормалізація client MIME. EN: Normalize browser-declared MIME. */
export function normalizeClientMime(type: string): string {
  const t = type.trim().toLowerCase();
  if (t === "image/jpg") return "image/jpeg";
  return t;
}

/** RU: Канонічний MIME за magic bytes. EN: Canonical MIME from sniffed kind. */
export function canonicalContentTypeFromSniff(sniffed: EnrollmentSniffKind): string {
  return SNIFF_TO_MIME[sniffed];
}

function extMatchesSniff(name: string, sniffed: EnrollmentSniffKind): boolean {
  const lower = name.toLowerCase();
  if (sniffed === "pdf") return /\.pdf$/i.test(lower);
  if (sniffed === "png") return /\.png$/i.test(lower);
  return /\.jpe?g$/i.test(lower);
}

function extOk(name: string, kind: "photo" | "document"): boolean {
  const lower = name.toLowerCase();
  if (kind === "photo") return /\.(jpe?g|png)$/.test(lower);
  return /\.(pdf|jpe?g|png)$/.test(lower);
}

/**
 * RU: MIME для відповіді адмін-проксі: лише безпечні типи; HTML/SVG ніколи.
 * EN: Safe Content-Type for admin proxy; never HTML/SVG.
 */
export function safeServeContentType(
  storedContentType: string | null | undefined,
  originalName: string,
): { contentType: string; allowInline: boolean } {
  const stored = normalizeClientMime(storedContentType || "");
  if (SAFE_SERVE_TYPES.has(stored)) {
    return { contentType: stored, allowInline: true };
  }
  // Legacy bad rows (e.g. text/html + .pdf): trust extension only for safe remap.
  const lower = originalName.toLowerCase();
  if (/\.pdf$/i.test(lower)) return { contentType: "application/pdf", allowInline: true };
  if (/\.png$/i.test(lower)) return { contentType: "image/png", allowInline: true };
  if (/\.jpe?g$/i.test(lower)) return { contentType: "image/jpeg", allowInline: true };
  return { contentType: "application/octet-stream", allowInline: false };
}

/** RU: Сигнатура файла (magic bytes). EN: Sniff file signature. */
export async function sniffEnrollmentFileKind(
  file: File,
): Promise<EnrollmentSniffKind | null> {
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

/** RU: Перевірка розміру/розширення (без MIME-довіри до клієнта). EN: Size/extension checks. */
export function validateEnrollmentFile(
  file: File,
  kind: "photo" | "document",
): string | null {
  const max = kind === "photo" ? PHOTO_MAX_BYTES : DOC_MAX_BYTES;
  if (file.size <= 0 || file.size > max) return "too_large";
  if (!extOk(file.name, kind)) return "bad_type";
  return null;
}

/**
 * RU: Повна перевірка: magic + узгодженість імені/MIME з sniff; тип зберігаємо лише з sniff.
 * EN: Strict check — sniff wins; reject MIME/name mismatches.
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
  if (!extMatchesSniff(file.name, sniffed)) return "bad_type";

  const client = normalizeClientMime(file.type || "");
  if (client) {
    const expected = canonicalContentTypeFromSniff(sniffed);
    if (client !== expected) return "bad_type";
    const allowed = kind === "photo" ? ALLOWED_PHOTO_TYPES : ALLOWED_DOC_TYPES;
    if (!allowed.has(client) && !allowed.has(file.type)) return "bad_type";
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
  const sniffed = await sniffEnrollmentFileKind(file);
  if (!sniffed) throw new Error("bad_signature");
  const contentType = canonicalContentTypeFromSniff(sniffed);
  const access = blobAccessForWrite();
  const pathname = `enrollment/${applicationPublicId}/${fieldKey}-${createPublicId("APP").slice(4)}-${safeFileName(file.name)}`;
  const result = await put(pathname, file, {
    access,
    token,
    contentType,
    addRandomSuffix: false,
  });
  return {
    fieldKey,
    originalName: file.name,
    pathname: result.pathname,
    contentType,
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
