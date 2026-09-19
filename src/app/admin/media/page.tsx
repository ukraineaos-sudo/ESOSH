import { AdminShell } from "@/components/admin/AdminShell";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { getDb } from "@/db";
import { mediaAssets } from "@/db/schema";
import { desc } from "drizzle-orm";

/** RU: Комната медиа. EN: Media room. */
export default async function AdminMediaPage() {
  const db = getDb();
  let initialItems: {
    id: number;
    url: string;
    alt: string;
    contentType: string | null;
    sizeBytes: number | null;
  }[] = [];
  if (db) {
    try {
      initialItems = await db
        .select({
          id: mediaAssets.id,
          url: mediaAssets.url,
          alt: mediaAssets.alt,
          contentType: mediaAssets.contentType,
          sizeBytes: mediaAssets.sizeBytes,
        })
        .from(mediaAssets)
        .orderBy(desc(mediaAssets.createdAt))
        .limit(200);
    } catch {
      initialItems = [];
    }
  }

  return (
    <AdminShell title="Медіа" pathname="/admin/media">
      <MediaLibrary initialItems={initialItems} />
    </AdminShell>
  );
}
