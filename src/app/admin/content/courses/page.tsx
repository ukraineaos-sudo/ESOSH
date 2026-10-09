import { AdminShell } from "@/components/admin/AdminShell";
import { CoursesManager, type EducationCourse } from "@/components/admin/CoursesManager";
import { getDb } from "@/db";
import { educationCourses } from "@/db/schema";
import { asc } from "drizzle-orm";

/** RU: Кімната каталогу курсів. EN: Education courses catalog room. */
export default async function AdminCoursesPage() {
  const db = getDb();
  let initialItems: EducationCourse[] = [];
  if (db) {
    try {
      const rows = await db
        .select()
        .from(educationCourses)
        .orderBy(asc(educationCourses.sortOrder), asc(educationCourses.id));
      initialItems = rows.map((row) => ({
        id: row.id,
        sortOrder: row.sortOrder,
        slug: row.slug || "",
        imageUrl: row.imageUrl || "",
        levelUk: row.levelUk,
        levelEn: row.levelEn,
        titleUk: row.titleUk,
        titleEn: row.titleEn,
        descriptionUk: row.descriptionUk,
        descriptionEn: row.descriptionEn,
        descriptionExtraUk: row.descriptionExtraUk,
        descriptionExtraEn: row.descriptionExtraEn,
        ctaUrl: row.ctaUrl || "",
        ctaLabelUk: row.ctaLabelUk || "",
        ctaLabelEn: row.ctaLabelEn || "",
        status: row.status,
      }));
    } catch {
      initialItems = [];
    }
  }

  return (
    <AdminShell title="Курси" pathname="/admin/content/courses">
      <p className="admin-muted" style={{ marginBottom: 16 }}>
        Каталог «Наші курси»: картка (основний опис) і сторінка «Дізнатися більше» (додатковий опис +
        зовнішнє посилання). Порядок у списку = порядок на сайті. Фото — з «Медіа» (до 4 МБ).
      </p>
      <CoursesManager initialItems={initialItems} />
    </AdminShell>
  );
}
