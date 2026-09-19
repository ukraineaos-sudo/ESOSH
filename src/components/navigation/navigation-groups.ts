type NavigationItem = { key: string; href: string };
type NavigationGroup = { key: string; href: string; items?: never } | { key: string; href?: never; items: NavigationItem[] };
export const navigationGroups: NavigationGroup[] = [
  { key: "about", href: "/about-esosh" },
  { key: "businesses", href: "/businesses" },
  { key: "join", items: [
    { key: "joinApply", href: "/join/apply" },
    { key: "joinEnrollment", href: "/join/enrollment" },
    { key: "joinParticipation", href: "/join/participation" },
    { key: "joinCodex", href: "/join/codex" },
    { key: "joinTerms", href: "/join/terms" },
    { key: "joinPractices", href: "/join/safety-league-best-practices" },
  ] },
  { key: "education", items: [
    { key: "projects", href: "/education/projects" },
    { key: "courses", href: "/education/courses" },
  ] },
  { key: "news", href: "/news" },
  { key: "contacts", href: "/contact-us" },
];
