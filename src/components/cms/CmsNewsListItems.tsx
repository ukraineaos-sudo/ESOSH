import { listPublishedCmsNews } from "@/lib/cms/public";

/** RU: Карточки CMS-новостей поверх legacy-листинга. EN: CMS news cards prepended to legacy listing. */
export async function CmsNewsListItems({ locale }: { locale: "uk" | "en" }) {
  const posts = await listPublishedCmsNews(locale);
  if (posts.length === 0) return null;
  const prefix = locale === "en" ? "/en" : "";
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
                {post.publishedAt
                  ? post.publishedAt.toLocaleDateString(locale === "en" ? "en-GB" : "uk-UA")
                  : ""}
              </div>
            </div>
          </a>
        </div>
      ))}
    </>
  );
}
