import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { ApplicationDetailClient } from "@/components/admin/ApplicationDetailClient";
import { getDb } from "@/db";
import {
  applicationEvents,
  applicationFiles,
  applications,
  members,
} from "@/db/schema";

type Props = { params: Promise<{ id: string }> };

/** RU: Картка заявки. EN: Application detail page. */
export default async function AdminApplicationDetailPage({ params }: Props) {
  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (!Number.isFinite(id)) notFound();

  const db = getDb();
  if (!db) {
    return (
      <AdminShell title="Заявка" pathname="/admin/applications">
        <p className="admin-muted">DATABASE_URL не налаштовано.</p>
      </AdminShell>
    );
  }

  const rows = await db
    .select({ application: applications, member: members })
    .from(applications)
    .leftJoin(members, eq(applications.memberId, members.id))
    .where(eq(applications.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) notFound();

  const files = await db.select().from(applicationFiles).where(eq(applicationFiles.applicationId, id));
  const events = await db
    .select()
    .from(applicationEvents)
    .where(eq(applicationEvents.applicationId, id));

  return (
    <AdminShell title={`Заявка ${row.application.publicId}`} pathname="/admin/applications">
      <ApplicationDetailClient
        id={id}
        application={{
          publicId: row.application.publicId,
          status: row.application.status,
          autoLevel: row.application.autoLevel,
          approvedLevel: row.application.approvedLevel,
          adminComment: row.application.adminComment,
          testScore: row.application.testScore,
          requiresManualReview: row.application.requiresManualReview,
          autoLevelRules: row.application.autoLevelRules,
          payload: (row.application.payload || {}) as Record<string, unknown>,
          createdAt: row.application.createdAt?.toISOString?.() || "",
        }}
        member={
          row.member
            ? {
                publicId: row.member.publicId,
                firstName: row.member.firstName,
                lastName: row.member.lastName,
                primaryEmail: row.member.primaryEmail,
                secondaryEmail: row.member.secondaryEmail,
                phone: row.member.phone,
              }
            : null
        }
        files={files.map((f) => ({
          id: f.id,
          fieldKey: f.fieldKey,
          originalName: f.originalName,
          reviewStatus: f.reviewStatus,
          sizeBytes: f.sizeBytes,
        }))}
        events={events
          .slice()
          .sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0))
          .map((e) => ({
            id: e.id,
            eventType: e.eventType,
            message: e.message,
            createdAt: e.createdAt?.toISOString?.() || "",
            actorType: e.actorType,
          }))}
      />
    </AdminShell>
  );
}
