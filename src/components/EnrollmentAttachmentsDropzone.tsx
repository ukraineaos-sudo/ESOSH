"use client";

import { useId, useRef, useState, type DragEvent, type ChangeEvent } from "react";
import {
  ALLOWED_DOC_TYPES,
  DOC_MAX_BYTES,
  ENROLLMENT_MAX_FILES,
  ENROLLMENT_MAX_TOTAL_BYTES,
} from "@/lib/enrollment/schema";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  title: string;
  hint: string;
  dropLabel: string;
  browseLabel: string;
  removeLabel: string;
  emptyLabel: string;
  optionalLabel: string;
  errorTooMany: string;
  errorTotalSize: string;
  errorFile: string;
};

function isAllowedDoc(file: File): boolean {
  if (file.size <= 0 || file.size > DOC_MAX_BYTES) return false;
  const type = file.type === "image/jpg" ? "image/jpeg" : file.type;
  if (ALLOWED_DOC_TYPES.has(type) || ALLOWED_DOC_TYPES.has(file.type)) return true;
  return /\.(pdf|jpe?g|png)$/i.test(file.name);
}

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

/** RU: Пакетне опційне завантаження документів (drag-and-drop). EN: Optional batch document dropzone. */
export function EnrollmentAttachmentsDropzone({
  files,
  onChange,
  title,
  hint,
  dropLabel,
  browseLabel,
  removeLabel,
  emptyLabel,
  optionalLabel,
  errorTooMany,
  errorTotalSize,
  errorFile,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function mergeFiles(incoming: File[]) {
    const next = [...files];
    let rejected = false;
    for (const file of incoming) {
      if (!isAllowedDoc(file)) {
        rejected = true;
        continue;
      }
      const duplicate = next.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified,
      );
      if (!duplicate) next.push(file);
    }
    if (next.length > ENROLLMENT_MAX_FILES) {
      setLocalError(errorTooMany);
      return;
    }
    const total = next.reduce((sum, f) => sum + f.size, 0);
    if (total > ENROLLMENT_MAX_TOTAL_BYTES) {
      setLocalError(errorTotalSize);
      return;
    }
    setLocalError(rejected ? errorFile : null);
    onChange(next);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    mergeFiles(Array.from(e.target.files || []));
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    mergeFiles(Array.from(e.dataTransfer.files || []));
  }

  function removeAt(index: number) {
    setLocalError(null);
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="enrollment-attachments" id="enrollment-field-attachments">
      <div className="enrollment-attachments__head">
        <p className="enrollment-question">
          {title} <em className="enrollment-attachments__optional">{optionalLabel}</em>
        </p>
        <p className="regular-s enrollment-attachments__hint">{hint}</p>
      </div>
      <div
        className={`enrollment-dropzone${dragging ? " is-dragging" : ""}`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          setDragging(false);
        }}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-controls={inputId}
        aria-label={dropLabel}
      >
        <p className="enrollment-dropzone__label">{dropLabel}</p>
        <button
          type="button"
          className="btn is--secondary w-button"
          onClick={() => inputRef.current?.click()}
        >
          {browseLabel}
        </button>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="enrollment-dropzone__input"
          onChange={onInputChange}
        />
      </div>
      {localError ? (
        <p className="site-form-error is--margin-top-8" role="alert">
          {localError}
        </p>
      ) : null}
      {files.length === 0 ? (
        <p className="regular-s enrollment-attachments__empty">{emptyLabel}</p>
      ) : (
        <ul className="enrollment-attachments__list">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}-${index}`}>
              <span className="enrollment-attachments__name">
                {file.name}{" "}
                <span className="enrollment-attachments__size">({formatBytes(file.size)})</span>
              </span>
              <button
                type="button"
                className="enrollment-attachments__remove"
                onClick={() => removeAt(index)}
              >
                {removeLabel}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
