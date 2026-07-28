import React, { useState } from "react";
import { IcSend } from "../../assets/icons.jsx";

const initialForm = {
  advertiserId: "",
  campaignBriefId: "",
  billingPeriod: "",
  invoiceAmount: "",
  commissionRate: "",
};

export default function GenerateInvoiceForm({ onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.advertiserId.trim()) next.advertiserId = "advertiserId is required";
    if (!form.campaignBriefId.trim()) next.campaignBriefId = "campaignBriefId is required";
    if (!form.billingPeriod.trim()) next.billingPeriod = "Billing Period is required";
    if (!form.invoiceAmount || Number(form.invoiceAmount) <= 0) next.invoiceAmount = "Enter a valid invoiceAmount";
    if (form.commissionRate === "" || Number(form.commissionRate) < 0)
      next.commissionRate = "Enter a valid commission Rate";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()){
      console.log("Not validated");
      return;
    }

    onSubmit({
      advertiserId: Number(form.advertiserId),
      campaignBriefId: Number(form.campaignBriefId),
      billingPeriod: form.billingPeriod.trim(),
      invoiceAmount: Number(form.invoiceAmount),
      commissionRate: Number(form.commissionRate/100),// Convert percentage to decimal
    });
  };
return (
    <div className="universal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="universal-modal">
        <span className="universal-orb universal-orb-1" />
        <span className="universal-orb universal-orb-2" />

        <button type="button" className="universal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className="universal-header">
          <h2 className="universal-title">Generate Client Invoice</h2>
        </div>

        <form onSubmit={handleSubmit} className="universal-form">
          <div className="universal-field">
            <label className="universal-label" htmlFor="advertiserId">Advertiser Id</label>
            <input
              className="universal-input"
              id="advertiserId"
              type="number"
              value={form.advertiserId}
              onChange={handleChange("advertiserId")}
              placeholder="e.g. Advert-Pro Ltd."
            />
            {errors.advertiserId && <span className="universal-field-error">{errors.advertiserId}</span>}
          </div>

          <div className="universal-field">
            <label className="universal-label" htmlFor="campaignBriefId">Campaign Brief Id</label>
            <input
              className="universal-input"
              id="campaignBriefId"
              type="number"
              value={form.campaignBriefId}
              onChange={handleChange("campaignBriefId")}
              placeholder="e.g. Summer Sale 2026"
            />
            {errors.campaignBriefId && <span className="universal-field-error">{errors.campaignBriefId}</span>}
          </div>

          <div className="universal-field">
            <label className="universal-label" htmlFor="billingPeriod">Billing Period</label>
            <input
              className="universal-input"
              id="billingPeriod"
              type="text"
              value={form.billingPeriod}
              onChange={handleChange("billingPeriod")}
              placeholder="e.g. Jul 2026"
            />
            {errors.billingPeriod && <span className="universal-field-error">{errors.billingPeriod}</span>}
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label" htmlFor="invoiceAmount">invoiceAmount ($)</label>
              <input
                className="universal-input"
                id="invoiceAmount"
                type="number"
                min="0"
                step="0.01"
                value={form.invoiceAmount}
                onChange={handleChange("invoiceAmount")}
                placeholder="0.00"
              />
              {errors.invoiceAmount && <span className="universal-field-error">{errors.invoiceAmount}</span>}
            </div>

            <div className="universal-field">
              <label className="universal-label" htmlFor="commissionRate">commission Rate ($) in %</label>
              <input
                className="universal-input"
                id="commissionRate"
                
                type="range" 
                 min="0"
                 max="100" 
               
                value={form.commissionRate}
                onChange={handleChange("commissionRate")}
                // placeholder="0.00"
              />
              {errors.commissionRate && <span className="universal-field-error">{errors.commissionRate}</span>}
            </div>
          </div>

          {/* {netBillable !== null && !Number.isNaN(netBillable) && (
            <div className="universal-preview">
              Net billable: <strong>${netBillable.toFixed(2)}</strong>
            </div>
          )} */}

          <div className="universal-actions">
            <button type="button" className="universal-btn universal-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="universal-btn universal-btn-primary">
              <IcSend size={14} /> Generate invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}