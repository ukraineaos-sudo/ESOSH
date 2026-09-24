import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  applicationEvents,
  applicationFiles,
  applications,
} from "@/db/schema";
import { classifyEnrollment } from "@/lib/enrollment/classify";
import {
  deleteEnrollmentBlobs,
  putEnrollmentBlob,
  validateEnrollmentFile,
} from "@/lib/enrollment/files";
import { createPublicId } from "@/lib/enrollment/ids";
import { CONSENT_VERSION, LEVEL_LABELS_UK, type LevelCode } from "@/lib/enrollment/levels";
import { upsertMemberFromEnrollment } from "@/lib/enrollment/members";
import { deliverEnrollmentNotify } from "@/lib/enrollment/notify";
import { CODEX_QUIZ_VERSION, scoreCodexQuiz } from "@/lib/enrollment/quiz";
import { enrollmentPayloadSchema } from "@/lib/enrollment/schema";

export const runtime = "nodejs";

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; message?: string; cause?: { code?: string } };
  return (
    e.code === "23505" ||
    e.cause?.code === "23505" ||
    (typeof e.message === "string" && /unique|duplicate|idempotency/i.test(e.message))
  );
}

function levelLabel(code: string | null | undefined): string {
  if (!code) return "";
  return LEVEL_LABELS_UK[code as LevelCode] || code;
}

/** RU: Приймає заявку на вступ (multipart). EN: Accept enrollment application multipart. */
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ ok: false, error: "invalid_origin" }, { status: 403 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ ok: false, error: "blob_unavailable" }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_form" }, { status: 400 });
  }

  const rawPayload = form.get("payload");
  if (typeof rawPayload !== "string" || rawPayload.length > 200_000) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawPayload);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = enrollmentPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_fields", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (parsed.data.company?.trim()) {
    return NextResponse.json({ ok: true, honeypot: true });
  }

  const existing = await db
    .select({
      id: applications.id,
      publicId: applications.publicId,
      autoLevel: applications.autoLevel,
      status: applications.status,
    })
    .from(applications)
    .where(eq(applications.idempotencyKey, parsed.data.idempotencyKey))
    .limit(1);

  if (existing[0]) {
    return NextResponse.json({
      ok: true,
      duplicate: true,
      applicationPublicId: existing[0].publicId,
      autoLevel: existing[0].autoLevel,
      autoLevelLabelUk: levelLabel(existing[0].autoLevel),
      status: existing[0].status,
    });
  }

  const testScore = scoreCodexQuiz(parsed.data.testAnswers);
  const classification = classifyEnrollment({
    oshFunctions: parsed.data.oshFunctions,
    oshYears: parsed.data.oshYears,
    companySize: parsed.data.companySize,
    profileEducation: parsed.data.profileEducation,
    educationLevel: parsed.data.educationLevel,
    courses: parsed.data.courses,
    cpdStatus: parsed.data.cpdStatus,
    testScorePercent: testScore,
  });

  const applicationPublicId = createPublicId("APP");

  type PendingFile = { key: string; file: File; kind: "photo" | "document" };
  const pending: PendingFile[] = [];

  const photo = form.get("photo");
  if (photo instanceof File && photo.size > 0) {
    pending.push({ key: "photo", file: photo, kind: "photo" });
  }
  for (const [key, value] of form.entries()) {
    if (!(value instanceof File) || value.size <= 0) continue;
    if (key === "photo" || key === "payload") continue;
    if (
      !key.startsWith("experience_") &&
      !key.startsWith("diploma_") &&
      !key.startsWith("certificate_")
    ) {
      continue;
    }
    pending.push({ key, file: value, kind: "document" });
  }

  for (const item of pending) {
    const err = validateEnrollmentFile(item.file, item.kind);
    if (err) {
      return NextResponse.json({ ok: false, error: err, field: item.key }, { status: 400 });
    }
  }

  for (let i = 0; i < parsed.data.courses.length; i++) {
    const course = parsed.data.courses[i];
    if (course.courseType === "other") continue;
    const hasCert = pending.some((f) => f.key.startsWith(`certificate_${i}_`));
    if (!hasCert) {
      return NextResponse.json(
        { ok: false, error: "certificate_required", courseIndex: i },
        { status: 400 },
      );
    }
  }

  const storedFiles: {
    fieldKey: string;
    originalName: string;
    pathname: string;
    contentType: string;
    sizeBytes: number;
  }[] = [];

  try {
    for (const item of pending) {
      storedFiles.push(await putEnrollmentBlob(applicationPublicId, item.key, item.file));
    }
  } catch {
    await deleteEnrollmentBlobs(storedFiles.map((f) => f.pathname));
    return NextResponse.json({ ok: false, error: "blob_unavailable" }, { status: 503 });
  }

  const { company: _honeypot, testAnswers: _answers, idempotencyKey, ...safePayload } = parsed.data;
  void _honeypot;
  void _answers;

  let member: { memberId: number; publicId: string; created: boolean };
  let app: typeof applications.$inferSelect;

  try {
    // neon-http: інтерактивних TX немає — послідовні записи + cleanup Blob при помилці.
    member = await upsertMemberFromEnrollment(db, parsed.data, {
      country: parsed.data.country,
      city: parsed.data.city,
      middleName: parsed.data.middleName || null,
      lastApplicationId: applicationPublicId,
    });

    const [createdApp] = await db
      .insert(applications)
      .values({
        publicId: applicationPublicId,
        memberId: member.memberId,
        locale: parsed.data.locale,
        status: "new",
        autoLevel: classification.level,
        requiresManualReview: classification.requiresManualReview,
        autoLevelRules: {
          matchedRules: classification.matchedRules,
          criteria: classification.criteria,
          nextLevelHintUk: classification.nextLevelHintUk,
          quizVersion: CODEX_QUIZ_VERSION,
        },
        payload: {
          ...safePayload,
          classificationLabelUk: classification.labelUk,
        },
        consentVersion: CONSENT_VERSION,
        testScore,
        testPassedAt: testScore >= 100 ? new Date() : null,
        idempotencyKey,
      })
      .returning();
    app = createdApp;

    if (storedFiles.length > 0) {
      await db.insert(applicationFiles).values(
        storedFiles.map((f) => ({
          applicationId: app.id,
          fieldKey: f.fieldKey,
          originalName: f.originalName,
          pathname: f.pathname,
          contentType: f.contentType,
          sizeBytes: f.sizeBytes,
          reviewStatus: "pending",
        })),
      );
    }

    await db.insert(applicationEvents).values({
      applicationId: app.id,
      actorType: "system",
      eventType: "submitted",
      message: "Заявку подано кандидатом",
      meta: {
        autoLevel: classification.level,
        testScore,
        fileCount: storedFiles.length,
      },
    });
  } catch (error) {
    await deleteEnrollmentBlobs(storedFiles.map((f) => f.pathname));
    if (error instanceof Error && error.message === "email_conflict") {
      return NextResponse.json({ ok: false, error: "email_conflict" }, { status: 409 });
    }
    if (isUniqueViolation(error)) {
      const again = await db
        .select({
          publicId: applications.publicId,
          autoLevel: applications.autoLevel,
          status: applications.status,
        })
        .from(applications)
        .where(eq(applications.idempotencyKey, parsed.data.idempotencyKey))
        .limit(1);
      if (again[0]) {
        return NextResponse.json({
          ok: true,
          duplicate: true,
          applicationPublicId: again[0].publicId,
          autoLevel: again[0].autoLevel,
          autoLevelLabelUk: levelLabel(again[0].autoLevel),
          status: again[0].status,
        });
      }
    }
    throw error;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const fullName = `${parsed.data.lastName} ${parsed.data.firstName}`.trim();
  const notifyBase = {
    applicationPublicId: app.publicId,
    memberPublicId: member.publicId,
    email: parsed.data.email,
    fullName,
    organization: parsed.data.organization || undefined,
    autoLevel: classification.level,
    autoLevelLabelUk: classification.labelUk,
    locale: parsed.data.locale,
  } as const;

  await Promise.all([
    deliverEnrollmentNotify({ type: "application_submitted", to: "candidate", ...notifyBase }),
    deliverEnrollmentNotify({
      type: "application_submitted",
      to: "admin",
      ...notifyBase,
      adminUrl: `${siteUrl}/admin/applications/${app.id}`,
    }),
  ]);

  return NextResponse.json({
    ok: true,
    applicationPublicId: app.publicId,
    memberPublicId: member.publicId,
    autoLevel: classification.level,
    autoLevelLabelUk: classification.labelUk,
    requiresManualReview: classification.requiresManualReview,
    criteria: classification.criteria,
    nextLevelHintUk: classification.nextLevelHintUk,
    testScore,
  });
}
