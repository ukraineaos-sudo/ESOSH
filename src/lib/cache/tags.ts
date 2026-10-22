import { revalidateTag } from "next/cache";

/** RU: Теги Data Cache для публічних читань Neon. EN: Data Cache tags for public Neon reads. */
export const CACHE_TAGS = {
  siteContacts: "site-contacts",
  membersPublicStats: "members-public-stats",
  cmsPages: "cms-pages",
  cmsNews: "cms-news",
  cmsLeadership: "cms-leadership",
  cmsCourses: "cms-courses",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/**
 * RU: Скинути тег після успішного write (Route Handler).
 * EN: Bust tag after a successful write (Route Handler).
 * Next 16: revalidateTag вимагає profile / { expire }.
 */
export function bustTag(tag: CacheTag): void {
  revalidateTag(tag, { expire: 0 });
}

/** RU: Скинути кілька тегів. EN: Bust several tags. */
export function bustTags(...tags: CacheTag[]): void {
  for (const tag of tags) bustTag(tag);
}
