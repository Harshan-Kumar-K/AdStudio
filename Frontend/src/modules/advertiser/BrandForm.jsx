import React, { useState } from "react";
import { API_BASE, ENDPOINTS } from "../../api/endpoints.js";
import { getToken } from "../../api/apiClient.js";
import { useAuth } from "../../context/AuthContext.jsx";

/* ---------------------------------------------------------------------- */
/*  Brand create/edit form                                                */
/* ---------------------------------------------------------------------- */
export default function BrandForm({ initial, advertisers, onCancel, onSaved }) {
  const isEdit = Boolean(initial?.brandID);
  const { user } = useAuth();
  const [form, setForm] = useState({
    brandName: initial?.brandName || "",
    category: initial?.category || "",
    advertiserId: user.userId,
    allocatedBudget: initial?.allocatedBudget ?? "",
    spentToDate: initial?.spentToDate ?? 0,
    status: initial?.status || "ACTIVE",
    color: initial?.color || "#6366F1",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = isEdit ? `${API_BASE}/${ENDPOINTS.brands}/${initial.brandID}` : `${API_BASE}/${ENDPOINTS.brands}`;
      const method = isEdit ? "PUT" : "POST";
       const { status,spentToDate,...rest } = form; 
      if(!isEdit){
       
        setForm(rest);
        console.log(form, "  ippiii  ",rest);
        console.log(" zooo  ",user);
        
        
      }
      const res = await fetch(url, {
        method,
        headers:  { 
          "Content-Type": "application/json" ,
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          ...form,
          allocatedBudget: Number(form.allocatedBudget),
          spentToDate: Number(form.spentToDate),
        }),
      });
      if (!res.ok) {
       const errorData = await res.json(); // parse the body
      console.log("error message: ", errorData.message);
        
        throw new Error(`Request failed (${res.status} : ${errorData.message})`);
      }
      const saved = await res.json();
      onSaved(saved);
    } catch (err) {

      setError(`${err.message}` || "Something went wrong");
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
            {isEdit ? "Edit brand" : "Create brand"}
          </h2>
          <p className="universal-subtitle">
            {isEdit ? "Update the brand's details." : "Fill in the details to add a new brand."}
          </p>
        </div>

        <form className="universal-form" onSubmit={submit}>
          <div className="universal-field">
            <label className="universal-label">Brand name</label>
            <input
              className="universal-input"
              required
              value={form.brandName}
              onChange={set("brandName")}
              placeholder="Puma Brand"
            />
          </div>

          <div className="universal-field">
            <label className="universal-label">Category</label>
            <input
              className="universal-input"
              required
              value={form.category}
              onChange={set("category")}
              placeholder="Shoes"
            />
          </div>

        

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label">Allocated budget</label>
              <input
                className="universal-input"
                required
                type="number"
                min="0"
                step="0.01"
                value={form.allocatedBudget}
                onChange={set("allocatedBudget")}
              />
            </div>
            <div className="universal-field">
              <label className="universal-label">Spent till date (ex: $100)</label>
              <input
                className="universal-input"
                type="number"
                min="0"
                step="0.01"
                value={form.spentToDate}
                onChange={set("spentToDate")}
              />
            </div>
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label">Status</label>
              <select className="universal-select" value={form.status} onChange={set("status")}>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="universal-field">
              <label className="universal-label">Color</label>
              <input className="universal-input" type="color" value={form.color} onChange={set("color")} />
            </div>
          </div>

          {error && <div className="universal-error-banner">{error}</div>}

          <div className="universal-actions">
            <button type="button" className="universal-btn universal-btn-ghost" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="universal-btn universal-btn-primary" disabled={saving}>
              {saving && <span className="universal-spinner" />}
              {saving ? "Saving..." : isEdit ? "Save changes" : "Create brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
