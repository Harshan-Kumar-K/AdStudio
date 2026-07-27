import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import { Loader, MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../hooks/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import apiClient from "../../api/apiClient.js";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  IcBell, IcCheckList, IcSend, IcAlert, IcCampaign, IcCreative,
  IcReceipt, IcMediaPlan, IcInbox,
} from "../../assets/icons.jsx";
import { MOCK_NOTIFICATIONS } from "../../data/mockData.js";

const CAT_META = {
  InsertionOrder: { Icon: IcSend, tone: "ai-blue" },
  LineItem: { Icon: IcMediaPlan, tone: "ai-blue" },
  Pacing: { Icon: IcAlert, tone: "ai-red" },
  Brief: { Icon: IcCampaign, tone: "ai-navy" },
  Creative: { Icon: IcCreative, tone: "ai-green" },
  Billing: { Icon: IcReceipt, tone: "ai-amber" },
  MediaPlan: { Icon: IcMediaPlan, tone: "ai-blue" },
};

// Backend sends createdDate as an ISO LocalDateTime string; mock data uses
// pre-baked strings like "12 min ago" — pass those through unchanged.
function timeAgo(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${seconds < 7200 ? "" : "s"} ago`;
  if (seconds < 172800) return "Yesterday";
  return `${Math.floor(seconds / 86400)} days ago`;
}

export default function Notifications() {
  const { user } = useAuth();
  const endpoint = `${ENDPOINTS.notifications}${user?.userId ? `?userId=${user.userId}` : ""}`;
  const { data, loading, isMock } = useApiData(endpoint, MOCK_NOTIFICATIONS, [user?.userId]);
  const [items, setItems] = useState(null);

  const list = (items || data || []).map((n) => ({ ...n, _id: n.notificationId ?? n.id }));
  const unread = list.filter((n) => n.status === "Unread").length;

  const markAll = () => {
    const unreadIds = list.filter((n) => n.status === "Unread").map((n) => n._id);
    setItems(list.map((n) => ({ ...n, status: "Read" })));
    unreadIds.forEach((id) => apiClient.put(`api/notifications/${id}/read`).catch(() => {}));
  };
  const markOne = (id) => {
    setItems(list.map((n) => (n._id === id ? { ...n, status: "Read" } : n)));
    apiClient.put(`api/notifications/${id}/read`).catch(() => {});
  };

  return (
    <div className="page">
      <PageHeader
        Icon={IcBell}
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread notification${unread > 1 ? "s" : ""}` : "You're all caught up"}
        actions={<>{isMock && <MockFlag />}<button className="btn btn-outline btn-sm" onClick={markAll}><IcCheckList /> Mark all read</button></>}
      />

      <div className="card">
        {loading ? <Loader /> : list.length === 0 ? (
          <div className="empty"><IcInbox /><div className="t">No notifications</div></div>
        ) : (
          <div className="notif-list">
            {list.map((n) => {
              const meta = CAT_META[n.category] || { Icon: IcBell, tone: "ai-blue" };
              const Icon = meta.Icon;
              const unreadCls = n.status === "Unread" ? "unread" : "";
              return (
                <div className={`notif-item ${unreadCls}`} key={n._id} onClick={() => markOne(n._id)}>
                  <div className={`nf-ic ${meta.tone}`}><Icon /></div>
                  <div className="nf-body">
                    <div className="nf-msg" dangerouslySetInnerHTML={{ __html: n.message }} />
                    <div className="nf-meta">
                      <span className="cat">{(n.category || "").replace(/([a-z])([A-Z])/g, "$1 $2")}</span>
                      <span>{timeAgo(n.createdDate)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
