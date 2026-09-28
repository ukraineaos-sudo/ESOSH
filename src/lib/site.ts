export const SITE = {
  name: "ESOSH",
  email: "office@esosh.net",
  phones: [
    { display: "+38 (050) 441-99-36", href: "tel:+380504419936" },
    { display: "+38 (097) 172-20-78", href: "tel:+380971722078" },
  ],
  social: {
    facebook: "https://www.facebook.com/groups/esosh",
    linkedin:
      "https://www.linkedin.com/company/esosh-the-european-society-of-occupational-safety-health/",
    youtube: "https://www.youtube.com/@esosh7814",
    telegram: "https://web.telegram.org/k/#@esosh_info",
    instagram: "https://www.instagram.com/esosh_ukraine/",
  },
  knowledgeBaseDrive:
    "https://drive.google.com/drive/u/0/folders/1KPpnjR_MbWzw8G-0jxoyKRU_ld7rs_OD",
} as const;

/**
 * RU: Базовий URL для deep-link в адмінку (листи Brevo).
 * Поки www.esosh.net ще на старому хостингу — не підставляти його в /admin/*.
 * EN: Base URL for admin deep links in Brevo emails (avoid legacy esosh.net until cutover).
 */
export function resolveAdminOrigin(request: Request): string {
  const requestOrigin = new URL(request.url).origin;
  if (/localhost|127\.0\.0\.1/i.test(requestOrigin)) {
    return requestOrigin;
  }

  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) {
    try {
      const host = new URL(configured).hostname.replace(/^www\./, "");
      // Legacy Webflow/marketing host until DNS points to this Next app.
      if (host === "esosh.net") {
        return "https://esosh.vercel.app";
      }
      return configured;
    } catch {
      /* fall through */
    }
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return requestOrigin;
}

export const ROUTES = {
  home: "/",
  about: "/about-esosh",
  businesses: "/businesses",
  contact: "/contact-us",
  news: "/news",
  courses: "/education/courses",
  projects: "/education/projects",
  trainings: "/education/trainings",
  joinEnrollment: "/join/enrollment",
  joinParticipation: "/join/participation",
  joinApply: "/join/apply",
  joinCodex: "/join/codex",
  joinTerms: "/join/terms",
  joinPractices: "/join/safety-league-best-practices",
} as const;
