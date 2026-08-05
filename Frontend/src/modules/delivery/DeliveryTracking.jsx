import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Tabs from "../../components/Tabs.jsx";
import { MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { useAllLineItems } from "../../api/useAllLineItems.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcDelivery, IcPlus } from "../../assets/icons.jsx";
import {
  MOCK_DELIVERY_RECORDS,
  MOCK_PACING_ALERTS,
  MOCK_LINE_ITEMS,
  MOCK_INSERTION_ORDERS,
} from "../../data/mockData.js";

import DeliveryStats from "./components/DeliveryStats.jsx";
import DeliveryRecordsTable from "./components/DeliveryRecordsTable.jsx";
import PacingAlertsTable from "./components/PacingAlertsTable.jsx";
import AddDeliveryRecordForm from "./components/AddDeliveryRecordForm.jsx";

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

  // Line items are aggregated across every media plan (see useAllLineItems -
  // there's no flat "all line items" endpoint), which is the exact same
  // source Creative's "link asset to line item" form uses, so both modules
  // always show the same real line item IDs from the media planner.
  const { data: lineItems } = useAllLineItems(MOCK_LINE_ITEMS);
  const { data: insertionOrders } = useApiData(ENDPOINTS.insertionOrders, MOCK_INSERTION_ORDERS);

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
        lineItems={lineItems || []}
        insertionOrders={insertionOrders || []}
      />
    </div>
  );
}