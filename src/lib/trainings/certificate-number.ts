/** RU: Формат номера ESOSH-{CODE}-{YEAR}-{######}. EN: Certificate number format helpers. */

const NUMBER_RE = /^ESOSH-([A-Z0-9]{1,16})-(\d{4})-(\d{6})$/;

/** RU: Зібрати номер сертифіката. EN: Build certificate number string. */
export function formatCertificateNumber(
  courseCode: string,
  year: number,
  seq: number,
): string {
  const code = courseCode.trim().toUpperCase();
  if (!code || seq < 1 || seq > 999_999) {
    throw new Error("invalid_certificate_sequence");
  }
  return `ESOSH-${code}-${year}-${String(seq).padStart(6, "0")}`;
}

/** RU: Перевірка формату номера. EN: Validate certificate number shape. */
export function isValidCertificateNumber(value: string): boolean {
  return NUMBER_RE.test(value);
}

export function parseCertificateNumber(
  value: string,
): { courseCode: string; year: number; seq: number } | null {
  const match = NUMBER_RE.exec(value);
  if (!match) return null;
  return {
    courseCode: match[1],
    year: Number(match[2]),
    seq: Number(match[3]),
  };
}
