import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Tabs from "../../components/Tabs.jsx";
import { MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";

import { API_BASE, ENDPOINTS } from "../../api/endpoints.js";
import { IcCampaign, IcPlus } from "../../assets/icons.jsx";
import { MOCK_BRIEFS, MOCK_AUDIENCES } from "../../data/mockData.js";

import Modal from "./Modal.jsx";
import BriefsTable from "./BriefsTable.jsx";
import AudiencesTable from "./AudiencesTable.jsx";
import CampaignBriefForm from "./forms/CampaignBriefForm.jsx";
import TargetAudienceForm from "./forms/TargetAudienceForm.jsx";
import apiRequest from "../../api/apiRequestSender.js";

export default function CampaignBriefs() {
  const [tab, setTab] = useState("briefs");

  const { data: briefsData, loading: lb, isMock } = useApiData(ENDPOINTS.campaignBriefs, MOCK_BRIEFS);
  const { data: audiencesData, loading: la } = useApiData(ENDPOINTS.targetAudiences, MOCK_AUDIENCES);

  const [briefModalOpen, setBriefModalOpen] = useState(false);
  const [audienceModalOpen, setAudienceModalOpen] = useState(false);

  const briefs = briefsData || [];
  const audiences = audiencesData || [];

  const tabs = [
    { key: "briefs", label: "Campaign Briefs", count: briefs.length },
    { key: "audiences", label: "Target Audiences", count: audiences.length },
  ];

  // ---- Create handlers ----
  // Every write reloads the whole page, so there's no need to merge
  // the created row into local state — the next load pulls fresh data.

  const handleCreateBrief = async (payload) => {
    const url = `${API_BASE}/${ENDPOINTS.campaignBriefs}`;
    await apiRequest(url, { method: "POST", body: payload });
    window.location.reload();
  };

  const handleCreateAudience = async (payload) => {
    const url = `${API_BASE}/${ENDPOINTS.targetAudiences}`;
    await apiRequest(url, { method: "POST", body: payload });
    window.location.reload();
  };

  // ---- Status transition handlers ----

  const handleSubmitBrief = async (row) => {
    await apiRequest(`${ENDPOINTS.campaignBriefs}/${row.briefId}/status`, {
      method: "PATCH",
      body: { status: "Submitted" },
    });
    window.location.reload();
  };

  const handleApproveBrief = async (row) => {
    await apiRequest(`${ENDPOINTS.campaignBriefs}/${row.briefId}/status`, {
      method: "PATCH",
      body: { status: "Approved" },
    });
    window.location.reload();
  };

  const handleRejectBrief = async (row) => {
    await apiRequest(`${ENDPOINTS.campaignBriefs}/${row.briefId}/status`, {
      method: "PATCH",
      body: { status: "Rejected" },
    });
    window.location.reload();
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