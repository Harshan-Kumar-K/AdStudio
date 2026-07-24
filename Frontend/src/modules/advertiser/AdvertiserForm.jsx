import React, { useState } from "react";
import {API_BASE, ENDPOINTS } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { getToken} from "../../api/apiClient.js";
/* ---------------------------------------------------------------------- */
/*  Advertiser create/edit form                                           */
/* ---------------------------------------------------------------------- */
export default function AdvertiserForm({ initial, onCancel, onSaved }) {
  const isEdit = Boolean(initial?.advertiserId);
  const { user } = useAuth();
  const [form, setForm] = useState({
    companyName: initial?.companyName || "",
    industry: initial?.industry || "",
   accountManagerId: user.userId,
    annualBudget: initial?.annualBudget ?? "",
    currency: initial?.currency || "USD",
  });
   
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = isEdit ? `${API_BASE}/${ENDPOINTS.advertisers}/${initial.advertiserId}` : `${API_BASE}/${ENDPOINTS.advertisers}`;
      const method = isEdit ? "PUT" : "POST";
     const { status, ...rest } = form; 
      if(!isEdit){
       
        setForm(rest);
      }
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json" ,
         "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ ...form, annualBudget: Number(form.annualBudget) }),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const saved = await res.json();
      onSaved(saved);
    } catch (err) {
      setError(err.message || "Something went wrong");
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
            {isEdit ? "Edit advertiser" : "Create advertiser"}
          </h2>
          <p className="universal-subtitle">
            {isEdit ? "Update the advertiser's account details." : "Fill in the details to add a new advertiser."}
          </p>
        </div>

        <form className="universal-form" onSubmit={submit}>
          <div className="universal-field">
            <label className="universal-label">Company name</label>
            <input
              className="universal-input"
              required
              value={form.companyName}
              onChange={set("companyName")}
              placeholder="Puma Corp"
            />
          </div>

          <div className="universal-field">
            <label className="universal-label">Industry</label>
            <input
              className="universal-input"
              required
              value={form.industry}
              onChange={set("industry")}
              placeholder="Shoes"
            />
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label">Annual budget</label>
              <input
                className="universal-input"
                required
                type="number"
                min="0"
                step="0.01"
                value={form.annualBudget}
                onChange={set("annualBudget")}
              />
            </div>
            <div className="universal-field">
              <label className="universal-label">Currency</label>
              <select className="universal-select" value={form.currency} onChange={set("currency")}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          <div className="universal-field">
            <label className="universal-label">Status</label>
            <select className="universal-select" value={form.status} onChange={set("status")}>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {error && <div className="universal-error-banner">{error}</div>}

          <div className="universal-actions">
            <button type="button" className="universal-btn universal-btn-ghost" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="universal-btn universal-btn-primary" disabled={saving}>
              {saving && <span className="universal-spinner" />}
              {saving ? "Saving..." : isEdit ? "Save changes" : "Create advertiser"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}