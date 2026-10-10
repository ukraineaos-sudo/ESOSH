import type { ReactNode } from "react";

type Props = {
  summary: string;
  children: ReactNode;
};

/** RU: Акордеон повного тексту кодексу. EN: Full codex text accordion. */
export function CodexAccordion({ summary, children }: Props) {
  return (
    <details className="codex-accordion is--margin-bottom-48">
      <summary className="codex-accordion__summary">
        <span className="bold-l">{summary}</span>
        <img
          src="/icons/chevron-down.svg"
          alt=""
          aria-hidden="true"
          className="codex-accordion__chevron is--icon-size-24--m-20"
          width={24}
          height={24}
        />
      </summary>
      <div className="codex-accordion__body">{children}</div>
    </details>
  );
}
