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
    <form onSubmit={submit} className="form-grid">
      <label className="field">
        <span>Line Item ID</span>
        <input
          required
          type="number"
          value={form.lineItemId}
          onChange={set("lineItemId")}
          onBlur={(e) => fetchLineItem(e.target.value)}
          disabled={Boolean(initial?.lineItemId)}
        />
      </label>
      <label className="field">
        <span>Publisher ID</span>
        <input required type="number" value={form.publisherId} onChange={set("publisherId")} />
      </label>
      <div className="field-row">
        <label className="field">
          <span>Committed Impressions</span>
          <input required type="number" min="1" value={form.committedImpressions} onChange={set("committedImpressions")} />
        </label>
        <label className="field">
          <span>Order Value (auto)</span>
          <input type="number" value={computedValue.toFixed(2)} readOnly disabled />
        </label>
      </div>
      <div className="field-row">
        <label className="field">
          <span>Order Date</span>
          <input required type="date" value={form.orderDate} onChange={set("orderDate")} />
        </label>
        <label className="field">
          <span>Start Date</span>
          <input required type="date" value={form.startDate} onChange={set("startDate")} />
        </label>
        <label className="field">
          <span>End Date</span>
          <input required type="date" min={form.startDate} value={form.endDate} onChange={set("endDate")} />
        </label>
      </div>

      {liInfo && (
        <p className="cell-muted txt-sm">
          Line item #{liInfo.lineItemId}: {liInfo.channel} · {liInfo.publisher} · CPM ${liInfo.cpm}.
          Order value = (committed ÷ 1000) × CPM = <b>{computedValue.toFixed(2)}</b>
        </p>
      )}
      {error && <div className="form-error">{error}</div>}

      <div className="modal-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
          {saving ? "Sending..." : "Generate & send"}
        </button>
      </div>
    </form>
  );
}
