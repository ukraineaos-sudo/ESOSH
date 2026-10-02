import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CmsBlocksView } from "@/components/cms/CmsBlocksView";
import type { CmsNewsDoc } from "@/lib/cms/public";
import { LOCALE_BCP47, localePathPrefix, type AppLocale, isAppLocale } from "@/lib/locale";

function formatNewsDate(value: Date | string | null | undefined, uiLocale: string): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const bcp47 = isAppLocale(uiLocale) ? LOCALE_BCP47[uiLocale] : "uk-UA";
  return d.toLocaleDateString(bcp47);
}

const BACK_LABEL: Record<AppLocale, string> = {
  uk: "Новини",
  en: "News",
  de: "Neuigkeiten",
  es: "Noticias",
  fr: "Actualités",
  az: "Xəbərlər",
  kk: "Жаңалықтар",
};

const DRAFT_BANNER: Record<AppLocale, string> = {
  uk: "Перегляд чернетки (не на сайті)",
  en: "Preview — draft (not on site)",
  de: "Vorschau — Entwurf (nicht auf der Website)",
  es: "Vista previa — borrador (no publicado)",
  fr: "Aperçu — brouillon (non publié)",
  az: "Önizləmə — qaralama (saytda yoxdur)",
  kk: "Алдын ала қарау — нобай (сайтта жоқ)",
};

/** RU: Публічна стаття CMS (текст uk; chrome за UI-локаллю). EN: CMS news article. */
export function CmsNewsArticle({
  post,
  uiLocale = "uk",
  draftBanner,
}: {
  post: CmsNewsDoc;
  /** UI locale for back-link / date / draft banner (content stays Ukrainian). */
  uiLocale?: string;
  draftBanner?: boolean;
}) {
  const locale: AppLocale = isAppLocale(uiLocale) ? uiLocale : "uk";
  const prefix = localePathPrefix(locale);
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
          {DRAFT_BANNER[locale]}
        </div>
      ) : null}
      <section className="section is--section-spacing">
        <div className="w-layout-blockcontainer container w-container">
          <a className="regular-l is--margin-bottom-24" href={`${prefix}/news`}>
            ← {BACK_LABEL[locale]}
          </a>
          <h1 className="h1 is--margin-bottom-24">{post.title}</h1>
          {formatNewsDate(post.publishedAt, locale) ? (
            <div className="regular-xs is--grey-20 is--margin-bottom-32">
              {formatNewsDate(post.publishedAt, locale)}
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
