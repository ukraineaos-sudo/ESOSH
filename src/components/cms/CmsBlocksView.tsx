import type { CmsBlock } from "@/lib/cms/blocks";
import { sanitizeCmsHtml } from "@/lib/cms/sanitize-html";

/** RU: Рендер CMS-блоков публичными reference-классами. EN: Render CMS blocks with reference CSS classes. */
export function CmsBlocksView({ blocks }: { blocks: CmsBlock[] }) {
  return (
    <div className="cms-blocks">
      {blocks.map((block) => {
        switch (block.type) {
          case "hero":
            return (
              <section key={block.id} className="section is--section-spacing">
                <div className="w-layout-blockcontainer container w-container">
                  <h1 className="h1">
                    {block.accent ? <span className="is--accent">{block.accent} </span> : null}
                    {block.title}
                  </h1>
                  {block.lead ? <p className="regular-l is--margin-top-32">{block.lead}</p> : null}
                  {block.ctaLabel && block.ctaHref ? (
                    <a className="btn is--primary is--margin-top-32" href={block.ctaHref}>
                      {block.ctaLabel}
                    </a>
                  ) : null}
                </div>
              </section>
            );
          case "richText":
            return (
              <section key={block.id} className="section is--section-spacing">
                <div className="w-layout-blockcontainer container w-container">
                  <div
                    className="regular-l"
                    dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(block.html) }}
                  />
                </div>
              </section>
            );
          case "image":
            return (
              <section key={block.id} className="section">
                <div className="w-layout-blockcontainer container w-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="image is--w-100p is--radius-6"
                    src={block.src}
                    alt={block.alt}
                    width={block.width || 1200}
                    height={block.height || 675}
                  />
                </div>
              </section>
            );
          case "cta":
            return (
              <section key={block.id} className="section is--section-spacing">
                <div className="w-layout-blockcontainer container w-container">
                  <a className="btn is--primary" href={block.href}>
                    {block.label}
                  </a>
                </div>
              </section>
            );
          case "cards":
            return (
              <section key={block.id} className="section is--section-spacing">
                <div className="w-layout-blockcontainer container w-container">
                  <div className="w-layout-grid is--grid-3-columns--t-1--m-1">
                    {block.items.map((item, index) => (
                      <a
                        key={`${block.id}_${index}`}
                        href={item.href || "#"}
                        className="block is--radius-6 is--spacing-32-32--m-24-32 is--border-light-blue is--link w-inline-block"
                      >
                        <h3 className="h3 is--margin-bottom-12">{item.title}</h3>
                        <p className="regular-l">{item.text}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            );
          case "spacer":
            return (
              <div
                key={block.id}
                style={{ height: block.size === "s" ? 24 : block.size === "m" ? 48 : 96 }}
              />
            );
          case "pdfLink":
            return (
              <section key={block.id} className="section is--section-spacing">
                <div className="w-layout-blockcontainer container w-container">
                  <a className="btn is--secondary" href={block.href} target="_blank" rel="noopener noreferrer">
                    {block.label}
                  </a>
                </div>
              </section>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
