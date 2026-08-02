import React from "react";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { Loader } from "../../components/Loader.jsx";
import { formatCompact } from "../../api/utils/format.js";

/**
 * PublisherInvoicesTab
 * Read-only table of invoices raised against confirmed insertion orders.
 */
export default function PublisherInvoicesTab({ data, loading }) {
  const columns = [
    { key: "id", label: "Invoice", render: (r) => <span className="strong">{r.id}</span> },
    {
      key: "io",
      label: "IO",
      render: (r) => <span className="badge badge-navy">{r.io}</span>,
    },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      mono: true,
      render: (r) => formatCompact(r.amount, { money: true }),
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
