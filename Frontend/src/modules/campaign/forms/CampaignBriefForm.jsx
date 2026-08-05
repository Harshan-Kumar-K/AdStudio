import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const OBJECTIVES = ["Awareness", "Consideration", "Conversion", "Retention"];

const EMPTY_FORM = {
  brandId: "",
  campaignName: "",
  objective: OBJECTIVES[0],
  targetDemographic: "",
  geography: "",
  startDate: "",
  endDate: "",
  totalBudget: "",
  channelPreferences: "",
  submittedById: "",
};

/**
 * Create-campaign-brief form.
 *
 * Payload shape sent to onSubmit matches the backend contract exactly:
 * {
 *   brandId, campaignName, objective, targetDemographic, geography,
 *   startDate, endDate, totalBudget, channelPreferences, submittedById
 * }
 *
 * Props:
 *  - onSubmit: (payload) => Promise<void>  (parent does the actual POST)
 *  - onCancel: () => void
 *  - submittedById: number (optional) - pre-fill the logged in user's id
 */
export default function CampaignBriefForm({ onSubmit, onCancel, submittedById }) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    submittedById: submittedById != null ? String(submittedById) : "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

   const { user } = useAuth();

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.brandId || Number(form.brandId) <= 0) next.brandId = "Enter a valid brand id";
    if (!form.campaignName.trim()) next.campaignName = "Campaign name is required";
    if (!form.objective) next.objective = "Select an objective";
    // if (!form.targetDemographic.trim()) next.targetDemographic = "Target demographic is required";
    // if (!form.geography.trim()) next.geography = "Geography is required";
    if (!form.startDate) next.startDate = "Start date is required";
    if (!form.endDate) next.endDate = "End date is required";
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      next.endDate = "End date must be on or after the start date";
    }
    if (!form.totalBudget || Number(form.totalBudget) <= 0) next.totalBudget = "Enter a budget greater than 0";
    // if (!form.submittedById || Number(form.submittedById) <= 0) next.submittedById = "Enter a valid user id";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    const payload = {
      brandId: Number(form.brandId),
      campaignName: form.campaignName.trim(),
      objective: form.objective,
      targetDemographic: "default",
      geography: "india",
      startDate: form.startDate,
      endDate: form.endDate,
      totalBudget: Number(form.totalBudget),
      channelPreferences: form.channelPreferences.trim(),
      submittedById: user.userId,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
    } catch (err) {
      setServerError(err?.message || "Something went wrong while saving the brief. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="app-form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="form-error-banner">{serverError}</div>}

      <div className="form-grid form-grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="brandId">Brand ID</label>
          <input
            id="brandId"
            type="number"
            min="1"
            className={`form-input ${errors.brandId ? "has-error" : ""}`}
            value={form.brandId}
            onChange={update("brandId")}
            placeholder="e.g. 101"
          />
          {errors.brandId && <span className="form-error">{errors.brandId}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="campaignName">Campaign name</label>
          <input
            id="campaignName"
            type="text"
            className={`form-input ${errors.campaignName ? "has-error" : ""}`}
            value={form.campaignName}
            onChange={update("campaignName")}
            placeholder="e.g. Summer Splash 2026"
          />
          {errors.campaignName && <span className="form-error">{errors.campaignName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="objective">Objective</label>
          <select
            id="objective"
            className={`form-select ${errors.objective ? "has-error" : ""}`}
            value={form.objective}
            onChange={update("objective")}
          >
            {OBJECTIVES.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          {errors.objective && <span className="form-error">{errors.objective}</span>}
        </div>


        <div className="form-group">
          <label className="form-label" htmlFor="totalBudget">Total budget (₹)</label>
          <input
            id="totalBudget"
            type="number"
            min="1"
            step="0.01"
            className={`form-input ${errors.totalBudget ? "has-error" : ""}`}
            value={form.totalBudget}
            onChange={update("totalBudget")}
            placeholder="e.g. 500000"
          />
          {errors.totalBudget && <span className="form-error">{errors.totalBudget}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="startDate">Start date</label>
          <input
            id="startDate"
            type="date"
            className={`form-input ${errors.startDate ? "has-error" : ""}`}
            value={form.startDate}
            onChange={update("startDate")}
          />
          {errors.startDate && <span className="form-error">{errors.startDate}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="endDate">End date</label>
          <input
            id="endDate"
            type="date"
            className={`form-input ${errors.endDate ? "has-error" : ""}`}
            value={form.endDate}
            onChange={update("endDate")}
          />
          {errors.endDate && <span className="form-error">{errors.endDate}</span>}
        </div>


        <div className="form-group form-span-2">
          <label className="form-label" htmlFor="channelPreferences">Channel preferences</label>
          <input
            id="channelPreferences"
            type="text"
            className="form-input"
            value={form.channelPreferences}
            onChange={update("channelPreferences")}
            placeholder="e.g. Instagram, Google Ads, YouTube"
          />
          <span className="form-hint">Comma-separated list of preferred channels (optional)</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
          {submitting ? "Saving…" : "Create brief"}
        </button>
      </div>
    </form>
  );
}
