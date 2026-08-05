import React, { useEffect, useState } from "react";
import { IcClose, IcLink } from "../../../assets/icons.jsx";
import apiClient from "../../../api/apiClient.js";
import { ENDPOINTS } from "../../../api/endpoints.js";

const INITIAL_FORM = { assetId: "", lineItemId: "" };

/**
 * LinkAssetForm
 * Lets a creative manager attach an approved asset to a media line item.
 * Both sides are chosen from dropdowns (populated from the Assets and
 * Line Items already loaded by CreativeStudio) instead of free-typed IDs,
 * so it's impossible to link an asset or line item that doesn't exist.
 *
 * Posts to POST /api/asset-links -> { assetId, lineItemId }
 *
 * `initialAssetId` lets a caller (e.g. the "Link This" action on an
 * already-approved asset row) open the form with that asset pre-selected,
 * while still letting the user change it via the dropdown if needed.
 */
export default function LinkAssetForm({
  isOpen,
  onClose,
  assets = [],
  lineItems = [],
  onLinked,
  initialAssetId = null,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({ assetId: initialAssetId != null ? String(initialAssetId) : "", lineItemId: "" });
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialAssetId]);

  if (!isOpen) return null;

  // Only approved assets should be linkable to a live/planned line item.
  // Status may come back as "Approved" (mock) or "APPROVED" (real API).
  const linkableAssets = assets.filter((a) => {
    const status = (a.status ?? "").toString().toUpperCase();
    return status === "APPROVED";
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.assetId) next.assetId = "Select an asset";
    if (!form.lineItemId) next.lineItemId = "Select a line item";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetAndClose = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.assetLinks, {
        assetId: Number(form.assetId),
        lineItemId: Number(form.lineItemId),
      });
      onLinked?.();
      resetAndClose();
    } catch (err) {
      setErrors({ submit: err.message || "Failed to link asset. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="universal-overlay" onClick={(e) => e.target === e.currentTarget && resetAndClose()}>
      <div className="universal-modal">
        <span className="universal-orb universal-orb-1" />
        <span className="universal-orb universal-orb-2" />

        <button type="button" className="universal-close" onClick={resetAndClose} aria-label="Close">
          ✕
        </button>

        <div className="universal-header">
          <h2 className="universal-title"><IcLink /> Link Asset to Line Item</h2>
          <p className="universal-subtitle">
            Pick the approved creative asset and the media line item to link it to.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="universal-form">
          <div className="universal-field">
            <label className="universal-label">Creative Asset</label>
            <select className="universal-select" name="assetId" value={form.assetId} onChange={handleChange}>
              <option value="">Select asset…</option>
              {linkableAssets.map((a) => (
                <option key={a.assetId ?? a.id} value={a.assetId ?? a.id}>
                  {(a.assetId ?? a.id)} — {a.assetName ?? a.name}
                </option>
              ))}
            </select>
            {linkableAssets.length === 0 && (
              <span className="universal-hint">No approved assets available to link yet.</span>
            )}
            {errors.assetId && <span className="universal-field-error">{errors.assetId}</span>}
          </div>

          <div className="universal-field">
            <label className="universal-label">Line Item</label>
            <select className="universal-select" name="lineItemId" value={form.lineItemId} onChange={handleChange}>
              <option value="">Select line item…</option>
              {lineItems.map((li) => (
                <option key={li.lineItemId ?? li.id} value={li.lineItemId ?? li.id}>
                  {(li.lineItemId ?? li.id)} — {li.channel} · {li.publisher ?? li.format}
                </option>
              ))}
            </select>
            {errors.lineItemId && <span className="universal-field-error">{errors.lineItemId}</span>}
          </div>

          {errors.submit && <div className="universal-error-banner">{errors.submit}</div>}

          <div className="universal-actions">
            <button type="button" className="universal-btn universal-btn-ghost" onClick={resetAndClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="universal-btn universal-btn-primary" disabled={submitting}>
              {submitting && <span className="universal-spinner" />}
              {submitting ? "Linking..." : "Link Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}