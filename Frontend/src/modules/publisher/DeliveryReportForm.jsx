import React, { useState } from "react";
import apiClient from "../../api/apiClient.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcClose } from "../../assets/icons.jsx";

const todayIso = () => new Date().toISOString().slice(0, 10);

/**
 * DeliveryReportForm
 * The input-taking form, split out on its own so it can be reused
 * (e.g. opened from a different screen) without pulling in the rest
 * of the portal. Submits to the backend with apiClient.post, using
 * the same ApiResponse envelope every other screen relies on.
 *
 * Expected backend route (adjust to match your Spring controller):
 *   POST {API_BASE}/{ENDPOINTS.publisherDeliveryReports}
 *   body: { io, reportingDate, impressions, clicks, spend }
 *
 * Props:
 *   insertionOrders  - array of IOs to populate the "Insertion order" select
 *   onClose          - called when the user cancels / closes the modal
 *   onSubmitted      - called after a successful save
 */
export default function DeliveryReportForm({ insertionOrders = [], onClose, onSubmitted }) {
  const [form, setForm] = useState({
    io: insertionOrders[0]?.id || "",
    reportingDate: todayIso(),
    impressions: "",
    clicks: "",
    spend: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.io) next.io = "Select an insertion order.";
    if (!form.reportingDate) next.reportingDate = "Reporting date is required.";
    if (form.impressions === "" || Number(form.impressions) < 0)
      next.impressions = "Enter a valid impression count.";
    if (form.clicks === "" || Number(form.clicks) < 0)
      next.clicks = "Enter a valid click count.";
    if (form.spend === "" || Number(form.spend) < 0)
      next.spend = "Enter a valid spend amount.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await apiClient.post(ENDPOINTS.publisherDeliveryReports, {
        io: form.io,
        reportingDate: form.reportingDate,
        impressions: Number(form.impressions),
        clicks: Number(form.clicks),
        spend: Number(form.spend),
      });
      onSubmitted && onSubmitted();
    } catch (err) {
      setSubmitError(err.message || "Could not submit the delivery report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="delivery-report-form-title">
      <div className="card" style={styles.modal}>
        <div style={styles.headerRow}>
          <h3 id="delivery-report-form-title" style={styles.title}>
            Submit delivery report
          </h3>
          <button
            type="button"
            className="btn btn-sm"
            onClick={onClose}
            aria-label="Close"
          >
            <IcClose size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="drf-io">
              Insertion order
            </label>
            <select
              id="drf-io"
              style={styles.input}
              value={form.io}
              onChange={(e) => update("io", e.target.value)}
            >
              {insertionOrders.length === 0 && (
                <option value="">No insertion orders available</option>
              )}
              {insertionOrders.map((io) => (
                <option key={io.id} value={io.id}>
                  {io.id} · {io.campaign}
                </option>
              ))}
            </select>
            {errors.io && <div style={styles.errorText}>{errors.io}</div>}
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="drf-date">
              Reporting date
            </label>
            <input
              id="drf-date"
              type="date"
              style={styles.input}
              value={form.reportingDate}
              onChange={(e) => update("reportingDate", e.target.value)}
            />
            {errors.reportingDate && <div style={styles.errorText}>{errors.reportingDate}</div>}
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label} htmlFor="drf-impressions">
                Impressions
              </label>
              <input
                id="drf-impressions"
                type="number"
                min="0"
                style={styles.input}
                value={form.impressions}
                onChange={(e) => update("impressions", e.target.value)}
              />
              {errors.impressions && <div style={styles.errorText}>{errors.impressions}</div>}
            </div>

            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label} htmlFor="drf-clicks">
                Clicks
              </label>
              <input
                id="drf-clicks"
                type="number"
                min="0"
                style={styles.input}
                value={form.clicks}
                onChange={(e) => update("clicks", e.target.value)}
              />
              {errors.clicks && <div style={styles.errorText}>{errors.clicks}</div>}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="drf-spend">
              Spend ($)
            </label>
            <input
              id="drf-spend"
              type="number"
              min="0"
              step="0.01"
              style={styles.input}
              value={form.spend}
              onChange={(e) => update("spend", e.target.value)}
            />
            {errors.spend && <div style={styles.errorText}>{errors.spend}</div>}
          </div>

          {submitError && <div style={styles.errorText}>{submitError}</div>}

          <div style={styles.actions}>
            <button type="button" className="btn btn-sm" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: 16,
  },
  modal: { width: "100%", maxWidth: 440 },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { margin: 0 },
  field: { marginBottom: 14 },
  row: { display: "flex", gap: 12 },
  label: { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #d0d5dd",
    fontSize: 14,
    boxSizing: "border-box",
  },
  errorText: { color: "#d92d20", fontSize: 12, marginTop: 4 },
  actions: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 },
};
