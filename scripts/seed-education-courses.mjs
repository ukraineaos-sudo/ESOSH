/**
 * Seed education_courses from legacy «Наші курси» grid (uk page as source of truth).
 *
 *   npm run db:seed-education-courses
 *   npm run db:seed-education-courses -- --force   # wipe then insert
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const FORCE = process.argv.includes("--force");

function cleanDescription(text) {
  return String(text || "")
    .replace(/\u200d/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function slugify(input) {
  const map = {
    а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye", ж: "zh", з: "z",
    и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
    р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
    ь: "", ю: "yu", я: "ya", ё: "yo",
  };
  return String(input || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[''`ʼ]/g, "")
    .split("")
    .map((ch) => map[ch] || ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120) || "course";
}

const INCLUSION_EXTRA = cleanDescription(`Навчальний курс для керівників, фахівців з безпеки праці, HR фахівців. 8 модулів (72 академічні години), що охоплюють: законодавство, систему управління, аудит середовища, комунікацію, цифрову доступність, умови праці, HR-процеси та безпеку, практичні кейси з бізнес-контексту — рішення, які можна впроваджувати одразу, фокус на реальних процесах компанії, а не теорії.

Організатори: Європейське співтовариство з охорони праці ESOSH, Криворізький національний університет, редакція журналу «Охорона праці».

Зміст:
1. Основи інклюзії та безбар'єрності. Законодавство та політики
2. Інтеграція принципів інклюзії та безбар'єрності у систему управління охороною праці (СУОП)
3. Ідентифікація бар'єрів та оптимізація робочих місць. Ергономіка
4. Інклюзивна комунікація у робочому середовищі
5. Цифрова доступність у робочому середовищі
6. Санітарно-гігієнічні умови праці та безбар'єрність
7. Інклюзивний рекрутинг та адаптація працівників
8. Організація реагування на надзвичайні ситуації в інклюзивному середовищі

Результати курсу:
✅ Проведете аудит бар'єрів: фізичних, цифрових, інформаційних і комунікаційних
✅ Навчитеся будувати інклюзивну комунікацію та працювати з чутливими аудиторіями
✅ Мінімізуєте ризики та підвищите відповідність вимогам
✅ Інтегруєте безбар'єрність у систему менеджменту компанії (HSE, HR, операційна діяльність, інфраструктура, цифрове середовище)
✅ Налаштуєте інклюзивні HR-процеси: найм, адаптацію, розвиток
✅ Зможете забезпечити евакуацію та безпеку з урахуванням різних потреб людей

За результатами навчання отримаєте:
Сертифікат «Координатор з інклюзії та безбар'єрності» (ESOSH)
Свідоцтво про підвищення кваліфікації державного зразка від Криворізького національного університету`);

const MENTAL_EXTRA_UK = cleanDescription(`Навчальний курс для менеджерів з безпеки праці та управління персоналом. 82 навчальні години, 10 змістовних модулів, онлайн-зустрічі протягом 10 тижнів, практичні завдання, тестування та іспит.

Організатори: Європейське співтовариство з охорони праці ESOSH, Криворізький національний університет, редакція журналу «Охорона праці».

Зміст:
1. Огляд питань ментального здоровʼя на роботі. Загальні положення ISO 45003 «Система керування ментальним здоровʼям на роботі»
2. Алгоритм впровадження системи керування ментальним здоровʼям
3. Превентивний підхід до керування ментальним здоровʼям на роботі
4. Емоційний інтелект
5. Стрес та стратегії його управління
6. Ефективне спілкування
7. Управління конфліктами на роботі
8. Організація системи надання першої психологічної допомоги

Результати курсу:
✅ Отримаєте кваліфікацію «Координатор з ментального здоровʼя» з державним сертифікатом від Криворізького національного університету (КНУ) та сертифікатом ESOSH
✅ Розробите покрокову програму з керування ментальним здоровʼям для вашого підприємства під керівництвом тренерів з Великої Британії та України`);

const MENTAL_EXTRA_EN = cleanDescription(`Training course for occupational safety managers and HR professionals. 82 instructional hours, 10 comprehensive modules, online sessions over 10 weeks, practical assignments, testing, and a final exam.

Organizers: European Society of Occupational Safety and Health (ESOSH), Kryvyi Rih National University, and the editorial team of the "Occupational Safety" journal.

Course content:
1. Overview of workplace mental health issues. General provisions of ISO 45003: "Workplace Mental Health Management System"
2. Implementation algorithm for a workplace mental health management system
3. Preventive approach to managing mental health in the workplace
4. Emotional intelligence
5. Stress and strategies for its management
6. Effective communication
7. Conflict management in the workplace
8. Organization of a first psychological aid system

Outcomes:
✅ Qualification of "Mental Health Coordinator" with a state certificate from Kryvyi Rih National University (KNU) and an ESOSH certificate
✅ A step-by-step mental health management program for your company under the guidance of trainers from the UK and Ukraine`);

/** UK grid order + images; EN titles curated. */
const SEED_RAW = [
  {
    sortOrder: 0,
    imageUrl: "/images/education-courses/photo-5337256396346562084-x-0b1e961e.jpg",
    levelUk: "Базовий",
    levelEn: "Basic",
    titleUk: "Координатор з інклюзії та безбар'єрності",
    titleEn: "Inclusion and Accessibility Coordinator",
    descriptionUk:
      "Навчальний курс для керівників, фахівців з безпеки праці та HR: інклюзія й безбар'єрність у компанії.",
    descriptionEn:
      "A training course for managers, OSH and HR specialists: inclusion and accessibility in the workplace.",
    descriptionExtraUk: INCLUSION_EXTRA,
    descriptionExtraEn: "",
    ctaUrl:
      "https://ohoronapraci.kiev.ua/landing/kurs-koordinator-z-inkluzii-ta-bezbarernosti",
    ctaLabelUk: "Детальніше",
    ctaLabelEn: "Learn more",
  },
  {
    sortOrder: 1,
    imageUrl: "/images/education-courses/2026-05-10-131220997-b2b508b0.webp",
    levelUk: "Базовий",
    levelEn: "Basic",
    titleUk: "Ментальне здоровʼя на роботі. Курс для менеджерів з безпеки праці та управління персоналом",
    titleEn: "Mental health management at work. Systemic and individual approach",
    descriptionUk:
      "Навчальний курс для менеджерів з безпеки праці та управління персоналом: системний і індивідуальний підхід до ментального здоровʼя на роботі.",
    descriptionEn:
      "A training course for OSH and HR managers: systemic and individual approach to workplace mental health.",
    descriptionExtraUk: MENTAL_EXTRA_UK,
    descriptionExtraEn: MENTAL_EXTRA_EN,
    ctaUrl:
      "https://ohoronapraci.kiev.ua/landing/mentalne-zdorova-na-roboti#packages-participation",
    ctaLabelUk: "Детальніше",
    ctaLabelEn: "Register",
  },
  {
    sortOrder: 2,
    imageUrl: "/images/education-courses/2026-05-11-163020593-e4434dca.webp",
    levelUk: "Базовий",
    levelEn: "Basic",
    titleUk: "Дії в надзвичайних ситуаціях",
    titleEn: "Actions in emergency situations",
    descriptionUk:
      "Навчальний курс-практикум для фахівців з безпеки праці: дії у випадку надзвичайної ситуації.",
    descriptionEn:
      "Practical training course for OSH specialists: actions in case of an emergency.",
    descriptionExtraUk: cleanDescription(`Навчальний курс для фахівців з безпеки праці. 8 навчальних годин, 11 навчальних модулів, тестування та іспит.

Тренери: фахівці нафтогазової галузі у сфері безпеки праці та цивільного захисту, ветерани – учасники бойових дій, представники ДСНС.

Зміст:
1. Поняття та класифікація надзвичайних ситуацій
2. Послідовність дій при виявленні НС
3. Комунікація та порядок інформування відповідальних органів
4. Пожежі, вибухи, витоки небезпечних речовин
5. Загроза ракетного удару або атаки дронами-камікадзе
6. Воєнні дії та вторгнення
7. Порядок евакуації з будівлі та укриття
8. Взаємодія з ДСНС, ЗСУ, поліцією та медичними службами

Сертифікат:
✅ Іменний сертифікат про проходження курсу «Дії у випадку надзвичайної ситуації» від ESOSH

Переваги курсу:
✅ Підвищення рівня готовності працівників до реальних загроз
✅ Мінімізація ризиків людських втрат та матеріальних збитків
✅ Узгоджені дії персоналу в умовах кризи
✅ Практична складова – тренування та короткі інструкції
✅ Відповідність національним та міжнародним стандартам реагування на надзвичайні ситуації`),
    descriptionExtraEn: cleanDescription(`Training course for occupational safety specialists. 8 training hours, 11 modules, testing and a final exam.

Trainers: experts from the oil and gas industry in occupational safety and civil protection, veterans – combat participants, and representatives of the State Emergency Service of Ukraine (SESU).

Course content:
1. Concept and classification of emergencies
2. Steps to take when an emergency is detected
3. Communication and notification protocol
4. Fires, explosions, and releases of hazardous substances
5. Threat of a missile strike or kamikaze drone attack
6. Armed hostilities and invasion
7. Evacuation and shelter-in-place procedures
8. Cooperation with the State Emergency Service, Armed Forces, Police, and medical services

Certificate:
✅ Personalized certificate of completion for “Actions in Case of an Emergency” from ESOSH

Course benefits:
✅ Improved readiness of employees for real threats
✅ Minimization of risks of human losses and material damage
✅ Coordinated staff actions in crisis situations
✅ Practical component – drills and concise instructions
✅ Compliance with national and international emergency response standards`),
    ctaUrl: "/contact-us",
    ctaLabelUk: "Зареєструватись",
    ctaLabelEn: "Register",
  },
  {
    sortOrder: 3,
    imageUrl: "/images/education-courses/2026-05-11-163949704-7ba542aa.webp",
    levelUk: "Базовий",
    levelEn: "Basic",
    titleUk: "Курс самозахисту для дітей «Захист Лева»",
    titleEn: "Self-defense course for children “Lion’s Protection”",
    descriptionUk:
      "Програма самозахисту для дітей 5–7 та 8–11 років: упевненість, безпечна поведінка та базові техніки.",
    descriptionEn:
      "Self-defense programme for children aged 5–7 and 8–11: confidence, safe behaviour and basic techniques.",
    descriptionExtraUk: cleanDescription(`Курс самозахисту для дітей «Левовий захист» / «Захист Лева».

Програма розроблена спеціально для дітей 5–7 та 8–11 років і спрямована на:
✔️ розвиток упевненості в собі
✔️ формування навичок безпечної поведінки
✔️ базові техніки самозахисту
✔️ вміння сказати «ні» у небезпечних ситуаціях

Формати:
🏫 школи та садочки
🏢 корпоративні тренінги для дітей співробітників
👥 відкриті набори

Сертифікат:
✅ По закінченню курсу діти отримають іменний сертифікат від ESOSH. Також готується мерч команди «левів».`),
    descriptionExtraEn: cleanDescription(`The self-defense course for children “Lion Defense”.

The programme is specially designed for children aged 5–7 and 8–11 and aims to:
✔️ develop self-confidence
✔️ build safe behaviour skills
✔️ teach basic self-defense techniques
✔️ foster the ability to say “no” in dangerous situations

Formats:
🏫 Schools and kindergartens
🏢 Corporate trainings for employees’ children
👥 Open groups

Certificate:
✅ Upon completion, children receive a personalized certificate from ESOSH. Special merchandise for the “Lion Team” is also being prepared.`),
    ctaUrl: "/contact-us",
    ctaLabelUk: "Замовити програму",
    ctaLabelEn: "Order the programme",
  },
  {
    sortOrder: 4,
    imageUrl: "/images/education-courses/2026-05-11-170812235-8dccb61a.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Безпечне водіння",
    titleEn: "Safe driving",
    descriptionUk: "Поглиблений практичний курс ESOSH: безпечне водіння.",
    descriptionEn: "Advanced practical ESOSH course: safe driving.",
    descriptionExtraUk:
      "Поглиблений практичний курс ESOSH: безпечне водіння.\n\nНа попередній версії сайту для цього курсу був лише заголовок у каталозі — повний текст програми там не публікувався.\n\nПрограма, дати, формат і умови участі — за запитом до ESOSH.",
    descriptionExtraEn:
      "Advanced practical ESOSH course: safe driving.\n\nOn the previous site this course had only a catalogue title — a full programme text was not published there.\n\nProgramme, dates, format and participation terms are available on request from ESOSH.",
    ctaUrl: "/contact-us",
    ctaLabelUk: "Звʼязатися",
    ctaLabelEn: "Contact us",
  },
  {
    sortOrder: 5,
    imageUrl: "/images/education-courses/2026-05-13-143824021-e222fc4e.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Оцінювання ризиків. ISO 45001:2018 на практиці",
    titleEn: "Risk assessment in practice. ISO 45001:2018 in practice",
    descriptionUk: "Поглиблений практичний курс ESOSH: оцінювання ризиків за ISO 45001:2018 на практиці.",
    descriptionEn: "Advanced practical ESOSH course: risk assessment in practice (ISO 45001:2018).",
    descriptionExtraUk:
      "Поглиблений практичний курс ESOSH: оцінювання ризиків за ISO 45001:2018 на практиці.\n\nНа попередній версії сайту для цього курсу був лише заголовок у каталозі — повний текст програми там не публікувався.\n\nПрограма, дати, формат і умови участі — за запитом до ESOSH.",
    descriptionExtraEn:
      "Advanced practical ESOSH course: risk assessment in practice (ISO 45001:2018).\n\nOn the previous site this course had only a catalogue title — a full programme text was not published there.\n\nProgramme, dates, format and participation terms are available on request from ESOSH.",
    ctaUrl: "/contact-us",
    ctaLabelUk: "Звʼязатися",
    ctaLabelEn: "Contact us",
  },
  {
    sortOrder: 6,
    imageUrl: "/images/education-courses/2026-05-13-145247657-81b691f3.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Розслідування нещасних випадків. Управління інцидентами",
    titleEn: "Accident investigation. Incident management",
    descriptionUk: "Поглиблений практичний курс ESOSH: розслідування нещасних випадків та управління інцидентами.",
    descriptionEn: "Advanced practical ESOSH course: accident investigation and incident management.",
    descriptionExtraUk:
      "Поглиблений практичний курс ESOSH: розслідування нещасних випадків та управління інцидентами.\n\nНа попередній версії сайту для цього курсу був лише заголовок у каталозі — повний текст програми там не публікувався.\n\nПрограма, дати, формат і умови участі — за запитом до ESOSH.",
    descriptionExtraEn:
      "Advanced practical ESOSH course: accident investigation and incident management.\n\nOn the previous site this course had only a catalogue title — a full programme text was not published there.\n\nProgramme, dates, format and participation terms are available on request from ESOSH.",
    ctaUrl: "/contact-us",
    ctaLabelUk: "Звʼязатися",
    ctaLabelEn: "Contact us",
  },
  {
    sortOrder: 7,
    imageUrl: "/images/education-courses/joshua-sukoff-TmNNde-SdZE-unsplash-061971c7.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Безпека робіт на висоті",
    titleEn: "Work at height safety",
    descriptionUk: "Поглиблений практичний курс ESOSH: безпека робіт на висоті.",
    descriptionEn: "Advanced practical ESOSH course: work at height safety.",
    descriptionExtraUk:
      "Поглиблений практичний курс ESOSH: безпека робіт на висоті.\n\nНа попередній версії сайту для цього курсу був лише заголовок у каталозі — повний текст програми там не публікувався.\n\nПрограма, дати, формат і умови участі — за запитом до ESOSH.",
    descriptionExtraEn:
      "Advanced practical ESOSH course: work at height safety.\n\nOn the previous site this course had only a catalogue title — a full programme text was not published there.\n\nProgramme, dates, format and participation terms are available on request from ESOSH.",
    ctaUrl: "/contact-us",
    ctaLabelUk: "Звʼязатися",
    ctaLabelEn: "Contact us",
  },
  {
    sortOrder: 8,
    imageUrl: "/images/education-courses/wes-hicks-4-EeTnaC1S4-unsplash-54f9f9da.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Аудит з безпеки та здоров’я на роботі",
    titleEn: "Labor safety audits. Checklists, observations, surveys, conclusions",
    descriptionUk: "Поглиблений практичний курс ESOSH: аудит з безпеки та здоров’я на роботі.",
    descriptionEn: "Advanced practical ESOSH course: occupational safety and health audits.",
    descriptionExtraUk:
      "Поглиблений практичний курс ESOSH: аудит з безпеки та здоров’я на роботі.\n\nНа попередній версії сайту для цього курсу був лише заголовок у каталозі — повний текст програми там не публікувався.\n\nПрограма, дати, формат і умови участі — за запитом до ESOSH.",
    descriptionExtraEn:
      "Advanced practical ESOSH course: occupational safety and health audits.\n\nOn the previous site this course had only a catalogue title — a full programme text was not published there.\n\nProgramme, dates, format and participation terms are available on request from ESOSH.",
    ctaUrl: "/contact-us",
    ctaLabelUk: "Звʼязатися",
    ctaLabelEn: "Contact us",
  },
  {
    sortOrder: 9,
    imageUrl: "/images/education-courses/ehmitrich-fW6lwDM26o0-unsplash-eb381da2.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Безпека машин і механізмів",
    titleEn: "Safety of machines and mechanisms",
    descriptionUk: "Поглиблений практичний курс ESOSH: безпека машин і механізмів.",
    descriptionEn: "Advanced practical ESOSH course: safety of machines and mechanisms.",
    descriptionExtraUk:
      "Поглиблений практичний курс ESOSH: безпека машин і механізмів.\n\nНа попередній версії сайту для цього курсу був лише заголовок у каталозі — повний текст програми там не публікувався.\n\nПрограма, дати, формат і умови участі — за запитом до ESOSH.",
    descriptionExtraEn:
      "Advanced practical ESOSH course: safety of machines and mechanisms.\n\nOn the previous site this course had only a catalogue title — a full programme text was not published there.\n\nProgramme, dates, format and participation terms are available on request from ESOSH.",
    ctaUrl: "/contact-us",
    ctaLabelUk: "Звʼязатися",
    ctaLabelEn: "Contact us",
  },
  {
    sortOrder: 10,
    imageUrl: "/images/education-courses/2026-05-18-164254654-14baae75.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Безпека виконання земляних робіт",
    titleEn: "Safety of excavation works",
    descriptionUk: "Поглиблений практичний курс ESOSH: безпека виконання земляних робіт.",
    descriptionEn: "Advanced practical ESOSH course: safety of excavation works.",
    descriptionExtraUk:
      "Поглиблений практичний курс ESOSH: безпека виконання земляних робіт.\n\nНа попередній версії сайту для цього курсу був лише заголовок у каталозі — повний текст програми там не публікувався.\n\nПрограма, дати, формат і умови участі — за запитом до ESOSH.",
    descriptionExtraEn:
      "Advanced practical ESOSH course: safety of excavation works.\n\nOn the previous site this course had only a catalogue title — a full programme text was not published there.\n\nProgramme, dates, format and participation terms are available on request from ESOSH.",
    ctaUrl: "/contact-us",
    ctaLabelUk: "Звʼязатися",
    ctaLabelEn: "Contact us",
  },
  {
    sortOrder: 11,
    imageUrl: "/images/education-courses/018-cd32dd3e.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Оцінка технологічних ризиків методами HAZOP/HAZID",
    titleEn: "Technological risk assessment using HAZOP/HAZID methods",
    descriptionUk: "Поглиблений практичний курс ESOSH: оцінка технологічних ризиків методами HAZOP/HAZID.",
    descriptionEn: "Advanced practical ESOSH course: technological risk assessment using HAZOP/HAZID.",
    descriptionExtraUk:
      "Поглиблений практичний курс ESOSH: оцінка технологічних ризиків методами HAZOP/HAZID.\n\nНа попередній версії сайту для цього курсу був лише заголовок у каталозі — повний текст програми там не публікувався.\n\nПрограма, дати, формат і умови участі — за запитом до ESOSH.",
    descriptionExtraEn:
      "Advanced practical ESOSH course: technological risk assessment using HAZOP/HAZID.\n\nOn the previous site this course had only a catalogue title — a full programme text was not published there.\n\nProgramme, dates, format and participation terms are available on request from ESOSH.",
    ctaUrl: "/contact-us",
    ctaLabelUk: "Звʼязатися",
    ctaLabelEn: "Contact us",
  },
];

const SEED = SEED_RAW.map((row) => ({
  ...row,
  slug: slugify(row.titleEn || row.titleUk),
  descriptionUk: row.descriptionUk || "",
  descriptionEn: row.descriptionEn || "",
  descriptionExtraUk: row.descriptionExtraUk || "",
  descriptionExtraEn: row.descriptionExtraEn || "",
  ctaUrl: row.ctaUrl || "",
  ctaLabelUk: row.ctaLabelUk || "Записатися",
  ctaLabelEn: row.ctaLabelEn || "Register",
}));

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }
  const sql = neon(process.env.DATABASE_URL);

  const [{ count }] = await sql`select count(*)::int as count from education_courses`;
  if (count > 0 && !FORCE) {
    console.log(`education_courses already has ${count} row(s). Skip (use --force to replace).`);
    return;
  }
  if (FORCE) {
    await sql`delete from education_courses`;
    console.log("cleared education_courses");
  }

  for (const row of SEED) {
    await sql`
      insert into education_courses (
        sort_order,
        slug,
        image_url,
        level_uk,
        level_en,
        title_uk,
        title_en,
        description_uk,
        description_en,
        description_extra_uk,
        description_extra_en,
        cta_url,
        cta_label_uk,
        cta_label_en,
        status
      ) values (
        ${row.sortOrder},
        ${row.slug},
        ${row.imageUrl},
        ${row.levelUk},
        ${row.levelEn},
        ${row.titleUk},
        ${row.titleEn},
        ${row.descriptionUk},
        ${row.descriptionEn},
        ${row.descriptionExtraUk},
        ${row.descriptionExtraEn},
        ${row.ctaUrl},
        ${row.ctaLabelUk},
        ${row.ctaLabelEn},
        'published'
      )
    `;
  }
  console.log(`seeded ${SEED.length} education courses`);
  for (const row of SEED) {
    console.log(`  /education/courses/${row.slug}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
