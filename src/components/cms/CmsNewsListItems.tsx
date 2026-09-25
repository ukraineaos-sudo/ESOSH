import { listPublishedCmsNews } from "@/lib/cms/public";

type Props = {
  locale: "uk" | "en";
  /** Max cards (homepage usually 3). */
  limit?: number;
  /** When true and feed empty — show a short empty hint. */
  showEmpty?: boolean;
};

function formatNewsDate(value: Date | string | null | undefined, locale: string): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "uk-UA");
}

/** RU: Карточки опубликованных CMS-новостей. EN: Published CMS news cards. */
export async function CmsNewsListItems({ locale, limit, showEmpty = false }: Props) {
  const posts = await listPublishedCmsNews(locale, { limit });
  const prefix = locale === "en" ? "/en" : "";

  if (posts.length === 0) {
    if (!showEmpty) return null;
    return (
      <div role="listitem" className="collection-item w-dyn-item">
        <p className="regular-m is--grey-20">
          {locale === "en" ? "No published news yet." : "Поки немає опублікованих новин."}
        </p>
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
