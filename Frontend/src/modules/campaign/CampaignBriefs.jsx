import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Tabs from "../../components/Tabs.jsx";
import { MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcCampaign, IcPlus } from "../../assets/icons.jsx";
import { MOCK_BRIEFS, MOCK_AUDIENCES } from "../../data/mockData.js";

import Modal from "./Modal.jsx";
import BriefsTable from "./BriefsTable.jsx";
import AudiencesTable from "./AudiencesTable.jsx";
import CampaignBriefForm from "./forms/CampaignBriefForm.jsx";
import TargetAudienceForm from "./forms/TargetAudienceForm.jsx";

// Small helper to POST/PATCH JSON against the Spring Boot backend.
async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json().catch(() => ({}));
}

async function patchStatus(baseUrl, id, status) {
  const res = await fetch(`${baseUrl}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json().catch(() => ({}));
}

export default function CampaignBriefs() {
  const [tab, setTab] = useState("briefs");

  const { data: briefsData, loading: lb, isMock } = useApiData(ENDPOINTS.campaignBriefs, MOCK_BRIEFS);
  const { data: audiencesData, loading: la } = useApiData(ENDPOINTS.targetAudiences, MOCK_AUDIENCES);

  // Locally created rows layered on top of whatever the hook returned,
  // so new items show up immediately without needing the hook to expose
  // a refetch method.
  const [extraBriefs, setExtraBriefs] = useState([]);
  const [extraAudiences, setExtraAudiences] = useState([]);
  const [statusOverrides, setStatusOverrides] = useState({}); // { [briefId]: newStatus }

  const [briefModalOpen, setBriefModalOpen] = useState(false);
  const [audienceModalOpen, setAudienceModalOpen] = useState(false);

  const briefs = [...(briefsData || []), ...extraBriefs].map((b) =>
    statusOverrides[b.id] ? { ...b, status: statusOverrides[b.id] } : b
  );
  const audiences = [...(audiencesData || []), ...extraAudiences];

  const tabs = [
    { key: "briefs", label: "Campaign Briefs", count: briefs.length },
    { key: "audiences", label: "Target Audiences", count: audiences.length },
  ];

  // ---- Create handlers ----

  const handleCreateBrief = async (payload) => {
    const created = await postJson(ENDPOINTS.campaignBriefs, payload);
    setExtraBriefs((prev) => [
      {
        id: created.id ?? `TMP-${Date.now()}`,
        brand: created.brand ?? `Brand #${payload.brandId}`,
        status: created.status ?? "Draft",
        ...payload,
        ...created,
      },
      ...prev,
    ]);
    setBriefModalOpen(false);
  };

  const handleCreateAudience = async (payload) => {
    const created = await postJson(ENDPOINTS.targetAudiences, payload);
    const parentBrief = briefs.find((b) => b.id === payload.briefId);
    setExtraAudiences((prev) => [
      {
        id: created.id ?? `TMP-${Date.now()}`,
        brief: created.brief ?? parentBrief?.campaignName ?? `Brief #${payload.briefId}`,
        status: created.status ?? "Active",
        ...payload,
        ...created,
      },
      ...prev,
    ]);
    setAudienceModalOpen(false);
  };

  // ---- Status transition handlers ----

  const handleSubmitBrief = async (row) => {
    await patchStatus(ENDPOINTS.campaignBriefs, row.id, "Submitted");
    setStatusOverrides((prev) => ({ ...prev, [row.id]: "Submitted" }));
  };

  const handleApproveBrief = async (row) => {
    await patchStatus(ENDPOINTS.campaignBriefs, row.id, "Approved");
    setStatusOverrides((prev) => ({ ...prev, [row.id]: "Approved" }));
  };

  const handleRejectBrief = async (row) => {
    await patchStatus(ENDPOINTS.campaignBriefs, row.id, "Rejected");
    setStatusOverrides((prev) => ({ ...prev, [row.id]: "Rejected" }));
  };

  return (
    <div className="page">
      <PageHeader
        Icon={IcCampaign}
        title="Campaign Planning & Briefing"
        subtitle="Capture briefs, objectives and target audiences, then run the approval workflow"
        actions={
          <>
            {isMock && <MockFlag />}
            <button
              className="btn btn-primary btn-sm"
              onClick={() => (tab === "audiences" ? setAudienceModalOpen(true) : setBriefModalOpen(true))}
            >
              <IcPlus /> {tab === "audiences" ? "New audience" : "New brief"}
            </button>
          </>
        }
      />

      <div className="toolbar">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>

      <div className="card">
        {tab === "briefs" ? (
          <BriefsTable
            rows={briefs}
            loading={lb}
            onSubmit={handleSubmitBrief}
            onApprove={handleApproveBrief}
            onReject={handleRejectBrief}
          />
        ) : (
          <AudiencesTable rows={audiences} loading={la} />
        )}
      </div>

      <Modal open={briefModalOpen} title="New campaign brief" onClose={() => setBriefModalOpen(false)}>
        <CampaignBriefForm onSubmit={handleCreateBrief} onCancel={() => setBriefModalOpen(false)} />
      </Modal>

      <Modal open={audienceModalOpen} title="New target audience" onClose={() => setAudienceModalOpen(false)}>
        <TargetAudienceForm
          briefs={briefs}
          onSubmit={handleCreateAudience}
          onCancel={() => setAudienceModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
