import React from "react";
import DataTable from "../../../components/DataTable.jsx";
import StatusBadge from "../../../components/StatusBadge.jsx";
import { Loader } from "../../../components/Loader.jsx";

const linkColumns = [
  { key: "id", label: "Link", render: (r) => <span className="meta"><div className="strong">{r.id}</div></span> },
  { key: "asset", label: "Asset", render: (r) => <span className="cell-muted">{r.asset}</span> },
  { key: "lineItem", label: "Line item", render: (r) => <span className="badge badge-navy">{r.lineItem}</span> },
  { key: "channel", label: "Channel", render: (r) => <span className="cell-muted">{r.channel}</span> },
  { key: "linkedDate", label: "Linked", render: (r) => <span className="cell-muted cell-num">{r.linkedDate}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

export default function AssetLinksTab({ links, loading }) {
  if (loading) return <Loader />;
  return <DataTable columns={linkColumns} rows={links} emptyLabel="No asset links yet" />;
}
