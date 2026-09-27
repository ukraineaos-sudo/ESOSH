import { countJoinedMembers } from "@/lib/members/public-stats";

type Props = {
  locale: "uk" | "en";
};

function formatCount(value: number, locale: "uk" | "en"): string {
  return value.toLocaleString(locale === "en" ? "en-GB" : "uk-UA");
}

/** RU: Заготовка лічильника членів на головній. EN: Homepage members-count stub. */
export async function HomeMembersStat({ locale }: Props) {
  const total = await countJoinedMembers();
  if (total === null) return null;

  const prefix = locale === "en" ? "/en" : "";
  const title =
    locale === "en" ? "Already with ESOSH" : "Вже з ESOSH";
  const caption =
    locale === "en"
      ? "people who have joined the community"
      : "тих, хто вже приєднався до спільноти";
  const cta = locale === "en" ? "Join us" : "Доєднатися";

  return (
    <section
      className="section is--margin-top-144--t-128--m-104 home-members-stat"
      aria-label={title}
    >
      <div className="w-layout-blockcontainer container w-container">
        <div className="home-members-stat__inner">
          <div className="home-members-stat__copy">
            <p className="home-members-stat__eyebrow">{title}</p>
            <p className="home-members-stat__number">{formatCount(total, locale)}</p>
            <p className="regular-l home-members-stat__caption">{caption}</p>
          </div>
          <a href={`${prefix}/join/apply`} className="btn is--primary w-button">
            {cta}
          </a>
        </div>
      </div>
    </section>
  );
}
