import React from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { IcCheck } from "../../../assets/icons.jsx";
import PacingCell from "./PacingCell.jsx";

const ALERT_TONE = {
  UnderDelivery: "badge-red",
  OverDelivery: "badge-amber",
  BudgetExhausted: "badge-red",
  FlightEndApproaching: "badge-amber",
};

const columns = [
  {
    key: "alertId",
    label: "Alert ID",
    render: (r) => <span className="strong">{r.alertId}</span>,
  },
   {
    key: "lineItemId",
    label: "Line Item ID",
    render: (r) => <span className="strong">{r.lineItemId}</span>,
  },
  {
    key: "alertType",
    label: "Alert Type",
    render: (r) => (
      <span className={`badge ${ALERT_TONE[r.alertType] || "badge-gray"}`}>
        {r.alertType.replace(/([a-z])([A-Z])/g, "$1 $2")}
      </span>
    ),
  },
  
  {
    key: "alertDate",
    label: "Alert Raised",
    render: (r) => <span className="cell-muted cell-num">{r.alertDate}</span>,
  },
  {
    key: "pacingPercent",
    label: "Pacing",
    align: "right",
    render: (r) => <PacingCell pct={r.pacingPercent.toFixed(2)} />,
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
      r.status === "OPEN" ? (
        <div className="t-actions">
          <button className="btn btn-outline btn-sm">Action</button>
          <button className="btn btn-success btn-sm">
            <IcCheck size={14} /> Close
          </button>
        </div>
      ) : (
        <span className="cell-muted txt-sm">—</span>
      ),
  },
];

/**
 * Renders the "Pacing Alerts" tab content.
 */
export default function PacingAlertsTable({ alerts, loading }) {
  if (loading) return <Loader />;
  return <DataTable columns={columns} rows={alerts} />;
}
