import { NextResponse } from "next/server";
import { z } from "zod";
import { getTrainingBySlug, verifyTrainingPassToken } from "@/lib/trainings/score";
import {
  findCertificateByDownloadToken,
  isNamedCertificateTraining,
  issueOrGetNamedCertificate,
  renderCertificatePdf,
} from "@/lib/trainings/certificates";
import { normalizeParticipantName } from "@/lib/trainings/certificate-identity";
import { resolveLocaleDoc } from "@/lib/docs";
import { pickLocalized } from "@/content/trainings/types";
import { isAppLocale } from "@/lib/locale";
import type { LocaleCode } from "@/content/trainings/types";
import { assertSameOrigin } from "@/lib/http/same-origin";
import { assertRateLimit } from "@/lib/rate-limit";

type Ctx = { params: Promise<{ slug: string }> };

const issueBodySchema = z.object({
  token: z.string().min(10).max(512),
  participantName: z.string().min(3).max(200).optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

function pdfResponse(bytes: Uint8Array, certificateNumber: string): NextResponse {
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${certificateNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

/**
 * RU: POST — випуск іменованого сертифіката (pass token + ПІБ).
 * EN: POST — issue named certificate (pass token + name).
 */
export async function POST(request: Request, ctx: Ctx) {
  const originBlock = assertSameOrigin(request);
  if (originBlock) return originBlock;

  const rateBlock = await assertRateLimit(request, "training_certificate");
  if (rateBlock) return rateBlock;

  const { slug } = await ctx.params;
  const training = getTrainingBySlug(slug);
  if (!training) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (!isNamedCertificateTraining(training)) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const parsed = issueBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  if (!verifyTrainingPassToken(slug, parsed.data.token)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const combined =
    parsed.data.participantName?.trim() ||
    [parsed.data.lastName, parsed.data.firstName]
      .filter((part): part is string => Boolean(part?.trim()))
      .map((part) => part.trim())
      .join(" ");
  const participantName = normalizeParticipantName(combined);
  if (participantName.length < 3) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }

  const issued = await issueOrGetNamedCertificate({ training, participantName });
  if ("error" in issued) {
    const status = issued.error === "misconfigured" ? 503 : 503;
    return NextResponse.json({ ok: false, error: issued.error }, { status });
  }

  return NextResponse.json({
    ok: true,
    created: issued.created,
    certificateId: issued.row.id,
    certificateNumber: issued.row.certificateNumber,
    downloadToken: issued.row.downloadToken,
    participantName: issued.row.participantName,
    completionDate: issued.row.completionDate,
  });
}

/**
 * RU: GET — PDF за downloadToken (іменований) або static PDF за pass token.
 * EN: GET — PDF by downloadToken (named) or static PDF by pass token.
 */
export async function GET(request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const training = getTrainingBySlug(slug);
  if (!training) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const downloadToken = url.searchParams.get("downloadToken") || "";

  if (downloadToken) {
    const rateBlock = await assertRateLimit(request, "training_certificate");
    if (rateBlock) return rateBlock;

    const row = await findCertificateByDownloadToken(downloadToken);
    if (!row || row.courseSlug !== slug) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
    try {
      const bytes = await renderCertificatePdf(row);
      return pdfResponse(bytes, row.certificateNumber);
    } catch (err) {
      console.error("[trainings/certificate] pdf render failed", {
        slug,
        id: row.id,
        err: err instanceof Error ? err.message : "unknown",
      });
      return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
    }
  }

  // Legacy / non-named: static locale PDF behind short-lived pass token
  const token = url.searchParams.get("token") || "";
  if (!verifyTrainingPassToken(slug, token)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (isNamedCertificateTraining(training)) {
    // Named courses must use POST issue + downloadToken (fail closed — no anonymous blank PDF)
    return NextResponse.json({ ok: false, error: "use_issue" }, { status: 400 });
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
