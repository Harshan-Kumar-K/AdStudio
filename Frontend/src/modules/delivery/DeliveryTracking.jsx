import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Tabs from "../../components/Tabs.jsx";
import { MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcDelivery, IcPlus } from "../../assets/icons.jsx";
import { MOCK_DELIVERY_RECORDS, MOCK_PACING_ALERTS } from "../../data/mockData.js";

import DeliveryStats from "./components/DeliveryStats.jsx";
import DeliveryRecordsTable from "./components/DeliveryRecordsTable.jsx";
import PacingAlertsTable from "./components/PacingAlertsTable.jsx";
import AddDeliveryRecordForm from "./components/AddDeliveryRecordForm.jsx";

/**
 * Delivery & Performance Tracking page.
 *
 * This file only wires things together now:
 *   - fetches records + alerts
 *   - tracks which tab is active and whether the add-record modal is open
 *   - hands data/callbacks down to the split-out pieces
 *
 * Layout & table-rendering details live in ./components/*.
 */
export default function DeliveryTracking() {
  const [tab, setTab] = useState("records");
  const [formOpen, setFormOpen] = useState(false);

  const {
    data: records,
    loading: lr,
    isMock,
    reload: reloadRecords,
  } = useApiData(ENDPOINTS.deliveryRecords, MOCK_DELIVERY_RECORDS);

  const { data: alerts, loading: laa , reload: reloadAlerts} = useApiData(
    ENDPOINTS.pacingAlerts,
    MOCK_PACING_ALERTS
  );

  const tabs = [
    { key: "records", label: "Delivery Records", count: (records || []).length },
    { key: "alerts", label: "Pacing Alerts", count: (alerts || []).length },
  ];

  return (
    <div className="page">
      <PageHeader
        Icon={IcDelivery}
        title="Delivery & Performance Tracking"
        subtitle="Record delivery against plan, monitor pacing and manage exceptions"
        actions={
          <>
            {isMock && <MockFlag />}
            <button className="btn btn-primary btn-sm" onClick={() => setFormOpen(true)}>
              <IcPlus /> Add delivery record
            </button>
          </>
        }
      />

      <DeliveryStats records={records} alerts={alerts} />

      <div className="toolbar mt">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>

      <div className="card">
        {tab === "records" ? (
          <DeliveryRecordsTable records={records} loading={lr} />
        ) : (
          <PacingAlertsTable alerts={alerts} loading={laa} reload_doer={reloadAlerts} />
        )}
      </div>

      <AddDeliveryRecordForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreated={() => {reloadRecords(); reloadAlerts(); } }
      />
    </div>
  );
}
