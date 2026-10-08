/**
 * Admin media upload size limit.
 * Must stay under Vercel serverless request body ~4.5 MB including multipart overhead.
 */
export const ADMIN_MEDIA_MAX_BYTES = 4 * 1024 * 1024;
