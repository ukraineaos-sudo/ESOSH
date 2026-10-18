import { getJoinedMembersBreakdown } from "@/lib/members/public-stats";
import type { PublicCountryCode } from "@/lib/members/public-stats";
import { LEVEL_CODES, LEVEL_LABELS_UK, type LevelCode } from "@/lib/enrollment/levels";
import { LOCALE_BCP47, localePathPrefix, type AppLocale } from "@/lib/locale";

type Props = {
  locale: AppLocale;
};

type Copy = {
  title: string;
  captionLine1: string;
  captionLine2: string;
  cta: string;
  levelsTitle: string;
  countriesTitle: string;
  levels: Record<LevelCode, string>;
  countries: Record<PublicCountryCode, string>;
};

const LEVEL_LABELS_EN: Record<LevelCode, string> = {
  diplomate: "Diplomate expert",
  certified: "Certified expert",
  accredited: "Accredited specialist",
  specialist: "Specialist",
  community: "Community member without a confirmed professional level",
};

const COPY: Record<AppLocale, Copy> = {
  uk: {
    title: "Вже з ESOSH",
    captionLine1: "тих, хто вже приєднався",
    captionLine2: "до спільноти",
    cta: "Доєднатися",
    levelsTitle: "За категоріями",
    countriesTitle: "За країнами",
    levels: LEVEL_LABELS_UK,
    countries: {
      UA: "Україна",
      PL: "Польща",
      DE: "Німеччина",
      GB: "Велика Британія",
      US: "США",
      AZ: "Азербайджан",
      KZ: "Казахстан",
      TR: "Туреччина",
      RO: "Румунія",
      MD: "Молдова",
      OTHER: "Інші країни",
    },
  },
  en: {
    title: "Already with ESOSH",
    captionLine1: "people who have joined",
    captionLine2: "the community",
    cta: "Join us",
    levelsTitle: "By category",
    countriesTitle: "By country",
    levels: LEVEL_LABELS_EN,
    countries: {
      UA: "Ukraine",
      PL: "Poland",
      DE: "Germany",
      GB: "United Kingdom",
      US: "United States",
      AZ: "Azerbaijan",
      KZ: "Kazakhstan",
      TR: "Turkey",
      RO: "Romania",
      MD: "Moldova",
      OTHER: "Other countries",
    },
  },
  de: {
    title: "Bereits bei ESOSH",
    captionLine1: "Menschen, die der Gemeinschaft",
    captionLine2: "beigetreten sind",
    cta: "Mitmachen",
    levelsTitle: "Nach Kategorie",
    countriesTitle: "Nach Land",
    levels: {
      diplomate: "Diplomierter Experte",
      certified: "Zertifizierter Experte",
      accredited: "Akkreditierter Spezialist",
      specialist: "Fachkraft",
      community: "Gemeinschaftsmitglied ohne bestätigte Stufe",
    },
    countries: {
      UA: "Ukraine",
      PL: "Polen",
      DE: "Deutschland",
      GB: "Vereinigtes Königreich",
      US: "USA",
      AZ: "Aserbaidschan",
      KZ: "Kasachstan",
      TR: "Türkei",
      RO: "Rumänien",
      MD: "Moldau",
      OTHER: "Andere Länder",
    },
  },
  es: {
    title: "Ya con ESOSH",
    captionLine1: "personas que se han unido",
    captionLine2: "a la comunidad",
    cta: "Únase",
    levelsTitle: "Por categoría",
    countriesTitle: "Por país",
    levels: {
      diplomate: "Experto diplomado",
      certified: "Experto certificado",
      accredited: "Especialista acreditado",
      specialist: "Especialista",
      community: "Miembro de la comunidad sin nivel confirmado",
    },
    countries: {
      UA: "Ucrania",
      PL: "Polonia",
      DE: "Alemania",
      GB: "Reino Unido",
      US: "EE. UU.",
      AZ: "Azerbaiyán",
      KZ: "Kazajistán",
      TR: "Turquía",
      RO: "Rumanía",
      MD: "Moldavia",
      OTHER: "Otros países",
    },
  },
  fr: {
    title: "Déjà avec ESOSH",
    captionLine1: "personnes qui ont rejoint",
    captionLine2: "la communauté",
    cta: "Rejoindre",
    levelsTitle: "Par catégorie",
    countriesTitle: "Par pays",
    levels: {
      diplomate: "Expert diplômé",
      certified: "Expert certifié",
      accredited: "Spécialiste accrédité",
      specialist: "Spécialiste",
      community: "Membre de la communauté sans niveau confirmé",
    },
    countries: {
      UA: "Ukraine",
      PL: "Pologne",
      DE: "Allemagne",
      GB: "Royaume-Uni",
      US: "États-Unis",
      AZ: "Azerbaïdjan",
      KZ: "Kazakhstan",
      TR: "Turquie",
      RO: "Roumanie",
      MD: "Moldavie",
      OTHER: "Autres pays",
    },
  },
  az: {
    title: "Artıq ESOSH ilə",
    captionLine1: "icmaya qoşulmuş",
    captionLine2: "insanlar",
    cta: "Qoşulun",
    levelsTitle: "Kateqoriya üzrə",
    countriesTitle: "Ölkə üzrə",
    levels: {
      diplomate: "Diplomlu ekspert",
      certified: "Sertifikatlı ekspert",
      accredited: "Akkreditə olunmuş mütəxəssis",
      specialist: "Mütəxəssis",
      community: "Təsdiqlənmiş səviyyəsi olmayan icma üzvü",
    },
    countries: {
      UA: "Ukrayna",
      PL: "Polşa",
      DE: "Almaniya",
      GB: "Böyük Britaniya",
      US: "ABŞ",
      AZ: "Azərbaycan",
      KZ: "Qazaxıstan",
      TR: "Türkiyə",
      RO: "Rumıniya",
      MD: "Moldova",
      OTHER: "Digər ölkələr",
    },
  },
  kk: {
    title: "ESOSH-пен бірге",
    captionLine1: "қауымдастыққа қосылған",
    captionLine2: "адамдар",
    cta: "Қосылу",
    levelsTitle: "Санат бойынша",
    countriesTitle: "Ел бойынша",
    levels: {
      diplomate: "Дипломды сарапшы",
      certified: "Сертификатталған сарапшы",
      accredited: "Аккредиттелген маман",
      specialist: "Маман",
      community: "Расталған деңгейі жоқ қауымдастық мүшесі",
    },
    countries: {
      UA: "Украина",
      PL: "Польша",
      DE: "Германия",
      GB: "Ұлыбритания",
      US: "АҚШ",
      AZ: "Әзербайжан",
      KZ: "Қазақстан",
      TR: "Түркия",
      RO: "Румыния",
      MD: "Молдова",
      OTHER: "Басқа елдер",
    },
  },
};

function formatCount(value: number | null | undefined, locale: AppLocale): string {
  return Number(value ?? 0).toLocaleString(LOCALE_BCP47[locale]);
}

function barWidth(part: number, total: number): string {
  if (total <= 0 || part <= 0) return "0%";
  return `${Math.max(4, Math.round((part / total) * 100))}%`;
}

/** RU: Лічильник прийнятих членів на головній (total / рівні / країни). EN: Homepage members breakdown. */
export async function HomeMembersStat({ locale }: Props) {
  const data = await getJoinedMembersBreakdown();
  if (data === null) return null;

  const prefix = localePathPrefix(locale);
  const copy = COPY[locale];
  const { total, levels, countries } = data;

  // Public list: professional levels only (no community / “без рівня”).
  const publicLevelCodes = LEVEL_CODES.filter((code) => code !== "community");
  const levelRows = publicLevelCodes.map((code) => {
    const found = levels.find((row) => row.code === code);
    return { code, count: found?.count ?? 0 };
  });

  return (
    <section
      className="section is--margin-top-144--t-128--m-104 home-members-stat"
      aria-label={copy.title}
    >
      <div className="w-layout-blockcontainer container w-container">
        <div className="home-members-stat__grid">
          <div className="home-members-stat__col home-members-stat__col--total">
            <p className="home-members-stat__eyebrow">{copy.title}</p>
            <p className="home-members-stat__number">{formatCount(total, locale)}</p>
            <p className="regular-l home-members-stat__caption">
              <span className="home-members-stat__caption-line">{copy.captionLine1}</span>
              <span className="home-members-stat__caption-line">{copy.captionLine2}</span>
            </p>
            <a href={`${prefix}/join/apply`} className="btn is--primary w-button home-members-stat__cta">
              {copy.cta}
            </a>
          </div>

          <div className="home-members-stat__col" aria-label={copy.levelsTitle}>
            <ul className="home-members-stat__bars">
              {levelRows.map((row) => (
                <li key={row.code}>
                  <div className="home-members-stat__bar-meta">
                    <span>{copy.levels[row.code]}</span>
                    <span>{formatCount(row.count, locale)}</span>
                  </div>
                  <div className="home-members-stat__bar-track" aria-hidden="true">
                    <div
                      className={
                        row.code === "specialist"
                          ? "home-members-stat__bar-fill"
                          : "home-members-stat__bar-fill home-members-stat__bar-fill--muted"
                      }
                      style={{ width: barWidth(row.count, total) }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="home-members-stat__col" aria-label={copy.countriesTitle}>
            <ul className="home-members-stat__countries">
              {countries.map((row) => (
                <li key={row.code}>
                  <span>{copy.countries[row.code]}</span>
                  <span>{formatCount(row.count, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
