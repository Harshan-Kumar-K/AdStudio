import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import Tabs from "../../components/Tabs.jsx";
import { MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { IcPublisher, IcSend } from "../../assets/icons.jsx";
import {
  MOCK_PUBLISHER_INBOX,
  MOCK_PUBLISHER_DELIVERY,
  MOCK_PUBLISHER_INVOICES,
} from "../../data/mockData.js";

import PublisherInboxTab from "./tabs/PublisherInboxTab.jsx";
import DeliveryReportsTab from "./tabs/DeliveryReportsTab.jsx";
import PublisherInvoicesTab from "./tabs/PublisherInvoicesTab.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
// import DeliveryReportForm from "./DeliveryReportForm.jsx";

/**
 * PublisherPortal
 * Orchestrates the three publisher tabs (Inbox / Delivery Reports / Invoices)
 * and owns the "Submit delivery report" modal. All data fetching for each
 * tab lives here so the tabs themselves stay presentational.
 */
export default function PublisherPortal() {
  const [tab, setTab] = useState("inbox");
  const [showReportForm, setShowReportForm] = useState(false);

  const {user} = useAuth();

  const {
    data: inbox,
    loading: inboxLoading,
    isMock: inboxIsMock,
    reload: reloadInbox,
  } = useApiData(`${ENDPOINTS.insertionOrders}?publisherId=${user.userId}`, MOCK_PUBLISHER_INBOX);

  const {
    data: reports,
    loading: reportsLoading,
    isMock: reportsIsMock,
    reload: reloadReports,
  } = useApiData(ENDPOINTS.deliveryRecords, MOCK_PUBLISHER_DELIVERY);

  const {
    data: invoices,
    loading: invoicesLoading,
    isMock: invoicesIsMock,
  } = useApiData(`${ENDPOINTS.publisherInvoices}?publisherId=${user.userId}`, MOCK_PUBLISHER_INVOICES);

  const isMock = inboxIsMock || reportsIsMock || invoicesIsMock;

  const tabs = [
    { key: "inbox", label: "IO Inbox", count: (inbox || []).length },
    { key: "reports", label: "Delivery Reports", count: (reports || []).length },
    { key: "invoices", label: "Invoices", count: (invoices || []).length },
  ];

  function handleReportSubmitted() {
    setShowReportForm(false);
    reloadReports();
  }

  return (
    <div className="page">
      <PageHeader
        Icon={IcPublisher}
        title="Publisher Portal"
        subtitle="Respond to insertion orders, submit delivery reports and raise invoices"
        actions={
          <>
            {isMock && <MockFlag />}
            {/* <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowReportForm(true)}
            >
              <IcSend /> Submit delivery report
            </button> */}
          </>
        }
      />

      <div className="toolbar">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>

      {tab === "inbox" && (
        <PublisherInboxTab
          data={inbox}
          loading={inboxLoading}
          onChanged={reloadInbox}
        />
      )}

      {tab === "reports" && (
        <DeliveryReportsTab data={reports} loading={reportsLoading} />
      )}

      {tab === "invoices" && (
        <PublisherInvoicesTab data={invoices} loading={invoicesLoading} />
      )}

      {/* {showReportForm && (
        <DeliveryReportForm
          insertionOrders={inbox || []}
          onClose={() => setShowReportForm(false)}
          onSubmitted={handleReportSubmitted}
        />
      )} */}
    </div>
  );
}
