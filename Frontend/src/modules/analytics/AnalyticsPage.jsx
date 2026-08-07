import React from "react";
import PageHeader from "../../components/PageHeader.jsx";
import DataTable from "../../components/DataTable.jsx";
import { Loader, MockFlag } from "../../components/Loader.jsx";
import BarChart from "../../components/charts/BarChart.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcAnalytics,  IcEye, IcPointer, IcPercent, IcWallet, IcMoney, IcChart, IcCheckCircle, IcTrendUp } from "../../assets/icons.jsx";
import { MOCK_ANALYTICS_KPIS,  MOCK_DELIVERY_RECORDS, MOCK_PACING_ALERTS } from "../../data/mockData.js";
import { formatCompact, formatNumber, getChannelPerformance, getSpendByChannel } from "../../api/utils/format.js";

const CHANNEL_TONE = { Display: "badge-blue", Video: "badge-navy", Social: "badge-green", Search: "badge-amber", OOH: "badge-gray" };

export default function Analytics() {
  const { data: k, loading, isMock } = useApiData(ENDPOINTS.analyticsKpis, MOCK_ANALYTICS_KPIS);
  
   const {  data: delivery_records,   loading: lr,  isMock : isMockRecords,   reload: reloadRecords,
    } = useApiData(ENDPOINTS.deliveryRecords, MOCK_DELIVERY_RECORDS);
  
    const { data: alerts, loading: laa , reload: reloadAlerts} = 
    useApiData(  ENDPOINTS.pacingAlerts,
      MOCK_PACING_ALERTS  );

  const { data: lineItems, loading: laba , reload: reloadLLineItems} =  useApiData(  "api/line-items/all",[]  );

  const spendByChannel = getSpendByChannel(lineItems);
  console.log(lineItems);
       
  const perf = getChannelPerformance(lineItems || []);
  // delivery part stats
  const totalImp = (delivery_records || []).reduce((s, r) => s + r.deliveredImpressions, 0);
  const totalClicks = (delivery_records || []).reduce((s, r) => s + r.clicks, 0);
  const totalSpend = (delivery_records || []).reduce((s, r) => s + r.spend, 0);
  const openAlerts = (alerts || []).filter((a) => String(a.status).toUpperCase() === "OPEN").length;

  if (loading || !k) return <Loader label="Crunching analytics…" />;

  const kpis = [
    { Icon: IcEye, label: "Impressions", value: formatCompact(totalImp) },
    { Icon: IcPointer, label: "Clicks", value: formatNumber(totalClicks) },
    { Icon: IcPercent, label: "CTR", value: `${((totalClicks / totalImp) *100).toFixed(2)}%` },
    { Icon: IcWallet, label: "Spend", value: formatCompact(totalSpend, { money: true }) },
    { Icon: IcCheckCircle, label: "Open Alerts", value: `${openAlerts}` },
  ];

  const perfColumns = [
    { key: "channel", label: "Channel", render: (r) => <span className={`badge ${CHANNEL_TONE[r.channel] || "badge-gray"}`}>{r.channel}</span> },
    { key: "impressions", label: "Impressions", align: "right", mono: true, render: (r) => <span className="strong">{r.impressions}</span> },
    { key: "ctr", label: "Budget", align: "right", mono: true, render: (r) => `₹${r.ctr}` },
    { key: "cpm", label: "CPM", align: "right", mono: true, render: (r) => `₹${r.cpm.toFixed(2)}` },
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
            <div><h3>Spend by channel</h3><div className="sub">Total media spend ($K)</div></div>
            <IcChart size={20} style={{ color: "var(--navy-400)" }} />
          </div>
          <div className="card-pad"><BarChart data={spendByChannel} unit="" prefix="₹" height={250} alternate /></div>
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
