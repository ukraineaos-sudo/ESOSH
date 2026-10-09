import type { ReactNode } from "react";
import { RichTextWithLinks } from "@/components/cms/RichTextWithLinks";
import { Link } from "@/i18n/navigation";
import {
  listPublishedEducationCourses,
  type EducationCourseCard,
} from "@/lib/cms/education-courses";
import type { AppLocale } from "@/lib/locale";

const SECTION_TITLE: Record<AppLocale, string> = {
  uk: "Наші курси",
  en: "Our courses",
  de: "Unsere Kurse",
  es: "Nuestros cursos",
  fr: "Nos cours",
  az: "Kurslarımız",
  kk: "Біздің курстарымыз",
};

const LEARN_MORE: Record<AppLocale, string> = {
  uk: "Дізнатися більше",
  en: "Learn more",
  de: "Mehr erfahren",
  es: "Saber más",
  fr: "En savoir plus",
  az: "Ətraflı",
  kk: "Толығырақ",
};

function pickText(locale: AppLocale, uk: string, en: string, fallback = ""): string {
  if (locale === "uk") return uk || en || fallback;
  return en || uk || fallback;
}

function chipClass(level: string): string {
  const lower = level.toLowerCase();
  if (
    lower.includes("поглиб") ||
    lower.includes("advanced") ||
    lower.includes("depth") ||
    lower.includes("expert")
  ) {
    return "chips is--purple";
  }
  return "chips is--green";
}

function Description({ text }: { text: string }) {
  if (!text.trim()) return null;
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <div>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="paragraph-2"
          style={{ whiteSpace: "pre-line", marginTop: index > 0 ? 12 : undefined }}
        >
          <RichTextWithLinks text={paragraph} />
        </p>
      ))}
    </div>
  );
}

function CourseCard({
  course,
  locale,
}: {
  course: EducationCourseCard;
  locale: AppLocale;
}) {
  const title = pickText(locale, course.titleUk, course.titleEn);
  const level = pickText(locale, course.levelUk, course.levelEn);
  const description = pickText(locale, course.descriptionUk, course.descriptionEn);
  const learnMore = LEARN_MORE[locale];
  const href = course.slug ? `/education/courses/${course.slug}` : "/education/courses";

  return (
    <div className="wrapper is--course">
      {course.imageUrl ? (
        <div className="course-image-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.imageUrl}
            loading="lazy"
            alt=""
            className="course-image"
            width={640}
            height={420}
            decoding="async"
          />
        </div>
      ) : null}
      <div className="course-content">
        {level ? (
          <div className={chipClass(level)}>
            <div className="medium-xs">{level}</div>
          </div>
        ) : null}
        <h3 className="h3 is--max-width-440">
          <strong>{title}</strong>
        </h3>
        <Description text={description} />
        <Link
          href={href}
          className="btn is--primary w-button"
          style={{ marginTop: 16, display: "inline-block" }}
        >
          {learnMore}
        </Link>
      </div>
    </div>
  );
}

type Props = {
  locale: AppLocale;
  /** Legacy grid markup when Neon has no published courses. */
  children?: ReactNode;
};

/**
 * RU: Сітка «Наші курси» з Neon або legacy children.
 * EN: Courses grid from Neon or legacy children fallback.
 */
export async function CoursesCatalogSection({ locale, children }: Props) {
  const fromDb = await listPublishedEducationCourses();
  const title = SECTION_TITLE[locale];

  if (fromDb.length === 0) {
    return <>{children}</>;
  }

  return (
    <section className="section is--margin-top-144--t-128--m-104 is--margin-bottom-144--t-128--m-104">
      <div className="w-layout-blockcontainer container w-container">
        <h2 className="h2 is--margin-bottom-40">{title}</h2>
        <div className="w-layout-grid is--courses-grid">
          {fromDb.map((course) => (
            <CourseCard key={course.id} course={course} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
