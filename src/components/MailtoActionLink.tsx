"use client";

import { useLocale } from "next-intl";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { SITE } from "@/lib/site";
import { localizedPath } from "@/lib/locale";

type Props = {
  subject?: string;
  body?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/** RU: mailto с запасным переходом на контакты. EN: mailto with contact-page fallback. */
export function MailtoActionLink({ subject, body, children, className, onClick, ...rest }: Props) {
  const locale = useLocale();
  const contactPath = localizedPath(locale, "/contact-us");
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  const href = `mailto:${SITE.email}${query ? `?${query}` : ""}`;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    window.location.href = href;
    window.setTimeout(() => {
      if (document.hasFocus()) window.location.assign(contactPath);
    }, 800);
  }

  return (
    <a href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
