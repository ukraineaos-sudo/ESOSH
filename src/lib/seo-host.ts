/**
 * RU: Хости, які не мають потрапляти в пошукову видачу (preview / Vercel default).
 * EN: Hosts that must stay out of search indexes (preview / default Vercel).
 */
export function shouldBlockSearchIndexing(hostname: string): boolean {
  const host = hostname.toLowerCase().split(":")[0]?.trim() ?? "";
  if (!host) return true;
  if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") return true;
  if (host.endsWith(".vercel.app")) return true;
  if (process.env.VERCEL_ENV === "preview") return true;
  return false;
}
