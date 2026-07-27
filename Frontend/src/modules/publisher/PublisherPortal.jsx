import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import Tabs from "../../components/Tabs.jsx";
import { Loader, MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcPublisher, IcCheck, IcClose, IcSend, IcInbox, IcReceipt } from "../../assets/icons.jsx";
import { MOCK_PUBLISHER_INBOX, MOCK_PUBLISHER_DELIVERY, MOCK_PUBLISHER_INVOICES } from "../../data/mockData.js";
import { formatCompact, formatNumber } from "../../api/utils/format.js";

export default function PublisherPortal() {
  const [tab, setTab] = useState("inbox");
  const { data: inbox, loading: li, isMock } = useApiData(ENDPOINTS.publisherInbox, MOCK_PUBLISHER_INBOX);
  const { data: reports, loading: lr } = useApiData(ENDPOINTS.publisherDeliveryReports, MOCK_PUBLISHER_DELIVERY);
  const { data: invoices, loading: lv } = useApiData(ENDPOINTS.publisherInvoices, MOCK_PUBLISHER_INVOICES);

  const inboxColumns = [
    { key: "id", label: "Insertion order", render: (r) => <span className="meta"><div className="strong">{r.id}</div><div className="sb cell-muted">{r.campaign} · {r.advertiser}</div></span> },
    { key: "format", label: "Format", render: (r) => <span className="badge badge-blue">{r.format}</span> },
    { key: "committedImpressions", label: "Committed", align: "right", mono: true, render: (r) => formatNumber(r.committedImpressions) },
    { key: "orderValue", label: "Value", align: "right", mono: true, render: (r) => <span className="strong">{formatCompact(r.orderValue, { money: true })}</span> },
    { key: "flight", label: "Flight", render: (r) => <span className="cell-muted cell-num">{r.startDate.slice(5)} → {r.endDate.slice(5)}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", align: "right", render: (r) =>
      r.status === "Sent"
        ? <div className="t-actions"><button className="btn btn-success btn-sm"><IcCheck size={14} /> Confirm</button><button className="btn btn-danger btn-sm"><IcClose size={14} /> Reject</button></div>
        : <span className="cell-muted txt-sm">—</span>
    },
  ];

  const reportColumns = [
    { key: "id", label: "Record", render: (r) => <span className="strong">{r.id}</span> },
    { key: "io", label: "IO", render: (r) => <span className="badge badge-navy">{r.io}</span> },
    { key: "reportingDate", label: "Reported", render: (r) => <span className="cell-muted cell-num">{r.reportingDate}</span> },
    { key: "impressions", label: "Impressions", align: "right", mono: true, render: (r) => formatNumber(r.impressions) },
    { key: "clicks", label: "Clicks", align: "right", mono: true, render: (r) => formatNumber(r.clicks) },
    { key: "spend", label: "Spend", align: "right", mono: true, render: (r) => <span className="strong">{formatCompact(r.spend, { money: true })}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  const invoiceColumns = [
    { key: "id", label: "Invoice", render: (r) => <span className="strong">{r.id}</span> },
    { key: "io", label: "IO", render: (r) => <span className="badge badge-navy">{r.io}</span> },
    { key: "amount", label: "Amount", align: "right", mono: true, render: (r) => formatCompact(r.amount, { money: true }) },
    { key: "deliveredValue", label: "Delivered", align: "right", mono: true, render: (r) => formatCompact(r.deliveredValue, { money: true }) },
    { key: "variance", label: "Variance", align: "right", mono: true, render: (r) => r.variance === 0 ? <span className="cell-muted">$0</span> : <span className="variance-neg">{formatCompact(r.variance, { money: true })}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  const tabs = [
    { key: "inbox", label: "IO Inbox", count: (inbox || []).length },
    { key: "reports", label: "Delivery Reports", count: (reports || []).length },
    { key: "invoices", label: "Invoices", count: (invoices || []).length },
  ];

  return (
    <div className="page">
      <PageHeader
        Icon={IcPublisher}
        title="Publisher Portal"
        subtitle="Respond to insertion orders, submit delivery reports and raise invoices"
        actions={<>{isMock && <MockFlag />}<button className="btn btn-primary btn-sm"><IcSend /> Submit delivery report</button></>}
      />

      <div className="toolbar"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === "inbox" && <div className="card">{li ? <Loader /> : <DataTable columns={inboxColumns} rows={inbox} />}</div>}
      {tab === "reports" && <div className="card">{lr ? <Loader /> : <DataTable columns={reportColumns} rows={reports} />}</div>}
      {tab === "invoices" && <div className="card">{lv ? <Loader /> : <DataTable columns={invoiceColumns} rows={invoices} />}</div>}
    </div>
  );
}
