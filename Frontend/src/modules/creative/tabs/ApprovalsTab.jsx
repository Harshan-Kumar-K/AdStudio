import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { IcCheck, IcClose, IcTarget } from "../../../assets/icons.jsx";
import { DECISION_TONE } from "../creativeStudio.constants.js";

import apiRequest from "../../../api/apiRequestSender.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { API_BASE } from "../../../api/endpoints.js";


export default function ApprovalsTab({ approvals, loading }) {

  const { user } = useAuth();

  const handleApproval = async (row) => {
    const url = `${API_BASE}/api/creative-approvals/${row.assetId}/decision`;
    const feedbackVal =  prompt("Enter your Feedback to approve:");
    await apiRequest(url, {
      method: "PUT",
      body: {
        reviewerId: user.userId,
        decision: "APPROVED",
        feedback: feedbackVal
      },
    });
    window.location.reload();
  };

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
          <button className="btn btn-success btn-sm" onClick={() => handleApproval(r)} >   Approve</button>
          <button className="btn btn-danger btn-sm"> Reject</button>
        </div>
      ) : (
        <span className="cell-muted txt-sm">—</span>
      ),
  },
];

  if (loading) return <Loader />;
  return <DataTable columns={approvalColumns} rows={approvals} />;
}
