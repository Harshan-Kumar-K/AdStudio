import React, { useState } from "react";
import Modal from "../Modal.jsx";
import apiClient from "../../../api/apiClient.js";
import { ENDPOINTS } from "../../../api/endpoints.js";

// If you ever need to call a full/absolute URL instead of a path relative
// to API_BASE (e.g. a different service), apiRequest.js is available too:
//   import apiRequest from "../../../api/apiRequest.js";
//   await apiRequest(`${SOME_OTHER_BASE}/delivery-records`, { method: "POST", body: payload });

// NOTE: adjust these two option lists to match whatever your Java enums
// (DeliverySource / DeliveryStatus, or similar) actually send/expect.
const SOURCE_OPTIONS = [
  { value: "PublisherReport", label: "Publisher Report" },
  { value: "InternalEntry", label: "Internal" },
];

const STATUS_OPTIONS = [ "Accepted",  "Disputed",  "PendingVerification" ];

const EMPTY_FORM = {
  lineItem: "",
  io: "",
  reportingDate: new Date().toISOString().slice(0, 10),
  deliveredImpressions: "",
  clicks: "",
  spend: "",
  source: SOURCE_OPTIONS[0].value,
  status: STATUS_OPTIONS[0],
};

function validate(form) {
  const errors = {};
  if (!form.lineItem.trim()) errors.lineItem = "Line item is required";
  if (!form.io.trim()) errors.io = "Insertion order is required";
  if (!form.reportingDate) errors.reportingDate = "Reporting date is required";
  if (form.deliveredImpressions === "" || Number(form.deliveredImpressions) < 0)
    errors.deliveredImpressions = "Enter a valid impressions count";
  if (form.clicks === "" || Number(form.clicks) < 0)
    errors.clicks = "Enter a valid click count";
  if (form.spend === "" || Number(form.spend) < 0)
    errors.spend = "Enter a valid spend amount";
  return errors;
}

/**
 * Modal form for adding a new delivery record.
 *
 * Submits with apiClient.post(), which already:
 *   - attaches the JWT from localStorage as Authorization: Bearer <token>
 *   - JSON-encodes the body
 *   - unwraps the { success, data, message } envelope
 *   - throws a readable Error on failure, which we catch and show inline
 *
 * Posts to ENDPOINTS.deliveryRecords - the same path the table GETs from -
 * following the usual REST convention of POST-to-collection-to-create.
 * If your backend uses a different path for creation, just change that
 * one endpoint below.
 */
export default function AddDeliveryRecordForm({ open, onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const resetAndClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitError("");
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      lineItemId: form.lineItem.trim(),
        ioId : form.io.trim(),
      reportingDate: form.reportingDate,
      deliveredImpressions : Number(form.deliveredImpressions),
      clicks: Number(form.clicks),
      spend: Number(form.spend),
      source: form.source,
      status: form.status,
    };

    const PacingPayload = {
       lineItemId: form.lineItem.trim(),
       spend: Number(form.spend),
       deliveredImpressions : Number(form.deliveredImpressions),
       reportingDate: form.reportingDate,
    };

    setSubmitting(true);
    setSubmitError("");
    try {
      const created = await apiClient.post(ENDPOINTS.deliveryRecords, payload);
      const PacingCreated = await apiClient.post(ENDPOINTS.pacingAlerts, PacingPayload);
      onCreated?.(created);
      resetAndClose();
    } catch (err) {
      setSubmitError(err.message || "Failed to save delivery record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={resetAndClose} title="Add delivery record" width={640}>
      <style>{`
        .adr-form { display: flex; flex-direction: column; gap: 14px; }
        .adr-row { display: flex; flex-direction: column; gap: 6px; }
        .adr-row-split { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .adr-row label { font-size: 13px; font-weight: 600; color: var(--text-muted, #64748b); }
        .adr-row input, .adr-row select {
          padding: 8px 10px;
          border: 1px solid var(--border, #e2e8f0);
          border-radius: 8px;
          font-size: 14px;
          background: var(--surface, #fff);
        }
        .adr-error { font-size: 12px; color: var(--red-600, #dc2626); }
        .adr-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px; }
      `}</style>

      <form onSubmit={handleSubmit} className="adr-form">
        <div className="adr-row">
          <label>Line item</label>
          <input
            type="text"
            value={form.lineItem}
            onChange={update("lineItem")}
            placeholder="e.g. 2"
          />
          {errors.lineItem && <span className="adr-error">{errors.lineItem}</span>}
        </div>

        <div className="adr-row">
          <label>Insertion order</label>
          <input
            type="text"
            value={form.io}
            onChange={update("io")}
            placeholder="e.g. 3"
          />
          {errors.io && <span className="adr-error">{errors.io}</span>}
        </div>

        <div className="adr-row">
          <label>Reporting date</label>
          <input type="date" value={form.reportingDate} onChange={update("reportingDate")} />
          {errors.reportingDate && <span className="adr-error">{errors.reportingDate}</span>}
        </div>

        <div className="adr-row-split">
          <div className="adr-row">
            <label>Delivered impressions</label>
            <input
              type="number"
              min="0"
              value={form.deliveredImpressions}
              onChange={update("deliveredImpressions")}
            />
            {errors.deliveredImpressions && (
              <span className="adr-error">{errors.deliveredImpressions}</span>
            )}
          </div>
          <div className="adr-row">
            <label>Clicks</label>
            <input type="number" min="0" value={form.clicks} onChange={update("clicks")} />
            {errors.clicks && <span className="adr-error">{errors.clicks}</span>}
          </div>
        </div>

        <div className="adr-row">
          <label>Spend</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.spend}
            onChange={update("spend")}
          />
          {errors.spend && <span className="adr-error">{errors.spend}</span>}
        </div>

        <div className="adr-row-split">
          <div className="adr-row">
            <label>Source</label>
            <select value={form.source} onChange={update("source")}>
              {SOURCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="adr-row">
            <label>Status</label>
            <select value={form.status} onChange={update("status")}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {submitError && <div className="adr-error">{submitError}</div>}

        <div className="adr-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={resetAndClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
            {submitting ? "Saving..." : "Save record"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
