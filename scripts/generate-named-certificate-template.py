#!/usr/bin/env python3
"""ESOSH named certificate template (Certify'em-style layout, no Certify'em mark).

Uses the circular crest seal and handwritten chairperson signature PNGs.
Fill later via CLI args or edit DEFAULTS. Placeholders in sample mode are visible tokens.

Example:
  python scripts/generate-named-certificate-template.py
  python scripts/generate-named-certificate-template.py --name "SHEVCHENKO OLENA" --role "OHS Engineer" \\
    --course-uk "ОЦІНКА РИЗИКІВ. БАЗОВИЙ КУРС" --course-en "RISK ASSESSMENT. AWARENESS COURSE" \\
    --hours 2 --year 2026 --id "ESOSH-CE000001"
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from reportlab.lib.colors import Color, white
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "docs" / "trainings"
CREST = ROOT / "public" / "images" / "certificates" / "esosh-crest.png"
SIGNATURE = ROOT / "public" / "images" / "certificates" / "bohdanova-signature.png"

BLUE = Color(0x1E / 255, 0x4F / 255, 0x91 / 255)
BLUE_DARK = Color(0x14 / 255, 0x38 / 255, 0x68 / 255)
YELLOW = Color(0xFF / 255, 0xD5 / 255, 0x00 / 255)
INK = Color(0x1A / 255, 0x24 / 255, 0x36 / 255)
MUTED = Color(0x4A / 255, 0x55 / 255, 0x68 / 255)

FONTS = {
    "sans": r"C:\Windows\Fonts\arial.ttf",
    "sansBold": r"C:\Windows\Fonts\arialbd.ttf",
}


@dataclass
class CertificateFields:
    """Fields to fill on the named ESOSH certificate."""

    full_name: str  # UPPERCASE display name
    job_title: str  # optional role under the name line
    course_title_uk: str
    course_title_en: str
    hours: float  # e.g. 2 or 0.5
    place_year: str  # e.g. "Kyiv, Ukraine 2026"
    certificate_id: str  # e.g. "ESOSH-CE000001"
    chairperson_line: str = "Голова Правління / Chairperson ESOSH O. Bohdanova"


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("CSans", FONTS["sans"]))
    pdfmetrics.registerFont(TTFont("CSansBold", FONTS["sansBold"]))


def draw_centered(
    c: canvas.Canvas, text: str, y: float, font: str, size: float, color: Color, width: float
) -> None:
    c.setFont(font, size)
    c.setFillColor(color)
    tw = stringWidth(text, font, size)
    c.drawString((width - tw) / 2, y, text)


def hours_uk(hours: float) -> str:
    if hours == int(hours):
        h = int(hours)
        if h == 1:
            return "1-годинне"
        if 2 <= h <= 4:
            return f"{h}-годинне"
        return f"{h}-годинне"
    return f"{hours:g}-годинне"


def hours_en(hours: float) -> str:
    if hours == int(hours):
        return f"{int(hours)}h"
    return f"{hours:g}h"


def draw_flag_banner(c: canvas.Canvas, x0: float, y0: float, w: float, h: float) -> None:
    """Diagonal blue→yellow band at the bottom (UA colours), matching the legacy Certify'em look."""
    path_blue = c.beginPath()
    path_blue.moveTo(x0, y0)
    path_blue.lineTo(x0 + w * 0.42, y0)
    path_blue.lineTo(x0 + w * 0.58, y0 + h)
    path_blue.lineTo(x0, y0 + h)
    path_blue.close()
    c.setFillColor(BLUE_DARK)
    c.drawPath(path_blue, fill=1, stroke=0)

    path_yellow = c.beginPath()
    path_yellow.moveTo(x0 + w * 0.42, y0)
    path_yellow.lineTo(x0 + w, y0)
    path_yellow.lineTo(x0 + w, y0 + h)
    path_yellow.lineTo(x0 + w * 0.58, y0 + h)
    path_yellow.close()
    c.setFillColor(YELLOW)
    c.drawPath(path_yellow, fill=1, stroke=0)


def build_pdf(fields: CertificateFields, out_path: Path) -> None:
    width, height = landscape(A4)
    c = canvas.Canvas(str(out_path), pagesize=landscape(A4))
    c.setTitle(f"ESOSH Certificate — {fields.full_name}")
    c.setAuthor("ESOSH")
    c.setSubject(fields.course_title_en)

    # Outer white page + thick blue frame (legacy layout)
    margin = 10 * mm
    c.setFillColor(white)
    c.rect(0, 0, width, height, fill=1, stroke=0)
    c.setStrokeColor(BLUE_DARK)
    c.setLineWidth(5.5)
    c.rect(margin, margin, width - 2 * margin, height - 2 * margin, fill=0, stroke=1)

    # Flag banner inside bottom of frame
    banner_h = 20 * mm
    inner = margin + 3
    draw_flag_banner(c, inner, inner, width - 2 * inner, banner_h)

    # Circular crest (not the wordmark logo)
    crest_h = 78
    crest_top = height - margin - 10
    if CREST.exists():
        # Keep aspect ratio; crest PNG includes laurel wreath
        ir = ImageReader(str(CREST))
        iw, ih = ir.getSize()
        aspect = iw / float(ih) if ih else 1.0
        crest_w = crest_h * aspect
        c.drawImage(
            str(CREST),
            (width - crest_w) / 2,
            crest_top - crest_h,
            width=crest_w,
            height=crest_h,
            mask="auto",
            preserveAspectRatio=True,
        )
        org_y = crest_top - crest_h - 14
    else:
        org_y = height - margin - 50

    draw_centered(
        c,
        "The European Society of Occupational Safety and Health",
        org_y,
        "CSans",
        11,
        BLUE_DARK,
        width,
    )
    draw_centered(
        c,
        "Європейське співтовариство з охорони праці",
        org_y - 15,
        "CSans",
        11,
        BLUE_DARK,
        width,
    )

    draw_centered(c, "CERTIFICATE / СЕРТИФІКАТ", org_y - 44, "CSansBold", 26, BLUE, width)

    uk_line = f"що засвідчує {hours_uk(fields.hours)} навчання та успішне тестування"
    en_line = f"that confirms the {hours_en(fields.hours)} study and successful testing"
    draw_centered(c, uk_line, org_y - 72, "CSans", 11, INK, width)
    draw_centered(c, en_line, org_y - 88, "CSans", 11, INK, width)

    draw_centered(c, fields.course_title_uk.upper(), org_y - 118, "CSansBold", 15, BLUE_DARK, width)
    draw_centered(c, fields.course_title_en.upper(), org_y - 138, "CSansBold", 14, BLUE_DARK, width)

    # Name + underline (wide line like reference)
    name = fields.full_name.strip().upper()
    name_y = org_y - 182
    draw_centered(c, name, name_y, "CSansBold", 24, INK, width)
    line_w = min(width - 2 * margin - 80, max(stringWidth(name, "CSansBold", 24) + 120, width * 0.72))
    c.setStrokeColor(INK)
    c.setLineWidth(0.85)
    c.line((width - line_w) / 2, name_y - 7, (width + line_w) / 2, name_y - 7)

    if fields.job_title.strip():
        draw_centered(c, fields.job_title.strip(), name_y - 26, "CSans", 11, INK, width)

    # Footer row above banner: place/date left, signature + chairperson right
    footer_y = inner + banner_h + 16
    c.setFont("CSans", 10)
    c.setFillColor(INK)
    c.drawString(margin + 18, footer_y, fields.place_year)

    chair = fields.chairperson_line
    c.setFont("CSans", 9)
    tw = stringWidth(chair, "CSans", 9)
    chair_x = width - margin - 18 - tw
    c.drawString(chair_x, footer_y, chair)

    # Handwritten signature above chairperson line
    if SIGNATURE.exists():
        sir = ImageReader(str(SIGNATURE))
        sw, sh = sir.getSize()
        aspect = sw / float(sh) if sh else 1.0
        # Match reference: signature roughly over the right third, readable size
        sig_w = 88
        sig_h = sig_w / aspect if aspect else 42
        if sig_h > 42:
            sig_h = 42
            sig_w = sig_h * aspect
        sig_x = width - margin - 20 - sig_w
        c.drawImage(
            str(SIGNATURE),
            sig_x,
            footer_y + 12,
            width=sig_w,
            height=sig_h,
            mask="auto",
            preserveAspectRatio=True,
        )

    # Certificate ID on the banner (white pill for contrast on blue/yellow)
    c.setFont("CSansBold", 11)
    id_tw = stringWidth(fields.certificate_id, "CSansBold", 11)
    c.setFillColor(white)
    c.roundRect(
        (width - id_tw) / 2 - 10,
        inner + banner_h / 2 - 10,
        id_tw + 20,
        18,
        3,
        fill=1,
        stroke=0,
    )
    c.setFillColor(BLUE_DARK)
    c.drawString((width - id_tw) / 2, inner + banner_h / 2 - 4, fields.certificate_id)

    c.showPage()
    c.save()


def sample_placeholders() -> CertificateFields:
    """Visible tokens — replace when wiring real issuance."""
    return CertificateFields(
        full_name="{{FULL_NAME}}",
        job_title="{{JOB_TITLE}}",
        course_title_uk="{{COURSE_TITLE_UK}}",
        course_title_en="{{COURSE_TITLE_EN}}",
        hours=2,
        place_year="Kyiv, Ukraine {{YEAR}}",
        certificate_id="{{CERTIFICATE_ID}}",
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate ESOSH named certificate PDF")
    parser.add_argument("--sample", action="store_true", help="Emit placeholder tokens PDF")
    parser.add_argument("--name", default="STRUTINSKYI ANDRII")
    parser.add_argument("--role", default="Coordinator of industrial safety and occupational health")
    parser.add_argument("--course-uk", default="ОЦІНКА РИЗИКІВ. БАЗОВИЙ КУРС")
    parser.add_argument("--course-en", default="RISK ASSESSMENT. AWARENESS COURSE")
    parser.add_argument("--hours", type=float, default=2)
    parser.add_argument("--year", type=int, default=2026)
    parser.add_argument("--id", default="ESOSH-CE000001")
    parser.add_argument(
        "--out",
        default="",
        help="Output path (default under public/docs/trainings/)",
    )
    args = parser.parse_args()

    register_fonts()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if args.sample:
        fields = sample_placeholders()
        out = Path(args.out) if args.out else OUT_DIR / "certificate-named-template-placeholders.pdf"
    else:
        fields = CertificateFields(
            full_name=args.name,
            job_title=args.role,
            course_title_uk=args.course_uk,
            course_title_en=args.course_en,
            hours=args.hours,
            place_year=f"Kyiv, Ukraine {args.year}",
            certificate_id=args.id,
        )
        out = Path(args.out) if args.out else OUT_DIR / "certificate-named-template-sample.pdf"

    build_pdf(fields, out)
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
