import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import StatCard from "../../components/StatCard.jsx";
import Tabs from "../../components/Tabs.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";
import { Loader, MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcFinance, IcPlus, IcWallet, IcMoney, IcReceipt, IcCheck, IcSend } from "../../assets/icons.jsx";
import { MOCK_CLIENT_INVOICES, MOCK_PUBLISHER_RECON, MOCK_PAYMENT_TRACKER } from "../../data/mockData.js";
import { formatCompact, formatCurrency } from "../../api/utils/format.js";

export default function FinanceDashboard() {
  const [tab, setTab] = useState("client");
  const { data: client, loading: lc, isMock } = useApiData(ENDPOINTS.clientInvoices, MOCK_CLIENT_INVOICES);
  const { data: recon, loading: lr } = useApiData(ENDPOINTS.publisherInvoiceRecon, MOCK_PUBLISHER_RECON);
  const { data: pay } = useApiData(ENDPOINTS.paymentTracker, MOCK_PAYMENT_TRACKER);

  const clientColumns = [
    { key: "id", label: "Invoice", render: (r) => <span className="meta"><div className="strong">{r.id}</div><div className="sb cell-muted">{r.advertiser}</div></span> },
    { key: "campaign", label: "Campaign", render: (r) => <span className="cell-muted">{r.campaign}</span> },
    { key: "period", label: "Period", render: (r) => <span className="badge badge-gray">{r.period}</span> },
    { key: "amount", label: "Amount", align: "right", mono: true, render: (r) => formatCompact(r.amount, { money: true }) },
    { key: "commission", label: "Commission", align: "right", mono: true, render: (r) => <span className="cell-muted">{formatCompact(r.commission, { money: true })}</span> },
    { key: "netBillable", label: "Net Billable", align: "right", mono: true, render: (r) => <span className="strong">{formatCompact(r.netBillable, { money: true })}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", align: "right", render: (r) => {
      if (r.status === "Draft") return <div className="t-actions"><button className="btn btn-outline btn-sm"><IcSend size={14} /> Issue</button></div>;
      if (r.status === "Issued" || r.status === "Overdue") return <div className="t-actions"><button className="btn btn-success btn-sm"><IcCheck size={14} /> Mark paid</button></div>;
      return <span className="cell-muted txt-sm">—</span>;
    }},
  ];

  const reconColumns = [
    { key: "id", label: "Invoice", render: (r) => <span className="meta"><div className="strong">{r.id}</div><div className="sb cell-muted">{r.publisher} · {r.io}</div></span> },
    { key: "invoiceAmount", label: "Invoiced", align: "right", mono: true, render: (r) => formatCompact(r.invoiceAmount, { money: true }) },
    { key: "deliveredValue", label: "Delivered", align: "right", mono: true, render: (r) => formatCompact(r.deliveredValue, { money: true }) },
    { key: "variance", label: "Variance", align: "right", mono: true, render: (r) =>
      r.variance === 0
        ? <span className="cell-muted">$0</span>
        : <span className="variance-neg">{formatCompact(r.variance, { money: true })}</span>
    },
    { key: "receivedDate", label: "Received", render: (r) => <span className="cell-muted cell-num">{r.receivedDate}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", align: "right", render: (r) =>
      r.status === "Received" || r.status === "Discrepancy"
        ? <div className="t-actions"><button className="btn btn-outline btn-sm">Reconcile</button></div>
        : <span className="cell-muted txt-sm">—</span>
    },
  ];

  const tabs = [
    { key: "client", label: "Client Invoices", count: (client || []).length },
    { key: "recon", label: "Publisher Reconciliation", count: (recon || []).length },
    { key: "payments", label: "Payment Tracker" },
  ];

  const collectedPct = pay ? (pay.collected / pay.totalBilled) * 100 : 0;

  return (
    <div className="page">
      <PageHeader
        Icon={IcFinance}
        title="Billing, Reconciliation & Payments"
        subtitle="Generate client invoices, reconcile publisher invoices and track collections"
        actions={<>{isMock && <MockFlag />}<button className="btn btn-primary btn-sm"><IcPlus /> Generate invoice</button></>}
      />

      <div className="toolbar"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === "client" && <div className="card">{lc ? <Loader /> : <DataTable columns={clientColumns} rows={client} />}</div>}

      {tab === "recon" && (
        <div className="card">
          {lr ? <Loader /> : (
            <DataTable
              columns={reconColumns}
              rows={recon}
              rowClass={(r) => (r.status === "Discrepancy" ? "row-flag-red" : "")}
            />
          )}
        </div>
      )}

      {tab === "payments" && pay && (
        <>
          <div className="stat-grid">
            <StatCard Icon={IcMoney} label="Total Billed" value={formatCompact(pay.totalBilled, { money: true })} foot={<>All invoices</>} />
            <StatCard Icon={IcWallet} label="Collected" value={formatCompact(pay.collected, { money: true })} foot={<>{pay.paidCount} paid</>} />
            <StatCard Icon={IcReceipt} label="Outstanding" value={formatCompact(pay.outstanding, { money: true })} foot={<>Awaiting payment</>} />
            <StatCard Icon={IcReceipt} label="Overdue" value={formatCompact(pay.overdue, { money: true })} foot={<>{pay.overdueCount} overdue · {pay.disputedCount} disputed</>} />
          </div>
          <div className="card card-pad mt">
            <div className="flex-between" style={{ marginBottom: 10 }}>
              <div className="section-title">Collection progress</div>
              <span className="strong">{Math.round(collectedPct)}%</span>
            </div>
            <ProgressBar value={pay.collected} max={pay.totalBilled} />
            <div className="flex-between mt-sm txt-sm mute">
              <span>{formatCurrency(pay.collected)} collected</span>
              <span>{formatCurrency(pay.totalBilled)} billed</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
