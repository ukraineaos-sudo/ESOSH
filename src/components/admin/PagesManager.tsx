"use client";

import { useMemo, useState } from "react";
import type { CmsBlock } from "@/lib/cms/blocks";
import { emptyBlocks, newBlockId } from "@/lib/cms/blocks";

type PageItem = {
  id: number;
  locale: string;
  route: string;
  title: string;
  status: string;
  blocks: CmsBlock[];
};

type CatalogRoute = { locale: "uk" | "en"; route: string; fullPath: string };

/** RU: Каталог и редактор CMS-страниц. EN: CMS pages catalog + block editor. */
export function PagesManager({
  catalog,
  initialItems,
}: {
  catalog: CatalogRoute[];
  initialItems: PageItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<PageItem | null>(null);
  const [filter, setFilter] = useState("");

  async function refresh() {
    const response = await fetch("/api/admin/pages");
    const data = await response.json();
    if (!response.ok) {
      setError("Немає доступу до БД або сесії.");
      return;
    }
    setItems(data.items || []);
  }

  const cmsKey = useMemo(
    () => new Set(items.map((item) => `${item.locale}:${item.route}`)),
    [items],
  );

  const filtered = catalog.filter((row) =>
    `${row.fullPath} ${row.route}`.toLowerCase().includes(filter.toLowerCase()),
  );

  async function createCms(locale: "uk" | "en", route: string) {
    const response = await fetch("/api/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        route,
        title: route === "/" ? "Home" : route,
        status: "draft",
        blocks: emptyBlocks(),
      }),
    });
    if (!response.ok) {
      setError("Не вдалося створити CMS-версію.");
      return;
    }
    const data = await response.json();
    await refresh();
    setSelected(data.item);
  }

  async function saveSelected() {
    if (!selected) return;
    const response = await fetch("/api/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });
    if (!response.ok) {
      setError("Не вдалося зберегти.");
      return;
    }
    await refresh();
  }

  function updateBlock(id: string, patch: Partial<CmsBlock>) {
    if (!selected) return;
    setSelected({
      ...selected,
      blocks: selected.blocks.map((block) =>
        block.id === id ? ({ ...block, ...patch } as CmsBlock) : block,
      ),
    });
  }

  function addBlock(type: CmsBlock["type"]) {
    if (!selected) return;
    let block: CmsBlock;
    switch (type) {
      case "hero":
        block = { id: newBlockId(), type, title: "Заголовок", lead: "" };
        break;
      case "richText":
        block = { id: newBlockId(), type, html: "<p>Текст</p>" };
        break;
      case "image":
        block = { id: newBlockId(), type, src: "/images/home/Logo-White-c13cc8ca.png", alt: "" };
        break;
      case "cta":
        block = { id: newBlockId(), type, label: "CTA", href: "/" };
        break;
      case "cards":
        block = { id: newBlockId(), type, items: [{ title: "Картка", text: "Опис" }] };
        break;
      case "spacer":
        block = { id: newBlockId(), type, size: "m" };
        break;
      case "pdfLink":
        block = { id: newBlockId(), type, label: "PDF", href: "/docs/codex-uk.pdf" };
        break;
      default:
        return;
    }
    setSelected({ ...selected, blocks: [...selected.blocks, block] });
  }

  function removeBlock(id: string) {
    if (!selected) return;
    setSelected({ ...selected, blocks: selected.blocks.filter((b) => b.id !== id) });
  }

  const previewPath =
    selected == null
      ? "#"
      : `${selected.locale === "en" ? "/en" : ""}${selected.route === "/" ? "" : selected.route || ""}` ||
        (selected.locale === "en" ? "/en" : "/");

  return (
    <div className="admin-stack">
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-split">
        <div className="admin-panel">
          <input
            className="admin-input"
            placeholder="Фільтр маршрутів…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <table className="admin-table">
            <thead>
              <tr>
                <th>Path</th>
                <th>CMS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const key = `${row.locale}:${row.route}`;
                const existing = items.find(
                  (item) => item.locale === row.locale && item.route === row.route,
                );
                return (
                  <tr key={row.fullPath}>
                    <td>
                      <code>{row.fullPath}</code>
                    </td>
                    <td>
                      <span className="admin-badge">{existing ? existing.status : "legacy"}</span>
                    </td>
                    <td>
                      {existing ? (
                        <button
                          className="admin-btn admin-btn-secondary"
                          type="button"
                          onClick={() => setSelected(existing)}
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          className="admin-btn"
                          type="button"
                          onClick={() => void createCms(row.locale, row.route)}
                          disabled={cmsKey.has(key)}
                        >
                          Створити CMS
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selected ? (
          <div className="admin-panel admin-form admin-stack">
            <h2>
              {selected.locale}
              {selected.route} <span className="admin-badge">{selected.status}</span>
            </h2>
            <label>
              Title
              <input
                value={selected.title}
                onChange={(e) => setSelected({ ...selected, title: e.target.value })}
              />
            </label>
            <label>
              Status
              <select
                value={selected.status}
                onChange={(e) => setSelected({ ...selected, status: e.target.value })}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </label>
            <div className="admin-actions">
              <button className="admin-btn admin-btn-secondary" type="button" onClick={() => addBlock("hero")}>
                + hero
              </button>
              <button className="admin-btn admin-btn-secondary" type="button" onClick={() => addBlock("richText")}>
                + richText
              </button>
              <button className="admin-btn admin-btn-secondary" type="button" onClick={() => addBlock("image")}>
                + image
              </button>
              <button className="admin-btn admin-btn-secondary" type="button" onClick={() => addBlock("cta")}>
                + cta
              </button>
              <button className="admin-btn admin-btn-secondary" type="button" onClick={() => addBlock("cards")}>
                + cards
              </button>
              <button className="admin-btn admin-btn-secondary" type="button" onClick={() => addBlock("spacer")}>
                + spacer
              </button>
              <button className="admin-btn admin-btn-secondary" type="button" onClick={() => addBlock("pdfLink")}>
                + pdf
              </button>
            </div>
            {selected.blocks.map((block, index) => (
              <div key={block.id} className="admin-block">
                <div className="admin-block-head">
                  <strong>
                    #{index + 1} {block.type}
                  </strong>
                  <button
                    className="admin-btn admin-btn-secondary"
                    type="button"
                    onClick={() => removeBlock(block.id)}
                  >
                    Видалити
                  </button>
                </div>
                {block.type === "hero" ? (
                  <>
                    <label>
                      Title
                      <input
                        value={block.title}
                        onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                      />
                    </label>
                    <label>
                      Accent
                      <input
                        value={block.accent || ""}
                        onChange={(e) => updateBlock(block.id, { accent: e.target.value })}
                      />
                    </label>
                    <label>
                      Lead
                      <textarea
                        value={block.lead || ""}
                        onChange={(e) => updateBlock(block.id, { lead: e.target.value })}
                      />
                    </label>
                  </>
                ) : null}
                {block.type === "richText" ? (
                  <label>
                    HTML
                    <textarea
                      rows={5}
                      value={block.html}
                      onChange={(e) => updateBlock(block.id, { html: e.target.value })}
                    />
                  </label>
                ) : null}
                {block.type === "image" ? (
                  <>
                    <label>
                      Src
                      <input
                        value={block.src}
                        onChange={(e) => updateBlock(block.id, { src: e.target.value })}
                      />
                    </label>
                    <label>
                      Alt
                      <input
                        value={block.alt}
                        onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                      />
                    </label>
                  </>
                ) : null}
                {block.type === "cta" || block.type === "pdfLink" ? (
                  <>
                    <label>
                      Label
                      <input
                        value={block.label}
                        onChange={(e) => updateBlock(block.id, { label: e.target.value })}
                      />
                    </label>
                    <label>
                      Href
                      <input
                        value={block.href}
                        onChange={(e) => updateBlock(block.id, { href: e.target.value })}
                      />
                    </label>
                  </>
                ) : null}
                {block.type === "spacer" ? (
                  <label>
                    Size
                    <select
                      value={block.size}
                      onChange={(e) =>
                        updateBlock(block.id, { size: e.target.value as "s" | "m" | "l" })
                      }
                    >
                      <option value="s">s</option>
                      <option value="m">m</option>
                      <option value="l">l</option>
                    </select>
                  </label>
                ) : null}
                {block.type === "cards" ? (
                  <label>
                    Cards JSON
                    <textarea
                      rows={4}
                      value={JSON.stringify(block.items, null, 2)}
                      onChange={(e) => {
                        try {
                          updateBlock(block.id, { items: JSON.parse(e.target.value) });
                        } catch {
                          /* ignore invalid while typing */
                        }
                      }}
                    />
                  </label>
                ) : null}
              </div>
            ))}
            <div className="admin-actions">
              <button className="admin-btn" type="button" onClick={() => void saveSelected()}>
                Зберегти / Publish
              </button>
              <a
                className="admin-btn admin-btn-secondary"
                href={`${previewPath || "/"}?preview=1`}
                target="_blank"
                rel="noreferrer"
              >
                Preview
              </a>
              <button className="admin-btn admin-btn-secondary" type="button" onClick={() => setSelected(null)}>
                Закрити
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-panel admin-muted">Оберіть маршрут або створіть CMS-версію.</div>
        )}
      </div>
    </div>
  );
}
