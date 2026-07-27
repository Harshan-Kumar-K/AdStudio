import React from "react";
import PageHeader from "../../components/PageHeader.jsx";
import StatCard from "../../components/StatCard.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { Loader, MockFlag } from "../../components/Loader.jsx";
import LineChart from "../../components/charts/LineChart.jsx";
import DonutChart from "../../components/charts/DonutChart.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import {
  IcDashboard, IcCampaign, IcWallet, IcEye, IcPercent,
  IcAlert, IcRefresh, IcDownload, IcTrendUp, IcClock,
} from "../../assets/icons.jsx";
import {
  MOCK_DASHBOARD_SUMMARY, MOCK_SPEND_TREND, MOCK_CHANNEL_MIX,
  MOCK_RECENT_CAMPAIGNS, MOCK_PACING_ALERTS,
} from "../../data/mockData.js";
import { formatCompact } from "../../utils/format.js";

const ALERT_TONE = {
  UnderDelivery: "ai-red", BudgetExhausted: "ai-red",
  OverDelivery: "ai-amber", FlightEndApproaching: "ai-amber",
};
const ALERT_TEXT = {
  UnderDelivery: "Under-delivering", OverDelivery: "Over-delivering",
  BudgetExhausted: "Budget exhausted", FlightEndApproaching: "Flight ending soon",
};

export default function Dashboard() {
  const { data: s, loading, isMock } = useApiData(ENDPOINTS.dashboardSummary, MOCK_DASHBOARD_SUMMARY);
  const trend = MOCK_SPEND_TREND;
  const mix = MOCK_CHANNEL_MIX;
  const campaigns = MOCK_RECENT_CAMPAIGNS;
  const alerts = MOCK_PACING_ALERTS.filter((a) => a.status === "Open").slice(0, 4);

  if (loading || !s) return <Loader label="Loading dashboard…" />;

  const columns = [
    { key: "id", label: "Campaign", render: (r) => (
      <div className="id-chip">
        <span className="av">{r.brand[0]}</span>
        <span className="meta"><span className="nm">{r.name}</span><span className="sb">{r.brand} · {r.id}</span></span>
      </div>
    )},
    { key: "impressions", label: "Impressions", align: "right", mono: true, render: (r) => <span className="strong">{r.impressions}</span> },
    { key: "spend", label: "Spend", align: "right", mono: true, render: (r) => formatCompact(r.spend, { money: true }) },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="page">
      <PageHeader
        Icon={IcDashboard}
        title="Dashboard"
        subtitle="Live snapshot of campaigns, spend and delivery"
        actions={
          <>
            {isMock && <MockFlag />}
            <button className="btn btn-outline btn-sm"><IcRefresh /> Refresh</button>
            <button className="btn btn-primary btn-sm"><IcDownload /> Export</button>
          </>
        }
      />

      <div className="stat-grid">
        <StatCard Icon={IcCampaign} label="Active Campaigns" value={s.activeCampaigns} trend={s.activeCampaignsTrend} foot={<><IcTrendUp size={13} /> vs last month</>} />
        <StatCard Icon={IcWallet} label="Total Spend" value={formatCompact(s.totalSpend, { money: true })} trend={s.totalSpendTrend} foot={<>This quarter</>} />
        <StatCard Icon={IcEye} label="Impressions" value={formatCompact(s.impressions)} trend={s.impressionsTrend} foot={<>Delivered</>} />
        <StatCard Icon={IcPercent} label="Avg. CTR" value={`${s.avgCtr}%`} trend={s.avgCtrTrend} foot={<>Across channels</>} />
      </div>

      <div className="dash-grid mt">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Spend over time</h3>
              <div className="sub">Monthly media spend ($K)</div>
            </div>
            <span className="badge badge-green"><span className="dot" /> +8.2%</span>
          </div>
          <div className="card-pad">
            <LineChart data={trend} unit="K" prefix="$" height={250} />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div><h3>Channel mix</h3><div className="sub">Spend share by channel</div></div>
          </div>
          <div className="card-pad">
            <div className="chart-row" style={{ justifyContent: "center" }}>
              <DonutChart data={mix} size={180} thickness={26} centerValue="$1.28M" centerLabel="Total spend" />
              <div className="legend-list">
                {mix.map((m) => (
                  <div className="ll" key={m.label}>
                    <span className="sw" style={{ background: m.color }} />
                    <span className="lt">{m.label}</span>
                    <span className="lv">{m.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-grid mt">
        <div className="card">
          <div className="card-head">
            <div><h3>Recent campaigns</h3><div className="sub">Latest activity across brands</div></div>
            <button className="btn btn-ghost btn-sm">View all</button>
          </div>
          <DataTable columns={columns} rows={campaigns} />
        </div>

        <div className="card">
          <div className="card-head">
            <div><h3>Pacing alerts</h3><div className="sub">{alerts.length} open</div></div>
            <span className="icon-btn" style={{ color: "var(--red-500)" }}><IcAlert size={20} /></span>
          </div>
          <div className="alert-list">
            {alerts.map((a) => (
              <div className="alert-item" key={a.id}>
                <div className={`ai-ic ${ALERT_TONE[a.alertType] || "ai-blue"}`}><IcAlert /></div>
                <div className="ai-body">
                  <div className="ti">{ALERT_TEXT[a.alertType] || a.alertType}</div>
                  <div className="ds">{a.channel} · line item {a.lineItem} · pacing {a.pacingPercent}%</div>
                </div>
                <div className="ai-time"><IcClock size={13} style={{ display: "inline", verticalAlign: "-2px" }} /> {a.alertDate.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
