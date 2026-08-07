import React, { useState } from "react";
import { IcSend } from "../../assets/icons.jsx";

const initialForm = {
  userId: "",
  publisherId: "",
  ioId: "",
  invoiceAmount: "",
  receivedDate: "",
};

export default function RecordPublisherPaymentForm({ onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.publisherId.trim()) next.publisherId = "publisherId is required";
    if (!form.ioId.trim()) next.ioId = "ioId is required";
    if (!form.invoiceAmount || Number(form.invoiceAmount) <= 0) next.invoiceAmount = "Enter a valid invoiceAmount";
    if (!form.receivedDate.trim()) next.receivedDate = "receivedDate is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      console.log("Not validated");
      return;
    }

    onSubmit({
        publisherId: Number(form.publisherId),
        ioId: Number(form.ioId),
        invoiceAmount: Number(form.invoiceAmount),
        receivedDate: form.receivedDate,
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
          <h2 className="universal-title">Record Publisher Payment</h2>
        </div>

        <form onSubmit={handleSubmit} className="universal-form">
         

          <div className="universal-field">
            <label className="universal-label" htmlFor="publisherId">Publisher Id</label>
            <input
              className="universal-input"
              id="publisherId"
              type="number"
              value={form.publisherId}
              onChange={handleChange("publisherId")}
              placeholder="e.g. 205"
            />
            {errors.publisherId && <span className="universal-field-error">{errors.publisherId}</span>}
          </div>

          <div className="universal-field">
            <label className="universal-label" htmlFor="ioId">Insertion Order Id</label>
            <input
              className="universal-input"
              id="ioId"
              type="number"
              value={form.ioId}
              onChange={handleChange("ioId")}
              placeholder="e.g. 3390"
            />
            {errors.ioId && <span className="universal-field-error">{errors.ioId}</span>}
          </div>

          <div className="universal-field-row">
            <div className="universal-field">
              <label className="universal-label" htmlFor="invoiceAmount">Invoice Amount ($)</label>
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
              <label className="universal-label" htmlFor="receivedDate">Received Date</label>
              <input
                className="universal-input"
                id="receivedDate"
                type="date"
                value={form.receivedDate}
                onChange={handleChange("receivedDate")}
              />
              {errors.receivedDate && <span className="universal-field-error">{errors.receivedDate}</span>}
            </div>
          </div>

          <div className="universal-actions">
            <button type="button" className="universal-btn universal-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="universal-btn universal-btn-primary">
              <IcSend size={14} /> Record payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
