/**
 * Seed leadership_people from legacy About capture (idempotent).
 *
 *   npm run db:seed-leadership
 *   npm run db:seed-leadership -- --force   # wipe table then insert
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const FORCE = process.argv.includes("--force");

const SEED = [
  {
    sortOrder: 0,
    photoUrl: "/images/about-esosh/OlgaBohdanova-560c8d24.jpeg",
    photoClass: "",
    nameUk: "Ольга Богданова",
    nameEn: "Olha Bohdanova",
    roleUk: "Співзасновник, Голова Правління",
    roleEn: "Co-founder, Chairman of the Board",
  },
  {
    sortOrder: 1,
    photoUrl: "/images/about-esosh/01-10-6662ed46.webp",
    photoClass: "",
    nameUk: "Дмитро Григоренко",
    nameEn: "Dmytro Grigorenko",
    roleUk: "Співзасновник, Генеральний Директор",
    roleEn: "Co-founder, CEO",
  },
  {
    sortOrder: 2,
    photoUrl: "/images/about-esosh/OlegTokar-60bdc828.jpeg",
    photoClass: "",
    nameUk: "Олег Токар",
    nameEn: "Oleh Tokar",
    roleUk: "Директор з Розвитку",
    roleEn: "Director of Development",
  },
  {
    sortOrder: 3,
    photoUrl: "/images/about-esosh/Ehnes-d0d0177e.jpg",
    photoClass: "is--helmut",
    nameUk: "Helmut Ehnes",
    nameEn: "Helmut Ehnes",
    roleUk: "Член Спостережної Ради",
    roleEn: "Member of the Supervisory Board",
  },
  {
    sortOrder: 4,
    photoUrl: "/images/about-esosh/Antonina-f9d22d41.webp",
    photoClass: "",
    nameUk: "Антоніна Сулхова",
    nameEn: "Antonina Devenis",
    roleUk: "Член Спостережної Ради",
    roleEn: "Member of the Supervisory Board",
  },
  {
    sortOrder: 5,
    photoUrl: "/images/about-esosh/f0743e95-00d9-47bd-aaf6-5593a1e6b2a1-5a09de8d.webp",
    photoClass: "",
    nameUk: "Олександр Шевченко",
    nameEn: "Oleksandr Shevchenko",
    roleUk: "Координатор",
    roleEn: "Coordinator",
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    create table if not exists leadership_people (
      id serial primary key,
      sort_order integer not null default 0,
      photo_url text not null default '',
      photo_class varchar(128) not null default '',
      name_uk text not null default '',
      name_en text not null default '',
      role_uk text not null default '',
      role_en text not null default '',
      status varchar(32) not null default 'published',
      updated_at timestamptz not null default now(),
      created_at timestamptz not null default now()
    )
  `;

  const [{ count }] = await sql`select count(*)::int as count from leadership_people`;
  if (count > 0 && !FORCE) {
    console.log(`leadership_people already has ${count} row(s). Skip (use --force to replace).`);
    return;
  }
  if (FORCE) {
    await sql`delete from leadership_people`;
    console.log("cleared leadership_people");
  }

  for (const row of SEED) {
    await sql`
      insert into leadership_people (
        sort_order, photo_url, photo_class, name_uk, name_en, role_uk, role_en, status
      ) values (
        ${row.sortOrder},
        ${row.photoUrl},
        ${row.photoClass},
        ${row.nameUk},
        ${row.nameEn},
        ${row.roleUk},
        ${row.roleEn},
        'published'
      )
    `;
  }
  console.log(`seeded ${SEED.length} leadership cards`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
