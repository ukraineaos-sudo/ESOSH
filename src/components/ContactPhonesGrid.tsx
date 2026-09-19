import { getContactSettings } from "@/lib/site-settings";

/** RU: Карточки телефонов/email из settings. EN: Contact cards from site settings. */
export async function ContactPhonesGrid({
  locale,
  labels,
}: {
  locale: "uk" | "en";
  labels: { phone: string; email: string };
}) {
  const settings = await getContactSettings();
  const phoneIcon = "/images/contact-us/Phone-db61c784.svg";
  const mailIcon = "/images/contact-us/Mail-162a9ef8.svg";
  return (
    <div className="w-layout-grid is--grid-3-columns--a-1-column-small-spacing">
      {settings.phones.slice(0, 2).map((phone) => (
        <a
          key={phone.href}
          href={phone.href}
          className="block is--link-block is--accent-light-bg is--spacing-32-32--m-24-32 is--radius-6 w-inline-block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={phoneIcon} loading="lazy" alt="" className="is--icon-size-40 is--margin-bottom-40" />
          <div className="wrapper">
            <div className="regular-l is--margin-bottom-12">{labels.phone}</div>
            <h3 className="h3">{phone.display}</h3>
          </div>
        </a>
      ))}
      <a
        href={`mailto:${settings.email}`}
        className="block is--link-block is--accent-light-bg is--spacing-32-32--m-24-32 is--radius-6 w-inline-block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mailIcon} loading="lazy" alt="" className="is--icon-size-40 is--margin-bottom-40" />
        <div className="wrapper">
          <div className="regular-l is--margin-bottom-12">{labels.email}</div>
          <h3 className="h3">{settings.email}</h3>
        </div>
      </a>
      {locale === "uk" && settings.addressUk ? (
        <div className="regular-l" style={{ gridColumn: "1 / -1" }}>
          {settings.addressUk}
        </div>
      ) : null}
      {locale === "en" && settings.addressEn ? (
        <div className="regular-l" style={{ gridColumn: "1 / -1" }}>
          {settings.addressEn}
        </div>
      ) : null}
    </div>
  );
}
