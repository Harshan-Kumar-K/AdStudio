import React from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { IcCheck, IcClose } from "../../../assets/icons.jsx";
import { DECISION_TONE } from "../creativeStudio.constants.js";

const approvalColumns = [
  { key: "asset", label: "Asset", render: (r) => <span className="strong">{r.asset}</span> },
  { key: "reviewer", label: "Reviewer", render: (r) => <span className="cell-muted">{r.reviewer}</span> },
  { key: "reviewDate", label: "Reviewed", render: (r) => <span className="cell-muted cell-num">{r.reviewDate}</span> },
  {
    key: "decision",
    label: "Decision",
    render: (r) =>
      r.decision === "—"
        ? <span className="cell-muted">—</span>
        : <span className={`badge ${DECISION_TONE[r.decision] || "badge-gray"}`}>{r.decision.replace(/([a-z])([A-Z])/g, "$1 $2")}</span>,
  },
  { key: "feedback", label: "Feedback", render: (r) => <span className="cell-muted txt-sm">{r.feedback}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "actions",
    label: "",
    align: "right",
    render: (r) =>
      r.status === "Pending"
        ? (
          <div className="t-actions">
            <button className="btn btn-success btn-sm"><IcCheck size={14} /> Approve</button>
            <button className="btn btn-danger btn-sm"><IcClose size={14} /></button>
          </div>
        )
        : <span className="cell-muted txt-sm">—</span>,
  },
];

export default function ApprovalsTab({ approvals, loading }) {
  if (loading) return <Loader />;
  return <DataTable columns={approvalColumns} rows={approvals} />;
}
