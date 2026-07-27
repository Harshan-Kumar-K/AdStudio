import React, { useState } from "react";
import { IcSend } from "../../assets/icons.jsx";

const initialForm = {
  advertiser: "",
  campaign: "",
  period: "",
  amount: "",
  commission: "",
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
    if (!form.advertiser.trim()) next.advertiser = "Advertiser is required";
    if (!form.campaign.trim()) next.campaign = "Campaign is required";
    if (!form.period.trim()) next.period = "Period is required";
    if (!form.amount || Number(form.amount) <= 0) next.amount = "Enter a valid amount";
    if (form.commission === "" || Number(form.commission) < 0)
      next.commission = "Enter a valid commission";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const netBillable =
    form.amount && form.commission
      ? Number(form.amount) - Number(form.commission)
      : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      advertiser: form.advertiser.trim(),
      campaign: form.campaign.trim(),
      period: form.period.trim(),
      amount: Number(form.amount),
      commission: Number(form.commission),
      netBillable: Number(form.amount) - Number(form.commission),
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
            <label className="universal-label" htmlFor="advertiser">Advertiser</label>
            <input
              className="universal-input"
              id="advertiser"
              type="text"
              value={form.advertiser}
              onChange={handleChange("advertiser")}
              placeholder="e.g. Acme Corp"
            />
            {errors.advertiser && <span className="universal-field-error">{errors.advertiser}</span>}
          </div>

          <div className="universal-field">
            <label className="universal-label" htmlFor="campaign">Campaign</label>
            <input
              className="universal-input"
              id="campaign"
              type="text"
              value={form.campaign}
              onChange={handleChange("campaign")}
              placeholder="e.g. Summer Sale 2026"
            />
            {errors.campaign && <span className="universal-field-error">{errors.campaign}</span>}
          </div>

          <div className="universal-field">
            <label className="universal-label" htmlFor="period">Billing Period</label>
            <input
              className="universal-input"
              id="period"
              type="text"
              value={form.period}
              onChange={handleChange("period")}
              placeholder="e.g. Jul 2026"
            />
            {errors.period && <span className="universal-field-error">{errors.period}</span>}
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label" htmlFor="amount">Amount ($)</label>
              <input
                className="universal-input"
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleChange("amount")}
                placeholder="0.00"
              />
              {errors.amount && <span className="universal-field-error">{errors.amount}</span>}
            </div>

            <div className="universal-field">
              <label className="universal-label" htmlFor="commission">Commission ($)</label>
              <input
                className="universal-input"
                id="commission"
                type="number"
                min="0"
                step="0.01"
                value={form.commission}
                onChange={handleChange("commission")}
                placeholder="0.00"
              />
              {errors.commission && <span className="universal-field-error">{errors.commission}</span>}
            </div>
          </div>

          {netBillable !== null && !Number.isNaN(netBillable) && (
            <div className="universal-preview">
              Net billable: <strong>${netBillable.toFixed(2)}</strong>
            </div>
          )}

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