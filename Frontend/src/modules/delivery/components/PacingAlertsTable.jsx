import React from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";
import { IcCheck } from "../../../assets/icons.jsx";
import PacingCell from "./PacingCell.jsx";
import { API_BASE } from "../../../api/endpoints.js";
import apiRequest from "../../../api/apiRequestSender.js";

const ALERT_TONE = {
  UnderDelivery: "badge-red",
  OverDelivery: "badge-amber",
  BudgetExhausted: "badge-red",
  FlightEndApproaching: "badge-amber",
};

// The real backend sends alertType/status as SCREAMING_SNAKE_CASE
// ("UNDER_DELIVERY", "OPEN") while the mock fallback uses PascalCase
// ("UnderDelivery", "Open"). Normalize both to the same PascalCase-no-space
// form so the tone lookup, the label, and the "is this alert open?" check
// all work no matter which shape the data is in.
function toPascalNoSep(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function humanize(str) {
  return toPascalNoSep(str).replace(/([a-z])([A-Z])/g, "$1 $2");
}

/**
 * Renders the "Pacing Alerts" tab content.
 */
export default function PacingAlertsTable({ alerts, loading, reload_doer }) {

 const handleAction = async (particular_alert_id) => {
     const url = `${API_BASE}/api/pacing-alerts/${particular_alert_id}/action`;
     await apiRequest(url, {
       method: "PUT"
     });
  reload_doer(); // Call the reload function to refresh the data
};

 const handleClose = async (particular_alert_id) => {
     const url = `${API_BASE}/api/pacing-alerts/${particular_alert_id}/close`;
     await apiRequest(url, {
       method: "PUT"
     });
  reload_doer(); // Call the reload function to refresh the data
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
      <span className={`badge ${ALERT_TONE[toPascalNoSep(r.alertType)] || "badge-gray"}`}>
        {humanize(r.alertType)}
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
    render: (r) => <StatusBadge status={toPascalNoSep(r.status)} />,
  },
  {
    key: "actions",
    label: "",
    align: "right",
    render: (r) =>
      toPascalNoSep(r.status) === "Open" ? (
        <div className="t-actions">
          <button className="btn btn-outline btn-sm" onClick={() => handleAction(r.alertId)}>Action</button>
          <button className="btn btn-success btn-sm" onClick={() => handleClose(r.alertId)}>
            <IcCheck size={14} /> Close
          </button>
        </div>
      ) : (
        <span className="cell-muted txt-sm">—</span>
      ),
  },
];

  if (loading) return <Loader />;
  return <DataTable columns={columns} rows={alerts} />;
}