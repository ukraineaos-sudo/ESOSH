import { countJoinedMembers } from "@/lib/members/public-stats";
import { LOCALE_BCP47, localePathPrefix, type AppLocale } from "@/lib/locale";

type Props = {
  locale: AppLocale;
};

const COPY: Record<
  AppLocale,
  { title: string; caption: string; cta: string }
> = {
  uk: {
    title: "Вже з ESOSH",
    caption: "тих, хто вже приєднався до спільноти",
    cta: "Доєднатися",
  },
  en: {
    title: "Already with ESOSH",
    caption: "people who have joined the community",
    cta: "Join us",
  },
  de: {
    title: "Bereits bei ESOSH",
    caption: "Menschen, die der Gemeinschaft beigetreten sind",
    cta: "Mitmachen",
  },
  es: {
    title: "Ya con ESOSH",
    caption: "personas que se han unido a la comunidad",
    cta: "Únase",
  },
  fr: {
    title: "Déjà avec ESOSH",
    caption: "personnes qui ont rejoint la communauté",
    cta: "Rejoindre",
  },
  az: {
    title: "Artıq ESOSH ilə",
    caption: "icmaya qoşulmuş insanlar",
    cta: "Qoşulun",
  },
  kk: {
    title: "ESOSH-пен бірге",
    caption: "қауымдастыққа қосылған адамдар",
    cta: "Қосылу",
  },
};

function formatCount(value: number, locale: AppLocale): string {
  return value.toLocaleString(LOCALE_BCP47[locale]);
}

/** RU: Заготовка лічильника членів на головній. EN: Homepage members-count stub. */
export async function HomeMembersStat({ locale }: Props) {
  const total = await countJoinedMembers();
  if (total === null) return null;

  const prefix = localePathPrefix(locale);
  const { title, caption, cta } = COPY[locale];

  return (
    <section
      className="section is--margin-top-144--t-128--m-104 home-members-stat"
      aria-label={title}
    >
      <div className="w-layout-blockcontainer container w-container">
        <div className="home-members-stat__inner">
          <div className="home-members-stat__copy">
            <p className="home-members-stat__eyebrow">{title}</p>
            <p className="home-members-stat__number">{formatCount(total, locale)}</p>
            <p className="regular-l home-members-stat__caption">{caption}</p>
          </div>
          <a href={`${prefix}/join/apply`} className="btn is--primary w-button">
            {cta}
          </a>
        </div>
      </div>
    </section>
  );
}
