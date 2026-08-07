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
 * This list is fetched from ENDPOINTS.insertionOrders, and the real
 * Insertion Order service only exposes a single status-change route
 * (not separate /confirm and /reject endpoints), so both actions go
 * through the same PUT with the target status as the payload:
 *   PUT {API_BASE}/{ENDPOINTS.insertionOrders}/{ioId}/status
 *   body: { status: "Confirmed" | "Rejected" }
 */
export default function PublisherInboxTab({ data, loading, onChanged }) {
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function handleDecision(row, decision) {
    const id = row.ioId ?? row.id;
    const status = decision === "confirm" ? "Confirmed" : "Rejected";
    setBusyId(id);
    setError("");
    try {
      await apiClient.put(`${ENDPOINTS.insertionOrders}/${id}/status`, { status });
      onChanged && onChanged();
    } catch (err) {
      setError(err.message || `Could not ${decision} ${id}. Please try again.`);
    } finally {
      setBusyId(null);
    }
  }

  const columns = [
    {
      key: "ioId",
      label: "Insert ord ID",
      render: (r) => (
        <span className="meta">
          <div className="strong">{r.ioId ?? r.id}</div>
          {r.publisherId != null && (
            <div className="sb cell-muted">
              #Publisher {r.publisherId}
            </div>
          )}
        </span>
      ),
    },
    {
      key: "lineItemId",
      label: "Line Item ID",
      align: "",
      mono: true,
      render: (r) => formatNumber(r.lineItemId),
    },
    {
      key: "orderDate",
      label: "Order Date",
      render: (r) => <span className="cell-muted">{r.orderDate}</span>,
    },
    {
      key: "committedImpressions",
      label: "Committed Imprsns",
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
              disabled={busyId === (r.ioId ?? r.id)}
              onClick={() => handleDecision(r, "confirm")}
            >
              <IcCheck size={14} /> Confirm
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              disabled={busyId === (r.ioId ?? r.id)}
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