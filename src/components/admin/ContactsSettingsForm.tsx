"use client";

import { FormEvent, useState } from "react";
import type { ContactSettings } from "@/lib/site-settings";

/** RU: Редактор контактов сайта. EN: Site contacts settings form. */
export function ContactsSettingsForm({ initial }: { initial: ContactSettings }) {
  const [settings, setSettings] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const response = await fetch("/api/admin/settings/contacts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setPending(false);
    setMessage(response.ok ? "Збережено." : "Помилка збереження.");
  }

  return (
    <form className="admin-form" style={{ maxWidth: 640 }} onSubmit={onSubmit}>
      <label>
        Email
        <input
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
        />
      </label>
      <label>
        Телефон 1 (відображення)
        <input
          value={settings.phones[0]?.display || ""}
          onChange={(e) =>
            setSettings({
              ...settings,
              phones: [
                { display: e.target.value, href: settings.phones[0]?.href || "" },
                settings.phones[1] || { display: "", href: "" },
              ],
            })
          }
        />
      </label>
      <label>
        Телефон 1 (tel:)
        <input
          value={settings.phones[0]?.href || ""}
          onChange={(e) =>
            setSettings({
              ...settings,
              phones: [
                { display: settings.phones[0]?.display || "", href: e.target.value },
                settings.phones[1] || { display: "", href: "" },
              ],
            })
          }
        />
      </label>
      <label>
        Телефон 2 (відображення)
        <input
          value={settings.phones[1]?.display || ""}
          onChange={(e) =>
            setSettings({
              ...settings,
              phones: [
                settings.phones[0] || { display: "", href: "" },
                { display: e.target.value, href: settings.phones[1]?.href || "" },
              ],
            })
          }
        />
      </label>
      <label>
        Телефон 2 (tel:)
        <input
          value={settings.phones[1]?.href || ""}
          onChange={(e) =>
            setSettings({
              ...settings,
              phones: [
                settings.phones[0] || { display: "", href: "" },
                { display: settings.phones[1]?.display || "", href: e.target.value },
              ],
            })
          }
        />
      </label>
      <label>
        Адреса UK
        <textarea
          value={settings.addressUk}
          onChange={(e) => setSettings({ ...settings, addressUk: e.target.value })}
        />
      </label>
      <label>
        Address EN
        <textarea
          value={settings.addressEn}
          onChange={(e) => setSettings({ ...settings, addressEn: e.target.value })}
        />
      </label>
      <label>
        Facebook
        <input
          value={settings.social.facebook}
          onChange={(e) =>
            setSettings({
              ...settings,
              social: { ...settings.social, facebook: e.target.value },
            })
          }
        />
      </label>
      <label>
        LinkedIn
        <input
          value={settings.social.linkedin}
          onChange={(e) =>
            setSettings({
              ...settings,
              social: { ...settings.social, linkedin: e.target.value },
            })
          }
        />
      </label>
      <label>
        YouTube
        <input
          value={settings.social.youtube}
          onChange={(e) =>
            setSettings({
              ...settings,
              social: { ...settings.social, youtube: e.target.value },
            })
          }
        />
      </label>
      <label>
        Telegram
        <input
          value={settings.social.telegram}
          onChange={(e) =>
            setSettings({
              ...settings,
              social: { ...settings.social, telegram: e.target.value },
            })
          }
        />
      </label>
      <label>
        Instagram
        <input
          value={settings.social.instagram}
          onChange={(e) =>
            setSettings({
              ...settings,
              social: { ...settings.social, instagram: e.target.value },
            })
          }
        />
      </label>
      <label>
        Knowledge base Drive
        <input
          value={settings.knowledgeBaseDrive}
          onChange={(e) =>
            setSettings({ ...settings, knowledgeBaseDrive: e.target.value })
          }
        />
      </label>
      {message ? (
        <p className={message.includes("Помилка") ? "admin-error" : "admin-ok"}>
          {message}
        </p>
      ) : null}
      <button className="admin-btn" type="submit" disabled={pending}>
        {pending ? "Збереження…" : "Зберегти"}
      </button>
    </form>
  );
}
