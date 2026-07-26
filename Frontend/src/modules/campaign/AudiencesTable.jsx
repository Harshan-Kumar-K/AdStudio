import React from "react";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { Loader } from "../../components/Loader.jsx";
import { IcUsers } from "../../assets/icons.jsx";
import "./forms-and-modal.css";

/**
 * Renders the Target Audiences table.
 *
 * Props:
 *  - rows: array of audience objects
 *  - loading: boolean
 */
export default function AudiencesTable({ rows, loading }) {
  const columns = [
    {
      key: "id",
      label: "Audience",
      render: (r) => (
        <div className="id-chip">
          <span className="av">
            <IcUsers size={16} />
          </span>
          <span className="meta">
            <span className="nm">{r.id}</span>
            <span className="sb">{r.brief}</span>
          </span>
        </div>
      ),
    },
    { key: "ageRange", label: "Age", render: (r) => <span className="badge badge-gray">{r.ageRange}</span> },
    { key: "gender", label: "Gender", render: (r) => <span className="cell-muted">{r.gender}</span> },
    { key: "interests", label: "Interests", render: (r) => <span className="cell-muted">{r.interests}</span> },
    { key: "deviceType", label: "Device", render: (r) => <span className="badge badge-blue">{r.deviceType}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  if (loading) return <Loader />;
  return <DataTable columns={columns} rows={rows} />;
}
