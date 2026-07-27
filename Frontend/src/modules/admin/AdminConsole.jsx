import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import Tabs from "../../components/Tabs.jsx";
import { Loader, MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import {
  IcAdmin, IcPlus, IcUser, IcCheck, IcClose, IcEdit,
  IcFmtBanner, IcFmtVideo, IcFmtNative, IcFmtAudio, IcFmtRich, IcFmtText,
} from "../../assets/icons.jsx";
import { MOCK_USERS, MOCK_AUDIT_LOGS, MOCK_CHANNELS, MOCK_RATE_CARDS } from "../../data/mockData.js";

const ROLE_LABEL = {
  Admin: "Ad Ops Admin", AdvertiserBrand: "Advertiser", MediaPlanner: "Media Planner",
  CreativeManager: "Creative", Publisher: "Publisher", Finance: "Finance",
};
const CHANNEL_ICON = {
  banner: IcFmtBanner, video: IcFmtVideo, native: IcFmtNative,
  audio: IcFmtAudio, rich: IcFmtRich, text: IcFmtText,
};

export default function AdminConsole() {
  const [tab, setTab] = useState("users");
  const { data: users, loading: lu, isMock } = useApiData(ENDPOINTS.adminUsers, MOCK_USERS);
  const { data: logs, loading: ll } = useApiData(ENDPOINTS.adminAuditLogs, MOCK_AUDIT_LOGS);
  const { data: channels, loading: lc } = useApiData(ENDPOINTS.adminChannels, MOCK_CHANNELS);
  const { data: rates, loading: lrc } = useApiData(ENDPOINTS.adminRateCards, MOCK_RATE_CARDS);

  const userColumns = [
    { key: "name", label: "User", render: (r) => (
      <div className="id-chip"><span className="av"><IcUser size={16} /></span><span className="meta"><span className="nm">{r.name}</span><span className="sb">{r.email}</span></span></div>
    )},
    { key: "role", label: "Role", render: (r) => <span className="badge badge-navy">{ROLE_LABEL[r.role] || r.role}</span> },
    { key: "phone", label: "Phone", render: (r) => <span className="cell-muted cell-num">{r.phone}</span> },
    { key: "accountId", label: "Account", render: (r) => <span className="cell-muted">{r.accountId}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", align: "right", render: (r) => (
      <div className="t-actions">
        {r.status === "Active"
          ? <button className="btn btn-danger btn-sm"><IcClose size={14} /> Suspend</button>
          : <button className="btn btn-success btn-sm"><IcCheck size={14} /> Activate</button>}
        <button className="btn btn-ghost btn-sm"><IcEdit size={14} /></button>
      </div>
    )},
  ];

  const logColumns = [
    { key: "id", label: "Audit ID", render: (r) => <span className="cell-num cell-muted">{r.id}</span> },
    { key: "user", label: "User", render: (r) => <span className="strong">{r.user}</span> },
    { key: "action", label: "Action", render: (r) => <span className="badge badge-blue">{r.action}</span> },
    { key: "entityType", label: "Entity", render: (r) => <span className="cell-muted">{r.entityType}</span> },
    { key: "timestamp", label: "Timestamp", align: "right", render: (r) => <span className="cell-muted cell-num">{r.timestamp}</span> },
  ];

  const rateColumns = [
    { key: "publisher", label: "Publisher", render: (r) => <span className="strong">{r.publisher}</span> },
    { key: "channel", label: "Channel", render: (r) => <span className="badge badge-navy">{r.channel}</span> },
    { key: "format", label: "Format", render: (r) => <span className="cell-muted">{r.format}</span> },
    { key: "baseCpm", label: "Base CPM", align: "right", mono: true, render: (r) => <span className="strong">${r.baseCpm.toFixed(2)}</span> },
    { key: "floorCpm", label: "Floor CPM", align: "right", mono: true, render: (r) => `$${r.floorCpm.toFixed(2)}` },
  ];

  const tabs = [
    { key: "users", label: "Users", count: (users || []).length },
    { key: "audit", label: "Audit Logs", count: (logs || []).length },
    { key: "channels", label: "Channel Catalog", count: (channels || []).length },
    { key: "rates", label: "Rate Cards", count: (rates || []).length },
  ];

  const actionFor = { users: "Add user", rates: "Add rate card" };

  return (
    <div className="page">
      <PageHeader
        Icon={IcAdmin}
        title="Admin Console"
        subtitle="Manage users, review audit trails and configure channels and rate cards"
        actions={<>{isMock && <MockFlag />}{actionFor[tab] && <button className="btn btn-primary btn-sm"><IcPlus /> {actionFor[tab]}</button>}</>}
      />

      <div className="toolbar"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === "users" && <div className="card">{lu ? <Loader /> : <DataTable columns={userColumns} rows={users} />}</div>}
      {tab === "audit" && <div className="card">{ll ? <Loader /> : <DataTable columns={logColumns} rows={logs} />}</div>}
      {tab === "rates" && <div className="card">{lrc ? <Loader /> : <DataTable columns={rateColumns} rows={rates} />}</div>}

      {tab === "channels" && (
        lc ? <Loader /> : (
          <>
            <div className="ref-note">Channels are reference values used across media line items. This is a read-only catalog for Phase 1.</div>
            <div className="ref-grid">
              {(channels || []).map((c) => {
                const Icon = CHANNEL_ICON[c.icon] || IcFmtBanner;
                return (
                  <div className="ref-chip" key={c.name}>
                    <div className="rc-ic"><Icon size={20} /></div>
                    <div>
                      <div className="rc-t">{c.name}</div>
                      <div className="rc-s">{c.note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )
      )}
    </div>
  );
}
