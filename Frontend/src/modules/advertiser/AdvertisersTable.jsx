import React from "react";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { Loader } from "../../components/Loader.jsx";
import { IcBuilding, IcEdit } from "../../assets/icons.jsx";
import { formatCurrency } from "../../utils/format.js";

/* ---------------------------------------------------------------------- */
/*  Advertisers tab: data table                                           */
/* ---------------------------------------------------------------------- */
export default function AdvertisersTable({ advertisers, loading, onEdit }) {
  const columns = [
    { key: "companyName", label: "Company", render: (r) => (
      <div className="id-chip">
        <span className="av"><IcBuilding size={17} /></span>
        <span className="meta"><span className="nm">{r.companyName}</span><span className="sb">{r.id} · {r.industry}</span></span>
      </div>
    )},
    { key: "accountManager", label: "Account Manager", render: (r) => <span className="cell-muted">{r.accountManagerId}</span> },
    { key: "annualBudget", label: "Annual Budget", align: "right", mono: true, render: (r) => <span className="strong">{formatCurrency(r.annualBudget, r.currency)}</span> },
    { key: "currency", label: "Currency", render: (r) => <span className="badge badge-gray">{r.currency}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", align: "right", render: (r) => (
      <div className="t-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(r)}>
          <IcEdit size={15} /> Edit
        </button>
      </div>
    )},
  ];

  return (
    <div className="card">
      {loading ? <Loader /> : <DataTable columns={columns} rows={advertisers} />}
    </div>
  );
}
