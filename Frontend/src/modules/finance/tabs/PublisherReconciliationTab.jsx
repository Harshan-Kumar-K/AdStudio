import React, { useState } from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { formatCompact } from "../../../api/utils/format.js";
import apiClient, { getToken } from "../../../api/apiClient.js";
import ENDPOINTS, { API_BASE } from "../../../api/endpoints.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { IcPlus } from "../../../assets/icons.jsx";
import RecordPublisherPaymentForm from "../RecordPublisherPaymentForm.jsx";
import apiRequest from "../../../api/apiRequestSender.js";

export default function PublisherReconciliationTab({ data, loading, reload_doer }) {
 

      const { user } = useAuth();
  
      const [showForm, setShowForm] = useState(false);
 
  const columns = [
    {
      key: "id",
      label: "Invoice",
      render: (r) => (
        <span className="meta">
          <div className="strong">{r.id}</div>
          
        </span>
      ),
    },
     {
      key: "ioId",
      label: "Insertion Order",
      render: (r) => (
        <span className="meta">
          <div className="strong">{r.ioId}</div>
        <div className="sb cell-muted">
           Publisher {r.publisherId}
          </div>
        </span>
      ),
    },
    {
      key: "invoiceAmount",
      label: "Invoiced",
      align: "right",
      mono: true,
      render: (r) => formatCompact(r.invoiceAmount, { money: true }),
    },
    {
      key: "deliveredValue",
      label: "Delivered",
      align: "right",
      mono: true,
      render: (r) => formatCompact(r.deliveredValue, { money: true }),
    },
    {
      key: "variance",
      label: "Variance",
      align: "right",
      mono: true,
      render: (r) =>
        r.varianceAmount === 0 ? (
          <span className="cell-muted">$0</span>
        ) : (
          <span className="variance-neg">{formatCompact(r.varianceAmount, { money: true })}</span>
        ),
    },
    {
      key: "receivedDate",
      label: "Received",
      render: (r) => <span className="cell-muted cell-num">{r.receivedDate}</span>,
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
      render: (r) =>   //  RECEIVED, RECONCILED, DISCREPANCY, PAID
        r.status === "RECEIVED" || r.status === "DISCREPANCY" ? (
          <div className="t-actions">
            <button className="btn btn-outline btn-sm"
            onClick={ () => handleReconcile(r.id)}
            >
              Reconcile</button>
          </div>
        ) : (
          <span className="cell-muted txt-sm">{r.status}</span>
        ),
    },
  ];

    const handlePublisherRecon = async (formData) => {
    const payload = await apiClient.post(
      ENDPOINTS.publisherInvoiceRecon,
      formData,
      { "X-User-Id": user.userId }
    );
  
    console.log("New invoice created:", payload);
    setShowForm(false);
    // window.location.reload();
    reload_doer(); // Call the reload function to refresh the data
  };

   const handleReconcile = async (rowRecordId) => {
   
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
                          <IcPlus /> Generate Publisher Recon
        </button>

      <div className="card">
          {loading ? (
            <Loader />
          ) : (
            <DataTable
              columns={columns}
              rows={data}
              rowClass={(r) => (r.status === "Discrepancy" ? "row-flag-red" : "")}
            />
          )}
        </div>

        {showForm && (
                  <RecordPublisherPaymentForm
                    onClose={() => setShowForm(false)}
                    onSubmit={handlePublisherRecon}
                  />
         )}

    </div>
    
  );
}
