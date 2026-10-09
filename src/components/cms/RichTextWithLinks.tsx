import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { parseRichTextLinks } from "@/lib/cms/rich-text-links";

/** RU: Текст з безпечними markdown-посиланнями. EN: Text with safe markdown links. */
export function RichTextWithLinks({ text }: { text: string }): ReactNode {
  const parts = parseRichTextLinks(text);
  return parts.map((part, index) => {
    if (part.type === "text") {
      return <span key={index}>{part.value}</span>;
    }
    if (part.external) {
      return (
        <a
          key={index}
          href={part.href}
          className="is--accent"
          target={part.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={part.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        >
          {part.label}
        </a>
      );
    }
    return (
      <Link key={index} href={part.href} className="is--accent">
        {part.label}
      </Link>
    );
  });
}
