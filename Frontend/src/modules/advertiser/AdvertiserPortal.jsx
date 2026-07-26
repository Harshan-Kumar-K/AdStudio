import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Tabs from "../../components/Tabs.jsx";
import { MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../hooks/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcAdvertiser, IcPlus } from "../../assets/icons.jsx";
import { MOCK_ADVERTISERS, MOCK_BRANDS } from "../../data/mockData.js";

import Modal from "./Modal.jsx";
import AdvertiserForm from "./AdvertiserForm.jsx";
import BrandForm from "./BrandForm.jsx";
import AdvertisersTable from "./AdvertisersTable.jsx";
import BrandGrid from "./BrandGrid.jsx";

/* ---------------------------------------------------------------------- */
/*  Main page                                                              */
/* ---------------------------------------------------------------------- */
export default function AdvertiserPortal() {
  const [tab, setTab] = useState("advertisers");
const { data: advertisers, loading: la, isMock, reload: refetchAdvertisers } = useApiData(ENDPOINTS.advertisers, MOCK_ADVERTISERS);
const { data: brands, loading: lb, reload: refetchBrands } = useApiData(ENDPOINTS.brands, MOCK_BRANDS);

  const [advertiserModal, setAdvertiserModal] = useState(null); // null | {} (new) | advertiser (edit)
  const [brandModal, setBrandModal] = useState(null);

  const tabs = [
    { key: "advertisers", label: "Advertisers", count: (advertisers || []).length },
    { key: "brands", label: "Brands", count: (brands || []).length },
  ];

  const handleAdvertiserSaved = () => {
    setAdvertiserModal(null);
    refetchAdvertisers?.();
  };

  const handleBrandSaved = () => {
    setBrandModal(null);
    refetchBrands?.();
  };

  return (
    <div className="page">
      <PageHeader
        Icon={IcAdvertiser}
        title="Advertisers & Brands"
        subtitle="Manage advertiser accounts, brand portfolios and budget headroom"
        actions={
          <>
            {isMock && <MockFlag />}
            <button
              className="btn btn-primary btn-sm"
              onClick={() => (tab === "brands" ? setBrandModal({}) : setAdvertiserModal({}))}
            >
              <IcPlus /> {tab === "brands" ? "New brand" : "New advertiser"}
            </button>
          </>
        }
      />

      <div className="toolbar"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === "advertisers" && (
        <AdvertisersTable advertisers={advertisers} loading={la} onEdit={setAdvertiserModal} />
      )}

      {tab === "brands" && (
        <BrandGrid brands={brands} loading={lb} onSelect={setBrandModal} />
      )}

      {advertiserModal && (
        <Modal title={advertiserModal.advertiserId ? "Edit advertiser" : "New advertiser"} onClose={() => setAdvertiserModal(null)}>
          <AdvertiserForm
            initial={advertiserModal}
            onCancel={() => setAdvertiserModal(null)}
            onSaved={handleAdvertiserSaved}
          />
        </Modal>
      )}

      {brandModal && (
        <Modal title={brandModal.brandId ? "Edit brand" : "New brand"} onClose={() => setBrandModal(null)}>
          <BrandForm
            initial={brandModal}
            advertisers={advertisers}
            onCancel={() => setBrandModal(null)}
            onSaved={handleBrandSaved}
          />
        </Modal>
      )}
    </div>
  );
}
