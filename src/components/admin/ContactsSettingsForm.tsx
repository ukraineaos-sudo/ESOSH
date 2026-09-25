"use client";

import { FormEvent, useState } from "react";
import type { ContactSettings } from "@/lib/site-settings";

type PhonePair = { display: string; href: string };

function ensurePhones(phones: ContactSettings["phones"]): [PhonePair, PhonePair] {
  return [
    phones[0] || { display: "", href: "" },
    phones[1] || { display: "", href: "" },
  ];
}

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
    setMessage(response.ok ? "Збережено — контакти на сайті оновлено." : "Не вдалося зберегти.");
  }

  const [phone1, phone2] = ensurePhones(settings.phones);

  function setPhone(index: 0 | 1, next: PhonePair) {
    const phones = ensurePhones(settings.phones);
    phones[index] = next;
    setSettings({ ...settings, phones: [...phones] });
  }

  return (
    <form className="admin-form" style={{ maxWidth: 640 }} onSubmit={onSubmit}>
      <p className="admin-muted" style={{ marginTop: 0 }}>
        Ці поля зʼявляються у футері та на сторінці «Контакти». Збережіть — і відвідувачі одразу
        бачать нові дані.
      </p>

      <h3 className="admin-section-label" style={{ marginBottom: 8 }}>
        Звʼязок
      </h3>
      <label>
        Електронна пошта
        <input
          type="email"
          autoComplete="email"
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
        />
      </label>

      <label>
        Телефон 1 — як показуємо на сайті
        <input
          value={phone1.display}
          placeholder="+380 …"
          onChange={(e) => setPhone(0, { ...phone1, display: e.target.value })}
        />
      </label>
      <label>
        Телефон 1 — номер для дзвінка
        <input
          value={phone1.href}
          placeholder="tel:+380…"
          onChange={(e) => setPhone(0, { ...phone1, href: e.target.value })}
        />
      </label>
      <p className="admin-muted" style={{ marginTop: -8 }}>
        Для дзвінка з телефону: формат <code>tel:+380XXXXXXXXX</code> (без пробілів).
      </p>

      <label>
        Телефон 2 — як показуємо на сайті
        <input
          value={phone2.display}
          placeholder="+380 …"
          onChange={(e) => setPhone(1, { ...phone2, display: e.target.value })}
        />
      </label>
      <label>
        Телефон 2 — номер для дзвінка
        <input
          value={phone2.href}
          placeholder="tel:+380…"
          onChange={(e) => setPhone(1, { ...phone2, href: e.target.value })}
        />
      </label>

      <h3 className="admin-section-label" style={{ marginBottom: 8, marginTop: 16 }}>
        Адреса
      </h3>
      <label>
        Українською
        <textarea
          value={settings.addressUk}
          onChange={(e) => setSettings({ ...settings, addressUk: e.target.value })}
        />
      </label>
      <label>
        Англійською
        <textarea
          value={settings.addressEn}
          onChange={(e) => setSettings({ ...settings, addressEn: e.target.value })}
        />
      </label>

      <h3 className="admin-section-label" style={{ marginBottom: 8, marginTop: 16 }}>
        Соцмережі та база знань
      </h3>
      <label>
        Facebook — посилання
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
        LinkedIn — посилання
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
        YouTube — посилання
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
        Telegram — посилання
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
        Instagram — посилання
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
        База знань (посилання на Google Drive)
        <input
          value={settings.knowledgeBaseDrive}
          onChange={(e) =>
            setSettings({ ...settings, knowledgeBaseDrive: e.target.value })
          }
        />
      </label>

      {message ? (
        <p className={message.includes("Не вдалося") ? "admin-error" : "admin-ok"}>{message}</p>
      ) : null}
      <button className="admin-btn" type="submit" disabled={pending}>
        {pending ? "Збереження…" : "Зберегти на сайті"}
      </button>
    </form>
  );
}
