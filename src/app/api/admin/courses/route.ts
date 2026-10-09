import { NextResponse } from "next/server";
import { and, asc, eq, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { educationCourses } from "@/db/schema";
import { canEditContent, getAdminSession, passwordChangeRequiredResponse } from "@/lib/admin/auth";
import { normalizeCourseSlug } from "@/lib/cms/course-slug";
import { assertSameOrigin } from "@/lib/http/same-origin";

async function ensureUniqueSlug(
  db: NonNullable<ReturnType<typeof getDb>>,
  desired: string,
  excludeId?: number,
): Promise<string> {
  let candidate = desired;
  for (let i = 0; i < 50; i++) {
    const rows = await db
      .select({ id: educationCourses.id })
      .from(educationCourses)
      .where(
        excludeId
          ? and(eq(educationCourses.slug, candidate), ne(educationCourses.id, excludeId))
          : eq(educationCourses.slug, candidate),
      )
      .limit(1);
    if (!rows[0]) return candidate;
    candidate = `${desired}-${i + 2}`;
  }
  return `${desired}-${Date.now().toString(36)}`;
}

function parseCourseBody(body: Record<string, unknown>) {
  const titleUk = String(body.titleUk || "").trim();
  const titleEn = String(body.titleEn || "").trim();
  if (!titleUk && !titleEn) return null;
  // Slug is system-managed: client may send existing slug on update; otherwise from title.
  const slugRaw = String(body.slug || "").trim();
  return {
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    slug: normalizeCourseSlug(slugRaw || titleUk || titleEn, titleUk || titleEn),
    imageUrl: String(body.imageUrl || "").trim(),
    levelUk: String(body.levelUk || "").trim(),
    levelEn: String(body.levelEn || "").trim(),
    titleUk,
    titleEn,
    descriptionUk: String(body.descriptionUk || "").trim(),
    descriptionEn: String(body.descriptionEn || "").trim(),
    descriptionExtraUk: String(body.descriptionExtraUk || "").trim(),
    descriptionExtraEn: String(body.descriptionExtraEn || "").trim(),
    ctaUrl: String(body.ctaUrl || "").trim(),
    ctaLabelUk: String(body.ctaLabelUk || "").trim(),
    ctaLabelEn: String(body.ctaLabelEn || "").trim(),
    status: body.status === "draft" ? "draft" : "published",
  } as const;
}

/** RU: Список курсів каталогу. EN: List education course cards. */
export async function GET() {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const items = await db
    .select()
    .from(educationCourses)
    .orderBy(asc(educationCourses.sortOrder), asc(educationCourses.id));
  return NextResponse.json({ ok: true, items });
}

/** RU: Створити курс. EN: Create education course card. */
export async function POST(request: Request) {
  const originBlock = assertSameOrigin(request);
  if (originBlock) return originBlock;
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const passwordBlock = passwordChangeRequiredResponse(user);
  if (passwordBlock) return passwordBlock;
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const parsed = parseCourseBody(body);
  if (!parsed) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  const maxRows = await db
    .select({ sortOrder: educationCourses.sortOrder })
    .from(educationCourses)
    .orderBy(asc(educationCourses.sortOrder))
    .limit(500);
  const nextOrder =
    maxRows.length === 0 ? 0 : Math.max(...maxRows.map((r) => r.sortOrder)) + 1;

  const slug = await ensureUniqueSlug(db, parsed.slug);

  try {
    const [row] = await db
      .insert(educationCourses)
      .values({
        ...parsed,
        slug,
        sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : nextOrder,
      })
      .returning();
    return NextResponse.json({ ok: true, item: row });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("education_courses_slug_uidx") || message.includes("duplicate")) {
      return NextResponse.json({ ok: false, error: "slug_taken" }, { status: 409 });
    }
    throw err;
  }
}

/** RU: Оновити курс. EN: Update education course card. */
export async function PUT(request: Request) {
  const originBlock = assertSameOrigin(request);
  if (originBlock) return originBlock;
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const passwordBlock = passwordChangeRequiredResponse(user);
  if (passwordBlock) return passwordBlock;
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const id = Number(body.id);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const parsed = parseCourseBody(body);
  if (!parsed) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  const slug = await ensureUniqueSlug(db, parsed.slug, id);

  try {
    const [row] = await db
      .update(educationCourses)
      .set({ ...parsed, slug, updatedAt: new Date() })
      .where(eq(educationCourses.id, id))
      .returning();

    if (!row) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true, item: row });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("education_courses_slug_uidx") || message.includes("duplicate")) {
      return NextResponse.json({ ok: false, error: "slug_taken" }, { status: 409 });
    }
    throw err;
  }
}
