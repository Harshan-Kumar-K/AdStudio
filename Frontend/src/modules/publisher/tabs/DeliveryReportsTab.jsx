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
    { key: "deliveryId", 
      label: "Delivery Id",
       render: (r) => (
        <span className="meta">
          <div className="strong">{r.deliveryId}</div>
          <div className="sb cell-muted">
            #Line Item Id {r.lineItemId}
          </div>
        </span>
      ),
   },

    {
      key: "ioId",
      label: "IO Id",
      render: (r) => <span className="badge badge-navy">{r.ioId}</span>,
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
      render: (r) => (
        <span className="strong">{formatCompact(r.spend, { money: true })}</span>
      ),
    },
     {
      key: "source",
      label: "Source",
      render: (r) => <span className="cell-muted">{r.source}</span>,
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
