import React, { useState, useEffect } from "react";
import { IcCheck, IcClose } from "../../../assets/icons.jsx";

/**
 * Centered, styled replacement for the native window.prompt() that used to
 * collect Approve/Reject feedback. Reuses the same "universal-*" modal
 * classes AssetDetailsModal already uses, so it looks and feels consistent
 * with the rest of the app instead of popping a browser dialog at the top
 * of the screen.
 *
 * decision: "APPROVED" | "REJECTED" | null (modal is closed when null)
 */
export default function DecisionFeedbackModal({ decision, assetName, onCancel, onSubmit, submitting }) {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (decision) setFeedback("");
  }, [decision]);

  if (!decision) return null;

  const isApprove = decision === "APPROVED";

  return (
    <div className="universal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel?.()}>
      <div className="universal-modal">
        <span className="universal-orb universal-orb-1" />
        <span className="universal-orb universal-orb-2" />

        <button type="button" className="universal-close" onClick={onCancel} aria-label="Close">
          ✕
        </button>

        <div className="universal-header">
          <h2 className="universal-title">
            {isApprove ? <IcCheck /> : <IcClose />} {isApprove ? "Approve" : "Reject"} asset
          </h2>
          <p className="universal-subtitle">
            {assetName ? `"${assetName}"` : "This asset"} — add a short note for the record.
          </p>
        </div>

        <form
          className="universal-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.(feedback);
          }}
        >
          <div className="universal-field">
            <label className="universal-label" htmlFor="decision-feedback">
              Feedback {isApprove ? "(optional)" : "(recommended)"}
            </label>
            <textarea
              id="decision-feedback"
              className="universal-input"
              style={{ height: "auto", minHeight: 110, padding: "10px 14px", resize: "vertical", lineHeight: 1.5 }}
              placeholder={
                isApprove
                  ? "e.g. Looks good, matches the brief."
                  : "e.g. Logo is cut off at 300x250, please resend."
              }
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              autoFocus
            />
          </div>

          <div className="universal-actions">
            <button type="button" className="universal-btn universal-btn-ghost" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="universal-btn universal-btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : isApprove ? "Approve" : "Reject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}