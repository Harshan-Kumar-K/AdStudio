import React from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { formatCompact, formatNumber } from "../../../api/utils/format.js";
import PacingCell from "./PacingCell.jsx";

const columns = [
  {
    key: "deliveryId",
    label: "Delivery ID",
    render: (r) => (
      <span className="meta">
        <div className="strong">{r.deliveryId}</div>
        <div className="sb cell-muted">
          {r.lineItem} · {r.io}
        </div>
      </span>
    ),
  },
   {
    key: "lineItemId",
    label: "Line Item ID",
    render: (r) => (
      <span className="meta">
        <div className="strong">{r.lineItemId}</div>
        <div className="sb cell-muted">
          {r.lineItemId} · {r.io}
        </div>
      </span>
    ),
  },
  {
    key: "reportingDate",
    label: "Reported",
    render: (r) => <span className="cell-muted cell-num">{r.reportingDate}</span>,
  },
  {
    key: "deliveredImpressions",
    label: "Impressions",
    align: "right",
    mono: true,
    render: (r) => formatNumber(r.deliveredImpressions),
  },
  {
    key: "clicks",
    label: "Clicks",
    align: "right",
    mono: true,
    render: (r) => formatNumber(r.clicks),
  },
  {
    key: "spend",
    label: "Spend",
    align: "right",
    mono: true,
    render: (r) => <span className="strong">{formatCompact(r.spend, { money: true })}</span>,
  },
  {
    key: "pacing",
    label: "Pacing",
    align: "right",
    render: (r) => <PacingCell pct={r.pacing} />,
  },
  {
    key: "source",
    label: "Source",
    render: (r) => (
      <span className="badge badge-gray">
        {r.source === "PublisherReport" ? "Publisher" : "Internal"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (r) => <StatusBadge status={r.status} />,
  },
];

/**
 * Renders the "Delivery Records" tab content.
 * Column config lives here so DeliveryTracking.jsx doesn't need to know
 * anything about how a record row is drawn.
 */
export default function DeliveryRecordsTable({ records, loading }) {
  if (loading) return <Loader />;
  return <DataTable columns={columns} rows={records} />;
}
