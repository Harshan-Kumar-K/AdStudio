import React from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { formatCompact, formatNumber } from "../../../api/utils/format.js";

/**
 * DeliveryReportsTab
 * Read-only table of delivery reports already submitted to the backend.
 * New reports are created through <DeliveryReportForm /> from the
 * "Submit delivery report" button in PublisherPortal.
 */
export default function DeliveryReportsTab({ data, loading }) {
  const columns = [
    { key: "id", label: "Record", render: (r) => <span className="strong">{r.id}</span> },
    {
      key: "io",
      label: "IO",
      render: (r) => <span className="badge badge-navy">{r.io}</span>,
    },
    {
      key: "reportingDate",
      label: "Reported",
      render: (r) => <span className="cell-muted cell-num">{r.reportingDate}</span>,
    },
    {
      key: "impressions",
      label: "Impressions",
      align: "right",
      mono: true,
      render: (r) => formatNumber(r.impressions),
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
      render: (r) => (
        <span className="strong">{formatCompact(r.spend, { money: true })}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="card">
      {loading ? <Loader /> : <DataTable columns={columns} rows={data} />}
    </div>
  );
}
