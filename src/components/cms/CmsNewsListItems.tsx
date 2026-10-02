import { listPublishedCmsNews } from "@/lib/cms/public";
import { LOCALE_BCP47, localePathPrefix, type AppLocale } from "@/lib/locale";

type Props = {
  locale: AppLocale;
  /** Max cards (homepage usually 3). */
  limit?: number;
  /** When true and feed empty — show a short empty hint. */
  showEmpty?: boolean;
};

const EMPTY_HINT: Record<AppLocale, string> = {
  uk: "Поки немає опублікованих новин.",
  en: "No published news yet.",
  de: "Noch keine veröffentlichten Neuigkeiten.",
  es: "Aún no hay noticias publicadas.",
  fr: "Aucune actualité publiée pour le moment.",
  az: "Hələ dərc olunmuş xəbər yoxdur.",
  kk: "Әзірге жарияланған жаңалықтар жоқ.",
};

function formatNewsDate(value: Date | string | null | undefined, locale: AppLocale): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(LOCALE_BCP47[locale]);
}

/** RU: Карточки опубликованных CMS-новостей. EN: Published CMS news cards. */
export async function CmsNewsListItems({ locale, limit, showEmpty = false }: Props) {
  const posts = await listPublishedCmsNews(locale, { limit });
  const prefix = localePathPrefix(locale);

  if (posts.length === 0) {
    if (!showEmpty) return null;
    return (
      <div role="listitem" className="collection-item w-dyn-item">
        <p className="regular-m is--grey-20">{EMPTY_HINT[locale]}</p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <div key={post.id} role="listitem" className="collection-item w-dyn-item">
          <a href={`${prefix}/news/${post.slug}`} className="collection-link-wrapper w-inline-block">
            <div className="collection-image-wrapper is--height-240--t-360--m-240 is--margin-bottom-20--m-16 is--overflow-hidden">
              {post.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  loading="lazy"
                  alt={post.title}
                  src={post.coverUrl}
                  className="collection-image"
                  width={1200}
                  height={675}
                  decoding="async"
                />
              ) : (
                <div className="collection-image" style={{ background: "#e8eef8", minHeight: 240 }} />
              )}
            </div>
            <div className="collection-text-wrapper is--max-width-408--a-664 is--padding-right-24--m-0">
              <h3 className="h3 is--margin-bottom-12">{post.title}</h3>
              <div className="regular-xs is--grey-20">
                {formatNewsDate(post.publishedAt, locale)}
              </div>
            </div>
          </a>
        </div>
      ))}
    </>
  );
}
