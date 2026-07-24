import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import Tabs from "../../components/Tabs.jsx";
import { Loader, MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../hooks/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import apiClient from "../../api/apiClient.js";
import { IcMediaPlan, IcPlus, IcSend, IcCheck, IcClose, IcEdit, IcTrash } from "../../assets/icons.jsx";
import { MOCK_MEDIA_PLANS, MOCK_LINE_ITEMS, MOCK_INSERTION_ORDERS } from "../../data/mockData.js";
import { formatCompact, formatNumber } from "../../utils/format.js";

import Modal from "../advertiser/Modal.jsx";
import MediaPlanForm from "./MediaPlanForm.jsx";
import LineItemForm from "./LineItemForm.jsx";
import InsertionOrderForm from "./InsertionOrderForm.jsx";

const CHANNEL_TONE = {
  Display: "badge-blue", Video: "badge-navy", Social: "badge-green",
  Search: "badge-amber", OOH: "badge-gray", Print: "badge-gray", Radio: "badge-gray",
};

// Flight progress isn't sent by the backend — derive it from the dates.
function computeProgress(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const now = Date.now();
  if (now <= s) return 0;
  if (now >= e) return 100;
  return Math.round(((now - s) / (e - s)) * 100);
}

export default function MediaPlanning() {
  const [tab, setTab] = useState("plans");
  const [actionError, setActionError] = useState("");

  // Plans: GET /api/media-plans returns a PagedResponse { content, page, size, ... }
  const { data: planPage, loading: lp, isMock: pIsMock, reload: reloadPlans } = useApiData(ENDPOINTS.mediaPlans, MOCK_MEDIA_PLANS);
  const plans = Array.isArray(planPage) ? planPage : (planPage?.content || []);

  // Insertion Orders: GET /api/insertion-orders returns a plain array, no paging
  const { data: ioData, loading: li, isMock: ioIsMock, reload: reloadIos } = useApiData(ENDPOINTS.insertionOrders, MOCK_INSERTION_ORDERS);
  const ios = Array.isArray(ioData) ? ioData : (ioData?.content || []);

  // Line Items: no "get all" endpoint exists on the backend — only
  // GET /api/media-plans/{planId}/line-items. Fetch one call per plan
  // (once plans have loaded) and flatten the results into one list.
  const [lineItems, setLineItems] = useState(null);
  const [ll, setLl] = useState(true);
  const [liIsMock, setLiIsMock] = useState(false);

  function loadLineItems() {
    if (plans.length === 0) { setLineItems([]); setLl(false); return; }
    setLl(true);
    return Promise.all(
      plans.map((p) => apiClient.get(`api/media-plans/${p.planId}/line-items`).catch(() => null))
    ).then((results) => {
      if (results.some((r) => r !== null)) {
        setLineItems(results.filter(Boolean).flat());
        setLiIsMock(false);
      } else {
        setLineItems(MOCK_LINE_ITEMS);
        setLiIsMock(true);
      }
    }).finally(() => setLl(false));
  }

  useEffect(() => {
    if (lp) return;
    loadLineItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lp, plans.length]);

  const isMock = pIsMock || ioIsMock || liIsMock;

  // ---- modals ----
  const [planModal, setPlanModal] = useState(null);       // null closed | {} new | plan row = edit
  const [lineItemModal, setLineItemModal] = useState(null); // null closed | {} new
  const [ioModal, setIoModal] = useState(null);            // null closed | {} new | { lineItemId } prefilled

  // ---- status-change / delete actions ----
  async function changePlanStatus(planId, status) {
    setActionError("");
    try {
      await apiClient.put(`api/media-plans/${planId}/status`, { status });
      reloadPlans();
    } catch (e) { setActionError(e.message || "Failed to update plan status."); }
  }
  async function deletePlan(planId) {
    if (!window.confirm(`Delete media plan #${planId}? This also deletes its line items.`)) return;
    setActionError("");
    try {
      await apiClient.del(`api/media-plans/${planId}`);
      reloadPlans();
    } catch (e) { setActionError(e.message || "Failed to delete media plan."); }
  }

  async function changeLineItemStatus(lineItemId, status) {
    setActionError("");
    try {
      await apiClient.put(`api/line-items/${lineItemId}/status`, { status });
      loadLineItems();
    } catch (e) { setActionError(e.message || "Failed to update line item status."); }
  }
  async function deleteLineItem(lineItemId) {
    if (!window.confirm(`Delete line item #${lineItemId}?`)) return;
    setActionError("");
    try {
      await apiClient.del(`api/line-items/${lineItemId}`);
      loadLineItems();
    } catch (e) { setActionError(e.message || "Failed to delete line item."); }
  }

  async function changeIoStatus(ioId, status) {
    setActionError("");
    try {
      await apiClient.put(`api/insertion-orders/${ioId}/status`, { status });
      reloadIos();
    } catch (e) { setActionError(e.message || "Failed to update insertion order status."); }
  }

  const planColumns = [
    { key: "id", label: "Plan", render: (r) => <span className="meta"><div className="strong">#{r.planId}</div><div className="sb cell-muted">Brief #{r.briefId}</div></span> },
    { key: "planner", label: "Planner", render: (r) => <span className="cell-muted">Planner #{r.plannerId}</span> },
    { key: "channelMix", label: "Channel mix", render: (r) => <span className="cell-muted txt-sm">{r.channelMix}</span> },
    { key: "totalBudget", label: "Budget", align: "right", mono: true, render: (r) => <span className="strong">{formatCompact(r.totalBudgetAllocated, { money: true })}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", align: "right", render: (r) => (
      <div className="t-actions">
        {r.status === "Draft" && (
          <button className="btn btn-outline btn-sm" onClick={() => changePlanStatus(r.planId, "PendingApproval")}><IcSend size={14} /> Submit</button>
        )}
        {r.status === "PendingApproval" && (
          <>
            <button className="btn btn-success btn-sm" onClick={() => changePlanStatus(r.planId, "Approved")}><IcCheck size={14} /> Approve</button>
            <button className="btn btn-ghost btn-sm" onClick={() => changePlanStatus(r.planId, "Draft")}>Send back</button>
          </>
        )}
        {r.status === "Approved" && (
          <button className="btn btn-primary btn-sm" onClick={() => changePlanStatus(r.planId, "Active")}>Activate</button>
        )}
        {r.status === "Active" && (
          <button className="btn btn-outline btn-sm" onClick={() => changePlanStatus(r.planId, "Completed")}>Complete</button>
        )}
        <button className="btn-icon" title="Edit" onClick={() => setPlanModal(r)}><IcEdit size={14} /></button>
        <button className="btn-icon" title="Delete" onClick={() => deletePlan(r.planId)}><IcTrash size={14} /></button>
      </div>
    )},
  ];

  const lineColumns = [
    { key: "id", label: "Line item", render: (r) => <span className="meta"><div className="strong">#{r.lineItemId}</div><div className="sb cell-muted">Plan #{r.planId} · {r.format}</div></span> },
    { key: "channel", label: "Channel", render: (r) => <span className={`badge ${CHANNEL_TONE[r.channel] || "badge-gray"}`}>{r.channel}</span> },
    { key: "publisher", label: "Publisher", render: (r) => <span className="cell-muted">{r.publisher}</span> },
    { key: "plannedImpressions", label: "Impressions", align: "right", mono: true, render: (r) => formatCompact(r.plannedImpressions) },
    { key: "cpm", label: "CPM", align: "right", mono: true, render: (r) => r.cpm != null ? `$${Number(r.cpm).toFixed(2)}` : "—" },
    { key: "plannedBudget", label: "Budget", align: "right", mono: true, render: (r) => <span className="strong">{formatCompact(r.plannedBudget, { money: true })}</span> },
    { key: "progress", label: "Flight", render: (r) => {
      const progress = computeProgress(r.flightStart, r.flightEnd);
      return (
        <div className="flight-bar-wrap">
          <div className="flight-bar"><span style={{ width: `${progress}%`, left: 0 }} /></div>
          <div className="flight-label">{r.flightStart.slice(5)} → {r.flightEnd.slice(5)} · {progress}%</div>
        </div>
      );
    }},
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", align: "right", render: (r) => (
      <div className="t-actions">
        {r.status === "Planned" && (
          <button className="btn btn-outline btn-sm" onClick={() => changeLineItemStatus(r.lineItemId, "Ordered")}>Mark Ordered</button>
        )}
        {r.status === "Ordered" && (
          <button className="btn btn-outline btn-sm" onClick={() => changeLineItemStatus(r.lineItemId, "Live")}>Go Live</button>
        )}
        {r.status === "Live" && (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => changeLineItemStatus(r.lineItemId, "Paused")}>Pause</button>
            <button className="btn btn-outline btn-sm" onClick={() => changeLineItemStatus(r.lineItemId, "Completed")}>Complete</button>
          </>
        )}
        {r.status === "Paused" && (
          <>
            <button className="btn btn-outline btn-sm" onClick={() => changeLineItemStatus(r.lineItemId, "Live")}>Resume</button>
            <button className="btn btn-ghost btn-sm" onClick={() => changeLineItemStatus(r.lineItemId, "Completed")}>Complete</button>
          </>
        )}
        {(r.status === "Planned" || r.status === "Ordered") && (
          <button className="btn btn-primary btn-sm" onClick={() => setIoModal({ lineItemId: r.lineItemId })}><IcSend size={14} /> Generate IO</button>
        )}
        <button className="btn-icon" title="Delete" onClick={() => deleteLineItem(r.lineItemId)}><IcTrash size={14} /></button>
      </div>
    )},
  ];

  const ioColumns = [
    { key: "id", label: "IO", render: (r) => <span className="meta"><div className="strong">#{r.ioId}</div><div className="sb cell-muted">line item #{r.lineItemId}</div></span> },
    { key: "publisher", label: "Publisher", render: (r) => <span className="cell-muted">Publisher #{r.publisherId}</span> },
    { key: "orderDate", label: "Ordered", render: (r) => <span className="cell-muted cell-num">{r.orderDate}</span> },
    { key: "committedImpressions", label: "Committed", align: "right", mono: true, render: (r) => formatNumber(r.committedImpressions) },
    { key: "orderValue", label: "Value", align: "right", mono: true, render: (r) => <span className="strong">{formatCompact(r.orderValue, { money: true })}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", align: "right", render: (r) => (
      <div className="t-actions">
        {r.status === "Sent" && (
          <>
            <button className="btn btn-success btn-sm" onClick={() => changeIoStatus(r.ioId, "Confirmed")}><IcCheck size={14} /> Confirm</button>
            <button className="btn btn-danger btn-sm" onClick={() => changeIoStatus(r.ioId, "Rejected")}><IcClose size={14} /></button>
          </>
        )}
        {r.status === "Confirmed" && (
          <>
            <button className="btn btn-outline btn-sm" onClick={() => changeIoStatus(r.ioId, "Delivered")}>Mark Delivered</button>
            <button className="btn btn-ghost btn-sm" onClick={() => changeIoStatus(r.ioId, "Disputed")}>Dispute</button>
          </>
        )}
        {r.status === "Delivered" && (
          <button className="btn btn-ghost btn-sm" onClick={() => changeIoStatus(r.ioId, "Disputed")}>Dispute</button>
        )}
        {(r.status === "Rejected" || r.status === "Disputed") && <span className="cell-muted txt-sm">—</span>}
      </div>
    )},
  ];

  const tabs = [
    { key: "plans", label: "Media Plans", count: plans.length },
    { key: "lines", label: "Line Items", count: (lineItems || []).length },
    { key: "ios", label: "Insertion Orders", count: ios.length },
  ];

  const handlePlanSaved = () => { setPlanModal(null); reloadPlans(); };
  const handleLineItemSaved = () => { setLineItemModal(null); loadLineItems(); };
  const handleIoSaved = () => { setIoModal(null); reloadIos(); };

  return (
    <div className="page">
      <PageHeader
        Icon={IcMediaPlan}
        title="Media Plan & Insertion Orders"
        subtitle="Build multi-channel plans, schedule line items and track publisher confirmations"
        actions={
          <>
            {isMock && <MockFlag />}
            {tab === "plans" && (
              <button className="btn btn-primary btn-sm" onClick={() => setPlanModal({})}><IcPlus /> New media plan</button>
            )}
            {tab === "lines" && (
              <button className="btn btn-primary btn-sm" onClick={() => setLineItemModal({})}><IcPlus /> New line item</button>
            )}
            {tab === "ios" && (
              <button className="btn btn-primary btn-sm" onClick={() => setIoModal({})}><IcPlus /> Generate IO</button>
            )}
          </>
        }
      />

      <div className="toolbar"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {actionError && <div className="form-error" style={{ marginBottom: 12 }}>{actionError}</div>}

      <div className="card">
        {tab === "plans" && (lp ? <Loader /> : <DataTable columns={planColumns} rows={plans} />)}
        {tab === "lines" && (ll ? <Loader /> : <DataTable columns={lineColumns} rows={lineItems || []} />)}
        {tab === "ios" && (li ? <Loader /> : <DataTable columns={ioColumns} rows={ios} />)}
      </div>

      {planModal && (
        <Modal title={planModal.planId ? `Edit plan #${planModal.planId}` : "New media plan"} onClose={() => setPlanModal(null)}>
          <MediaPlanForm initial={planModal} onCancel={() => setPlanModal(null)} onSaved={handlePlanSaved} />
        </Modal>
      )}

      {lineItemModal && (
        <Modal title="New line item" onClose={() => setLineItemModal(null)}>
          <LineItemForm plans={plans} onCancel={() => setLineItemModal(null)} onSaved={handleLineItemSaved} />
        </Modal>
      )}

      {ioModal && (
        <Modal title="Generate insertion order" onClose={() => setIoModal(null)}>
          <InsertionOrderForm initial={ioModal} onCancel={() => setIoModal(null)} onSaved={handleIoSaved} />
        </Modal>
      )}
    </div>
  );
}
