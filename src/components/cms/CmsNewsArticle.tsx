import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CmsBlocksView } from "@/components/cms/CmsBlocksView";
import type { CmsNewsDoc } from "@/lib/cms/public";

function formatNewsDate(value: Date | string | null | undefined, locale: string): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "uk-UA");
}

/** RU: Публичная статья CMS. EN: Public CMS news article. */
export function CmsNewsArticle({
  post,
  draftBanner,
}: {
  post: CmsNewsDoc;
  draftBanner?: boolean;
}) {
  const prefix = post.locale === "en" ? "/en" : "";
  return (
    <>
      <Header />
      {draftBanner ? (
        <div
          style={{
            background: "#f59e0b",
            color: "#111",
            textAlign: "center",
            padding: "8px 12px",
            fontWeight: 600,
          }}
        >
          {post.locale === "en" ? "Preview — draft (not on site)" : "Перегляд чернетки (не на сайті)"}
        </div>
      ) : null}
      <section className="section is--section-spacing">
        <div className="w-layout-blockcontainer container w-container">
          <a className="regular-l is--margin-bottom-24" href={`${prefix}/news`}>
            ← {post.locale === "en" ? "News" : "Новини"}
          </a>
          <h1 className="h1 is--margin-bottom-24">{post.title}</h1>
          {formatNewsDate(post.publishedAt, post.locale) ? (
            <div className="regular-xs is--grey-20 is--margin-bottom-32">
              {formatNewsDate(post.publishedAt, post.locale)}
            </div>
          ) : null}
          {post.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="image is--w-100p is--radius-6 is--margin-bottom-40"
              src={post.coverUrl}
              alt={post.title}
              width={1200}
              height={675}
            />
          ) : null}
          {post.excerpt ? <p className="regular-l is--margin-bottom-40">{post.excerpt}</p> : null}
        </div>
      </section>
      <CmsBlocksView blocks={post.body} />
      <Footer />
    </>
  );
}
