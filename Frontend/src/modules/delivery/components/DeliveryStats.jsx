import React from "react";
import StatCard from "../../../components/StatCard.jsx";
import { IcEye, IcPointer, IcWallet, IcAlert } from "../../../assets/icons.jsx";
import { formatCompact, formatNumber } from "../../../api/utils/format.js";

/**
 * The 4-card summary strip at the top of the Delivery & Performance
 * Tracking page. Pure presentational component - all it needs is the
 * current records + alerts arrays, it derives the totals itself.
 */
export default function DeliveryStats({ records, alerts }) {
  const totalImp = (records || []).reduce((s, r) => s + r.deliveredImpressions, 0);
  const totalClicks = (records || []).reduce((s, r) => s + r.clicks, 0);
  const totalSpend = (records || []).reduce((s, r) => s + r.spend, 0);
  const openAlerts = (alerts || []).filter((a) => a.status === "Open").length;

  return (
    <div className="stat-grid">
      <StatCard
        Icon={IcEye}
        label="Delivered Impressions"
        value={formatCompact(totalImp)}
        foot={<>This period</>}
      />
      <StatCard
        Icon={IcPointer}
        label="Total Clicks"
        value={formatNumber(totalClicks)}
        foot={<>Across records</>}
      />
      <StatCard
        Icon={IcWallet}
        label="Recorded Spend"
        value={formatCompact(totalSpend, { money: true })}
        foot={<>This period</>}
      />
      <StatCard
        Icon={IcAlert}
        label="Open Pacing Alerts"
        value={openAlerts}
        foot={<>Need attention</>}
      />
    </div>
  );
}
