import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Tabs from "../../components/Tabs.jsx";
import { MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { useAllLineItems } from "../../api/useAllLineItems.js";
import { ENDPOINTS, API_BASE } from "../../api/endpoints.js";
import { getToken } from "../../api/apiClient.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { IcCreative, IcTarget, IcLink } from "../../assets/icons.jsx";
import {
  MOCK_CREATIVE_ASSETS,
  MOCK_APPROVALS,
  MOCK_ASSET_LINKS,
  MOCK_BRANDS,
  MOCK_BRIEFS,
  MOCK_LINE_ITEMS,
  MOCK_USERS,
} from "../../data/mockData.js";

import AssetsGrid from "./tabs/AssetsGrid.jsx";
import ApprovalsTab from "./tabs/ApprovalsTab.jsx";
import AssetLinksTab from "./tabs/AssetLinksTab.jsx";
import UploadAssetForm from "./forms/UploadAssetForm.jsx";
import LinkAssetForm from "./forms/LinkAssetForm.jsx";
import AssetDetailsModal from "./AssetDetailsModal.jsx";

export default function CreativeStudio() {
  const { user } = useAuth();
  const [tab, setTab] = useState("assets");
  const { data: assets, loading: la, isMock, reload: reloadAssets } = useApiData(ENDPOINTS.creativeAssets, MOCK_CREATIVE_ASSETS);
  const { data: approvals, loading: lap } = useApiData(ENDPOINTS.creativeApprovals, MOCK_APPROVALS);
  const { data: links, loading: ll, reload: reloadLinks } = useApiData(ENDPOINTS.assetLinks, MOCK_ASSET_LINKS);

  const { data: brands } = useApiData(ENDPOINTS.brands, MOCK_BRANDS);
  const { data: briefs } = useApiData(ENDPOINTS.campaignBriefs, MOCK_BRIEFS);
  // Line items come straight from the Media Planner (aggregated across all
  // media plans - see useAllLineItems for why this can't be a single GET),
  // so "link this asset to a line item" always offers a real, currently
  // existing line item ID rather than a disconnected mock list.
  const { data: lineItems } = useAllLineItems(MOCK_LINE_ITEMS);
  const { data: users } = useApiData(ENDPOINTS.adminUsers, MOCK_USERS);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkPresetAssetId, setLinkPresetAssetId] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const openLinkForm = (presetAssetId = null) => {
    setLinkPresetAssetId(presetAssetId);
    setShowLinkForm(true);
  };

  const tabs = [
    { key: "assets", label: "Assets", count: (assets || []).length },
    { key: "approvals", label: "Approvals", count: (approvals || []).length },
    { key: "links", label: "Asset Links", count: (links || []).length },
  ];

const handleUpload = async (payload, file) => {
  if (!user?.userId) {
    throw new Error("You must be signed in to upload an asset.");
  }
  const fullPayload = { ...payload, uploadedById: user.userId };

  const params = new URLSearchParams();

  Object.entries(fullPayload).forEach(([key, value]) => {
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
    let detail = "";
    try {
      detail = await response.text();
    } catch {
      /* ignore */
    }
    const match = detail.match(/default message \[(.*?)\]/);
    throw new Error(match ? match[1] : detail || `HTTP ${response.status}`);
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
        <button onClick={() => openLinkForm()} className="btn btn-outline btn-sm">
          <IcLink /> Link to line item</button>
        <button onClick={() => setShowUploadForm(true)} className="btn btn-primary btn-sm">
          <IcTarget /> Upload asset</button></>}
      />

      <div className="toolbar"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === "assets" && (
        <AssetsGrid
          assets={assets}
          loading={la}
          users={users || []}
          onSelect={setSelectedAsset}
        />
      )}
      {tab === "approvals" && <div className="card"><ApprovalsTab approvals={approvals} loading={lap} onRequestLink={openLinkForm} links={links || []} /></div>}
      {tab === "links" && <div className="card"><AssetLinksTab links={links} loading={ll} /></div>}

      <UploadAssetForm
        isOpen={showUploadForm}
        onClose={() => setShowUploadForm(false)}
        onSubmit={handleUpload}
        brands={brands || []}
        briefs={briefs || []}
      />

      <LinkAssetForm
        isOpen={showLinkForm}
        onClose={() => setShowLinkForm(false)}
        assets={assets || []}
        lineItems={lineItems || []}
        onLinked={reloadLinks}
        initialAssetId={linkPresetAssetId}
      />

      <AssetDetailsModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        brands={brands || []}
        briefs={briefs || []}
        users={users || []}
        links={links || []}
        onRequestLink={(assetId) => {
          setSelectedAsset(null);
          openLinkForm(assetId);
        }}
      />
    </div>
  );
}