import React, { useState } from "react";
import apiClient from "../../api/apiClient.js";

const CHANNELS = ["Display", "Video", "Social", "Search", "OOH", "Print", "Radio"];

/* Create a line item under a chosen plan.
   POST /api/media-plans/{planId}/line-items
   (no PUT form yet — the backend supports full edit via
   PUT /api/line-items/{id}, add it here later if needed) */
export default function LineItemForm({ plans, initialPlanId, onCancel, onSaved }) {
  const [form, setForm] = useState({
    planId: initialPlanId ? String(initialPlanId) : (plans[0]?.planId ? String(plans[0].planId) : ""),
    channel: "Display",
    publisher: "",
    format: "",
    plannedImpressions: "",
    cpm: "",
    flightStart: "",
    flightEnd: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // AUTO-CALCULATED: budget = (impressions / 1000) * CPM
  const computedBudget = (Number(form.plannedImpressions || 0) / 1000) * Number(form.cpm || 0);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.planId) { setError("Select a media plan."); return; }
    if (form.flightEnd <= form.flightStart) { setError("Flight end must be after flight start."); return; }
    setSaving(true);
    try {
      await apiClient.post(`api/media-plans/${form.planId}/line-items`, {
        channel: form.channel,
        publisher: form.publisher,
        format: form.format,
        plannedImpressions: Number(form.plannedImpressions),
        plannedBudget: computedBudget,
        cpm: Number(form.cpm),
        flightStart: form.flightStart,
        flightEnd: form.flightEnd,
      });
      onSaved();
    } catch (err) {
      setError(err.message || "Failed to create line item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="form-grid">
      <label className="field">
        <span>Media Plan</span>
        <select value={form.planId} onChange={set("planId")} required>
          <option value="">-- choose a plan --</option>
          {plans.map((p) => (
            <option key={p.planId} value={p.planId}>#{p.planId} — Brief #{p.briefId}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Channel</span>
        <select value={form.channel} onChange={set("channel")}>
          {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Publisher</span>
        <input required value={form.publisher} onChange={set("publisher")} placeholder="Times Network" />
      </label>
      <label className="field">
        <span>Format</span>
        <input value={form.format} onChange={set("format")} placeholder="Banner 728x90" />
      </label>
      <div className="field-row">
        <label className="field">
          <span>Planned Impressions</span>
          <input required type="number" min="1" value={form.plannedImpressions} onChange={set("plannedImpressions")} />
        </label>
        <label className="field">
          <span>CPM</span>
          <input required type="number" step="0.01" value={form.cpm} onChange={set("cpm")} />
        </label>
      </div>
      <label className="field">
        <span>Planned Budget (auto)</span>
        <input type="number" value={computedBudget.toFixed(2)} readOnly disabled />
      </label>
      <div className="field-row">
        <label className="field">
          <span>Flight Start</span>
          <input required type="date" value={form.flightStart} onChange={set("flightStart")} />
        </label>
        <label className="field">
          <span>Flight End</span>
          <input required type="date" min={form.flightStart} value={form.flightEnd} onChange={set("flightEnd")} />
        </label>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="modal-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
          {saving ? "Creating..." : "Create line item"}
        </button>
      </div>
    </form>
  );
}
