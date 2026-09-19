"""Generate English Code of Conduct PDF from the Ukrainian source text."""
from pathlib import Path

from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "docs" / "codex-en.pdf"

pdfmetrics.registerFont(TTFont("Times", r"C:\Windows\Fonts\times.ttf"))
pdfmetrics.registerFont(TTFont("Times-Bold", r"C:\Windows\Fonts\timesbd.ttf"))

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="DocTitle",
        fontName="Times-Bold",
        fontSize=16,
        leading=20,
        alignment=TA_CENTER,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="DocSubtitle",
        fontName="Times-Bold",
        fontSize=13,
        leading=17,
        alignment=TA_CENTER,
        spaceAfter=18,
    )
)
styles.add(
    ParagraphStyle(
        name="H",
        fontName="Times-Bold",
        fontSize=12,
        leading=16,
        spaceBefore=14,
        spaceAfter=8,
        alignment=TA_LEFT,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        fontName="Times",
        fontSize=10.5,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyBold",
        fontName="Times-Bold",
        fontSize=10.5,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Sign",
        fontName="Times-Bold",
        fontSize=10.5,
        leading=14,
        alignment=TA_LEFT,
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="SignRole",
        fontName="Times",
        fontSize=10,
        leading=13,
        alignment=TA_LEFT,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="Item",
        fontName="Times",
        fontSize=10.5,
        leading=14,
        alignment=TA_JUSTIFY,
    )
)
styles.add(
    ParagraphStyle(
        name="Date",
        fontName="Times",
        fontSize=10.5,
        leading=14,
        alignment=TA_RIGHT,
        spaceBefore=18,
    )
)


def p(text: str, style: str = "Body") -> Paragraph:
    return Paragraph(text, styles[style])


def bullet(items: list[str]) -> ListFlowable:
    return ListFlowable(
        [ListItem(Paragraph(i, styles["Item"]), leftIndent=12, bulletColor="black") for i in items],
        bulletType="bullet",
        start="•",
        leftIndent=18,
        spaceBefore=2,
        spaceAfter=8,
    )


story: list = []

story.append(p("Code of Conduct for Participants", "DocTitle"))
story.append(
    p(
        "of the European Society of Occupational Safety and Health (ESOSH)",
        "DocSubtitle",
    )
)

story.append(p("Introduction", "H"))
story.append(
    p(
        "Honesty is one of the principal qualities of a person. As members of the "
        "European Society of Occupational Safety and Health (ESOSH), we are committed "
        "to the fundamental principles of honesty, transparency and openness. Upholding "
        "these principles is of the utmost importance for preserving respect for and "
        "trust in our activities in accordance with the vision, mission, purpose and "
        "objectives of our Society."
    )
)
story.append(
    p(
        "The purpose of this Code of Conduct is to provide ESOSH participants with "
        "ethical guidance consistent with the highest European standards and rules of "
        "conduct governing anti-corruption matters, conflicts of interest and "
        "confidentiality."
    )
)
story.append(
    p(
        "The Code sets out the basic standards of conduct, while not restricting the "
        "ability to carry out professional and public activities."
    )
)
story.append(
    p(
        "We call upon all members of ESOSH to ensure that honesty remains at the centre "
        "of our actions and that the principles of the Code are observed in the "
        "performance of our activities, which serve the preservation of the highest "
        "value — human life and health."
    )
)
story.append(p("Olha Bohdanova", "Sign"))
story.append(p("Chair of the Board of ESOSH", "SignRole"))
story.append(p("Dmytro Hryhorenko", "Sign"))
story.append(p("Director General of ESOSH", "SignRole"))

story.append(p("Code of Conduct for ESOSH Participants", "H"))
story.append(
    p(
        "<b>Purpose of the Code of Conduct</b> — to provide ESOSH participants with "
        "criteria to be followed in the performance of their professional duties. It "
        "sets out the general principles of conduct that our Society expects of its "
        "members. By adhering to these standards, participants may maintain and enhance "
        "the level of openness and accountability necessary to sustain trust in ESOSH."
    )
)
story.append(
    p(
        "<b>Scope of the Code of Conduct</b> — applies to all participants with respect "
        "to aspects of their professional activities in the field of occupational safety "
        "and health. The Code may be supplemented by other rules of conduct and "
        "organisational discipline adopted by the Board of ESOSH that do not conflict "
        "with this Code."
    )
)

story.append(p("General Principles of Conduct", "H"))
story.append(p("1. In their professional activities, ESOSH participants:", "BodyBold"))
story.append(
    p(
        "1.1 share the Society’s <b>vision</b> that life is the highest value, and do "
        "everything possible to prevent any harm to human life and health;"
    )
)
story.append(
    p(
        "1.2 fulfil the <b>mission</b> — to shape safety-oriented thinking and to "
        "promote leadership in occupational safety;"
    )
)
story.append(
    p(
        "1.3 pursue the <b>purpose</b> — to develop their own professional competence "
        "and to become a source of development for others;"
    )
)
story.append(p("1.4 achieve the following objectives:"))
story.append(
    bullet(
        [
            "disseminate knowledge obtained from qualified, experienced specialists in the field of safety;",
            "join efforts with other specialists who share the aspiration for safe work and European values;",
            "promote an attitude to occupational safety as a moral obligation.",
        ]
    )
)

story.append(p("2. In performing their professional duties, ESOSH participants:", "BodyBold"))
story.append(
    p(
        "2.1 perform occupational safety duties responsibly, diligently and honestly;"
    )
)
story.append(
    p(
        "2.2 when taking decisions in their professional activities, are guided primarily "
        "by the interests of society and act for the purpose of preserving human life "
        "and health;"
    )
)
story.append(
    p(
        "2.3 are guided by the principles of transparent reporting on occupational "
        "injuries and occupational diseases in the workplace, in no way concealing the "
        "real causes of incidents, and doing everything within their power to ensure "
        "an objective and impartial investigation and to prevent the recurrence of such "
        "incidents in the future;"
    )
)
story.append(
    p(
        "2.4 act in a manner that strengthens the reputation of ESOSH and comply with "
        "the provisions and rules of the organisation approved by the Board of ESOSH;"
    )
)
story.append(
    p(
        "2.5 promote and support the <b>core principles and foundations of ESOSH</b>:"
    )
)
story.append(
    bullet(
        [
            "honesty;",
            "access to advanced knowledge in occupational safety;",
            "continuous improvement,",
        ]
    )
)
story.append(p("taking a leading role and serving as an example."))

story.append(
    p(
        "3. ESOSH participants undertake to comply with the following Rules of Conduct:",
        "BodyBold",
    )
)
story.append(
    p(
        "3.1 respect the values of ESOSH and common European values, and refrain from "
        "any actions that could harm the reputation or standing of ESOSH or its "
        "participants;"
    )
)
story.append(
    p(
        "3.2 avoid conflicts between any actual or potential economic, commercial, "
        "financial or other interests at the professional and personal level, on the "
        "one hand, and the public interests in the work of ESOSH, on the other, "
        "resolving any such conflicts in favour of the public interest; if an ESOSH "
        "participant is unable to avoid a conflict of interest, such conflict must be "
        "disclosed to the Board of ESOSH;"
    )
)
story.append(
    p(
        "3.3 do not use their participation in ESOSH to advance their own interests or "
        "the interests of another person or entity through actions incompatible with "
        "the Code of Conduct;"
    )
)
story.append(
    p(
        "3.4 do not use for personal purposes confidential information to which they "
        "have gained access by virtue of membership in ESOSH."
    )
)

story.append(
    p(
        "4. ESOSH participants act in accordance with the Code of Conduct on the "
        "prevention of and counteraction to corruption. In this regard, ESOSH adheres "
        "to the highest ethical standards and to both the letter and the spirit of all "
        "applicable anti-corruption laws and regulations in force in the countries "
        "where ESOSH participants carry out their activities (hereinafter — the "
        "“Anti-Corruption Legislation”):",
        "BodyBold",
    )
)
story.append(
    p(
        "4.1 all participants, employees and representatives of ESOSH, and third parties "
        "acting on behalf of the Society, are prohibited from committing or inducing "
        "anyone to commit acts prohibited by the Anti-Corruption Legislation;"
    )
)
story.append(
    p(
        "4.2 all of the above persons must ensure that all arrangements with third "
        "parties, in both the private and the public sectors, are concluded in "
        "accordance with the applicable laws of the country in which the activity is "
        "carried out, as well as with standards of good faith and integrity;"
    )
)
story.append(
    p(
        "4.3 ESOSH values the integrity and transparency of all transactions and opposes "
        "and does not recognise any corrupt acts, regardless of by whom they are "
        "committed;"
    )
)
story.append(
    p(
        "4.4 ESOSH participants must not permit corruption offences — acts containing "
        "elements of corruption:"
    )
)
story.append(
    bullet(
        [
            "the use by a person liable for corruption offences of official powers conferred upon them, or of opportunities related thereto, for the purpose of obtaining an unlawful benefit;",
            "participation in acts committed by a person liable for corruption offences, for which criminal, disciplinary and/or civil liability is established by law;",
        ]
    )
)
story.append(
    p(
        "4.5 regarding all threats or suspicions of possible corruption offences, or "
        "facts of their occurrence, of which an ESOSH participant becomes aware and "
        "which relate directly to their professional activities or to the activities of "
        "the Society as a whole, the ESOSH participant must notify the Board of ESOSH."
    )
)

story.append(
    p(
        "5. All members of ESOSH, when taking part in the Society’s events and when "
        "referring to their participation in the Society, assume the following "
        "obligations:",
        "BodyBold",
    )
)
story.append(p("5.1 to show respect for the values of ESOSH;"))
story.append(p("5.2 to demonstrate openness and transparency of their activities;"))
story.append(p("5.3 to maintain neutrality, impartiality and objectivity;"))
story.append(
    p(
        "5.4 the obligation to act within the applicable legal framework of the country "
        "in which ESOSH carries out its activities;"
    )
)
story.append(
    p(
        "5.5 the obligation to maintain order and the rules of propriety, ensuring "
        "civilised and orderly relations in accordance with the rules and established "
        "business practice;"
    )
)
story.append(
    p(
        "5.6 the obligation to behave courteously, politely and respectfully towards one "
        "another, and to refrain from any actions that may disrupt the course of "
        "organised events;"
    )
)
story.append(
    p(
        "5.7 the obligation to refrain from any discrimination on grounds of gender, "
        "social status, language, ethnicity or other characteristics that deny or "
        "diminish the equal exercise of the rights of ESOSH participants and other "
        "persons;"
    )
)
story.append(
    p(
        "5.8 all participants shall make a declaration to the Board of ESOSH if they have "
        "professional, personal or economic interests that conflict with the activities "
        "of the Society."
    )
)

story.append(p("Compliance with the Code of Conduct", "H"))
story.append(
    p(
        "In carrying out their professional activities, ESOSH participants undertake to "
        "comply with the principles and rules set out in the Code of Conduct."
    )
)
story.append(
    p(
        "Where there are grounds to believe that a participant has acted in breach of "
        "the Code of Conduct, the Board of ESOSH is entitled to require explanations or "
        "additional information from that ESOSH participant or from other members of "
        "the Society who may clarify the situation."
    )
)
story.append(
    p(
        "If the Board of ESOSH determines that the participant has breached the Code of "
        "Conduct, the Board shall decide on the participant’s expulsion from membership "
        "of the Society within the scope of its powers and in accordance with the "
        "applicable legal framework of the country in which ESOSH carries out its "
        "activities."
    )
)

story.append(p("15 March 2019", "Date"))

doc = SimpleDocTemplate(
    str(OUT),
    pagesize=A4,
    leftMargin=20 * mm,
    rightMargin=20 * mm,
    topMargin=18 * mm,
    bottomMargin=18 * mm,
    title="Code of Conduct for Participants of ESOSH",
    author="European Society of Occupational Safety and Health (ESOSH)",
    subject="English translation of the ESOSH Code of Conduct (source: Ukrainian PDF of 15 March 2019)",
)
doc.build(story)
print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
