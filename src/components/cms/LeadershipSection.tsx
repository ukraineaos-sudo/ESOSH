import type { LeadershipPerson } from "@/lib/cms/leadership";
import { listPublishedLeadership } from "@/lib/cms/leadership";

/** Fallback when DB empty / unavailable — mirrors legacy about-esosh capture. */
const LEGACY: Omit<LeadershipPerson, "id" | "sortOrder" | "status">[] = [
  {
    photoUrl: "/images/about-esosh/OlgaBohdanova-560c8d24.jpeg",
    photoClass: "",
    nameUk: "Ольга Богданова",
    nameEn: "Olha Bohdanova",
    roleUk: "Співзасновник, Голова Правління",
    roleEn: "Co-founder, Chairman of the Board",
  },
  {
    photoUrl: "/images/about-esosh/01-10-6662ed46.webp",
    photoClass: "",
    nameUk: "Дмитро Григоренко",
    nameEn: "Dmytro Grigorenko",
    roleUk: "Співзасновник, Генеральний Директор",
    roleEn: "Co-founder, CEO",
  },
  {
    photoUrl: "/images/about-esosh/OlegTokar-60bdc828.jpeg",
    photoClass: "",
    nameUk: "Олег Токар",
    nameEn: "Oleh Tokar",
    roleUk: "Директор з Розвитку",
    roleEn: "Director of Development",
  },
  {
    photoUrl: "/images/about-esosh/Ehnes-d0d0177e.jpg",
    photoClass: "is--helmut",
    nameUk: "Helmut Ehnes",
    nameEn: "Helmut Ehnes",
    roleUk: "Член Спостережної Ради",
    roleEn: "Member of the Supervisory Board",
  },
  {
    photoUrl: "/images/about-esosh/Antonina-f9d22d41.webp",
    photoClass: "",
    nameUk: "Антоніна Сулхова",
    nameEn: "Antonina Devenis",
    roleUk: "Член Спостережної Ради",
    roleEn: "Member of the Supervisory Board",
  },
  {
    photoUrl: "/images/about-esosh/f0743e95-00d9-47bd-aaf6-5593a1e6b2a1-5a09de8d.webp",
    photoClass: "",
    nameUk: "Олександр Шевченко",
    nameEn: "Oleksandr Shevchenko",
    roleUk: "Координатор",
    roleEn: "Coordinator",
  },
];

/** RU: Сітка керівного складу на Про ESOSH. EN: Leadership grid on About. */
export async function LeadershipSection({ locale }: { locale: "uk" | "en" }) {
  const fromDb = await listPublishedLeadership();
  const people =
    fromDb.length > 0
      ? fromDb
      : LEGACY.map((p, i) => ({
          id: -(i + 1),
          sortOrder: i,
          status: "published",
          ...p,
        }));

  const title = locale === "en" ? "The management team" : "Керівний склад";

  return (
    <section className="section is--margin-top-144--t-128--m-104">
      <div className="w-layout-blockcontainer container w-container">
        <h2 className="h2 is--margin-bottom-40">{title}</h2>
        <div className="w-layout-grid is--grid-3columns--t-2--m-1">
          {people.map((person) => {
            const name = locale === "en" ? person.nameEn || person.nameUk : person.nameUk || person.nameEn;
            const role = locale === "en" ? person.roleEn || person.roleUk : person.roleUk || person.roleEn;
            const imgClass = [
              "image",
              "is--w-100p",
              "is--height-480--a-360",
              "is--fit-cover",
              "is--radius-6",
              "is--margin-bottom-20--m-16",
              person.photoClass,
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div key={person.id} className="block">
                {person.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={person.photoUrl}
                    loading="lazy"
                    alt={name}
                    className={imgClass}
                    width={600}
                    height={720}
                    decoding="async"
                  />
                ) : (
                  <div
                    className="image is--w-100p is--height-480--a-360 is--radius-6 is--margin-bottom-20--m-16"
                    style={{ background: "#e8eef8" }}
                    aria-hidden
                  />
                )}
                <div className="wrapper is--max-width-408 is--padding-right-24--m-0">
                  <h3 className="h3 is--margin-bottom-8">{name}</h3>
                  <div className="regular-l is--grey-60">{role}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
