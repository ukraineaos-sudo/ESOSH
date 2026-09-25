"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  label?: string;
};

/** RU: Простой rich-text (жирний/списки/посилання) + HTML. EN: Simple rich text + HTML fallback. */
export function AdminRichTextEditor({ value, onChange, label = "Текст новини" }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlMode, setHtmlMode] = useState(false);
  const [htmlDraft, setHtmlDraft] = useState(value);
  const labelId = useId();

  useEffect(() => {
    if (htmlMode) return;
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) el.innerHTML = value || "<p></p>";
  }, [value, htmlMode]);

  function runCommand(command: string, arg?: string) {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(command, false, arg);
    onChange(el.innerHTML);
  }

  function insertLink() {
    const url = window.prompt("Посилання (https://… або /шлях):", "https://");
    if (!url) return;
    runCommand("createLink", url.trim());
  }

  function toggleHtmlMode() {
    if (htmlMode) {
      onChange(htmlDraft);
      setHtmlMode(false);
      return;
    }
    setHtmlDraft(value);
    setHtmlMode(true);
  }

  return (
    <div className="admin-rte">
      <div className="admin-rte-head">
        <span id={labelId}>{label}</span>
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={toggleHtmlMode}
        >
          {htmlMode ? "Звичайний вигляд" : "HTML"}
        </button>
      </div>
      {!htmlMode ? (
        <>
          <div className="admin-rte-toolbar" role="toolbar" aria-label="Форматування">
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => runCommand("bold")}>
              Жирний
            </button>
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => runCommand("italic")}>
              Курсив
            </button>
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => runCommand("insertUnorderedList")}>
              Список
            </button>
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => runCommand("insertOrderedList")}>
              Нумерований
            </button>
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={insertLink}>
              Посилання
            </button>
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => runCommand("removeFormat")}>
              Очистити формат
            </button>
          </div>
          <div
            ref={editorRef}
            className="admin-rte-surface"
            contentEditable
            role="textbox"
            aria-multiline="true"
            aria-labelledby={labelId}
            suppressContentEditableWarning
            onInput={() => {
              if (editorRef.current) onChange(editorRef.current.innerHTML);
            }}
          />
        </>
      ) : (
        <textarea
          className="admin-rte-html"
          rows={12}
          aria-labelledby={labelId}
          value={htmlDraft}
          onChange={(e) => setHtmlDraft(e.target.value)}
          onBlur={() => onChange(htmlDraft)}
        />
      )}
    </div>
  );
}
