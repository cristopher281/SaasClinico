"use client";

import { useEffect, useRef } from "react";
import styles from "@/modules/operations/components/clinic-shell.module.css";

export function DoctorPrescriptionEditor({
  clinicName,
  value,
  onChange,
}: {
  clinicName: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function applyCommand(command: string) {
    document.execCommand(command);
    onChange(editorRef.current?.innerHTML ?? "");
  }

  return (
    <div className={styles.editorWrap}>
      <div className={styles.editorToolbar}>
        <button type="button" className={styles.ghostButton} onClick={() => applyCommand("bold")}>
          Negrita
        </button>
        <button type="button" className={styles.ghostButton} onClick={() => applyCommand("italic")}>
          Cursiva
        </button>
        <button
          type="button"
          className={styles.ghostButton}
          onClick={() => applyCommand("insertUnorderedList")}
        >
          Lista
        </button>
      </div>

      <div className={styles.editorSheet}>
        <header className={styles.editorHeader}>
          <strong>{clinicName}</strong>
          <span>Receta medica</span>
        </header>
        <div
          ref={editorRef}
          className={styles.editorSurface}
          contentEditable
          suppressContentEditableWarning
          onInput={() => onChange(editorRef.current?.innerHTML ?? "")}
        />
      </div>
    </div>
  );
}
