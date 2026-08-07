import React, { useState } from "react";
import apiClient from "../../api/apiClient.js";

/* Create/edit a media plan.
   POST /api/media-plans           (create)
   PUT  /api/media-plans/{planId}  (edit) — status is changed separately */
export default function MediaPlanForm({ initial, onCancel, onSaved }) {
  const isEdit = Boolean(initial?.planId);
  const [form, setForm] = useState({
    briefId: initial?.briefId ?? "", //nullish coalescing operator ??
    plannerId: initial?.plannerId ?? "", 
    totalBudgetAllocated: initial?.totalBudgetAllocated ?? "",
    channelMix: initial?.channelMix ?? "",
    startDate: initial?.startDate ?? "",
    endDate: initial?.endDate ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.endDate <= form.startDate) { setError("End date must be after start date."); return; }
    setSaving(true);
    try {
      const payload = {
        briefId: Number(form.briefId),
        plannerId: Number(form.plannerId),
        totalBudgetAllocated: Number(form.totalBudgetAllocated),
        channelMix: form.channelMix,
        startDate: form.startDate,
        endDate: form.endDate,
      };
      if (isEdit) await apiClient.put(`api/media-plans/${initial.planId}`, payload);
      else await apiClient.post("api/media-plans", payload);
      onSaved();
    } catch (err) {
      setError(err.message || "Failed to save media plan.");
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
          <h2 className="universal-title">
            {isEdit ? "Edit media plan" : "Create media plan"}
          </h2>
          <p className="universal-subtitle">
            {isEdit ? "Update the media plan's details." : "Fill in the details to add a new media plan."}
          </p>
        </div>

        <form className="universal-form" onSubmit={submit}>
          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label">Brief ID</label>
              <input
                className="universal-input"
                required
                type="number"
                value={form.briefId}
                onChange={set("briefId")}
              />
            </div>
            <div className="universal-field">
              <label className="universal-label">Planner ID</label>
              <input
                className="universal-input"
                required
                type="number"
                value={form.plannerId}
                onChange={set("plannerId")}
              />
            </div>
          </div>

          <div className="universal-field">
            <label className="universal-label">Total Budget</label>
            <input
              className="universal-input"
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.totalBudgetAllocated}
              onChange={set("totalBudgetAllocated")}
            />
          </div>

          <div className="universal-field">
            <label className="universal-label">Channel Mix</label>
            <input
              className="universal-input"
              value={form.channelMix}
              onChange={set("channelMix")}
              placeholder="Display, Video, Social"
            />
          </div>

          <div className="universal-field-row">
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

          {error && <div className="universal-error-banner">{error}</div>}

          <div className="universal-actions">
            <button type="button" className="universal-btn universal-btn-ghost" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="universal-btn universal-btn-primary" disabled={saving}>
              {saving && <span className="universal-spinner" />}
              {saving ? "Saving..." : isEdit ? "Save changes" : "Create media plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}