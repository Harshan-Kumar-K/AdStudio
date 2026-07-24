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
      console.log(user); 
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
      // throw err;
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="form-grid">
      <label className="field">
        <span>Company name</span>
        <input required value={form.companyName} onChange={set("companyName")} placeholder="Acme Corp" />
      </label>
      <label className="field">
        <span>Industry</span>
        <input required value={form.industry} onChange={set("industry")} placeholder="Retail" />
      </label>
      
      <div className="field-row">
        <label className="field">
          <span>Annual budget</span>
          <input required type="number" min="0" step="0.01" value={form.annualBudget} onChange={set("annualBudget")} />
        </label>
        <label className="field">
          <span>Currency</span>
          <select value={form.currency} onChange={set("currency")}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>Status</span>
        <select value={form.status} onChange={set("status")}>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </label>

      {error && <div className="form-error">{error}</div>}

      <div className="modal-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create advertiser"}
        </button>
      </div>
    </form>
  );
}
