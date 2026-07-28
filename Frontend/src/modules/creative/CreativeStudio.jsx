import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Tabs from "../../components/Tabs.jsx";
import { MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS, API_BASE } from "../../api/endpoints.js";
import { getToken } from "../../api/apiClient.js";
import { IcCreative, IcTarget } from "../../assets/icons.jsx";
import { MOCK_CREATIVE_ASSETS, MOCK_APPROVALS, MOCK_ASSET_LINKS } from "../../data/mockData.js";

import AssetsGrid from "./tabs/AssetsGrid.jsx";
import ApprovalsTab from "./tabs/ApprovalsTab.jsx";
import AssetLinksTab from "./tabs/AssetLinksTab.jsx";
import UploadAssetForm from "./forms/UploadAssetForm.jsx";

export default function CreativeStudio() {
  const [tab, setTab] = useState("assets");
  const { data: assets, loading: la, isMock, reload: reloadAssets } = useApiData(ENDPOINTS.creativeAssets, MOCK_CREATIVE_ASSETS);
  const { data: approvals, loading: lap } = useApiData(ENDPOINTS.creativeApprovals, MOCK_APPROVALS);
  const { data: links, loading: ll } = useApiData(ENDPOINTS.assetLinks, MOCK_ASSET_LINKS);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const tabs = [
    { key: "assets", label: "Assets", count: (assets || []).length },
    { key: "approvals", label: "Approvals", count: (approvals || []).length },
    { key: "links", label: "Asset Links", count: (links || []).length },
  ];

const handleUpload = async (payload, file) => {
  const params = new URLSearchParams();

  // Append only defined/non-null values as query params
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  const formData = new FormData();
  if (file) formData.append("file", file);

  const token = getToken();
  const response = await fetch(
    `${API_BASE}/${ENDPOINTS.creativeAssets}?${params.toString()}`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const json = await response.json();
  const created = json && typeof json === "object" && "data" in json ? json.data : json;

    reloadAssets();

  return created;
};

  return (
    <div className="page">
      <PageHeader
        Icon={IcCreative}
        title="Creative Studio"
        subtitle="Upload assets, run approval workflows and link approved creative to line items"
        actions={<>{isMock && <MockFlag />}
        <button onClick={() => setShowUploadForm(true)} className="btn btn-primary btn-sm">
          <IcTarget /> Upload asset</button></>}
      />

      <div className="toolbar"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === "assets" && <AssetsGrid assets={assets} loading={la} />}
      {tab === "approvals" && <div className="card"><ApprovalsTab approvals={approvals} loading={lap} /></div>}
      {tab === "links" && <div className="card"><AssetLinksTab links={links} loading={ll} /></div>}

      <UploadAssetForm
        isOpen={showUploadForm}
        onClose={() => setShowUploadForm(false)}
        onSubmit={handleUpload}
      />
    </div>
  );
}