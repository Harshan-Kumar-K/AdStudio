import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import StatCard from "../../components/StatCard.jsx";
import Tabs from "../../components/Tabs.jsx";
import { Loader, MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcDelivery, IcPlus, IcEye, IcPointer, IcWallet, IcAlert, IcCheck } from "../../assets/icons.jsx";
import { MOCK_DELIVERY_RECORDS, MOCK_PACING_ALERTS } from "../../data/mockData.js";
import { formatCompact, formatNumber } from "../../utils/format.js";

const ALERT_TONE = { UnderDelivery: "badge-red", OverDelivery: "badge-amber", BudgetExhausted: "badge-red", FlightEndApproaching: "badge-amber" };

function PacingCell({ pct }) {
  const tone = pct < 90 ? "var(--red-600)" : pct > 110 ? "var(--amber-600)" : "var(--green-600)";
  return <span className="strong" style={{ color: tone }}>{pct}%</span>;
}

export default function DeliveryTracking() {
  const [tab, setTab] = useState("records");
  const { data: records, loading: lr, isMock } = useApiData(ENDPOINTS.deliveryRecords, MOCK_DELIVERY_RECORDS);
  const { data: alerts, loading: laa } = useApiData(ENDPOINTS.pacingAlerts, MOCK_PACING_ALERTS);

  const totalImp = (records || []).reduce((s, r) => s + r.deliveredImpressions, 0);
  const totalClicks = (records || []).reduce((s, r) => s + r.clicks, 0);
  const totalSpend = (records || []).reduce((s, r) => s + r.spend, 0);
  const openAlerts = (alerts || []).filter((a) => a.status === "Open").length;

  const recColumns = [
    { key: "id", label: "Record", render: (r) => <span className="meta"><div className="strong">{r.id}</div><div className="sb cell-muted">{r.lineItem} · {r.io}</div></span> },
    { key: "reportingDate", label: "Reported", render: (r) => <span className="cell-muted cell-num">{r.reportingDate}</span> },
    { key: "deliveredImpressions", label: "Impressions", align: "right", mono: true, render: (r) => formatNumber(r.deliveredImpressions) },
    { key: "clicks", label: "Clicks", align: "right", mono: true, render: (r) => formatNumber(r.clicks) },
    { key: "spend", label: "Spend", align: "right", mono: true, render: (r) => <span className="strong">{formatCompact(r.spend, { money: true })}</span> },
    { key: "pacing", label: "Pacing", align: "right", render: (r) => <PacingCell pct={r.pacing} /> },
    { key: "source", label: "Source", render: (r) => <span className="badge badge-gray">{r.source === "PublisherReport" ? "Publisher" : "Internal"}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  const alertColumns = [
    { key: "alertType", label: "Alert", render: (r) => <span className={`badge ${ALERT_TONE[r.alertType] || "badge-gray"}`}>{r.alertType.replace(/([a-z])([A-Z])/g, "$1 $2")}</span> },
    { key: "lineItem", label: "Line item", render: (r) => <span className="strong">{r.lineItem}</span> },
    { key: "channel", label: "Channel", render: (r) => <span className="cell-muted">{r.channel}</span> },
    { key: "alertDate", label: "Raised", render: (r) => <span className="cell-muted cell-num">{r.alertDate}</span> },
    { key: "pacingPercent", label: "Pacing", align: "right", render: (r) => <PacingCell pct={r.pacingPercent} /> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", align: "right", render: (r) =>
      r.status === "Open"
        ? <div className="t-actions"><button className="btn btn-outline btn-sm">Action</button><button className="btn btn-ghost btn-sm"><IcCheck size={14} /> Close</button></div>
        : <span className="cell-muted txt-sm">—</span>
    },
  ];

  const tabs = [
    { key: "records", label: "Delivery Records", count: (records || []).length },
    { key: "alerts", label: "Pacing Alerts", count: (alerts || []).length },
  ];

  return (
    <div className="page">
      <PageHeader
        Icon={IcDelivery}
        title="Delivery & Performance Tracking"
        subtitle="Record delivery against plan, monitor pacing and manage exceptions"
        actions={<>{isMock && <MockFlag />}<button className="btn btn-primary btn-sm"><IcPlus /> Add delivery record</button></>}
      />

      <div className="stat-grid">
        <StatCard Icon={IcEye} label="Delivered Impressions" value={formatCompact(totalImp)} foot={<>This period</>} />
        <StatCard Icon={IcPointer} label="Total Clicks" value={formatNumber(totalClicks)} foot={<>Across records</>} />
        <StatCard Icon={IcWallet} label="Recorded Spend" value={formatCompact(totalSpend, { money: true })} foot={<>This period</>} />
        <StatCard Icon={IcAlert} label="Open Pacing Alerts" value={openAlerts} foot={<>Need attention</>} />
      </div>

      <div className="toolbar mt"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      <div className="card">
        {tab === "records"
          ? (lr ? <Loader /> : <DataTable columns={recColumns} rows={records} />)
          : (laa ? <Loader /> : <DataTable columns={alertColumns} rows={alerts} />)}
      </div>
    </div>
  );
}
