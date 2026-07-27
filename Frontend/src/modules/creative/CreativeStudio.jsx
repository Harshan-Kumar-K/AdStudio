import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Tabs from "../../components/Tabs.jsx";
import { MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcCreative, IcUpload } from "../../assets/icons.jsx";
import { MOCK_CREATIVE_ASSETS, MOCK_APPROVALS, MOCK_ASSET_LINKS } from "../../data/mockData.js";

import AssetsGrid from "./tabs/AssetsGrid.jsx";
import ApprovalsTab from "./tabs/ApprovalsTab.jsx";
import AssetLinksTab from "./tabs/AssetLinksTab.jsx";

export default function CreativeStudio() {
  const [tab, setTab] = useState("assets");
  const { data: assets, loading: la, isMock } = useApiData(ENDPOINTS.creativeAssets, MOCK_CREATIVE_ASSETS);
  const { data: approvals, loading: lap } = useApiData(ENDPOINTS.creativeApprovals, MOCK_APPROVALS);
  const { data: links, loading: ll } = useApiData(ENDPOINTS.assetLinks, MOCK_ASSET_LINKS);

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

      {tab === "assets" && <AssetsGrid assets={assets} loading={la} />}
      {tab === "approvals" && <div className="card"><ApprovalsTab approvals={approvals} loading={lap} /></div>}
      {tab === "links" && <div className="card"><AssetLinksTab links={links} loading={ll} /></div>}
    </div>
  );
}
