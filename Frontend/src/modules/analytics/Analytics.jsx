import React from "react";
import PageHeader from "../../components/PageHeader.jsx";
import DataTable from "../../components/DataTable.jsx";
import { Loader, MockFlag } from "../../components/Loader.jsx";
import LineChart from "../../components/charts/LineChart.jsx";
import BarChart from "../../components/charts/BarChart.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcAnalytics, IcDownload, IcEye, IcPointer, IcPercent, IcWallet, IcMoney, IcChart, IcCheckCircle, IcTrendUp } from "../../assets/icons.jsx";
import { MOCK_ANALYTICS_KPIS, MOCK_IMPRESSIONS_TREND, MOCK_SPEND_BY_CHANNEL, MOCK_CHANNEL_PERF } from "../../data/mockData.js";
import { formatCompact, formatNumber } from "../../api/utils/format.js";

const CHANNEL_TONE = { Display: "badge-blue", Video: "badge-navy", Social: "badge-green", Search: "badge-amber", OOH: "badge-gray" };

export default function Analytics() {
  const { data: k, loading, isMock } = useApiData(ENDPOINTS.analyticsKpis, MOCK_ANALYTICS_KPIS);
  const impressions = MOCK_IMPRESSIONS_TREND;
  const spendByChannel = MOCK_SPEND_BY_CHANNEL;
  const perf = MOCK_CHANNEL_PERF;

  if (loading || !k) return <Loader label="Crunching analytics…" />;

  const kpis = [
    { Icon: IcEye, label: "Impressions", value: formatCompact(k.totalImpressions) },
    { Icon: IcPointer, label: "Clicks", value: formatNumber(k.totalClicks) },
    { Icon: IcPercent, label: "CTR", value: `${k.ctr}%` },
    { Icon: IcWallet, label: "Spend", value: formatCompact(k.totalSpend, { money: true }) },
    { Icon: IcMoney, label: "CPM", value: `$${k.cpm.toFixed(2)}` },
    { Icon: IcMoney, label: "CPC", value: `$${k.cpc.toFixed(2)}` },
    { Icon: IcCheckCircle, label: "Delivery Rate", value: `${k.deliveryRate}%` },
    { Icon: IcTrendUp, label: "Agency ROI", value: `${k.agencyRoi}×` },
  ];

  const perfColumns = [
    { key: "channel", label: "Channel", render: (r) => <span className={`badge ${CHANNEL_TONE[r.channel] || "badge-gray"}`}>{r.channel}</span> },
    { key: "impressions", label: "Impressions", align: "right", mono: true, render: (r) => <span className="strong">{r.impressions}</span> },
    { key: "ctr", label: "CTR", align: "right", mono: true, render: (r) => `${r.ctr}%` },
    { key: "cpm", label: "CPM", align: "right", mono: true, render: (r) => `$${r.cpm.toFixed(2)}` },
    { key: "deliveryRate", label: "Delivery", align: "right", render: (r) => (
      <div className="mini-bar-wrap">
        <div className="mini-bar"><span style={{ width: `${r.deliveryRate}%` }} /></div>
        <span className="mb-label">{r.deliveryRate}%</span>
      </div>
    )},
  ];

  return (
    <div className="page">
      <PageHeader
        Icon={IcAnalytics}
        title="Campaign Analytics & Reporting"
        subtitle="Impressions, spend pacing, CPM, CTR and ROI across channels and brands"
        actions={<>{isMock && <MockFlag />}<button className="btn btn-outline btn-sm"><IcDownload /> Export report</button></>}
      />

      <div className="kpi-strip">
        {kpis.map((kpi) => (
          <div className="kpi" key={kpi.label}>
            <div className="kpi-ic"><kpi.Icon size={18} /></div>
            <div className="kpi-body">
              <div className="kpi-val tnum">{kpi.value}</div>
              <div className="kpi-lab">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid mt">
        <div className="card">
          <div className="card-head">
            <div><h3>Impressions over time</h3><div className="sub">Weekly delivered impressions (millions)</div></div>
            <span className="badge badge-green"><span className="dot" /> On pace</span>
          </div>
          <div className="card-pad"><LineChart data={impressions} unit="M" height={250} /></div>
        </div>

        <div className="card">
          <div className="card-head">
            <div><h3>Spend by channel</h3><div className="sub">Total media spend ($K)</div></div>
            <IcChart size={20} style={{ color: "var(--navy-400)" }} />
          </div>
          <div className="card-pad"><BarChart data={spendByChannel} unit="K" prefix="$" height={250} alternate /></div>
        </div>
      </div>

      <div className="card mt">
        <div className="card-head">
          <div><h3>Channel performance</h3><div className="sub">Effectiveness comparison across channels</div></div>
        </div>
        <DataTable columns={perfColumns} rows={perf} />
      </div>
    </div>
  );
}
