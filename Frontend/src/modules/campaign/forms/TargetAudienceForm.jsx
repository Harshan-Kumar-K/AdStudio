import React, { useState } from "react";
import "../forms-and-modal.css";

const GENDERS = ["All", "Male", "Female", "Other"];
const DEVICE_TYPES = ["All", "Mobile", "Desktop", "Tablet"];

const EMPTY_FORM = {
  briefId: "",
  ageRange: "",
  gender: GENDERS[0],
  interests: "",
  geography: "",
  deviceType: DEVICE_TYPES[0],
};

/**
 * Create-target-audience form.
 *
 * Payload shape sent to onSubmit matches the backend contract exactly:
 * { briefId, ageRange, gender, interests, geography, deviceType }
 *
 * Props:
 *  - briefs: array of { id, campaignName } used to populate the brief dropdown.
 *            Falls back to a plain numeric input if not provided.
 *  - onSubmit: (payload) => Promise<void>  (parent does the actual POST)
 *  - onCancel: () => void
 */
export default function TargetAudienceForm({ briefs = [], onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.briefId || Number(form.briefId) <= 0) next.briefId = "Select or enter a valid brief id";
    if (!form.ageRange.trim()) next.ageRange = "Age range is required";
    else if (!/^\d{1,2}\s*-\s*\d{1,3}\+?$/.test(form.ageRange.trim())) {
      next.ageRange = "Use a format like 18-24 or 55+";
    }
    if (!form.gender) next.gender = "Select a gender";
    if (!form.interests.trim()) next.interests = "Interests are required";
    if (!form.geography.trim()) next.geography = "Geography is required";
    if (!form.deviceType) next.deviceType = "Select a device type";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    const payload = {
      briefId: Number(form.briefId),
      ageRange: form.ageRange.trim(),
      gender: form.gender,
      interests: form.interests.trim(),
      geography: form.geography.trim(),
      deviceType: form.deviceType,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
    } catch (err) {
      setServerError(err?.message || "Something went wrong while saving the audience. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="app-form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="form-error-banner">{serverError}</div>}

      <div className="form-grid form-grid-2">
        <div className="form-group form-span-2">
          <label className="form-label" htmlFor="briefId">Campaign brief</label>
          {briefs.length > 0 ? (
            <select
              id="briefId"
              className={`form-select ${errors.briefId ? "has-error" : ""}`}
              value={form.briefId}
              onChange={update("briefId")}
            >
              <option value="">Select a brief…</option>
              {briefs.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} · {b.campaignName}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="briefId"
              type="number"
              min="1"
              className={`form-input ${errors.briefId ? "has-error" : ""}`}
              value={form.briefId}
              onChange={update("briefId")}
              placeholder="e.g. 12"
            />
          )}
          {errors.briefId && <span className="form-error">{errors.briefId}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ageRange">Age range</label>
          <input
            id="ageRange"
            type="text"
            className={`form-input ${errors.ageRange ? "has-error" : ""}`}
            value={form.ageRange}
            onChange={update("ageRange")}
            placeholder="e.g. 18-24"
          />
          {errors.ageRange && <span className="form-error">{errors.ageRange}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="gender">Gender</label>
          <select
            id="gender"
            className={`form-select ${errors.gender ? "has-error" : ""}`}
            value={form.gender}
            onChange={update("gender")}
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.gender && <span className="form-error">{errors.gender}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="deviceType">Device type</label>
          <select
            id="deviceType"
            className={`form-select ${errors.deviceType ? "has-error" : ""}`}
            value={form.deviceType}
            onChange={update("deviceType")}
          >
            {DEVICE_TYPES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.deviceType && <span className="form-error">{errors.deviceType}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="geography">Geography</label>
          <input
            id="geography"
            type="text"
            className={`form-input ${errors.geography ? "has-error" : ""}`}
            value={form.geography}
            onChange={update("geography")}
            placeholder="e.g. Tamil Nadu, India"
          />
          {errors.geography && <span className="form-error">{errors.geography}</span>}
        </div>

        <div className="form-group form-span-2">
          <label className="form-label" htmlFor="interests">Interests</label>
          <input
            id="interests"
            type="text"
            className={`form-input ${errors.interests ? "has-error" : ""}`}
            value={form.interests}
            onChange={update("interests")}
            placeholder="e.g. Fitness, Travel, Technology"
          />
          {errors.interests && <span className="form-error">{errors.interests}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
          {submitting ? "Saving…" : "Create audience"}
        </button>
      </div>
    </form>
  );
}
