import { count, desc, inArray } from "drizzle-orm";
import { AdminShell } from "@/components/admin/AdminShell";
import { MembersAdminClient } from "@/components/admin/MembersAdminClient";
import {
  collectIndustryFacets,
  computeMemberRegistryStats,
  readMemberProfileSlice,
  readPayloadProfileSlice,
  type MemberRegistryItem,
} from "@/lib/admin/member-registry";
import { getDb } from "@/db";
import { applications, members } from "@/db/schema";

/** RU: Реєстр учасників зі статистикою. EN: Members registry with stats. */
export default async function AdminMembersPage() {
  let items: MemberRegistryItem[] = [];
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(members).orderBy(desc(members.createdAt)).limit(500);
      const ids = rows.map((row) => row.id);
      const linkedMap = new Map<number, number>();
      const latestPayloadByMember = new Map<number, unknown>();
      if (ids.length > 0) {
        const linkedRows = await db
          .select({
            memberId: applications.memberId,
            value: count(),
          })
          .from(applications)
          .where(inArray(applications.memberId, ids))
          .groupBy(applications.memberId);
        for (const row of linkedRows) {
          if (row.memberId != null) linkedMap.set(row.memberId, Number(row.value));
        }
        const appRows = await db
          .select({
            memberId: applications.memberId,
            payload: applications.payload,
            createdAt: applications.createdAt,
          })
          .from(applications)
          .where(inArray(applications.memberId, ids))
          .orderBy(desc(applications.createdAt));
        for (const row of appRows) {
          if (row.memberId == null) continue;
          if (!latestPayloadByMember.has(row.memberId)) {
            latestPayloadByMember.set(row.memberId, row.payload);
          }
        }
      }
      items = rows.map((row) => {
        const fromProfile = readMemberProfileSlice(row.profile);
        const fromPayload = readPayloadProfileSlice(latestPayloadByMember.get(row.id));
        return {
          id: row.id,
          publicId: row.publicId,
          firstName: row.firstName,
          lastName: row.lastName,
          primaryEmail: row.primaryEmail,
          secondaryEmail: row.secondaryEmail,
          phone: row.phone,
          status: row.status,
          level: row.level,
          linkedApplications: linkedMap.get(row.id) ?? 0,
          jobTitle: fromProfile.jobTitle || fromPayload.jobTitle,
          organization: fromProfile.organization || fromPayload.organization,
          industry: fromProfile.industry || fromPayload.industry,
          companySize: fromProfile.companySize || fromPayload.companySize,
          oshYears: fromProfile.oshYears ?? fromPayload.oshYears,
          oshFunctions: fromProfile.oshFunctions ?? fromPayload.oshFunctions,
          country: fromProfile.country || fromPayload.country,
          city: fromProfile.city || fromPayload.city,
        };
      });
    } catch {
      items = [];
    }
  }

  const stats = computeMemberRegistryStats(items);
  const industries = collectIndustryFacets(items);

  return (
    <AdminShell title="Члени" pathname="/admin/members">
      <div className="admin-panel">
        <MembersAdminClient
          initialItems={items}
          initialStats={stats}
          initialIndustries={industries}
        />
      </div>
    </AdminShell>
  );
}
