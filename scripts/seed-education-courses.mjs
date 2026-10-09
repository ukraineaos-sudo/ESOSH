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
  },
  {
    sortOrder: 1,
    imageUrl: "/images/education-courses/2026-05-10-131220997-b2b508b0.webp",
    levelUk: "Базовий",
    levelEn: "Basic",
    titleUk: "Ментальне здоровʼя на роботі. Курс для менеджерів з безпеки праці та управління персоналом",
    titleEn: "Mental health management at work. Systemic and individual approach",
  },
  {
    sortOrder: 2,
    imageUrl: "/images/education-courses/2026-05-11-163020593-e4434dca.webp",
    levelUk: "Базовий",
    levelEn: "Basic",
    titleUk: "Дії в надзвичайних ситуаціях",
    titleEn: "Actions in emergency situations",
  },
  {
    sortOrder: 3,
    imageUrl: "/images/education-courses/2026-05-11-163949704-7ba542aa.webp",
    levelUk: "Базовий",
    levelEn: "Basic",
    titleUk: "Курс самозахисту для дітей «Захист Лева»",
    titleEn: "Self-defense course for children “Lion’s Protection”",
  },
  {
    sortOrder: 4,
    imageUrl: "/images/education-courses/2026-05-11-170812235-8dccb61a.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Безпечне водіння",
    titleEn: "Safe driving",
  },
  {
    sortOrder: 5,
    imageUrl: "/images/education-courses/2026-05-13-143824021-e222fc4e.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Оцінювання ризиків. ISO 45001:2018 на практиці",
    titleEn: "Risk assessment in practice. ISO 45001:2018 in practice",
  },
  {
    sortOrder: 6,
    imageUrl: "/images/education-courses/2026-05-13-145247657-81b691f3.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Розслідування нещасних випадків. Управління інцидентами",
    titleEn: "Accident investigation. Incident management",
  },
  {
    sortOrder: 7,
    imageUrl: "/images/education-courses/joshua-sukoff-TmNNde-SdZE-unsplash-061971c7.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Безпека робіт на висоті",
    titleEn: "Work at height safety",
  },
  {
    sortOrder: 8,
    imageUrl: "/images/education-courses/wes-hicks-4-EeTnaC1S4-unsplash-54f9f9da.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Аудит з безпеки та здоров’я на роботі",
    titleEn: "Labor safety audits. Checklists, observations, surveys, conclusions",
  },
  {
    sortOrder: 9,
    imageUrl: "/images/education-courses/ehmitrich-fW6lwDM26o0-unsplash-eb381da2.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Безпека машин і механізмів",
    titleEn: "Safety of machines and mechanisms",
  },
  {
    sortOrder: 10,
    imageUrl: "/images/education-courses/2026-05-18-164254654-14baae75.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Безпека виконання земляних робіт",
    titleEn: "Safety of excavation works",
  },
  {
    sortOrder: 11,
    imageUrl: "/images/education-courses/018-cd32dd3e.webp",
    levelUk: "Поглиблений",
    levelEn: "Advanced",
    titleUk: "Оцінка технологічних ризиків методами HAZOP/HAZID",
    titleEn: "Technological risk assessment using HAZOP/HAZID methods",
  },
];

const SEED = SEED_RAW.map((row) => ({
  ...row,
  slug: slugify(row.titleEn || row.titleUk),
  descriptionUk: row.descriptionUk || "",
  descriptionEn: row.descriptionEn || "",
  descriptionExtraUk: row.descriptionExtraUk || "",
  descriptionExtraEn: row.descriptionExtraEn || "",
  ctaUrl: "",
  ctaLabelUk: "Записатися",
  ctaLabelEn: "Register",
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
