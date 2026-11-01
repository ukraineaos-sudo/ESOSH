import {
  oilGasSiteSafetyIntro,
  type OilGasSiteSafetyIntroCopy,
} from "@/content/trainings/oil-gas-site-safety-intro";
import type { LocaleCode, LocalizedString } from "@/content/trainings/types";
import { pickLocalized } from "@/content/trainings/types";

type Props = {
  locale: LocaleCode;
  copy?: OilGasSiteSafetyIntroCopy;
};

function text(map: LocalizedString, locale: LocaleCode): string {
  return pickLocalized(map, locale) ?? map.en;
}

function withTokenLink(
  template: string,
  token: string,
  link: { href: string; label: string; external?: boolean },
) {
  const marker = `{${token}}`;
  const index = template.indexOf(marker);
  if (index < 0) return <>{template}</>;
  const before = template.slice(0, index);
  const after = template.slice(index + marker.length);
  return (
    <>
      {before}
      <a
        href={link.href}
        className="is--accent"
        {...(link.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : undefined)}
      >
        {link.label}
      </a>
      {after}
    </>
  );
}

/**
 * RU: Вступ OGS між заголовком і модулями.
 * EN: Oil-gas intro between title and modules.
 */
export function OilGasSiteSafetyIntro({
  locale,
  copy = oilGasSiteSafetyIntro,
}: Props) {
  return (
    <aside className="training-intro" aria-label={text(copy.sections[0].title, locale)}>
      <div className="training-intro__body">
        {copy.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="training-intro__section">
            <h2
              className={
                sectionIndex === 0
                  ? "h3 training-intro__title"
                  : "h3 training-intro__section-title"
              }
            >
              {text(section.title, locale)}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className="regular-l">
                {text(paragraph, locale)}
              </p>
            ))}
            {section.bullets && section.bullets.length > 0 ? (
              <ul className="training-intro__list regular-l">
                {section.bullets.map((item, index) => (
                  <li key={index}>{text(item, locale)}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        <p className="regular-l">
          {withTokenLink(text(copy.inviteTrainings, locale), "email", {
            href: copy.emailHref,
            label: copy.emailDisplay,
          })}
        </p>

        <p className="regular-l">
          {withTokenLink(text(copy.inviteApp, locale), "app", {
            href: copy.appHref,
            label: copy.appDisplay,
            external: true,
          })}
        </p>

        <p className="regular-l">{text(copy.closing, locale)}</p>

        <p className="regular-s training-intro__sign">
          <span>{text(copy.signName, locale)}</span>
          <br />
          <span>{text(copy.signRole, locale)}</span>
        </p>
      </div>
    </aside>
  );
}
