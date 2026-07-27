import React from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { IcSend, IcCheck } from "../../../assets/icons.jsx";
import { formatCompact } from "../../../api/utils/format.js";

export default function ClientInvoicesTab({ data, loading }) {
  const columns = [
    {
      key: "id",
      label: "Invoice",
      render: (r) => (
        <span className="meta">
          <div className="strong">{r.id}</div>
          <div className="sb cell-muted">{r.advertiser}</div>
        </span>
      ),
    },
    {
      key: "campaign",
      label: "Campaign",
      render: (r) => <span className="cell-muted">{r.campaign}</span>,
    },
    {
      key: "period",
      label: "Period",
      render: (r) => <span className="badge badge-gray">{r.period}</span>,
    },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      mono: true,
      render: (r) => formatCompact(r.amount, { money: true }),
    },
    {
      key: "commission",
      label: "Commission",
      align: "right",
      mono: true,
      render: (r) => (
        <span className="cell-muted">{formatCompact(r.commission, { money: true })}</span>
      ),
    },
    {
      key: "netBillable",
      label: "Net Billable",
      align: "right",
      mono: true,
      render: (r) => <span className="strong">{formatCompact(r.netBillable, { money: true })}</span>,
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
        if (r.status === "Draft") {
          return (
            <div className="t-actions">
              <button className="btn btn-outline btn-sm">
                <IcSend size={14} /> Issue
              </button>
            </div>
          );
        }
        if (r.status === "Issued" || r.status === "Overdue") {
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

  return (
    <div className="card">
      {loading ? <Loader /> : <DataTable columns={columns} rows={data} />}
    </div>
  );
}
