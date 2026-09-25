import { AdminShell } from "@/components/admin/AdminShell";
import { ContactsSettingsForm } from "@/components/admin/ContactsSettingsForm";
import { getContactSettings } from "@/lib/site-settings";

/** RU: Настройки контактов. EN: Contacts settings room. */
export default async function AdminContactsPage() {
  const settings = await getContactSettings();
  return (
    <AdminShell title="Контакти сайту" pathname="/admin/settings/contacts">
      <div className="admin-panel">
        <ContactsSettingsForm initial={settings} />
      </div>
    </AdminShell>
  );
}
