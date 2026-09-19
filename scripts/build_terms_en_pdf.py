"""Generate English Activity Statement / Regulations PDF from Ukrainian terms-uk.pdf."""
from pathlib import Path

from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "docs" / "terms-en.pdf"

pdfmetrics.registerFont(TTFont("Times", r"C:\Windows\Fonts\times.ttf"))
pdfmetrics.registerFont(TTFont("Times-Bold", r"C:\Windows\Fonts\timesbd.ttf"))

styles = getSampleStyleSheet()
for name, kwargs in {
    "DocTitle": dict(fontName="Times-Bold", fontSize=14, leading=18, alignment=TA_CENTER, spaceAfter=4),
    "DocSubtitle": dict(fontName="Times-Bold", fontSize=12, leading=16, alignment=TA_CENTER, spaceAfter=16),
    "H": dict(fontName="Times-Bold", fontSize=11.5, leading=15, spaceBefore=12, spaceAfter=7, alignment=TA_LEFT),
    "Body": dict(fontName="Times", fontSize=10, leading=13.5, alignment=TA_JUSTIFY, spaceAfter=7),
    "BodyBold": dict(fontName="Times-Bold", fontSize=10, leading=13.5, alignment=TA_JUSTIFY, spaceAfter=7),
    "Item": dict(fontName="Times", fontSize=10, leading=13.5, alignment=TA_JUSTIFY),
    "Date": dict(fontName="Times", fontSize=10, leading=13, alignment=TA_RIGHT, spaceBefore=14),
}.items():
    styles.add(ParagraphStyle(name=name, **kwargs))


def p(text: str, style: str = "Body") -> Paragraph:
    return Paragraph(text, styles[style])


def bullets(items: list[str]) -> ListFlowable:
    return ListFlowable(
        [ListItem(Paragraph(i, styles["Item"]), leftIndent=10) for i in items],
        bulletType="bullet",
        start="•",
        leftIndent=16,
        spaceBefore=1,
        spaceAfter=7,
    )


story: list = []

story.append(p("REGULATIONS ON THE ACTIVITIES OF THE PUBLIC UNION", "DocTitle"))
story.append(p("“EUROPEAN SOCIETY OF OCCUPATIONAL SAFETY AND HEALTH”", "DocSubtitle"))

story.append(p("INTRODUCTION", "H"))
story.append(
    p(
        "These Regulations on Activities (hereinafter — the Regulations) of the PUBLIC UNION "
        "“EUROPEAN SOCIETY OF OCCUPATIONAL SAFETY AND HEALTH” (hereinafter — the Union, ESOSH) "
        "have been developed on the basis of the Charter of the Union and the Code of Conduct for "
        "Participants of the Union, and govern the procedure for admission to, membership in, "
        "withdrawal from, or expulsion from the Union of its participants. The Regulations form "
        "the basis for the activities of the Union’s bodies in ensuring the rights of its members "
        "and in supervising the performance by members of the Union of their duties."
    )
)

story.append(p("1. AREAS OF ACTIVITY", "H"))
story.append(
    p(
        "1.1 The Union carries out its activities in the field of occupational safety and "
        "industrial safety, and directs them towards preserving human life and health in the "
        "workplace and towards using available opportunities to disseminate the best worldwide "
        "experience in reducing occupational injuries."
    )
)
story.append(p("1.2 The principal areas of the Union’s activity are:", "BodyBold"))
story.append(
    bullets(
        [
            "development of the professional competence of occupational safety specialists;",
            "dissemination of the knowledge of qualified, experienced and competent European specialists in occupational hygiene and safety;",
            "consulting and information and technical support for organisations of various forms of ownership in the field of occupational safety and industrial safety;",
            "establishment of relations with international and local organisations with a view to raising the level of occupational safety at enterprises of various forms of ownership;",
            "raising occupational safety standards on the basis of the legislation of the European Union and the conventions of the International Labour Organization in the field of occupational safety;",
            "dissemination and application of a risk-based approach and best practices in occupational hygiene and safety.",
        ]
    )
)

story.append(p("2. PROCEDURE FOR ACQUISITION AND TERMINATION OF ASSOCIATE MEMBERSHIP", "H"))
story.append(
    p(
        "2.1 Membership in the Union is voluntary and individual. Members of the Union may be "
        "citizens of Ukraine, foreign nationals and stateless persons who are lawfully present in "
        "Ukraine and who have reached the age of 18, as well as legal entities of various forms of "
        "ownership that recognise the Charter of the Union and promote activities aimed at "
        "achieving the purpose and objectives of the Union."
    )
)
story.append(p("2.2 A candidate must meet the following criteria for membership in the Union:", "BodyBold"))
story.append(
    bullets(
        [
            "shares the vision, mission and values of the Union;",
            "takes part in achieving the purpose and objectives of the Union;",
            "undertakes to comply with the Code of Conduct for Members of the Union;",
            "confirms their professional experience and is prepared to pursue continuous improvement;",
            "has an impeccable business reputation.",
        ]
    )
)
story.append(
    p(
        "2.3 The decision on admission as an associate member of the Union is taken on the basis "
        "of fulfilment of the requirements set out on the official website of ESOSH, namely:",
        "BodyBold",
    )
)
story.append(
    bullets(
        [
            "an application for admission to ESOSH;",
            "a curriculum vitae (for natural persons) or a company profile (for legal entities) in free form confirming professional activity (see clause 4.2 of the Regulations — ESOSH qualification requirements for the “Specialist” level);",
            "successful completion of a test on knowledge of the Code of Conduct for ESOSH Participants;",
            "consent to the processing of personal data;",
            "consent to comply with the Code of Conduct and these Regulations in activities related to ESOSH.",
        ]
    )
)
story.append(
    p(
        "2.4 The decision on the admission of legal entities as associate members of the Union is "
        "taken, in addition to the requirements of clause 2.3, on the basis of the results of an "
        "audit of compliance with the criteria set out in clause 2.2 of these Regulations. The "
        "audit is conducted by ESOSH or by an organisation authorised by the Union, has an "
        "established periodicity, and is aimed at maintaining an impeccable reputation of the "
        "legal entity — ESOSH participant — in the field of occupational safety and health."
    )
)
story.append(
    p(
        "2.5 The Union may require candidates to provide additional information (documents) to "
        "complete the admission procedure. Associate membership in ESOSH is confirmed by a "
        "relevant letter from the Board of ESOSH and by an entry in the register of associate "
        "members of the Union. The Board reserves the right to refuse admission of a candidate as "
        "an associate member of the Union without stating reasons."
    )
)
story.append(p("2.6 Associate membership in the Union terminates in the following cases:", "BodyBold"))
story.append(
    bullets(
        [
            "withdrawal from the Union at one’s own request;",
            "expulsion from the Union by decision of the Board in connection with a breach of the requirements of the Charter, these Regulations on the Activities of the Union and the Code of Conduct for Participants of the Union;",
            "if the member’s activities conflict with the purpose and objectives of the Union;",
            "if the member has lost contact with the Union without good reason;",
            "death of a member of the Union.",
        ]
    )
)
story.append(p("2.7 Participation in the Union is free of charge for its members."))

story.append(p("3. RIGHTS AND DUTIES OF MEMBERS OF THE UNION AND ASSOCIATE MEMBERS OF THE UNION", "H"))
story.append(p("3.1 Rights of an associate member of the Union:", "BodyBold"))
story.append(
    bullets(
        [
            "to take part in all events held by the Union, except in cases determined by the General Meeting of Participants of the Union;",
            "to take part in the work of permanent and temporary commissions, sections, branches and other non-governing bodies established by decision of the authorised bodies of the Union;",
            "to submit proposals concerning the Union’s activities to the relevant bodies of the Union;",
            "to apply to the bodies of the Union for assistance in protecting their rights and legitimate interests directly related to the activities of the Union;",
            "to take part in mass events organised by the Union on special (preferential) terms approved by the Board, where such terms have been established;",
            "to enjoy discounts from the Union’s partners provided for associate members of the Union;",
            "to take part in social and charitable activities carried out by the Union;",
            "to use in their professional activities information provided by the Union from open sources, and information on their acquired membership status in the Union;",
            "voluntarily and freely to acquire and terminate associate membership in the Union.",
        ]
    )
)
story.append(p("3.2 Duties of an associate member of the Union:", "BodyBold"))
story.append(
    bullets(
        [
            "in their activities, where they relate to the Union, to be guided by the Charter of the Union, these Regulations and other internal documents of the Union;",
            "to take an active part in achieving the objectives and tasks of the Union and to assist the Union in every way in its activities;",
            "to implement decisions adopted by the governing bodies of the Union;",
            "to refrain from acts and statements that conflict with the policy, purpose and objectives of the Union’s activities, or that may harm its business reputation;",
            "not to infringe the rights of other members of the Union, including associate members, in relations with the Union;",
            "to uphold the authority and business reputation of the Union;",
            "to notify the Union of their current contact details and of any changes thereto;",
            "to confirm the active status of their associate membership in the manner and within the time limits prescribed by the Union.",
        ]
    )
)

story.append(p("4. QUALIFICATION LEVELS OF ASSOCIATE MEMBERS OF THE UNION", "H"))
story.append(
    p(
        "4.1 The Union provides its associate members who are natural persons with the "
        "opportunity to enhance their competence within or outside the Union and to confirm their "
        "qualification level on the basis of honesty, impartiality and objectivity. For this "
        "purpose, four (4) qualification levels for specialists in occupational hygiene and "
        "safety operate within the Union, taking into account professional practical experience "
        "and the level of professional knowledge:"
    )
)
story.append(
    bullets(
        [
            "Level 1 — Specialist;",
            "Level 2 — Accredited Specialist;",
            "Level 3 — Certified Expert;",
            "Level 4 — Chartered Expert.",
        ]
    )
)
story.append(
    p(
        "Progression through the qualification levels is undertaken by associate members at "
        "their own discretion, on a non-compulsory basis, and enables continuous professional "
        "development."
    )
)
story.append(
    p(
        "4.2 The requirements for the qualification levels of associate members of ESOSH are set "
        "out in clauses 4.2.1–4.2.4. A qualification level is acquired by a candidate upon "
        "meeting all requirements established for each level:"
    )
)

story.append(p("4.2.1 Level 1 — Specialist (abbr. S ESOSH)", "BodyBold"))
story.append(
    p(
        "<b>Condition 1.</b> Practical work experience in the positions of engineer, specialist "
        "or manager in occupational safety / industrial safety of not less than 2 years at an "
        "enterprise with a workforce of more than 20 persons, or, for graduates of higher "
        "education institutions — a specialised higher education degree in the specialty "
        "“Occupational Safety” (not lower than a bachelor’s degree)."
    )
)
story.append(
    p(
        "<b>Condition 2.</b> 100% successful completion of a test on knowledge of the Code of "
        "Conduct for ESOSH Participants."
    )
)

story.append(p("4.2.2 Level 2 — Accredited Specialist (abbr. AS ESOSH)", "BodyBold"))
story.append(
    p(
        "<b>Condition 1.</b> Practical work experience in the positions of engineer, specialist "
        "or manager in occupational safety / industrial safety of not less than 2 years at an "
        "enterprise with a workforce of more than 20 persons, or, for graduates of higher "
        "education institutions — a specialised higher education degree in the specialty "
        "“Occupational Safety” (not lower than a bachelor’s degree)."
    )
)
story.append(
    p(
        "<b>Condition 2.</b> An ESOSH Specialist who holds an ESOSH certificate of completion of "
        "a basic course in occupational safety and health management (21 instructional hours), "
        "or who has completed an equivalent course under a programme of internationally "
        "recognised occupational safety training centres (IOSH Managing Safely, NEBOSH Award or "
        "their equivalents)."
    )
)

story.append(p("4.2.3 Level 3 — Certified Expert (abbr. CE ESOSH)", "BodyBold"))
story.append(
    p(
        "<b>Condition 1.</b> Practical work experience in the positions of engineer, specialist "
        "or manager in occupational safety / industrial safety of not less than 5 years at an "
        "enterprise with a workforce of more than 50 persons."
    )
)
story.append(
    p(
        "<b>Condition 2.</b> An ESOSH participant of Level 1 or 2 who holds an ESOSH certificate "
        "of completion of an advanced course in occupational safety and health management "
        "(130 instructional hours), or who has completed an equivalent course under a programme "
        "of internationally recognised occupational safety training centres (NEBOSH IGC or its "
        "equivalents)."
    )
)
story.append(
    p(
        "<b>Condition 3.</b> An ESOSH participant who maintains the Continuing Professional "
        "Development Programme (ESOSH CPD Programme) published on the official website of "
        "ESOSH, in which information on professional activities performed and on their further "
        "planning is recorded."
    )
)

story.append(p("4.2.4 Level 4 — Chartered Expert (abbr. ChE ESOSH)", "BodyBold"))
story.append(
    p(
        "<b>Condition 1.</b> Practical work experience in the positions of engineer, specialist "
        "or manager in occupational safety / industrial safety of not less than 5 years at an "
        "enterprise with a workforce of more than 50 persons."
    )
)
story.append(
    p(
        "<b>Condition 2.</b> An ESOSH participant of Level 1, 2 or 3 who holds an ESOSH "
        "certificate of completion of a diploma course in occupational safety and health "
        "management (not less than 1.5 years of part-time study), or who has completed an "
        "equivalent course under a programme of internationally recognised occupational safety "
        "training centres — NEBOSH Diploma, NVQ5, or their equivalents."
    )
)
story.append(
    p(
        "<b>Condition 3.</b> The ESOSH participant maintains the Continuing Professional "
        "Development Programme (ESOSH CPD Programme) published on the official website of "
        "ESOSH, in which information on professional activities performed and on their further "
        "planning is recorded."
    )
)
story.append(
    p(
        "<b>Condition 4.</b> The ESOSH participant has successfully completed an interview with "
        "other Chartered Experts of ESOSH for the purpose of verifying the level of knowledge "
        "and practical experience in solving tasks with the application of a risk-based approach."
    )
)

story.append(
    p(
        "4.3 Training programmes, seminars and professional development courses of ESOSH are "
        "conducted by the Union or by an organisation authorised by it on the basis of ordinary "
        "market relations. The decision on the award of a qualification level is taken by the "
        "Board of ESOSH on the basis of an application by an associate member of ESOSH, the "
        "results of knowledge assessment within the training, and the certificates obtained."
    )
)

story.append(p("5. GOVERNING BODIES OF THE UNION", "H"))
story.append(
    p(
        "5.1 The governing bodies of the Union are: the General Meeting of Members of the Union, "
        "the Board, and the Supervisory Board, the activities of which are governed by the "
        "Charter of the Union."
    )
)
story.append(
    p(
        "5.2 The <b>General Meeting of Members of the Union</b> is the highest body of the Union "
        "and is entitled to take decisions on any matters of its activities, including matters "
        "falling within the competence of the Board. Ordinary General Meetings are convened by "
        "the Board annually. Members of the Union may be elected by the Board from among the "
        "associate members of the Union."
    )
)
story.append(
    p(
        "5.3 The <b>Board of the Union</b> is the governing body of the Union for the period "
        "between General Meetings, is elected for a term of 5 years and performs functions of "
        "managing the Union’s current organisational activities. The Board comprises: the Chair "
        "of the Board and the Director General, whose functional duties are set out in the "
        "Charter of the Union."
    )
)
story.append(
    p(
        "5.4 The <b>Supervisory Board</b> is an advisory and supervisory body of the Union. "
        "Members of the Supervisory Board are entitled to attend meetings of the Board of the "
        "Union with a consultative vote."
    )
)

story.append(p("FINAL PROVISIONS", "H"))
story.append(
    p(
        "These Regulations enter into force on the date of their approval by the Board of the "
        "Union, are binding upon new members of the Union, and remain in force until repealed or "
        "until a new instrument governing analogous matters is adopted in accordance with the "
        "procedure established by the internal regulatory documents of the Union. Amendments and "
        "supplements to these Regulations enter into force on the date of their approval by the "
        "Board of the Union."
    )
)

doc = SimpleDocTemplate(
    str(OUT),
    pagesize=A4,
    leftMargin=18 * mm,
    rightMargin=18 * mm,
    topMargin=16 * mm,
    bottomMargin=16 * mm,
    title="Regulations on the Activities of ESOSH",
    author="European Society of Occupational Safety and Health (ESOSH)",
    subject="English translation of the ESOSH Activity Regulations (source: Ukrainian PDF)",
)
doc.build(story)
print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
