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
    <div className="universal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="universal-modal">
        <span className="universal-orb universal-orb-1" />
        <span className="universal-orb universal-orb-2" />

        <button type="button" className="universal-close" onClick={onCancel} aria-label="Close">
          ✕
        </button>

        <div className="universal-header">
          <h2 className="universal-title">Create line item</h2>
          <p className="universal-subtitle">Fill in the details to add a new line item.</p>
        </div>

        <form className="universal-form" onSubmit={submit}>
          <div className="universal-field">
            <label className="universal-label">Media Plan</label>
            <select className="universal-select" value={form.planId} onChange={set("planId")} required>
              <option value="">-- choose a plan --</option>
              {plans.map((p) => (
                <option key={p.planId} value={p.planId}>#{p.planId} — Brief #{p.briefId}</option>
              ))}
            </select>
          </div>

          <div className="universal-field">
            <label className="universal-label">Channel</label>
            <select className="universal-select" value={form.channel} onChange={set("channel")}>
              {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="universal-field">
            <label className="universal-label">Publisher</label>
            <input
              className="universal-input"
              required
              value={form.publisher}
              onChange={set("publisher")}
              placeholder="Times Network"
            />
          </div>

          <div className="universal-field">
            <label className="universal-label">Format</label>
            <input
              className="universal-input"
              value={form.format}
              onChange={set("format")}
              placeholder="Banner 728x90"
            />
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label">Planned Impressions</label>
              <input
                className="universal-input"
                required
                type="number"
                min="1"
                value={form.plannedImpressions}
                onChange={set("plannedImpressions")}
              />
            </div>
            <div className="universal-field">
              <label className="universal-label">Cost Per Thousand Imprsns</label>
              <input
                className="universal-input"
                required
                type="number"
                step="0.01"
                value={form.cpm}
                onChange={set("cpm")}
              />
            </div>
          </div>

          <div className="universal-field">
            <label className="universal-label">Planned Budget (auto)</label>
            <input
              className="universal-input"
              type="number"
              value={computedBudget.toFixed(2)}
              readOnly
              disabled
            />
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label">Flight Start</label>
              <input
                className="universal-input"
                required
                type="date"
                value={form.flightStart}
                onChange={set("flightStart")}
              />
            </div>
            <div className="universal-field">
              <label className="universal-label">Flight End</label>
              <input
                className="universal-input"
                required
                type="date"
                min={form.flightStart}
                value={form.flightEnd}
                onChange={set("flightEnd")}
              />
            </div>
          </div>

          {error && <div className="universal-error-banner">{error}</div>}

          <div className="universal-actions">
            <button type="button" className="universal-btn universal-btn-ghost" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="universal-btn universal-btn-primary" disabled={saving}>
              {saving && <span className="universal-spinner" />}
              {saving ? "Creating..." : "Create line item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}