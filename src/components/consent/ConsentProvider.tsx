"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
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

const consentListeners = new Set<() => void>();

function subscribeConsentStore(onStoreChange: () => void) {
  consentListeners.add(onStoreChange);
  return () => {
    consentListeners.delete(onStoreChange);
  };
}

function emitConsentStoreChange() {
  for (const listener of consentListeners) {
    listener();
  }
}

const subscribeClientReady = () => () => {};

/** RU: Провайдер згоди + банер. EN: Consent provider and banner shell. */
export function ConsentProvider({ children }: { children: ReactNode }) {
  // false during SSR/hydration, true on client — avoids cookie read mismatch.
  const ready = useSyncExternalStore(subscribeClientReady, () => true, () => false);
  const stored = useSyncExternalStore(
    subscribeConsentStore,
    readConsentFromDocument,
    () => null,
  );
  const consent = isConsentCurrent(stored) ? stored : null;
  const bannerVisible = ready && !consent;
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    function onOpen() {
      setSettingsOpen(true);
    }
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  const apply = useCallback((next: ConsentState) => {
    persistConsent(next);
    emitConsentStoreChange();
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
