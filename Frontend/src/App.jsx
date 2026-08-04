import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PortalGuard from "./components/PortalGuard.jsx";

import Login from "./modules/auth/Login.jsx";
import Register from "./modules/auth/Register.jsx";
import Dashboard from "./modules/dashboard/Dashboard.jsx";
import AdvertiserPortal from "./modules/advertiser/AdvertiserPortal.jsx";
import CampaignBriefs from "./modules/campaign/CampaignBriefs.jsx";
import MediaPlanning from "./modules/mediaplan/MediaPlanning.jsx";
import CreativeStudio from "./modules/creative/CreativeStudio.jsx";
import DeliveryTracking from "./modules/delivery/DeliveryTracking.jsx";
import PublisherPortal from "./modules/publisher/PublisherPortal.jsx";
import FinanceDashboard from "./modules/finance/FinanceDashboard.jsx";
import Analytics from "./modules/analytics/Analytics.jsx";
import Notifications from "./modules/notifications/Notifications.jsx";
import AdminConsole from "./modules/admin/AdminConsole.jsx";
import UserProfileCard from "./modules/profile/UserProfileCard.jsx";

/* Wrap a page in its eligibility gate. Portals not present in the
   /eligibilityList response render the red "Not authorized" box. */
const guard = (key, El) => (
  <PortalGuard portalKey={key}>
    <El />
  </PortalGuard>
);

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protected app shell */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={guard("dashboard", Dashboard)} />
        <Route path="/advertisers" element={guard("advertiser", AdvertiserPortal)} />
        <Route path="/campaigns" element={guard("campaign", CampaignBriefs)} />
        <Route path="/media-plans" element={guard("mediaplan", MediaPlanning)} />
        <Route path="/creative" element={guard("creative", CreativeStudio)} />
        <Route path="/delivery" element={guard("delivery", DeliveryTracking)} />
        <Route path="/publisher" element={guard("publisher", PublisherPortal)} />
        <Route path="/finance" element={guard("finance", FinanceDashboard)} />
        <Route path="/analytics" element={guard("analytics", Analytics)} />
        <Route path="/notifications" element={guard("notifications", Notifications)} />
        <Route path="/admin" element={guard("admin", AdminConsole)} />
        <Route path="/profile" element={guard("profile", UserProfileCard)} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
