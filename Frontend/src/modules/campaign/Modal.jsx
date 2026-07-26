import React, { useEffect } from "react";
import { IcClose } from "../../assets/icons.jsx";
import "./forms-and-modal.css";

/**
 * Generic modal shell used to host the create forms (campaign brief,
 * target audience, etc). Keeping this separate means any future form
 * (e.g. "New creative", "New invoice") can reuse the same overlay/card
 * chrome without duplicating markup.
 *
 * Props:
 *  - open: boolean, whether the modal is visible
 *  - title: string, header text
 *  - onClose: () => void, called on backdrop click / close button / Escape
 *  - children: form content
 */
export default function Modal({ open, title, onClose, children }) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="modal-card" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <IcClose size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
