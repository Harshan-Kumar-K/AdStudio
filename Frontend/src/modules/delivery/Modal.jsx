import React, { useEffect } from "react";

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 16,
  },
  panel: {
    background: "var(--surface, #ffffff)",
    borderRadius: 12,
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid var(--border, #e5e7eb)",
  },
  title: { margin: 0, fontSize: 16 },
  body: { padding: 20 },
};

/**
 * Generic, dependency-free modal shell.
 *
 * Not specific to delivery records on purpose - any future "Add X" or
 * "Edit X" form in the app can reuse this instead of re-building an
 * overlay + panel every time.
 *
 * If you already have a Modal component elsewhere in the project, feel
 * free to delete this file and point AddDeliveryRecordForm.jsx at that
 * one instead.
 */
export default function Modal({ open, onClose, title, children, width = 560 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={styles.overlay}
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div style={{ ...styles.panel, maxWidth: width }} onMouseDown={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}
