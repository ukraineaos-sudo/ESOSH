import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CmsBlocksView } from "@/components/cms/CmsBlocksView";
import type { CmsBlock } from "@/lib/cms/blocks";

/** RU: Публичный рендер CMS-страницы. EN: Public CMS page shell. */
export function CmsPageShell({
  title,
  blocks,
  draftBanner,
}: {
  title: string;
  blocks: CmsBlock[];
  draftBanner?: boolean;
}) {
  return (
    <>
      <Header />
      {draftBanner ? (
        <div
          style={{
            background: "#f59e0b",
            color: "#111",
            textAlign: "center",
            padding: "8px 12px",
            fontWeight: 600,
          }}
        >
          Preview draft: {title}
        </div>
      ) : null}
      <CmsBlocksView blocks={blocks} />
      <Footer />
    </>
  );
}
