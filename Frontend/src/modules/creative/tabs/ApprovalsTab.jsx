import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { IcCheck, IcClose, IcTarget } from "../../../assets/icons.jsx";
import { useState } from "react";
import DecisionFeedbackModal from "../forms/DecisionFeedbackModal.jsx";
import apiRequest from "../../../api/apiRequestSender.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { API_BASE } from "../../../api/endpoints.js";

// The backend sends status as SCREAMING_SNAKE_CASE (e.g. "PENDING_APPROVAL"),
// but StatusBadge's colour map + "Pending" mock fallback both use PascalCase
// with no separators (e.g. "PendingApproval"). Normalize here so the badge
// picks the right colour and label regardless of which shape it's fed.
function toPascalNoSep(str) {
  if (!str) return str;
  return String(str)
    .toLowerCase()
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}


export default function ApprovalsTab({ approvals, loading, onRequestLink, links = [] }) {

  const { user } = useAuth();

  // Which row + decision ("APPROVED"/"REJECTED") is currently being
  // confirmed, so the modal knows what to show and what to submit.
  // null = modal closed.
  const [pending, setPending] = useState(null); // { row, decision } | null
  const [submitting, setSubmitting] = useState(false);

  const submitDecision = async (feedbackVal) => {
    if (!pending) return;
    const { row, decision } = pending;

    setSubmitting(true);
    try {
      const url = `${API_BASE}/api/creative-approvals/${row.assetId}/decision`;
      await apiRequest(url, {
        method: "PUT",
        body: {
          reviewerId: user.userId,
          decision,
          feedback: feedbackVal,
        },
      });
      window.location.reload();
    } finally {
      setSubmitting(false);
      setPending(null);
    }
  };

  const handleReject = (row) => setPending({ row, decision: "REJECTED" });

  const handleLinkThis = (row) => {
    onRequestLink?.(row.assetId ?? row.id);
  };

  const handleApproval = (row) => setPending({ row, decision: "APPROVED" });

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
    render: (r) => <StatusBadge status={toPascalNoSep(r.status)} />,
  },
   {
    key: "Link It",
    label: "Linked To",
    render: (r) => {
      const status = String(r.status).toUpperCase();
      const isApproved = status === "APPROVED";
      if (!isApproved) {
        // Only a rejected asset gets an explicit "not applicable" dash.
        // Anything else that isn't approved yet (e.g. still in Draft) just
        // shows nothing here rather than a misleading dash.
        return status === "REJECTED" ? <span className="cell-muted txt-sm">—</span> : null;
      }

      const assetId = r.assetId ?? r.id;
      // isLinked is just a boolean from the backend - it doesn't say *which*
      // line item(s), so resolve that from the actual asset-links list
      // (the same data AssetLinksTab renders) instead of just showing a dash.
      const linkedTo = links.filter((l) => String(l.assetId) === String(assetId));

      return (
        <div className="t-actions" style={{ flexWrap: "wrap", gap: 6 }}>
          {linkedTo.map((l) => (
            <span key={l.linkId ?? l.lineItemId} className="badge badge-navy">
              {l.lineItemId}
            </span>
          ))}
          <button className="btn btn-outline btn-sm" onClick={() => handleLinkThis(r)}>
            {linkedTo.length > 0 ? "+ Link another" : "Link This"}
          </button>
        </div>
      );
    },
  },
  {
    key: "actions",
    label: "",
    align: "right",
    render: (r) =>
      String(r.status).toUpperCase() === "DRAFT" ? (
        <div className="t-actions">
          <button className="btn btn-success btn-sm" onClick={() => handleApproval(r)} >   Approve</button>
          <button className="btn btn-danger btn-sm"  onClick={() => handleReject(r)} > Reject</button>
        </div>
      ) : null,
  },
];

  if (loading) return <Loader />;
  return (
    <>
      <DataTable columns={approvalColumns} rows={approvals} />
      <DecisionFeedbackModal
        decision={pending?.decision ?? null}
        assetName={pending?.row?.assetName}
        submitting={submitting}
        onCancel={() => setPending(null)}
        onSubmit={submitDecision}
      />
    </>
  );
}