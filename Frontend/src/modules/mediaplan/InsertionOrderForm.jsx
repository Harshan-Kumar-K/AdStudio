import React, { useState, useEffect } from "react";
import apiClient from "../../api/apiClient.js";

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* Create an insertion order for a line item.
   POST /api/insertion-orders
   If `initial.lineItemId` is passed (opened from a line item row) the
   line item is pre-filled and locked; otherwise the user types an ID
   and it's looked up on blur. */
export default function InsertionOrderForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    lineItemId: initial?.lineItemId ? String(initial.lineItemId) : "",
    publisherId: "",
    orderDate: today(),
    startDate: "",
    endDate: "",
    committedImpressions: "",
  });
  const [liCpm, setLiCpm] = useState(0);
  const [liInfo, setLiInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // AUTO-CALCULATED: orderValue = (committedImpressions / 1000) * the line item's CPM
  const computedValue = (Number(form.committedImpressions || 0) / 1000) * Number(liCpm || 0);

  const fetchLineItem = async (id) => {
    if (!id) { setLiInfo(null); setLiCpm(0); return; }
    try {
      const li = await apiClient.get(`api/line-items/${id}`);
      setLiInfo(li);
      setLiCpm(li.cpm || 0);
      setForm((f) => ({
        ...f,
        committedImpressions: f.committedImpressions || li.plannedImpressions,
        startDate: f.startDate || li.flightStart,
        endDate: f.endDate || li.flightEnd,
      }));
      setError("");
    } catch {
      setLiInfo(null); setLiCpm(0);
      setError(`Line item #${id} not found — check the ID.`);
    }
  };

  useEffect(() => {
    if (initial?.lineItemId) fetchLineItem(initial.lineItemId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.endDate <= form.startDate) { setError("End date must be after start date."); return; }
    if (computedValue <= 0) { setError("Enter a valid Line Item ID and committed impressions first."); return; }
    setSaving(true);
    try {
      await apiClient.post("api/insertion-orders", {
        lineItemId: Number(form.lineItemId),
        publisherId: Number(form.publisherId),
        orderDate: form.orderDate,
        startDate: form.startDate,
        endDate: form.endDate,
        committedImpressions: Number(form.committedImpressions),
        orderValue: computedValue,
      });
      onSaved();
    } catch (err) {
      setError(err.message || "Failed to create insertion order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="universal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="universal-modal">
        <span className="universal-orb universal-orb-1" />
        <span className="universal-orb universal-orb-2" />

        <button type="button" className="universal-close" onClick={onCancel} aria-label="Close">
          ✕
        </button>

        <div className="universal-header">
          <h2 className="universal-title">Generate purchase order</h2>
          <p className="universal-subtitle">Fill in the details to generate and send the order.</p>
        </div>

        <form className="universal-form" onSubmit={submit}>
          <div className="universal-field">
            <label className="universal-label">Line Item ID</label>
            <input
              className="universal-input"
              required
              type="number"
              value={form.lineItemId}
              onChange={set("lineItemId")}
              onBlur={(e) => fetchLineItem(e.target.value)}
              disabled={Boolean(initial?.lineItemId)}
            />
          </div>

          <div className="universal-field">
            <label className="universal-label">Publisher ID</label>
            <input
              className="universal-input"
              required
              type="number"
              value={form.publisherId}
              onChange={set("publisherId")}
            />
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label">Committed Impressions</label>
              <input
                className="universal-input"
                required
                type="number"
                min="1"
                value={form.committedImpressions}
                onChange={set("committedImpressions")}
              />
            </div>
            <div className="universal-field">
              <label className="universal-label">Order Value (auto)</label>
              <input
                className="universal-input"
                type="number"
                value={computedValue.toFixed(2)}
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label">Order Date</label>
              <input
                className="universal-input"
                required
                type="date"
                value={form.orderDate}
                onChange={set("orderDate")}
              />
            </div>
            <div className="universal-field">
              <label className="universal-label">Start Date</label>
              <input
                className="universal-input"
                required
                type="date"
                value={form.startDate}
                onChange={set("startDate")}
              />
            </div>
            <div className="universal-field">
              <label className="universal-label">End Date</label>
              <input
                className="universal-input"
                required
                type="date"
                min={form.startDate}
                value={form.endDate}
                onChange={set("endDate")}
              />
            </div>
          </div>

          {liInfo && (
            <p className="universal-subtitle" style={{ marginTop: "-8px" }}>
              Line Item #{liInfo.lineItemId}: {liInfo.channel} · {liInfo.publisher} · CPM ₹{liInfo.cpm}.
              Order value = (Committed ÷ 1000) × CPM = <b>{computedValue.toFixed(2)}</b>
            </p>
          )}

          {error && <div className="universal-error-banner">{error}</div>}

          <div className="universal-actions">
            <button type="button" className="universal-btn universal-btn-ghost" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="universal-btn universal-btn-primary" disabled={saving}>
              {saving && <span className="universal-spinner" />}
              {saving ? "Sending..." : "Generate & send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}