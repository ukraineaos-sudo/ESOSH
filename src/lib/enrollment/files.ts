import { put, get } from "@vercel/blob";
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

/** RU: access Blob: private лише якщо ENROLLMENT_BLOB_ACCESS=private. EN: Default public store-compatible. */
function blobAccess(): "public" | "private" {
  return process.env.ENROLLMENT_BLOB_ACCESS === "private" ? "private" : "public";
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
    const name = file.name.toLowerCase();
    const okExt =
      kind === "photo"
        ? /\.(jpe?g|png)$/.test(name)
        : /\.(pdf|jpe?g|png)$/.test(name);
    if (!okExt) return "bad_type";
  }
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
  const pathname = `enrollment/${applicationPublicId}/${fieldKey}-${createPublicId("APP").slice(4)}-${safeFileName(file.name)}`;
  const result = await put(pathname, file, {
    access: blobAccess(),
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
  return get(pathname, { access: blobAccess(), token });
}
