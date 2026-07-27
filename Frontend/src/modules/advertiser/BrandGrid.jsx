import React from "react";
import StatusBadge from "../../components/StatusBadge.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";
import { Loader } from "../../components/Loader.jsx";
import { formatCompact } from "../../utils/format.js";

/* ---------------------------------------------------------------------- */
/*  Brands tab: card grid                                                 */
/* ---------------------------------------------------------------------- */
export default function BrandGrid({ brands, loading, onSelect }) {
  if (loading) return <Loader />;

  return (
    <div className="brand-grid">
      {(brands || []).map((b) => {
        const pct = b.allocatedBudget ? (b.spentToDate / b.allocatedBudget) * 100 : 0;
        const remaining = b.allocatedBudget - b.spentToDate;
        return (
          <div className="brand-card" key={b.brandId} onClick={() => onSelect(b)}>
            <div className="bc-top">
              <div className="bc-logo" style={{ background: b.color }}>{b.brandName[0]}</div>
              <div>
                <div className="bc-name">{b.brandName}</div>
                <div className="bc-cat">{b.category} · {b.advertiserId}</div>
              </div>
              <div style={{ marginLeft: "auto" }}><StatusBadge status={b.status} /></div>
            </div>
            <div className="bc-budget">
              <span className="lab">Spent till date ($100)</span>
              <span className="val">{formatCompact(b.spentToDate, { money: true })} / {formatCompact(b.allocatedBudget, { money: true })}</span>
            </div>
            <ProgressBar value={b.spentToDate} max={b.allocatedBudget} />
            <div className="bc-foot">
              <span className="rem">Remaining <b>{formatCompact(remaining, { money: true })}</b></span>
              <span className="txt-sm mute">{Math.round(pct)}% used</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
