import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Tabs from "../../components/Tabs.jsx";
import { MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { API_BASE, ENDPOINTS } from "../../api/endpoints.js";
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
import { useAuth } from "../../context/AuthContext.jsx";
import { getToken } from "../../api/apiClient.js";

export default function FinanceDashboard() {
  const [tab, setTab] = useState("client");
  const [showForm, setShowForm] = useState(false);
  const {user}= useAuth();

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
  const handleCreateInvoice = async(formData) => {
    console.log("New invoice submitted:", formData); // 
    
    const url = `${API_BASE}/api/client-invoices`;
   const cur_user_id = user.userId; 
    
     const token = getToken();
    
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Acting-User-Id-Finance": cur_user_id,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
    
      // Try to parse JSON even on error responses, since the backend
      // usually sends { message: "..." } alongside non-2xx statuses.
      let json = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }
    
      if (!res.ok) {
        const message =
          (json && (json.message || json.error)) || `HTTP ${res.status}`;
        throw new Error(message);
      }
    
      const payload =
        json && typeof json === "object" && "data" in json ? json.data : json;
    console.log("seee ----  ",payload);
        
 setShowForm(false);
 
    window.location.reload();
  
   
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
