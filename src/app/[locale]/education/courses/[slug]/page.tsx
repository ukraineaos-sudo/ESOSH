import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CourseDetailView } from "@/components/cms/CourseDetailView";
import { getPublishedEducationCourseBySlug } from "@/lib/cms/education-courses";
import { isAppLocale } from "@/lib/locale";

export const dynamicParams = true;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/** RU: Метадані сторінки курсу. EN: Course detail metadata. */
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const course = await getPublishedEducationCourseBySlug(slug);
  if (!course) return { title: "Not found" };
  const title =
    locale === "uk"
      ? course.titleUk || course.titleEn
      : course.titleEn || course.titleUk;
  return { title };
}

/** RU: Публічна деталь курсу з Neon. EN: Public course detail from Neon. */
export default async function Page({ params }: Props) {
  const { locale: localeRaw, slug } = await params;
  if (!isAppLocale(localeRaw)) notFound();
  setRequestLocale(localeRaw);

  const course = await getPublishedEducationCourseBySlug(slug);
  if (!course) notFound();

  return <CourseDetailView locale={localeRaw} course={course} />;
}
