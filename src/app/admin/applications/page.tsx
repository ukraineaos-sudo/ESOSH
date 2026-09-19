import { AdminShell } from "@/components/admin/AdminShell";
import { ApplicationsAdminClient } from "@/components/admin/ApplicationsAdminClient";
import { getDb } from "@/db";
import { applications, members } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

/** RU: Реєстр заявок на вступ. EN: Enrollment applications registry. */
export default async function AdminApplicationsPage() {
  let items: {
    id: number;
    publicId: string;
    status: string;
    autoLevel: string | null;
    approvedLevel: string | null;
    requiresManualReview: boolean;
    createdAt: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    organization: string | null;
    industry: string | null;
  }[] = [];

  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select({
          id: applications.id,
          publicId: applications.publicId,
          status: applications.status,
          autoLevel: applications.autoLevel,
          approvedLevel: applications.approvedLevel,
          requiresManualReview: applications.requiresManualReview,
          createdAt: applications.createdAt,
          firstName: members.firstName,
          lastName: members.lastName,
          email: members.primaryEmail,
          organization: sql<string>`${applications.payload}->>'organization'`,
          industry: sql<string>`${applications.payload}->>'industry'`,
        })
        .from(applications)
        .leftJoin(members, eq(applications.memberId, members.id))
        .orderBy(desc(applications.createdAt))
        .limit(200);
      items = rows.map((r) => ({
        ...r,
        createdAt: r.createdAt?.toISOString?.() || "",
        requiresManualReview: Boolean(r.requiresManualReview),
      }));
    } catch {
      items = [];
    }
  }

  return (
    <AdminShell title="Заявки" pathname="/admin/applications">
      <div className="admin-panel">
        <ApplicationsAdminClient initialItems={items} />
      </div>
    </AdminShell>
  );
}
