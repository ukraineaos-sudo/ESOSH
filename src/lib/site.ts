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

export const ROUTES = {
  home: "/",
  about: "/about-esosh",
  businesses: "/businesses",
  contact: "/contact-us",
  news: "/news",
  courses: "/education/courses",
  projects: "/education/projects",
  joinEnrollment: "/join/enrollment",
  joinParticipation: "/join/participation",
  joinApply: "/join/apply",
  joinCodex: "/join/codex",
  joinTerms: "/join/terms",
  joinPractices: "/join/safety-league-best-practices",
} as const;
