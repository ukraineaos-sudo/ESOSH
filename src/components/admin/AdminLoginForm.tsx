"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

/** RU: Форма входа в админку. EN: Admin login form. */
export function AdminLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
    });
    setPending(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error === "unavailable" ? "База даних не налаштована (DATABASE_URL)." : "Невірні скринька або пароль.");
      return;
    }
    router.replace(search.get("next") || "/admin");
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <label>Електронна скринька<input name="email" type="email" autoComplete="username" required /></label>
      <label>Пароль<input name="password" type="password" autoComplete="current-password" required /></label>
      {error ? <p className="admin-error">{error}</p> : null}
      <button className="admin-btn" type="submit" disabled={pending}>{pending ? "Вхід…" : "Увійти"}</button>
    </form>
  );
}
