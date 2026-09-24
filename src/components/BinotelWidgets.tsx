"use client";

import Script from "next/script";
import { BINOTEL } from "@/lib/binotel";
import { hasConsent } from "@/lib/consent";
import { useConsent } from "@/components/consent/ConsentProvider";

/** RU: Binotel лише після згоди communications. EN: Binotel only after communications consent. */
export function BinotelWidgets() {
  const { ready, consent } = useConsent();
  if (!ready || !hasConsent(consent, "communications")) return null;

  return (
    <>
      <Script src={BINOTEL.getCallWidgetUrl} strategy="afterInteractive" />
      <Script src={BINOTEL.chatWidgetUrl} strategy="afterInteractive" />
    </>
  );
}
