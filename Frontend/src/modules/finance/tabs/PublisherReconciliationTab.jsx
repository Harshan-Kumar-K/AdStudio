import React from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { formatCompact } from "../../../api/utils/format.js";

export default function PublisherReconciliationTab({ data, loading }) {
  const columns = [
    {
      key: "id",
      label: "Invoice",
      render: (r) => (
        <span className="meta">
          <div className="strong">{r.id}</div>
          <div className="sb cell-muted">
            {r.publisher} · {r.io}
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
        r.variance === 0 ? (
          <span className="cell-muted">$0</span>
        ) : (
          <span className="variance-neg">{formatCompact(r.variance, { money: true })}</span>
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
      render: (r) =>
        r.status === "Received" || r.status === "Discrepancy" ? (
          <div className="t-actions">
            <button className="btn btn-outline btn-sm">Reconcile</button>
          </div>
        ) : (
          <span className="cell-muted txt-sm">—</span>
        ),
    },
  ];

  return (
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
  );
}
