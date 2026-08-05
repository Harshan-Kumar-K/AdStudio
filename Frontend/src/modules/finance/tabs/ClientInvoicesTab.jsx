import React, { useState } from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { IcSend, IcCheck, IcPlus } from "../../../assets/icons.jsx";
import { formatCompact } from "../../../api/utils/format.js";
import GenerateInvoiceForm from "../GenerateInvoiceForm.jsx";
import ENDPOINTS from "../../../api/endpoints.js";
import apiClient from "../../../api/apiClient.js";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function ClientInvoicesTab({ data, loading, reload_doer }) {

    const { user } = useAuth();

    const [showForm, setShowForm] = useState(false);

    const handleIssueClientInvoice = async (rowRecordId) => {
       
      try {
        
        const url =  `${API_BASE}/api/publisher-invoices/${rowRecordId}/reconcile`;
        const res = await fetch(`${API_BASE}/api/publisher-invoices/${rowRecordId}/reconcile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${getToken()}`,
              "X-User-Id": user.userId,
            },
          }
        );
    
        console.log("heee  -",`${API_BASE}/api/publisher-invoices/${rowRecordId}/reconcile`);
        
    
        if (!res.ok) {
          let msg = `HTTP ${res.status}`;
          try {
            const body = await res.json();
            msg = body.message || msg;
          } catch (_) {
            /* response had no JSON body */
          }
          throw new Error(msg);
        }
    
        const text = await res.text();
        const body = text ? JSON.parse(text) : null;
    
        if (body && body.success === false) {
          throw new Error(body.message || "Reconcile failed");
        }
    
        reload_doer();
      } catch (err) {
        console.error("Failed to reconcile invoice:", err);
        // TODO: show a toast/error message to the user
      }
    };
    

  const columns = [
    {
      key: "id",
      label: "Invoice ID",
      render: (r) => (
        <span className="meta">
          <div className="strong">{r.id}</div>
          <div className="sb cell-muted">{r.advertiser}</div>
        </span>
      ),
    },
    {
      key: "campaignBriefId",
      label: "Campaign Brief ID",
      render: (r) => <span className="cell-muted">{r.campaignBriefId}</span>,
    },
    {
      key: "billingPeriod",
      label: "Billing Period",
      render: (r) => <span className="badge badge-gray">{r.billingPeriod}</span>,
    },
    {
      key: "invoiceAmount",
      label: "Invoice Amount",
      align: "right",
      mono: true,
      render: (r) => formatCompact(r.invoiceAmount, { money: true }),
    },
    {
      key: "agencyCommission",
      label: "Agency Commission",
      align: "right",
      mono: true,
      render: (r) => <span className="strong">{formatCompact(r.agencyCommission, { money: true })}</span>,
    },
    {
      key: "netBillable",
      label: "Net Billable",
      align: "right",
      mono: true,
      render: (r) => <span className="strong">{formatCompact(r.netBillable, { money: true })}</span>,
    },
    {
      key: "advertiserId",
      label: "Advertiser ID",
      align: "right",
      mono: true,
      render: (r) => (
        <span className="cell-muted">{formatCompact(r.advertiserId)}</span>
      ),
    },
    
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (r) => {
        if (r.status === "DRAFT") {
          return (
            <div className="t-actions">
              <button className="btn btn-outline btn-sm"
              onClick={ () => handleIssueClientInvoice(r.id) }
              >
                <IcSend size={14} /> Issue
              </button>
            </div>
          );
        }
        if (r.status === "ISSUED" || r.status === "OVERDUE") {
          return (
            <div className="t-actions">
              <button className="btn btn-success btn-sm">
                <IcCheck size={14} /> Mark paid
              </button>
            </div>
          );
        }
        return <span className="cell-muted txt-sm">—</span>;
      },
    },
  ];

  const handleCreateInvoice = async (formData) => {
  const payload = await apiClient.post(
    ENDPOINTS.clientInvoices,
    formData,
    { "Acting-User-Id-Finance": user.userId }
  );

  console.log("New invoice created:", payload);
  setShowForm(false);
  // window.location.reload();
  reload_doer(); // Call the reload function to refresh the data
};

  return (
    <div>
      <button className="btn btn-primary"
               style={{ 
                marginBottom: '15px', 
                marginLeft: 'auto', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '6px' 
              }}
              onClick={() => setShowForm(true)}>
                    <IcPlus /> Genrte Client invoice
        </button>


        <div className="card">
          
        {loading ? <Loader /> : <DataTable columns={columns} rows={data} />}

        {showForm && (
          <GenerateInvoiceForm
            onClose={() => setShowForm(false)}
            onSubmit={handleCreateInvoice}
          />
        )}
      </div>
    </div>
    
  );
}
