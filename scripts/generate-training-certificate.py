#!/usr/bin/env python3
"""Generate formal ESOSH training completion certificates (uk/en).

Layout follows common occupational safety / OSHA-style completion certificates:
logo → title → statement → course → scope/assessment → dual authorised signatures → seal.
No decorative filler shields. Ornament is border/corners only.
"""

from __future__ import annotations

import math
from pathlib import Path

from reportlab.lib.colors import Color
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


def fill_polygon(c: canvas.Canvas, points: list[float]) -> None:
    path = c.beginPath()
    path.moveTo(points[0], points[1])
    for i in range(2, len(points), 2):
        path.lineTo(points[i], points[i + 1])
    path.close()
    c.drawPath(path, fill=1, stroke=0)


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "docs" / "trainings"
LOGO = ROOT / "public" / "images" / "logo-color.png"

ACCENT = Color(0x1E / 255, 0x4F / 255, 0x91 / 255)
ACCENT_DARK = Color(0x14 / 255, 0x38 / 255, 0x68 / 255)
GOLD = Color(0xB8 / 255, 0x96 / 255, 0x4A / 255)
GOLD_LIGHT = Color(0xD4 / 255, 0xB8 / 255, 0x6A / 255)
INK = Color(0x1A / 255, 0x24 / 255, 0x36 / 255)
MUTED = Color(0x4A / 255, 0x55 / 255, 0x68 / 255)
CREAM = Color(0xFB / 255, 0xFA / 255, 0xF7 / 255)
PANEL = Color(0xF3 / 255, 0xF6 / 255, 0xFA / 255)
BORDER_LINE = Color(0xC5 / 255, 0xCF / 255, 0xDE / 255)

FONTS = {
    "serif": r"C:\Windows\Fonts\times.ttf",
    "serifBold": r"C:\Windows\Fonts\timesbd.ttf",
    "serifItalic": r"C:\Windows\Fonts\timesi.ttf",
    "display": r"C:\Windows\Fonts\georgiab.ttf",
    "sans": r"C:\Windows\Fonts\arial.ttf",
    "sansBold": r"C:\Windows\Fonts\arialbd.ttf",
}


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("EsoshSerif", FONTS["serif"]))
    pdfmetrics.registerFont(TTFont("EsoshSerifBold", FONTS["serifBold"]))
    pdfmetrics.registerFont(TTFont("EsoshSerifItalic", FONTS["serifItalic"]))
    pdfmetrics.registerFont(TTFont("EsoshDisplay", FONTS["display"]))
    pdfmetrics.registerFont(TTFont("EsoshSans", FONTS["sans"]))
    pdfmetrics.registerFont(TTFont("EsoshSansBold", FONTS["sansBold"]))


def draw_centered(
    c: canvas.Canvas,
    text: str,
    y: float,
    font: str,
    size: float,
    color: Color,
    width: float,
) -> None:
    c.setFont(font, size)
    c.setFillColor(color)
    tw = stringWidth(text, font, size)
    c.drawString((width - tw) / 2, y, text)


def draw_wrapped_centered(
    c: canvas.Canvas,
    text: str,
    y: float,
    font: str,
    size: float,
    color: Color,
    page_width: float,
    max_width: float,
    leading: float,
) -> float:
    c.setFont(font, size)
    c.setFillColor(color)
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if stringWidth(trial, font, size) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    for i, line in enumerate(lines):
        tw = stringWidth(line, font, size)
        c.drawString((page_width - tw) / 2, y - i * leading, line)
    return y - (len(lines) - 1) * leading


def draw_corner_ornament(
    c: canvas.Canvas, x: float, y: float, scale: float, flip_x: int, flip_y: int
) -> None:
    c.saveState()
    c.translate(x, y)
    c.scale(flip_x * scale, flip_y * scale)
    c.setStrokeColor(GOLD)
    c.setFillColor(GOLD)
    c.setLineWidth(1.15)
    c.setLineCap(1)
    c.setLineJoin(1)

    p = c.beginPath()
    p.moveTo(0, 34)
    p.curveTo(3, 22, 6, 12, 14, 7)
    p.curveTo(22, 2, 34, 1, 44, 0)
    c.drawPath(p, stroke=1, fill=0)

    p2 = c.beginPath()
    p2.moveTo(34, 0)
    p2.curveTo(22, 2, 12, 5, 7, 14)
    p2.curveTo(2, 22, 1, 34, 0, 44)
    c.drawPath(p2, stroke=1, fill=0)

    c.setStrokeColor(ACCENT)
    c.setLineWidth(0.75)
    p3 = c.beginPath()
    p3.moveTo(8, 26)
    p3.curveTo(10, 16, 16, 11, 24, 9)
    c.drawPath(p3, stroke=1, fill=0)

    fill_polygon(c, [12, 12, 16, 16, 12, 20, 8, 16])
    c.setFillColor(ACCENT)
    c.circle(22, 8, 1.4, fill=1, stroke=0)
    c.restoreState()


def draw_divider(c: canvas.Canvas, y: float, width: float, inset: float = 110) -> None:
    left = inset
    right = width - inset
    mid = width / 2
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.9)
    c.line(left, y, mid - 14, y)
    c.line(mid + 14, y, right, y)
    c.setFillColor(ACCENT)
    fill_polygon(c, [mid, y + 4, mid + 4, y, mid, y - 4, mid - 4, y])


def draw_border(c: canvas.Canvas, width: float, height: float, margin: float) -> None:
    c.setFillColor(CREAM)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    c.setStrokeColor(ACCENT_DARK)
    c.setLineWidth(2.6)
    c.rect(margin, margin, width - 2 * margin, height - 2 * margin, fill=0, stroke=1)

    inner = margin + 4.5
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.15)
    c.rect(inner, inner, width - 2 * inner, height - 2 * inner, fill=0, stroke=1)

    hair = inner + 3.5
    c.setStrokeColor(BORDER_LINE)
    c.setLineWidth(0.45)
    c.rect(hair, hair, width - 2 * hair, height - 2 * hair, fill=0, stroke=1)

    oi = margin + 8
    draw_corner_ornament(c, oi, height - oi, 0.82, 1, -1)
    draw_corner_ornament(c, width - oi, height - oi, 0.82, -1, -1)
    draw_corner_ornament(c, oi, oi, 0.82, 1, 1)
    draw_corner_ornament(c, width - oi, oi, 0.82, -1, 1)


def draw_check_item(
    c: canvas.Canvas, x: float, y: float, label: str, font: str = "EsoshSerif", size: float = 9
) -> None:
    """Assessment checklist tick — semantic verification mark used on safety certs."""
    box = 8
    c.setStrokeColor(ACCENT)
    c.setLineWidth(1.0)
    c.rect(x, y - 1.5, box, box, fill=0, stroke=1)
    c.setStrokeColor(ACCENT_DARK)
    c.setLineWidth(1.35)
    p = c.beginPath()
    p.moveTo(x + 1.6, y + 2.2)
    p.lineTo(x + 3.4, y + 0.2)
    p.lineTo(x + 6.6, y + 5.2)
    c.drawPath(p, stroke=1, fill=0)
    c.setFillColor(INK)
    c.setFont(font, size)
    c.drawString(x + box + 6, y, label)


def draw_name_block(
    c: canvas.Canvas,
    cx: float,
    name_y: float,
    name: str,
    role: str,
) -> None:
    """Name + role only (no signature line — wet-ink signing is not possible)."""
    c.setFont("EsoshSerifBold", 9.5)
    c.setFillColor(INK)
    c.drawString(cx - stringWidth(name, "EsoshSerifBold", 9.5) / 2, name_y, name)
    c.setFont("EsoshSerifItalic", 8)
    c.setFillColor(MUTED)
    c.drawString(cx - stringWidth(role, "EsoshSerifItalic", 8) / 2, name_y - 14, role)


def draw_seal(c: canvas.Canvas, cx: float, cy: float, radius: float = 26) -> None:
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.circle(cx, cy, radius, fill=0, stroke=1)
    c.setStrokeColor(ACCENT)
    c.setLineWidth(0.8)
    c.circle(cx, cy, radius - 5, fill=0, stroke=1)
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.55)
    for ang in range(0, 360, 24):
        rad = math.radians(ang)
        c.line(
            cx + (radius - 2.8) * math.cos(rad),
            cy + (radius - 2.8) * math.sin(rad),
            cx + (radius - 0.8) * math.cos(rad),
            cy + (radius - 0.8) * math.sin(rad),
        )
    c.setFillColor(ACCENT_DARK)
    c.setFont("EsoshDisplay", 8)
    tw = stringWidth("ESOSH", "EsoshDisplay", 8)
    c.drawString(cx - tw / 2, cy + 1, "ESOSH")
    c.setFont("EsoshSans", 5)
    c.setFillColor(MUTED)
    sub = "OFFICIAL"
    tw2 = stringWidth(sub, "EsoshSans", 5)
    c.drawString(cx - tw2 / 2, cy - 8, sub)


def build_certificate(locale: str, out_path: Path) -> None:
    width, height = landscape(A4)
    c = canvas.Canvas(str(out_path), pagesize=landscape(A4))
    c.setAuthor("ESOSH — European Society of Occupational Safety & Health")
    c.setSubject("UAV attacks training completion certificate")

    if locale == "uk":
        c.setTitle("Сертифікат про проходження тренінгу — ESOSH")
        heading = "СЕРТИФІКАТ"
        subheading = "про проходження тренінгу"
        confirms = (
            "Цим документується успішне проходження відеотренінгу з безпеки "
            "та перевірку знань."
        )
        training_label = "НАЗВА ТРЕНІНГУ"
        training_title = "Дії під час атак БПЛА"
        scope_title = "Зміст програми"
        scope_items = [
            "Розпізнавання загрози FPV та тактика ухилення",
            "Захист приміщень, укриття та протокол для транспорту",
            "Повторний удар, дистанція безпеки, дисципліна фіксації",
        ]
        assess_title = "Підтвердження оцінювання"
        assess_items = [
            "Відеотренінг переглянуто",
            "Письмовий тест складено",
        ]
        issuer_line = "Європейське товариство охорони праці (ЄСОП / ESOSH)"
        sig_left = ("Ольга Богданова", "Голова Правління ESOSH")
        sig_right = ("Дмитро Григоренко", "Генеральний директор ESOSH")
        footer = "www.esosh.net  ·  Програма навчання ESOSH  ·  Охорона праці та цивільна безпека"
    else:
        c.setTitle("Certificate of Completion — ESOSH")
        heading = "CERTIFICATE"
        subheading = "of completion"
        confirms = (
            "This document certifies successful completion of the safety video training "
            "and the knowledge assessment."
        )
        training_label = "TRAINING TITLE"
        training_title = "Actions during UAV attacks"
        scope_title = "Programme scope"
        scope_items = [
            "FPV threat recognition and evasion tactics",
            "Building protection, sheltering, and vehicle protocol",
            "Secondary strike window, safe distance, media discipline",
        ]
        assess_title = "Assessment verification"
        assess_items = [
            "Video training completed",
            "Written knowledge check passed",
        ]
        issuer_line = "European Society of Occupational Safety & Health (ESOSH)"
        sig_left = ("Olha Bohdanova", "Chairman of the Board, ESOSH")
        sig_right = ("Dmytro Grigorenko", "Chief Executive Officer, ESOSH")
        footer = "www.esosh.net  ·  ESOSH Training Programme  ·  Occupational safety & civil protection"

    draw_border(c, width, height, margin=16 * mm)

    content_top = height - 16 * mm - 16
    content_bottom = 16 * mm + 12

    # --- Top: logo ---
    logo_w, logo_h = 112, 43
    logo_bottom = content_top - logo_h
    if LOGO.exists():
        c.drawImage(
            str(LOGO),
            (width - logo_w) / 2,
            logo_bottom,
            width=logo_w,
            height=logo_h,
            mask="auto",
            preserveAspectRatio=True,
        )

    # --- Bottom: seal + names + footer ---
    footer_y = content_bottom + 2
    name_y = footer_y + 40
    seal_cy = name_y + 4
    draw_seal(c, width / 2, seal_cy, radius=22)
    draw_name_block(c, width * 0.28, name_y, sig_left[0], sig_left[1])
    draw_name_block(c, width * 0.72, name_y, sig_right[0], sig_right[1])
    draw_centered(c, footer, footer_y, "EsoshSans", 7.0, MUTED, width)

    # --- Middle block vertically centered between logo and seal/names ---
    mid_h = 188
    band_top = logo_bottom - 4
    band_bottom = seal_cy + 36
    mid_top = (band_top + band_bottom) / 2 + mid_h / 2

    title_y = mid_top
    draw_centered(c, heading, title_y, "EsoshDisplay", 30, ACCENT_DARK, width)
    draw_centered(c, subheading, title_y - 20, "EsoshSerifItalic", 13.5, GOLD, width)
    draw_divider(c, title_y - 34, width, inset=120)

    y = draw_wrapped_centered(
        c,
        confirms,
        title_y - 54,
        "EsoshSerif",
        11,
        INK,
        width,
        max_width=width - 170,
        leading=14,
    )

    draw_centered(c, training_label, y - 22, "EsoshSansBold", 8, MUTED, width)

    title_panel_top = y - 28
    title_panel_h = 32
    panel_x = 100
    panel_w = width - 200
    c.setFillColor(PANEL)
    c.setStrokeColor(ACCENT)
    c.setLineWidth(0.9)
    c.roundRect(panel_x, title_panel_top - title_panel_h, panel_w, title_panel_h, 4, fill=1, stroke=1)
    draw_centered(
        c,
        training_title,
        title_panel_top - title_panel_h / 2 - 4,
        "EsoshSerifBold",
        15,
        ACCENT,
        width,
    )

    col_top = title_panel_top - title_panel_h - 16
    col_gap = 24
    col_w = (width - 200 - col_gap) / 2
    left_x = 100
    right_x = left_x + col_w + col_gap
    box_h = 70

    def draw_column(x: float, title: str, items: list[str], checklist: bool) -> None:
        c.setFillColor(Color(1, 1, 1))
        c.setStrokeColor(BORDER_LINE)
        c.setLineWidth(0.7)
        c.roundRect(x, col_top - box_h, col_w, box_h, 3, fill=1, stroke=1)
        c.setFillColor(ACCENT_DARK)
        c.setFont("EsoshSansBold", 8.2)
        c.drawString(x + 12, col_top - 14, title.upper())
        c.setStrokeColor(GOLD)
        c.setLineWidth(0.7)
        c.line(x + 12, col_top - 18, x + col_w - 12, col_top - 18)
        row_y = col_top - 32
        for item in items:
            if checklist:
                draw_check_item(c, x + 12, row_y, item, size=8.2)
            else:
                c.setFillColor(ACCENT)
                c.circle(x + 16, row_y + 2.5, 1.6, fill=1, stroke=0)
                c.setFillColor(INK)
                c.setFont("EsoshSerif", 8.0)
                max_w = col_w - 36
                if stringWidth(item, "EsoshSerif", 8.0) <= max_w:
                    c.drawString(x + 24, row_y, item)
                else:
                    words = item.split()
                    line1, line2 = "", ""
                    for w in words:
                        trial = f"{line1} {w}".strip()
                        if stringWidth(trial, "EsoshSerif", 8.0) <= max_w:
                            line1 = trial
                        else:
                            line2 = f"{line2} {w}".strip()
                    c.drawString(x + 24, row_y + 4, line1)
                    if line2:
                        c.drawString(x + 24, row_y - 6, line2)
                        row_y -= 7
            row_y -= 14

    draw_column(left_x, scope_title, scope_items, checklist=False)
    draw_column(right_x, assess_title, assess_items, checklist=True)

    issuer_y = col_top - box_h - 16
    draw_centered(c, issuer_line, issuer_y, "EsoshSerif", 10, INK, width)

    c.showPage()
    c.save()


def main() -> None:
    register_fonts()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    uk_path = OUT_DIR / "uav-attacks-certificate-uk.pdf"
    en_path = OUT_DIR / "uav-attacks-certificate-en.pdf"
    build_certificate("uk", uk_path)
    build_certificate("en", en_path)
    print(f"Wrote {uk_path}")
    print(f"Wrote {en_path}")


if __name__ == "__main__":
    main()
