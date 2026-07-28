import React from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { IcCheck, IcClose } from "../../../assets/icons.jsx";
import { DECISION_TONE } from "../creativeStudio.constants.js";

const approvalColumns =[
  {
    key: "assetName",
    label: "Asset Name",
    render: (r) => <span className="strong">{r.assetName}</span>,
  },
  {
    key: "assetType",
    label: "Type",
    render: (r) => <span className="cell-muted">{r.assetType}</span>,
  },
  {
    key: "dimensions",
    label: "Dimensions",
    render: (r) => <span className="cell-muted cell-num">{r.width} x {r.height}</span>,
  },
  {
    key: "fileSizeKB",
    label: "Size (KB)",
    align: "right",
    mono: true,
    render: (r) => <span className="cell-muted cell-num">{r.fileSizeKB}</span>,
  },
  {
    key: "version",
    label: "Version",
    align: "right",
    render: (r) => <span className="cell-muted cell-num">v{r.version}</span>,
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
      r.status === "DRAFT" ? (
        <div className="t-actions">
          <button className="btn btn-success btn-sm"><IcCheck size={14} /> Approve</button>
          <button className="btn btn-danger btn-sm"><IcClose size={14} /></button>
        </div>
      ) : (
        <span className="cell-muted txt-sm">—</span>
      ),
  },
];

export default function ApprovalsTab({ approvals, loading }) {
  if (loading) return <Loader />;
  return <DataTable columns={approvalColumns} rows={approvals} />;
}
