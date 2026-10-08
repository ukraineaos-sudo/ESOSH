import {
  riskAssessmentIntro,
  type RiskAssessmentIntroCopy,
} from "@/content/trainings/risk-assessment-intro";
import type { LocaleCode, LocalizedString } from "@/content/trainings/types";
import { pickLocalized } from "@/content/trainings/types";

type Props = {
  locale: LocaleCode;
  copy?: RiskAssessmentIntroCopy;
};

function text(map: LocalizedString, locale: LocaleCode): string {
  return pickLocalized(map, locale) ?? map.en;
}

/** RU: Вставити посилання замість `{token}` у локалізованому рядку. */
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

/** RU: Вступ risk-assessment між заголовком і модулями. EN: Risk-assessment intro before modules. */
export function RiskAssessmentIntro({ locale, copy = riskAssessmentIntro }: Props) {
  const title = text(copy.title, locale);

  return (
    <aside className="training-intro" aria-labelledby="training-intro-title">
      <h2 id="training-intro-title" className="h3 training-intro__title">
        {title}
      </h2>

      <div className="training-intro__body">
        {copy.paragraphs.map((paragraph, index) => (
          <p key={index} className="regular-l">
            {text(paragraph, locale)}
          </p>
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

        <p className="regular-s training-intro__blurb">{text(copy.appBlurb, locale)}</p>

        <p className="regular-l">{text(copy.closing, locale)}</p>

        <p className="regular-s training-intro__sign">
          <span>{text(copy.signName, locale)}</span>
          <br />
          <span>{text(copy.signOrg, locale)}</span>
        </p>
      </div>
    </aside>
  );
}
