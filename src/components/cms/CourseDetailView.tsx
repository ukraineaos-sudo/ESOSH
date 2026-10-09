import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RichTextWithLinks } from "@/components/cms/RichTextWithLinks";
import { Link } from "@/i18n/navigation";
import type { EducationCourseCard } from "@/lib/cms/education-courses";
import type { AppLocale } from "@/lib/locale";

const BACK: Record<AppLocale, string> = {
  uk: "Наші курси",
  en: "Our courses",
  de: "Unsere Kurse",
  es: "Nuestros cursos",
  fr: "Nos cours",
  az: "Kurslarımız",
  kk: "Біздің курстарымыз",
};

function pickText(locale: AppLocale, uk: string, en: string, fallback = ""): string {
  if (locale === "uk") return uk || en || fallback;
  return en || uk || fallback;
}

function chipClass(level: string): string {
  const lower = level.toLowerCase();
  if (lower.includes("поглиб") || lower.includes("advanced")) return "chips is--purple";
  return "chips is--green";
}

function TextBlock({ text, className }: { text: string; className: string }) {
  if (!text.trim()) return null;
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="is--max-width-720" style={{ marginTop: 24 }}>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={className}
          style={{ whiteSpace: "pre-line", marginTop: index > 0 ? 16 : undefined }}
        >
          <RichTextWithLinks text={paragraph} />
        </p>
      ))}
    </div>
  );
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url.trim());
}

/** RU: Сторінка курсу з каталогу. EN: Education course detail page. */
export function CourseDetailView({
  locale,
  course,
}: {
  locale: AppLocale;
  course: EducationCourseCard;
}) {
  const title = pickText(locale, course.titleUk, course.titleEn);
  const level = pickText(locale, course.levelUk, course.levelEn);
  const primary = pickText(locale, course.descriptionUk, course.descriptionEn);
  const extra = pickText(locale, course.descriptionExtraUk, course.descriptionExtraEn);
  const ctaLabel = pickText(locale, course.ctaLabelUk, course.ctaLabelEn, "Записатися");
  const ctaUrl = course.ctaUrl.trim();
  const external = isExternalUrl(ctaUrl);

  return (
    <>
      <section className="section is--height-100vh--a-auto is--internal-hero">
        <Header />
        <div className="wrapper is--accent-light-bg is--position-relative is--grow">
          <div className="wrapper is--hero-internal-layout">
            <div className="wrapper is--hero-internal-text">
              <div className="w-layout-blockcontainer container is--w-100p w-container">
                <div className="wrapper is--hero-internal-text-wrapper">
                  <div className="wrapper is--max-width-720">
                    <p className="medium-xs is--margin-bottom-16">
                      <Link href="/education/courses" className="is--accent">
                        {BACK[locale]}
                      </Link>
                    </p>
                    <h1 className="h1">
                      <span className="is--accent">{title}</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section is--margin-top-144--t-128--m-104 is--margin-bottom-144--t-128--m-104">
        <div className="w-layout-blockcontainer container w-container">
          {level ? (
            <div
              className={`${chipClass(level)} cms-course-detail__chip`}
              style={{ marginBottom: 16 }}
            >
              <div className="cms-course-card__chip-label">{level}</div>
            </div>
          ) : null}
          {course.imageUrl ? (
            <div className="cms-course-detail__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.imageUrl}
                alt=""
                className="cms-course-detail__image"
                width={960}
                height={540}
                decoding="async"
              />
            </div>
          ) : null}
          <TextBlock text={primary} className="regular-l" />
          <TextBlock text={extra} className="regular-l" />
          {external ? (
            <p style={{ marginTop: 32 }}>
              <a
                href={ctaUrl}
                className="btn is--primary w-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ctaLabel}
              </a>
            </p>
          ) : null}
        </div>
      </section>
      <Footer />
    </>
  );
}
