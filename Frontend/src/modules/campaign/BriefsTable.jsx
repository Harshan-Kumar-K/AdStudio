import React from "react";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { Loader } from "../../components/Loader.jsx";
import { IcCheck, IcClose, IcSend } from "../../assets/icons.jsx";
import { formatCompact } from "../../api/utils/format.js";
import "./forms-and-modal.css";

const OBJECTIVE_TONE = {
  Awareness: "badge-blue",
  Consideration: "badge-navy",
  Conversion: "badge-green",
  Retention: "badge-amber",
};

/**
 * Renders the Campaign Briefs table, including the status-driven row
 * actions (Submit / Approve / Reject).
 *
 * Props:
 *  - rows: array of brief objects
 *  - loading: boolean
 *  - onSubmit: (row) => void   -> called when "Submit" is clicked (Draft -> Submitted)
 *  - onApprove: (row) => void  -> called when "Approve" is clicked
 *  - onReject: (row) => void   -> called when "Reject" is clicked
 */
export default function BriefsTable({ rows, loading, onSubmit, onApprove, onReject }) {
  const columns = [
    {
      key: "campaignName",
      label: "Campaign",
      render: (r) => (
        <span className="meta">
          <div className="strong">{r.campaignName}</div>
          <div className="sb cell-muted">
            {r.briefId} · {r.brand}
          </div>
        </span>
      ),
    },
    {
      key: "objective",
      label: "Objective",
      render: (r) => <span className={`badge ${OBJECTIVE_TONE[r.objective] || "badge-gray"}`}>{r.objective}</span>,
    },
    { key: "geography", label: "Geography", render: (r) => <span className="cell-muted">{r.geography}</span> },
    {
      key: "flight",
      label: "Flight",
      render: (r) => (
        <span className="cell-muted cell-num">
          {r.startDate.slice(5)} → {r.endDate.slice(5)}
        </span>
      ),
    },
    {
      key: "totalBudget",
      label: "Budget",
      align: "right",
      mono: true,
      render: (r) => <span className="strong">{formatCompact(r.totalBudget, { money: true })}</span>,
    },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (r) => {
        if (r.status === "Draft") {
          return (
            <div className="t-actions">
              <button className="btn btn-outline btn-sm" onClick={() => onSubmit?.(r)}>
                <IcSend size={14} /> Submit
              </button>
            </div>
          );
        }
        if (r.status === "Submitted") {
          return (
            <div className="t-actions">
              <button className="btn btn-success btn-sm" onClick={() => onApprove?.(r)}>
                <IcCheck size={14} /> Approve
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onReject?.(r)}>
                <IcClose size={14} /> Reject
              </button>
            </div>
          );
        }
        return <span className="cell-muted txt-sm">—</span>;
      },
    },
  ];

  if (loading) return <Loader />;
  return <DataTable columns={columns} rows={rows} />;
}
