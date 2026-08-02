import React, { useState } from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { IcCheck, IcClose } from "../../../assets/icons.jsx";
import { formatCompact, formatNumber } from "../../../api/utils/format.js";
import { ENDPOINTS } from "../../../api/endpoints.js";
import apiClient from "../../../api/apiClient.js";

/**
 * PublisherInboxTab
 * Lists insertion orders sent to the publisher. "Confirm" / "Reject"
 * call the backend directly via apiClient, then ask the parent to
 * refresh (onChanged) so the row's status picks up the new value.
 *
 * Expected backend routes (adjust to match your Spring controller):
 *   POST {API_BASE}/{ENDPOINTS.publisherInbox}/{id}/confirm
 *   POST {API_BASE}/{ENDPOINTS.publisherInbox}/{id}/reject
 */
export default function PublisherInboxTab({ data, loading, onChanged }) {
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function handleDecision(row, decision) {
    setBusyId(row.id);
    setError("");
    try {
      await apiClient.post(`${ENDPOINTS.publisherInbox}/${row.id}/${decision}`);
      onChanged && onChanged();
    } catch (err) {
      setError(err.message || `Could not ${decision} ${row.id}. Please try again.`);
    } finally {
      setBusyId(null);
    }
  }

  const columns = [
    {
      key: "id",
      label: "Insertion order",
      render: (r) => (
        <span className="meta">
          <div className="strong">{r.id}</div>
          <div className="sb cell-muted">
            {r.campaign} · {r.advertiser}
          </div>
        </span>
      ),
    },
    {
      key: "format",
      label: "Format",
      render: (r) => <span className="badge badge-blue">{r.format}</span>,
    },
    {
      key: "committedImpressions",
      label: "Committed",
      align: "right",
      mono: true,
      render: (r) => formatNumber(r.committedImpressions),
    },
    {
      key: "orderValue",
      label: "Value",
      align: "right",
      mono: true,
      render: (r) => (
        <span className="strong">{formatCompact(r.orderValue, { money: true })}</span>
      ),
    },
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
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (r) =>
        r.status === "Sent" ? (
          <div className="t-actions">
            <button
              type="button"
              className="btn btn-success btn-sm"
              disabled={busyId === r.id}
              onClick={() => handleDecision(r, "confirm")}
            >
              <IcCheck size={14} /> Confirm
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              disabled={busyId === r.id}
              onClick={() => handleDecision(r, "reject")}
            >
              <IcClose size={14} /> Reject
            </button>
          </div>
        ) : (
          <span className="cell-muted txt-sm">—</span>
        ),
    },
  ];

  return (
    <div className="card">
      {error && <div className="form-error">{error}</div>}
      {loading ? <Loader /> : <DataTable columns={columns} rows={data} />}
    </div>
  );
}
