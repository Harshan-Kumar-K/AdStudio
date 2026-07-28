import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Tabs from "../../components/Tabs.jsx";
import { MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcFinance, IcPlus } from "../../assets/icons.jsx";
import {
  MOCK_CLIENT_INVOICES,
  MOCK_PUBLISHER_RECON,
  MOCK_PAYMENT_TRACKER,
} from "../../data/mockData.js";

import ClientInvoicesTab from "./tabs/ClientInvoicesTab.jsx";
import PublisherReconciliationTab from "./tabs/PublisherReconciliationTab.jsx";
import PaymentTrackerTab from "./tabs/PaymentTrackerTab.jsx";
import GenerateInvoiceForm from "./GenerateInvoiceForm.jsx";

export default function FinanceDashboard() {
  const [tab, setTab] = useState("client");
  const [showForm, setShowForm] = useState(false);

  const { data: client, loading: lc, isMock } = useApiData(
    ENDPOINTS.clientInvoices,
    MOCK_CLIENT_INVOICES
  );
  const { data: recon, loading: lr } = useApiData(
    ENDPOINTS.publisherInvoiceRecon,
    MOCK_PUBLISHER_RECON
  );
  const { data: pay } = useApiData(ENDPOINTS.paymentTracker, MOCK_PAYMENT_TRACKER);

  const tabs = [
    { key: "client", label: "Client Invoices", count: (client || []).length },
    { key: "recon", label: "Publisher Reconciliation", count: (recon || []).length },
    { key: "payments", label: "Payment Tracker" },
  ];

  // Called when the GenerateInvoiceForm is submitted.
  // Wire this up to your Spring Boot endpoint, e.g.:
  // await axios.post("/api/finance/invoices", formData);
  const handleCreateInvoice = (formData) => {
    console.log("New invoice submitted:", formData);
    setShowForm(false);
  };

  return (
    <div className="page">
      <PageHeader
        Icon={IcFinance}
        title="Billing, Reconciliation & Payments"
        subtitle="Generate client invoices, reconcile publisher invoices and track collections"
        actions={
          <>
            {isMock && <MockFlag />}
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
              <IcPlus /> Generate Client invoice
            </button>
          </>
        }
      />

      <div className="toolbar">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>

      {tab === "client" && <ClientInvoicesTab data={client} loading={lc} />}
      {tab === "recon" && <PublisherReconciliationTab data={recon} loading={lr} />}
      {tab === "payments" && <PaymentTrackerTab data={pay} />}

      {showForm && (
        <GenerateInvoiceForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateInvoice}
        />
      )}
    </div>
  );
}
