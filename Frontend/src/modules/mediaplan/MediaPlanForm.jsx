import React, { useState } from "react";
import apiClient from "../../api/apiClient.js";

/* Create/edit a media plan.
   POST /api/media-plans           (create)
   PUT  /api/media-plans/{planId}  (edit) — status is changed separately */
export default function MediaPlanForm({ initial, onCancel, onSaved }) {
  const isEdit = Boolean(initial?.planId);
  const [form, setForm] = useState({
    briefId: initial?.briefId ?? "",
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
    <form onSubmit={submit} className="form-grid">
      <div className="field-row">
        <label className="field">
          <span>Brief ID</span>
          <input required type="number" value={form.briefId} onChange={set("briefId")} />
        </label>
        <label className="field">
          <span>Planner ID</span>
          <input required type="number" value={form.plannerId} onChange={set("plannerId")} />
        </label>
      </div>
      <label className="field">
        <span>Total Budget</span>
        <input required type="number" min="0.01" step="0.01" value={form.totalBudgetAllocated} onChange={set("totalBudgetAllocated")} />
      </label>
      <label className="field">
        <span>Channel Mix</span>
        <input value={form.channelMix} onChange={set("channelMix")} placeholder="Display, Video, Social" />
      </label>
      <div className="field-row">
        <label className="field">
          <span>Start Date</span>
          <input required type="date" value={form.startDate} onChange={set("startDate")} />
        </label>
        <label className="field">
          <span>End Date</span>
          <input required type="date" min={form.startDate} value={form.endDate} onChange={set("endDate")} />
        </label>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="modal-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create media plan"}
        </button>
      </div>
    </form>
  );
}
