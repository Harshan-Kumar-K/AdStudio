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
  const {user}= useAuth();

  const { data: client, loading: lc, isMock, reload: clientInvoicesReload } = useApiData(
    ENDPOINTS.clientInvoices,
    MOCK_CLIENT_INVOICES
  );
  const { data: recon, loading: lr, reload: reconreload } = useApiData(
    ENDPOINTS.publisherInvoiceRecon,
    MOCK_PUBLISHER_RECON
  );
  const { data: pay } = useApiData(ENDPOINTS.paymentTracker, MOCK_PAYMENT_TRACKER);

  const tabs = [
    { key: "client", label: "Client Invoices", count: (client || []).length },
    { key: "recon", label: "Publisher Reconciliation", count: (recon || []).length },
    { key: "payments", label: "Payment Tracker" },
  ];

 

  return (
    <div className="page">
      <PageHeader
        Icon={IcFinance}
        title="Billing, Reconciliation & Payments"
        subtitle="Generate client invoices, reconcile publisher invoices and track collections"
        actions={
          <>
            {isMock && <MockFlag />}
            
         
          </>
        }
      />

      <div className="toolbar">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>

      {tab === "client" && <ClientInvoicesTab data={client} loading={lc}  reload_doer={clientInvoicesReload}/>}
      {tab === "recon" && <PublisherReconciliationTab data={recon} loading={lr} />}
      {tab === "payments" && <PaymentTrackerTab data={pay} />}

      
    </div>
  );
}
