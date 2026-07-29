import React from "react";
import StatCard from "../../../components/StatCard.jsx";
import ProgressBar from "../../../components/ProgressBar.jsx";
import { IcWallet, IcMoney, IcReceipt } from "../../../assets/icons.jsx";
import { formatCompact, formatCurrency } from "../../../api/utils/format.js";

export default function PaymentTrackerTab({ data }) {
  if (!data) return null;

  const collectedPct = (data.collected / data.totalBilled) * 100;

  return (
    <>
      <div className="stat-grid">
        <StatCard
          Icon={IcMoney}
          label="Total Billed"
          value={formatCompact(data.totalBilled, { money: true })}
          foot={<>All invoices</>}
        />
        <StatCard
          Icon={IcWallet}
          label="Collected"
          value={formatCompact(data.collected, { money: true })}
          foot={<>{data.paidCount} paid</>}
        />
        <StatCard
          Icon={IcReceipt}
          label="Outstanding"
          value={formatCompact(data.outstanding, { money: true })}
          foot={<>Awaiting payment</>}
        />
        <StatCard
          Icon={IcReceipt}
          label="Overdue"
          value={formatCompact(data.overdue, { money: true })}
          foot={
            <>
              {data.overdueCount} overdue · {data.disputedCount} disputed
            </>
          }
        />
      </div>

      <div className="card card-pad mt">
        <div className="flex-between" style={{ marginBottom: 10 }}>
          <div className="section-title">Collection progress</div>
          <span className="strong">{Math.round(collectedPct)}%</span>
        </div>
        <ProgressBar value={data.collected} max={data.totalBilled} />
        <div className="flex-between mt-sm txt-sm mute">
          <span>{formatCurrency(data.collected)} collected</span>
          <span>{formatCurrency(data.totalBilled)} billed</span>
        </div>
      </div>
    </>
  );
}
