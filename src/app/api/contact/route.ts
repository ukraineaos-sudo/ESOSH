import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact";
import { deliverContact } from "@/lib/contact/deliver-contact";

/** RU: Проверяет и передаёт обращение, не имитируя доставку. EN: Validate and deliver without reporting false success. */
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ ok: false, error: "invalid_origin" }, { status: 403 });
  const raw = await request.text();
  if (raw.length > 8192) return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  let json: unknown;
  try { json = JSON.parse(raw); } catch { return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 }); }
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  if (parsed.data.company?.trim()) return NextResponse.json({ ok: true });
  const delivery = await deliverContact(parsed.data);
  if (delivery !== "delivered") return NextResponse.json({ ok: false, error: delivery }, { status: delivery === "unavailable" ? 503 : 502 });
  return NextResponse.json({ ok: true });
}
