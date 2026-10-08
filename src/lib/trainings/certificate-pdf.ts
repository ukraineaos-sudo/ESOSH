import { readFile } from "node:fs/promises";
import path from "node:path";
import * as fontkit from "@pdf-lib/fontkit";
import {
  PDFDocument,
  rgb,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";

export type CertificateModuleLine = { uk: string; en: string };

export type NamedCertificatePayload = {
  participantName: string;
  courseTitleUk: string;
  courseTitleEn: string;
  durationUk: string;
  durationEn: string;
  modules: CertificateModuleLine[];
  completionDate: string;
  certificateNumber: string;
};

const NAVY = rgb(0.05, 0.16, 0.38);
const YELLOW = rgb(1, 0.84, 0.05);
const WHITE = rgb(1, 1, 1);

const A4_LANDSCAPE = { width: 841.89, height: 595.28 };

function assetPath(...parts: string[]): string {
  return path.join(process.cwd(), "public", "assets", "certificate", ...parts);
}

async function loadOptionalImage(
  pdf: PDFDocument,
  filePath: string,
): Promise<PDFImage | null> {
  try {
    const bytes = await readFile(filePath);
    if (filePath.toLowerCase().endsWith(".jpg") || filePath.toLowerCase().endsWith(".jpeg")) {
      return pdf.embedJpg(bytes);
    }
    return pdf.embedPng(bytes);
  } catch {
    return null;
  }
}

function fitFontSize(
  font: PDFFont,
  text: string,
  maxWidth: number,
  maxSize: number,
  minSize: number,
): number {
  let size = maxSize;
  while (size > minSize && font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 0.5;
  }
  return size;
}

function drawCentered(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  y: number,
  color = NAVY,
): void {
  const { width } = page.getSize();
  const textWidth = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: (width - textWidth) / 2,
    y,
    size,
    font,
    color,
  });
}

/**
 * Footer stripe geometry shared by draw + cert-no niche placement.
 * Yellow thickness fixed at bandH/5; left blue = 75% of the former 4× yellow band.
 */
function footerStripeGeometry(bandH: number) {
  const yellowH = bandH / 5;
  const leftH = yellowH + (bandH - yellowH) * 0.75;
  const reducedH = leftH / 3;
  const drop = leftH - reducedH;
  return { yellowH, leftH, reducedH, drop };
}

/**
 * Two solid horizontal stripes (yellow on top of navy), bottom-aligned in the band zone.
 * Left ~2/3: yellow unchanged, blue 25% thinner than the prior 4× stack. Then 30° diagonal
 * cut down-right; right third continues at ~1/3 left-stack height — yellow thickness
 * unchanged, blue thinned. pdf-lib drawSvgPath uses SVG Y-down; origin is TOP-LEFT of the
 * left stack.
 */
function drawBottomDecoration(
  page: PDFPage,
  innerLeft: number,
  innerBottom: number,
  innerWidth: number,
  bandH: number,
): void {
  const w = innerWidth;
  const { yellowH, leftH, drop } = footerStripeGeometry(bandH);
  const originY = innerBottom + leftH;
  // Horizontal run of a 30° down-right cut
  const diagW = drop / Math.tan((30 * Math.PI) / 180);
  const cutX = w * (2 / 3);
  const cutEndX = Math.min(cutX + diagW, w * 0.92);

  // Blue (bottom layer): full → thinned after diagonal
  page.drawSvgPath(
    [
      `M 0 ${yellowH}`,
      `L ${cutX} ${yellowH}`,
      `L ${cutEndX} ${drop + yellowH}`,
      `L ${w} ${drop + yellowH}`,
      `L ${w} ${leftH}`,
      `L 0 ${leftH}`,
      "Z",
    ].join(" "),
    { x: innerLeft, y: originY, color: NAVY },
  );
  // Yellow (top layer): constant thickness across the full width
  page.drawSvgPath(
    [
      "M 0 0",
      `L ${cutX} 0`,
      `L ${cutEndX} ${drop}`,
      `L ${w} ${drop}`,
      `L ${w} ${drop + yellowH}`,
      `L ${cutEndX} ${drop + yellowH}`,
      `L ${cutX} ${yellowH}`,
      `L 0 ${yellowH}`,
      "Z",
    ].join(" "),
    { x: innerLeft, y: originY, color: YELLOW },
  );
}

/**
 * RU: A4 landscape PDF сертифіката (близько до ТЗ, не pixel-perfect).
 * EN: A4 landscape certificate PDF close to TZ, not pixel-perfect.
 */
export async function buildNamedCertificatePdf(
  payload: NamedCertificatePayload,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const page = pdf.addPage([A4_LANDSCAPE.width, A4_LANDSCAPE.height]);
  const { width, height } = page.getSize();

  const [regularBytes, boldBytes] = await Promise.all([
    readFile(assetPath("fonts", "NotoSans-Regular.ttf")),
    readFile(assetPath("fonts", "NotoSans-Bold.ttf")),
  ]);
  const font = await pdf.embedFont(regularBytes, { subset: true });
  const fontBold = await pdf.embedFont(boldBytes, { subset: true });

  // Outer white margin + navy frame (TZ ~12–18 mm / 4–6 mm)
  const margin = 28;
  const frame = 14;
  const innerLeft = margin + frame;
  const innerBottom = margin + frame;
  const innerRight = width - margin - frame;
  const innerTop = height - margin - frame;
  const innerWidth = innerRight - innerLeft;

  // Flag band ~10–12% of page height (frees vertical room for body text)
  const bandH = Math.round(height * 0.105);

  page.drawRectangle({ x: 0, y: 0, width, height, color: WHITE });
  drawBottomDecoration(page, innerLeft, innerBottom, innerWidth, bandH);

  page.drawRectangle({
    x: margin,
    y: margin,
    width: width - margin * 2,
    height: height - margin * 2,
    borderColor: NAVY,
    borderWidth: frame,
  });

  // Narrow side padding so text fills the frame width
  const sidePad = 10;
  const contentWidth = innerWidth - sidePad * 2;
  const contentLeft = innerLeft + sidePad;

  // Footer: date left / signature right above band; cert no. in right niche above thinned stripes
  const footerGapAboveBand = 18;
  const sigH = 62;
  const { leftH: leftStackH, reducedH: reducedBandH } = footerStripeGeometry(bandH);
  const metaY = innerBottom + leftStackH + footerGapAboveBand + 12;
  const nicheTop = innerBottom + leftStackH;
  const nicheBottom = innerBottom + reducedBandH;
  // Baseline for cert no. value — sits in the freed white space above the lower-right stripes
  const nicheValueY = nicheBottom + (nicheTop - nicheBottom) * 0.28;
  // payload.modules may be present for DB snapshots; intentionally not drawn.

  /**
   * pdf-lib y is the text baseline; Noto Sans ink box is ~1.35× size.
   * `cursor` is the next available TOP of ink — reserve full line box so lines never overlap.
   */
  let cursor = innerTop - 4;
  const lineBox = (size: number) => size * 1.36;

  const placeLine = (
    text: string,
    usedFont: PDFFont,
    size: number,
    gapAfter: number,
    color = NAVY,
  ): number => {
    const box = lineBox(size);
    // Ascender dominates (~80% of the ink box for Noto Sans)
    const baseline = cursor - box * 0.8;
    drawCentered(page, text, usedFont, size, baseline, color);
    cursor = baseline - box * 0.2 - gapAfter;
    return baseline;
  };

  const logo =
    (await loadOptionalImage(pdf, assetPath("esosh-logo.png"))) ??
    (await loadOptionalImage(
      pdf,
      path.join(process.cwd(), "public", "images", "certificates", "esosh-crest.png"),
    ));
  if (logo) {
    const maxLogoW = width * 0.165;
    const maxLogoH = 78;
    const scale = Math.min(maxLogoW / logo.width, maxLogoH / logo.height);
    const logoW = logo.width * scale;
    const logoH = logo.height * scale;
    page.drawImage(logo, {
      x: (width - logoW) / 2,
      y: cursor - logoH,
      width: logoW,
      height: logoH,
    });
    cursor -= logoH + 4;
  } else {
    placeLine("ESOSH LOGO", fontBold, 12, 6);
  }

  const orgEn = "THE EUROPEAN SOCIETY OF OCCUPATIONAL SAFETY AND HEALTH";
  const orgUk = "ЄВРОПЕЙСЬКЕ СПІВТОВАРИСТВО З ОХОРОНИ ПРАЦІ";
  const orgEnSize = fitFontSize(fontBold, orgEn, contentWidth, 10.5, 8);
  placeLine(orgEn, fontBold, orgEnSize, 1.5);
  const orgUkSize = fitFontSize(fontBold, orgUk, contentWidth, 10.5, 8);
  placeLine(orgUk, fontBold, orgUkSize, 10);

  const certEn = "CERTIFICATE OF COMPLETION";
  const certUk = "СЕРТИФІКАТ ПРО ПРОХОДЖЕННЯ КУРСУ";
  const certEnSize = fitFontSize(fontBold, certEn, contentWidth, 22, 14);
  placeLine(certEn, fontBold, certEnSize, 1.5);
  const certUkSize = fitFontSize(fontBold, certUk, contentWidth, 15.5, 10);
  placeLine(certUk, fontBold, certUkSize, 12);

  // certify-that → name → completed → course titles (fixed gaps, no overlap)
  placeLine("This is to certify that / Цим засвідчується, що", font, 9.5, 7);

  const nameSize = fitFontSize(
    fontBold,
    payload.participantName,
    contentWidth * 0.96,
    24,
    13,
  );
  const nameBaseline = placeLine(payload.participantName, fontBold, nameSize, 0);
  const nameWidth = fontBold.widthOfTextAtSize(payload.participantName, nameSize);
  const underlineW = Math.max(nameWidth, contentWidth * 0.45);
  page.drawLine({
    start: { x: (width - underlineW) / 2, y: nameBaseline - 3.5 },
    end: { x: (width + underlineW) / 2, y: nameBaseline - 3.5 },
    thickness: 1.1,
    color: NAVY,
  });
  cursor = nameBaseline - 3.5 - 12;

  placeLine(
    "has successfully completed the training course and passed the final assessment",
    font,
    9,
    2.5,
  );
  placeLine(
    "успішно пройшов(ла) навчальний курс та склав(ла) підсумкове оцінювання",
    font,
    9,
    14,
  );

  const titleUkSize = fitFontSize(
    fontBold,
    payload.courseTitleUk,
    contentWidth * 0.98,
    14.5,
    9.5,
  );
  placeLine(payload.courseTitleUk, fontBold, titleUkSize, 2.5);
  const titleEnSize = fitFontSize(
    fontBold,
    payload.courseTitleEn,
    contentWidth * 0.98,
    13,
    8.5,
  );
  placeLine(payload.courseTitleEn, fontBold, titleEnSize, 12);

  placeLine(
    `Тривалість / Duration: ${payload.durationUk} / ${payload.durationEn}`,
    font,
    9.5,
    0,
  );

  // --- Footer: date (left) | signature (right) | cert no. in right niche ---
  page.drawText("Дата завершення курсу / Completion date:", {
    x: contentLeft,
    y: metaY + 14,
    size: 7.5,
    font,
    color: NAVY,
  });
  page.drawText(payload.completionDate, {
    x: contentLeft,
    y: metaY,
    size: 11.5,
    font: fontBold,
    color: NAVY,
  });

  const signature =
    (await loadOptionalImage(pdf, assetPath("signature-olha-bohdanova.png"))) ??
    (await loadOptionalImage(
      pdf,
      path.join(process.cwd(), "public", "images", "certificates", "bohdanova-signature.png"),
    ));

  const roleLine = "Голова правління ESOSH / Chairperson of ESOSH";
  const nameLine = "Ольга Богданова / Olha Bohdanova";
  const roleSize = 7.5;
  const nameLineSize = 9;
  const roleW = font.widthOfTextAtSize(roleLine, roleSize);
  const nameLineW = fontBold.widthOfTextAtSize(nameLine, nameLineSize);
  const sigRight = innerRight - 4;
  // Bottom-right block; text left-aligned inside it (not flush-right).
  const sigBlockW = Math.max(roleW, nameLineW, 150);
  const sigBlockX = sigRight - sigBlockW;

  if (signature) {
    const sigW = Math.min((signature.width / signature.height) * sigH, 215);
    // Signature centered above the left-aligned text block
    page.drawImage(signature, {
      x: sigBlockX + (sigBlockW - sigW) / 2,
      y: metaY + 16,
      width: sigW,
      height: sigH,
    });
  } else {
    page.drawText("SIGNATURE", {
      x: sigBlockX + (sigBlockW - font.widthOfTextAtSize("SIGNATURE", 10)) / 2,
      y: metaY + 42,
      size: 10,
      font,
      color: NAVY,
    });
  }

  page.drawText(roleLine, {
    x: sigBlockX,
    y: metaY + 8,
    size: roleSize,
    font,
    color: NAVY,
  });
  page.drawText(nameLine, {
    x: sigBlockX,
    y: metaY - 5,
    size: nameLineSize,
    font: fontBold,
    color: NAVY,
  });

  // Certificate number — right-side niche above the thinned stripes
  const numLabel = "Номер сертифіката / Certificate No.:";
  const numLabelSize = 7.5;
  const numValueSize = 11.5;
  const numLabelW = font.widthOfTextAtSize(numLabel, numLabelSize);
  const numValueW = fontBold.widthOfTextAtSize(
    payload.certificateNumber,
    numValueSize,
  );
  const numBlockW = Math.max(numLabelW, numValueW);
  // Right niche starts after the ~2/3 cut; sit ~60% into available span (keep right margin)
  const nicheLeft = innerLeft + innerWidth * (2 / 3) + 8;
  const nicheRightMax = sigRight - numBlockW;
  const nicheSpan = Math.max(0, nicheRightMax - nicheLeft);
  const numBlockX = nicheLeft + nicheSpan * 0.6;
  page.drawText(numLabel, {
    x: numBlockX,
    y: nicheValueY + 14,
    size: numLabelSize,
    font,
    color: NAVY,
  });
  page.drawText(payload.certificateNumber, {
    x: numBlockX,
    y: nicheValueY,
    size: numValueSize,
    font: fontBold,
    color: NAVY,
  });

  return pdf.save();
}
