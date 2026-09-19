import type { ContactPayload } from "../contact";

/** RU: Доставляет обращение настроенному обработчику. EN: Deliver a contact request to the configured webhook. */
export async function deliverContact(payload: ContactPayload): Promise<"delivered" | "unavailable" | "failed"> {
  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) return "unavailable";
  try {
    const { name, email, message, locale } = payload;
    const response = await fetch(endpoint, {
      method: "POST", headers: { "Content-Type": "application/json", ...(process.env.CONTACT_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` } : {}) },
      body: JSON.stringify({ name, email, message, locale }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    return response.ok ? "delivered" : "failed";
  } catch { return "failed"; }
}
