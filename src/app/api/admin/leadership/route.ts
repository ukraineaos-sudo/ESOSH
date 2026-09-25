import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { leadershipPeople } from "@/db/schema";
import { canEditContent, getAdminSession, passwordChangeRequiredResponse } from "@/lib/admin/auth";

/** RU: Список керівного складу. EN: List leadership people. */
export async function GET() {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const items = await db
    .select()
    .from(leadershipPeople)
    .orderBy(asc(leadershipPeople.sortOrder), asc(leadershipPeople.id));
  return NextResponse.json({ ok: true, items });
}

/** RU: Створити картку. EN: Create leadership card. */
export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const passwordBlock = passwordChangeRequiredResponse(user);
  if (passwordBlock) return passwordBlock;
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

  const body = await request.json();
  const nameUk = String(body.nameUk || "").trim();
  const nameEn = String(body.nameEn || "").trim();
  if (!nameUk && !nameEn) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const maxRows = await db
    .select({ sortOrder: leadershipPeople.sortOrder })
    .from(leadershipPeople)
    .orderBy(asc(leadershipPeople.sortOrder))
    .limit(500);
  const nextOrder =
    maxRows.length === 0 ? 0 : Math.max(...maxRows.map((r) => r.sortOrder)) + 1;

  const [row] = await db
    .insert(leadershipPeople)
    .values({
      sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : nextOrder,
      photoUrl: String(body.photoUrl || ""),
      photoClass: String(body.photoClass || ""),
      nameUk,
      nameEn,
      roleUk: String(body.roleUk || ""),
      roleEn: String(body.roleEn || ""),
      status: body.status === "draft" ? "draft" : "published",
    })
    .returning();
  return NextResponse.json({ ok: true, item: row });
}

/** RU: Оновити картку. EN: Update leadership card. */
export async function PUT(request: Request) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) return NextResponse.json({ ok: false }, { status: 401 });
  const passwordBlock = passwordChangeRequiredResponse(user);
  if (passwordBlock) return passwordBlock;
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

  const body = await request.json();
  const id = Number(body.id);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  const nameUk = String(body.nameUk || "").trim();
  const nameEn = String(body.nameEn || "").trim();
  if (!nameUk && !nameEn) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const [row] = await db
    .update(leadershipPeople)
    .set({
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      photoUrl: String(body.photoUrl || ""),
      photoClass: String(body.photoClass || ""),
      nameUk,
      nameEn,
      roleUk: String(body.roleUk || ""),
      roleEn: String(body.roleEn || ""),
      status: body.status === "draft" ? "draft" : "published",
      updatedAt: new Date(),
    })
    .where(eq(leadershipPeople.id, id))
    .returning();

  if (!row) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true, item: row });
}
