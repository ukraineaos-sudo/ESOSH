"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export const ADMIN_APPS_REFRESH_EVENT = "esosh:admin-apps-refresh";

const POLL_MS = 30_000;

type RefreshDetail = { newCount?: number };

/** RU: Живий лічильник нових заявок у шапці. EN: Live new-applications header chip. */
export function AdminNewAppsBadge({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = useState(Math.max(0, initialCount));
  const stopRef = useRef(false);

  const applyCount = useCallback((next: number) => {
    setCount(Math.max(0, next));
  }, []);

  const fetchCount = useCallback(async () => {
    if (stopRef.current) return;
    try {
      const response = await fetch("/api/admin/applications?status=new");
      if (response.status === 401) {
        stopRef.current = true;
        return;
      }
      if (!response.ok) return;
      const data = (await response.json()) as { items?: unknown[] };
      if (Array.isArray(data.items)) applyCount(data.items.length);
    } catch {
      // keep last known count
    }
  }, [applyCount]);

  useEffect(() => {
    applyCount(initialCount);
  }, [initialCount, applyCount]);

  useEffect(() => {
    stopRef.current = false;
    const id = window.setInterval(() => {
      void fetchCount();
    }, POLL_MS);

    function onRefresh(event: Event) {
      const detail = (event as CustomEvent<RefreshDetail>).detail;
      if (typeof detail?.newCount === "number") {
        applyCount(detail.newCount);
        return;
      }
      void fetchCount();
    }

    window.addEventListener(ADMIN_APPS_REFRESH_EVENT, onRefresh);
    return () => {
      window.clearInterval(id);
      window.removeEventListener(ADMIN_APPS_REFRESH_EVENT, onRefresh);
    };
  }, [fetchCount, applyCount]);

  const hasNew = count > 0;
  const label = hasNew ? `${count} нових` : "Заявки";

  return (
    <Link
      href="/admin/applications"
      className={`admin-live-chip${hasNew ? " admin-live-chip--pulse" : ""}`}
      title={hasNew ? `${count} нових заявок` : "Реєстр заявок"}
    >
      <span className="admin-live-chip__mark" aria-hidden="true">
        ✉
      </span>
      <span className="admin-live-chip__label">{label}</span>
      {hasNew ? <span className="admin-live-chip__dot" aria-hidden="true" /> : null}
    </Link>
  );
}

/** Notify header badge after apps list changes. */
export function emitAdminAppsRefresh(newCount?: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<RefreshDetail>(ADMIN_APPS_REFRESH_EVENT, {
      detail: typeof newCount === "number" ? { newCount } : {},
    }),
  );
}
