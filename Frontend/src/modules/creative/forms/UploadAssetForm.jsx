import React, { useState } from "react";
import { IcClose, IcUpload } from "../../../assets/icons.jsx";

const ASSET_TYPES = ["BANNER", "VIDEO", "IMAGE", "NATIVE", "AUDIO", "RICH_MEDIA"];
const STATUSES = ["DRAFT"];

const INITIAL_FORM = {
  brandId: "",
  campaignBriefId: "",
  assetName: "",
  filePath: "",
  fileSizeKB: "",
  version: 1,
  uploadedById: "",
  width: "",
  height: "",
  assetType: "BANNER",
  status: "DRAFT",
};

export default function UploadAssetForm({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setForm((prev) => ({
      ...prev,
      filePath: selected.name,
      fileSizeKB: Math.round(selected.size / 1024),
    }));
  };

  const validate = () => {
    const next = {};
    if (!form.assetName.trim()) next.assetName = "Asset name is required";
    if (!form.brandId) next.brandId = "Brand is required";
    if (!form.filePath) next.filePath = "Please select a file";
    if (!form.assetType) next.assetType = "Asset type is required";
    if (!form.status) next.status = "Status is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      brandId: Number(form.brandId),
      campaignBriefId: form.campaignBriefId ? Number(form.campaignBriefId) : null,
      assetName: form.assetName.trim(),
      filePath: form.filePath,
      fileSizeKB: form.fileSizeKB ? Number(form.fileSizeKB) : null,
      version: form.version ? Number(form.version) : 1,
      uploadedById: form.uploadedById ? Number(form.uploadedById) : null,
      width: form.width ? Number(form.width) : null,
      height: form.height ? Number(form.height) : null,
      assetType: form.assetType,
      status: form.status,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload, file);
      setForm(INITIAL_FORM);
      setFile(null);
      onClose();
    } catch (err) {
      setErrors({ submit: "Failed to upload asset. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setFile(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="universal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="universal-modal">
        <span className="universal-orb universal-orb-1" />
        <span className="universal-orb universal-orb-2" />

        <button type="button" className="universal-close" onClick={handleClose} aria-label="Close">
          ✕
        </button>

        <div className="universal-header">
          <h2 className="universal-title"><IcUpload /> Upload Asset</h2>
          <p className="universal-subtitle">Fill in the details to upload a new creative asset.</p>
        </div>

        <form onSubmit={handleSubmit} className="universal-form">
          <div className="universal-field">
            <label className="universal-label">Asset Name</label>
            <input
              className="universal-input"
              type="text"
              name="assetName"
              value={form.assetName}
              onChange={handleChange}
              placeholder="e.g. Summer_Sale_Banner_v1"
            />
            {errors.assetName && <span className="universal-field-error">{errors.assetName}</span>}
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label">Brand ID</label>
              <input
                className="universal-input"
                type="number"
                name="brandId"
                value={form.brandId}
                onChange={handleChange}
                placeholder="Brand ID"
              />
              {errors.brandId && <span className="universal-field-error">{errors.brandId}</span>}
            </div>

            <div className="universal-field">
              <label className="universal-label">Campaign Brief ID</label>
              <input
                className="universal-input"
                type="number"
                name="campaignBriefId"
                value={form.campaignBriefId}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="universal-field">
            <label className="universal-label">File</label>
            <input className="universal-input" type="file" name="file" onChange={handleFileChange} />
            {errors.filePath && <span className="universal-field-error">{errors.filePath}</span>}
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label">Width (px)</label>
              <input
                className="universal-input"
                type="number"
                name="width"
                value={form.width}
                onChange={handleChange}
                placeholder="e.g. 300"
              />
            </div>

            <div className="universal-field">
              <label className="universal-label">Height (px)</label>
              <input
                className="universal-input"
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="e.g. 250"
              />
            </div>
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label">Asset Type</label>
              <select className="universal-select" name="assetType" value={form.assetType} onChange={handleChange}>
                {ASSET_TYPES.map((type) => (
                  <option key={type} value={type}>{type.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>

            <div className="universal-field">
              <label className="universal-label">Status</label>
              <select className="universal-select" name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label">Version</label>
              <input
                className="universal-input"
                type="number"
                name="version"
                value={form.version}
                onChange={handleChange}
                min={1}
              />
            </div>

            <div className="universal-field">
              <label className="universal-label">Uploaded By (User ID)</label>
              <input
                className="universal-input"
                type="number"
                name="uploadedById"
                value={form.uploadedById}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
          </div>

          {errors.submit && <div className="universal-error-banner">{errors.submit}</div>}

          <div className="universal-actions">
            <button type="button" className="universal-btn universal-btn-ghost" onClick={handleClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="universal-btn universal-btn-primary" disabled={submitting}>
              {submitting && <span className="universal-spinner" />}
              {submitting ? "Uploading..." : "Upload Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}