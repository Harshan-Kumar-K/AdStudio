import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import Tabs from "../../components/Tabs.jsx";
import { Loader, MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import {
  IcCreative, IcUpload, IcCheck, IcClose, IcEdit, IcLink,
  IcFmtBanner, IcFmtVideo, IcFmtNative, IcFmtAudio, IcFmtRich, IcFmtText,
} from "../../assets/icons.jsx";
import { MOCK_CREATIVE_ASSETS, MOCK_APPROVALS, MOCK_ASSET_LINKS } from "../../data/mockData.js";

const FORMAT_META = {
  Banner: { Icon: IcFmtBanner, grad: "linear-gradient(135deg,#1f4396,#2f5bc4)" },
  Video: { Icon: IcFmtVideo, grad: "linear-gradient(135deg,#122a5c,#18367a)" },
  Native: { Icon: IcFmtNative, grad: "linear-gradient(135deg,#2f5bc4,#3d8bff)" },
  Audio: { Icon: IcFmtAudio, grad: "linear-gradient(135deg,#0e1f44,#1f4396)" },
  RichMedia: { Icon: IcFmtRich, grad: "linear-gradient(135deg,#18367a,#5fa3ff)" },
  Text: { Icon: IcFmtText, grad: "linear-gradient(135deg,#3a4763,#6c7a9c)" },
};
const DECISION_TONE = { Approved: "badge-green", Rejected: "badge-red", RevisionRequired: "badge-amber" };

export default function CreativeStudio() {
  const [tab, setTab] = useState("assets");
  const { data: assets, loading: la, isMock } = useApiData(ENDPOINTS.creativeAssets, MOCK_CREATIVE_ASSETS);
  const { data: approvals, loading: lap } = useApiData(ENDPOINTS.creativeApprovals, MOCK_APPROVALS);
  const { data: links, loading: ll } = useApiData(ENDPOINTS.assetLinks, MOCK_ASSET_LINKS);

  const approvalColumns = [
    { key: "asset", label: "Asset", render: (r) => <span className="strong">{r.asset}</span> },
    { key: "reviewer", label: "Reviewer", render: (r) => <span className="cell-muted">{r.reviewer}</span> },
    { key: "reviewDate", label: "Reviewed", render: (r) => <span className="cell-muted cell-num">{r.reviewDate}</span> },
    { key: "decision", label: "Decision", render: (r) => r.decision === "—" ? <span className="cell-muted">—</span> : <span className={`badge ${DECISION_TONE[r.decision] || "badge-gray"}`}>{r.decision.replace(/([a-z])([A-Z])/g, "$1 $2")}</span> },
    { key: "feedback", label: "Feedback", render: (r) => <span className="cell-muted txt-sm">{r.feedback}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", align: "right", render: (r) =>
      r.status === "Pending"
        ? <div className="t-actions"><button className="btn btn-success btn-sm"><IcCheck size={14} /> Approve</button><button className="btn btn-danger btn-sm"><IcClose size={14} /></button></div>
        : <span className="cell-muted txt-sm">—</span>
    },
  ];

  const linkColumns = [
    { key: "id", label: "Link", render: (r) => <span className="meta"><div className="strong">{r.id}</div></span> },
    { key: "asset", label: "Asset", render: (r) => <span className="cell-muted">{r.asset}</span> },
    { key: "lineItem", label: "Line item", render: (r) => <span className="badge badge-navy">{r.lineItem}</span> },
    { key: "channel", label: "Channel", render: (r) => <span className="cell-muted">{r.channel}</span> },
    { key: "linkedDate", label: "Linked", render: (r) => <span className="cell-muted cell-num">{r.linkedDate}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  const tabs = [
    { key: "assets", label: "Assets", count: (assets || []).length },
    { key: "approvals", label: "Approvals", count: (approvals || []).length },
    { key: "links", label: "Asset Links", count: (links || []).length },
  ];

  return (
    <div className="page">
      <PageHeader
        Icon={IcCreative}
        title="Creative Studio"
        subtitle="Upload assets, run approval workflows and link approved creative to line items"
        actions={<>{isMock && <MockFlag />}<button className="btn btn-primary btn-sm"><IcUpload /> Upload asset</button></>}
      />

      <div className="toolbar"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === "assets" && (
        la ? <Loader /> : (
          <div className="creative-grid">
            {(assets || []).map((a) => {
              const meta = FORMAT_META[a.format] || FORMAT_META.Banner;
              const Icon = meta.Icon;
              return (
                <div className="creative-card" key={a.id}>
                  <div className="creative-thumb" style={{ background: meta.grad }}>
                    <Icon className="fmt-ic" />
                    <span className="ver">v{a.version}</span>
                    {a.dimensions !== "—" && <span className="dims">{a.dimensions}</span>}
                  </div>
                  <div className="creative-body">
                    <div className="cn">{a.name}</div>
                    <div className="cm">{a.format} · {a.brand}</div>
                    <div className="cf">
                      <StatusBadge status={a.status} />
                      <span className="txt-sm mute">{a.fileSizeKB} KB</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {tab === "approvals" && <div className="card">{lap ? <Loader /> : <DataTable columns={approvalColumns} rows={approvals} />}</div>}
      {tab === "links" && <div className="card">{ll ? <Loader /> : <DataTable columns={linkColumns} rows={links} emptyLabel="No asset links yet" />}</div>}
    </div>
  );
}
