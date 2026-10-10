import {
  emergencyActionsIntro,
  type EmergencyActionsIntroCopy,
} from "@/content/trainings/emergency-actions-intro";
import type { LocaleCode, LocalizedString } from "@/content/trainings/types";
import { pickLocalized } from "@/content/trainings/types";

type Props = {
  locale: LocaleCode;
  copy?: EmergencyActionsIntroCopy;
};

function text(map: LocalizedString, locale: LocaleCode): string {
  return pickLocalized(map, locale) ?? map.en;
}

/** RU: Вставити mailto замість `{email}`. EN: Insert mailto for `{email}`. */
function withEmailLink(template: string, href: string, label: string) {
  const marker = "{email}";
  const index = template.indexOf(marker);
  if (index < 0) return <>{template}</>;
  return (
    <>
      {template.slice(0, index)}
      <a href={href} className="is--accent">
        {label}
      </a>
      {template.slice(index + marker.length)}
    </>
  );
}

/** RU: Вступ emergency-actions між заголовком і модулями. EN: Emergency-actions intro before modules. */
export function EmergencyActionsIntro({ locale, copy = emergencyActionsIntro }: Props) {
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
          {withEmailLink(text(copy.inviteTrainings, locale), copy.emailHref, copy.emailDisplay)}
        </p>

        <p className="regular-s training-intro__sign">
          <span>{text(copy.signName, locale)}</span>
          <br />
          <span>{text(copy.signOrg, locale)}</span>
        </p>
      </div>
    </aside>
  );
}
