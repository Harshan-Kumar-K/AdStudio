import React, { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import { Loader, MockFlag } from "../../components/Loader.jsx";
import { useApiData } from "../../api/useApiData.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import {
  IcBell, IcCheckList, IcSend, IcAlert, IcCampaign, IcCreative,
  IcReceipt, IcMediaPlan, IcInbox,
} from "../../assets/icons.jsx";
import { MOCK_NOTIFICATIONS } from "../../data/mockData.js";

const CAT_META = {
  InsertionOrder: { Icon: IcSend, tone: "ai-blue" },
  Pacing: { Icon: IcAlert, tone: "ai-red" },
  Brief: { Icon: IcCampaign, tone: "ai-navy" },
  Creative: { Icon: IcCreative, tone: "ai-green" },
  Billing: { Icon: IcReceipt, tone: "ai-amber" },
  MediaPlan: { Icon: IcMediaPlan, tone: "ai-blue" },
};

export default function Notifications() {
  const { data, loading, isMock } = useApiData(ENDPOINTS.notifications, MOCK_NOTIFICATIONS);
  const [items, setItems] = useState(null);

  const list = items || data || [];
  const unread = list.filter((n) => n.status === "Unread").length;

  const markAll = () => setItems(list.map((n) => ({ ...n, status: "Read" })));
  const markOne = (id) => setItems(list.map((n) => (n.id === id ? { ...n, status: "Read" } : n)));

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
                <div className={`notif-item ${unreadCls}`} key={n.id} onClick={() => markOne(n.id)}>
                  <div className={`nf-ic ${meta.tone}`}><Icon /></div>
                  <div className="nf-body">
                    <div className="nf-msg" dangerouslySetInnerHTML={{ __html: n.message }} />
                    <div className="nf-meta">
                      <span className="cat">{n.category.replace(/([a-z])([A-Z])/g, "$1 $2")}</span>
                      <span>{n.createdDate}</span>
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
