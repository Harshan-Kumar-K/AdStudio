import React from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";

// Backend sets link status as "ACTIVE" (all caps); StatusBadge's colour map
// keys off PascalCase ("Active"). Normalize for display only.
function toPascalNoSep(str) {
  if (!str) return str;
  return String(str)
    .toLowerCase()
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

export default function AssetLinksTab({ links, loading }) {
  const linkColumns = [
  { key: "linkId", label: "Link Id", render: (r) => <span className="meta"><div className="strong">{r.linkId}</div></span> },
  { key: "assetId", label: "Asset Id", render: (r) => <span className="cell-muted">{r.assetId}</span> },
  { key: "lineItemId", label: "Line Item Id", render: (r) => <span className="badge badge-navy">{r.lineItemId}</span> },
  { key: "assetName", label: "Asset Name", render: (r) => <span className="cell-muted">{r.assetName}</span> },
  { key: "linkedDate", label: "Linked Date", render: (r) => <span className="cell-muted cell-num">{r.linkedDate}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={toPascalNoSep(r.status)} /> },
];

  if (loading) return <Loader />;
  return <DataTable columns={linkColumns} rows={links} emptyLabel="No asset links yet" />;
}