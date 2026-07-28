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
      label: "Invoice ID",
      render: (r) => (
        <span className="meta">
          <div className="strong">{r.id}</div>
          <div className="sb cell-muted">{r.advertiser}</div>
        </span>
      ),
    },
    {
      key: "campaignBriefId",
      label: "Campaign Brief ID",
      render: (r) => <span className="cell-muted">{r.campaignBriefId}</span>,
    },
    {
      key: "billingPeriod",
      label: "Billing Period",
      render: (r) => <span className="badge badge-gray">{r.billingPeriod}</span>,
    },
    {
      key: "invoiceAmount",
      label: "Invoice Amount",
      align: "right",
      mono: true,
      render: (r) => formatCompact(r.invoiceAmount, { money: true }),
    },
    {
      key: "agencyCommission",
      label: "Agency Commission",
      align: "right",
      mono: true,
      render: (r) => <span className="strong">{formatCompact(r.agencyCommission, { money: true })}</span>,
    },
    {
      key: "netBillable",
      label: "Net Billable",
      align: "right",
      mono: true,
      render: (r) => <span className="strong">{formatCompact(r.netBillable, { money: true })}</span>,
    },
    {
      key: "advertiserId",
      label: "Advertiser ID",
      align: "right",
      mono: true,
      render: (r) => (
        <span className="cell-muted">{formatCompact(r.advertiserId)}</span>
      ),
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
