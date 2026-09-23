import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  applicationEvents,
  applicationFiles,
  applications,
  members,
} from "@/db/schema";
import { canEditContent, getAdminSession } from "@/lib/admin/auth";
import { isAdminDeleteConfirm } from "@/lib/admin/confirm-delete";
import {
  APPLICATION_STATUSES,
  LEVEL_CODES,
  type ApplicationStatus,
  type LevelCode,
} from "@/lib/enrollment/levels";
import { deleteEnrollmentBlobs } from "@/lib/enrollment/files";
import { deliverEnrollmentNotify } from "@/lib/enrollment/notify";

type Ctx = { params: Promise<{ id: string }> };

/** RU: Картка заявки. EN: Application detail. */
export async function GET(_request: Request, ctx: Ctx) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const { id: idRaw } = await ctx.params;
  const id = Number(idRaw);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  const rows = await db
    .select({
      application: applications,
      member: members,
    })
    .from(applications)
    .leftJoin(members, eq(applications.memberId, members.id))
    .where(eq(applications.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const files = await db
    .select()
    .from(applicationFiles)
    .where(eq(applicationFiles.applicationId, id));
  const events = await db
    .select()
    .from(applicationEvents)
    .where(eq(applicationEvents.applicationId, id));

  return NextResponse.json({
    ok: true,
    item: row.application,
    member: row.member,
    files,
    events,
  });
}

/** RU: Оновлення статусу/рівня/коментаря. EN: Update status/level/comment. */
export async function PATCH(request: Request, ctx: Ctx) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const { id: idRaw } = await ctx.params;
  const id = Number(idRaw);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  let body: {
    status?: string;
    approvedLevel?: string | null;
    adminComment?: string;
    notifyCandidate?: boolean;
    candidateMessage?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const rows = await db
    .select({
      application: applications,
      member: members,
    })
    .from(applications)
    .leftJoin(members, eq(applications.memberId, members.id))
    .where(eq(applications.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const nextStatus = body.status as ApplicationStatus | undefined;
  if (nextStatus && !APPLICATION_STATUSES.includes(nextStatus)) {
    return NextResponse.json({ ok: false, error: "bad_status" }, { status: 400 });
  }

  const nextLevel = body.approvedLevel as LevelCode | null | undefined;
  if (nextLevel !== undefined && nextLevel !== null && !LEVEL_CODES.includes(nextLevel)) {
    return NextResponse.json({ ok: false, error: "bad_level" }, { status: 400 });
  }

  if (
    nextLevel !== undefined &&
    nextLevel !== row.application.autoLevel &&
    !(body.adminComment || row.application.adminComment)?.trim()
  ) {
    return NextResponse.json({ ok: false, error: "comment_required" }, { status: 400 });
  }

  const [updated] = await db
    .update(applications)
    .set({
      status: nextStatus || row.application.status,
      approvedLevel:
        nextLevel === undefined ? row.application.approvedLevel : nextLevel,
      adminComment:
        body.adminComment !== undefined
          ? body.adminComment
          : row.application.adminComment,
      decidedBy: user.id,
      decidedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(applications.id, id))
    .returning();

  if (row.member && (nextStatus === "confirmed" || nextStatus === "confirmed_no_level")) {
    await db
      .update(members)
      .set({
        status: nextStatus === "confirmed" ? "active" : "active_no_level",
        level:
          nextStatus === "confirmed"
            ? updated.approvedLevel || updated.autoLevel
            : "community",
        updatedAt: new Date(),
      })
      .where(eq(members.id, row.member.id));
  }

  await db.insert(applicationEvents).values({
    applicationId: id,
    actorType: "admin",
    actorId: user.id,
    eventType: "updated",
    message: body.candidateMessage || body.adminComment || "Оновлення заявки",
    meta: {
      status: updated.status,
      approvedLevel: updated.approvedLevel,
    },
  });

  if (body.notifyCandidate && row.member?.primaryEmail) {
    await deliverEnrollmentNotify({
      type: "status_changed",
      to: "candidate",
      applicationPublicId: updated.publicId,
      email: row.member.primaryEmail,
      fullName: `${row.member.lastName} ${row.member.firstName}`.trim(),
      status: updated.status,
      approvedLevel: (updated.approvedLevel as LevelCode | null) || null,
      message: body.candidateMessage || undefined,
      locale: (updated.locale as "uk" | "en") || "uk",
    });
  }

  return NextResponse.json({ ok: true, item: updated });
}

/** RU: Видалення заявки (файли/події каскадом; картка члена лишається). EN: Delete application; keep member. */
export async function DELETE(request: Request, ctx: Ctx) {
  const user = await getAdminSession();
  if (!user || !canEditContent(user)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  const { id: idRaw } = await ctx.params;
  const id = Number(idRaw);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  let body: { confirm?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!isAdminDeleteConfirm(body.confirm)) {
    return NextResponse.json({ ok: false, error: "confirm_required" }, { status: 400 });
  }

  const existing = await db
    .select({ id: applications.id })
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);
  if (!existing[0]) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const files = await db
    .select({ pathname: applicationFiles.pathname })
    .from(applicationFiles)
    .where(eq(applicationFiles.applicationId, id));

  await db.delete(applications).where(eq(applications.id, id));
  await deleteEnrollmentBlobs(files.map((f) => f.pathname));

  return NextResponse.json({ ok: true });
}
