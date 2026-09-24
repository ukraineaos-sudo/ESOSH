"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  OPEN_CONSENT_EVENT,
  acceptAllConsent,
  buildConsent,
  defaultNecessaryConsent,
  isConsentCurrent,
  persistConsent,
  readConsentFromDocument,
  type ConsentChoice,
  type ConsentState,
} from "@/lib/consent";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { ConsentSettings } from "@/components/consent/ConsentSettings";

type ConsentContextValue = {
  consent: ConsentState | null;
  ready: boolean;
  bannerVisible: boolean;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  acceptAll: () => void;
  acceptNecessary: () => void;
  saveChoice: (choice: ConsentChoice) => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

/** RU: Провайдер згоди + банер. EN: Consent provider and banner shell. */
export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [ready, setReady] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const stored = readConsentFromDocument();
    if (isConsentCurrent(stored)) {
      setConsent(stored);
      setBannerVisible(false);
    } else {
      setConsent(null);
      setBannerVisible(true);
    }
    setReady(true);

    function onOpen() {
      setSettingsOpen(true);
    }
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  const apply = useCallback((next: ConsentState) => {
    persistConsent(next);
    setConsent(next);
    setBannerVisible(false);
    setSettingsOpen(false);
  }, []);

  const acceptAll = useCallback(() => apply(acceptAllConsent()), [apply]);
  const acceptNecessary = useCallback(() => apply(defaultNecessaryConsent()), [apply]);
  const saveChoice = useCallback((choice: ConsentChoice) => apply(buildConsent(choice)), [apply]);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo(
    () => ({
      consent,
      ready,
      bannerVisible,
      settingsOpen,
      openSettings,
      closeSettings,
      acceptAll,
      acceptNecessary,
      saveChoice,
    }),
    [
      consent,
      ready,
      bannerVisible,
      settingsOpen,
      openSettings,
      closeSettings,
      acceptAll,
      acceptNecessary,
      saveChoice,
    ],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {ready && bannerVisible ? <ConsentBanner /> : null}
      {ready && settingsOpen ? <ConsentSettings /> : null}
    </ConsentContext.Provider>
  );
}

/** RU: Хук доступу до згоди. EN: Access consent state. */
export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return ctx;
}
