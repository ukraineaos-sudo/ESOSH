import Script from "next/script";
import { BINOTEL } from "@/lib/binotel";

/** RU: GetCall и чат Binotel как на esosh.net. EN: Binotel GetCall and chat widgets matching live site. */
export function BinotelWidgets() {
  return <>
    <Script src={BINOTEL.getCallWidgetUrl} strategy="afterInteractive" />
    <Script src={BINOTEL.chatWidgetUrl} strategy="afterInteractive" />
  </>;
}
