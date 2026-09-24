"use client";

import type { ReactNode } from "react";
import { openConsentSettings } from "@/lib/consent";

type Props = {
  className?: string;
  children: ReactNode;
};

/** RU: Кнопка відкриття налаштувань cookies. EN: Open cookie settings control. */
export function OpenConsentSettingsButton({ className, children }: Props) {
  return (
    <button type="button" className={className} onClick={() => openConsentSettings()}>
      {children}
    </button>
  );
}
