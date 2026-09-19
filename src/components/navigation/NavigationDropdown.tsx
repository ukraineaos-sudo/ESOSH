"use client";
/* Local static brand icons retain their source dimensions. */
/* eslint-disable @next/next/no-img-element */
import { useRef, type ReactNode } from "react";

/** RU: Доступное выпадающее меню. EN: Keyboard and pointer accessible dropdown. */
export function NavigationDropdown({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  return <details className="nav-menu-dropdown w-dropdown" ref={ref}
    onMouseEnter={() => { if (ref.current) ref.current.open = true; }}
    onMouseLeave={() => { if (ref.current) ref.current.open = false; }}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}
    onKeyDown={(event) => { if (event.key === "Escape" && ref.current) { ref.current.open = false; ref.current.querySelector("summary")?.focus(); } }}>
    <summary className="nav-menu-toggle"><span className="medium-m">{label}</span><img src="/icons/chevron-down.svg" alt="" aria-hidden="true" className="is--icon-size-16" width={16} height={16} /></summary>
    <div className="nav-menu-dropdown-list w-dropdown-list w--open">{children}</div>
  </details>;
}
