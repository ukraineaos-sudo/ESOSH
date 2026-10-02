import { NextResponse } from "next/server";
import { getTrainingBySlug, verifyTrainingPassToken } from "@/lib/trainings/score";
import { resolveLocaleDoc } from "@/lib/docs";
import { pickLocalized } from "@/content/trainings/types";
import { isAppLocale } from "@/lib/locale";
import type { LocaleCode } from "@/content/trainings/types";

type Ctx = { params: Promise<{ slug: string }> };

/** RU: Видача PDF сертифіката лише з валідним токеном. EN: Certificate PDF only with pass token. */
export async function GET(request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const training = getTrainingBySlug(slug);
  if (!training) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  if (!verifyTrainingPassToken(slug, token)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const localeRaw = url.searchParams.get("locale") || "uk";
  const locale: LocaleCode = isAppLocale(localeRaw) ? localeRaw : "uk";
  const resolution = training.certificateDocId
    ? resolveLocaleDoc(training.certificateDocId, locale)
    : null;
  const href =
    resolution?.status === "available"
      ? resolution.href
      : pickLocalized(training.certificatePdf, locale);

  if (!href) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  return NextResponse.redirect(new URL(href, request.url), 303);
}
