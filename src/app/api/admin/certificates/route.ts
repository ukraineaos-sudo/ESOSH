import { NextResponse } from "next/server";
import { z } from "zod";
import {
  canManageRegistry,
  getAdminSession,
  passwordChangeRequiredResponse,
} from "@/lib/admin/auth";
import { isAdminDeleteConfirm } from "@/lib/admin/confirm-delete";
import {
  deleteAdminCertificates,
  listAdminCertificateCourseStats,
  listAdminCertificates,
} from "@/lib/admin/training-certificates";
import { assertSameOrigin } from "@/lib/http/same-origin";

/** RU: Список сертифікатів + агрегати по курсах. EN: Certificate list + course aggregates. */
export async function GET(request: Request) {
  const user = await getAdminSession();
  if (!user || !canManageRegistry(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const url = new URL(request.url);
  const courseCode = url.searchParams.get("courseCode") || undefined;
  const q = url.searchParams.get("q") || undefined;

  const [items, courses] = await Promise.all([
    listAdminCertificates({ courseCode, q }),
    listAdminCertificateCourseStats(),
  ]);

  if (!items || !courses) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, items, courses });
}

const deleteBodySchema = z.object({
  confirm: z.string(),
  mode: z.enum(["one", "course", "all"]),
  id: z.number().int().positive().optional(),
  courseCode: z.string().min(1).max(16).optional(),
});

/**
 * RU: Видалення сертифікатів (один / курс / усі). Лічильники номерів не змінюємо.
 * EN: Delete certificates (one / course / all). Sequence counters untouched.
 */
export async function DELETE(request: Request) {
  const originBlock = assertSameOrigin(request);
  if (originBlock) return originBlock;

  const user = await getAdminSession();
  if (!user || !canManageRegistry(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const passwordBlock = passwordChangeRequiredResponse(user);
  if (passwordBlock) return passwordBlock;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const parsed = deleteBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  if (!isAdminDeleteConfirm(parsed.data.confirm)) {
    return NextResponse.json({ ok: false, error: "confirm_required" }, { status: 400 });
  }

  const result = await deleteAdminCertificates({
    mode: parsed.data.mode,
    id: parsed.data.id,
    courseCode: parsed.data.courseCode,
  });

  if ("error" in result) {
    const status =
      result.error === "unavailable" ? 503 : result.error === "not_found" ? 404 : 400;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json({ ok: true, deleted: result.deleted });
}
