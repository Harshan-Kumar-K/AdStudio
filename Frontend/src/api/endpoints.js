/* ============================================================
   AdStudio · API endpoints
   Every backend call goes to a SINGLE port: 9090.
   These are the dummy endpoint names the frontend talks to.
   If a real backend is running on 9090 it is used automatically;
   otherwise each page falls back to local mock data (see hooks/useApiData).
   ============================================================ */

export const API_BASE = "http://localhost:9090";

export const ENDPOINTS = {
  // --- access / auth ---
  eligibilityList: "api/auth/eligibility-list", // -> ["dashboard","advertiser", ...]
  login: "api/auth/login",
  register: "api/auth/register",

  // --- dashboard (overview) ---
  dashboardSummary: "dashboard/summary",
  dashboardSpendTrend: "dashboard/spend-trend",
  dashboardChannelMix: "dashboard/channel-mix",
  recentCampaigns: "dashboard/recent-campaigns",

  // --- advertiser & brand ---
  advertisers: "api/advertisers",
  brands: "api/brands",

  // --- campaign planning ---
  campaignBriefs: "api/campaign-briefs",
  targetAudiences: "api/target-audiences",

  // --- media plan & insertion orders ---
  mediaPlans: "api/media-plans",
  lineItems: "api/line-items/all",
  insertionOrders: "api/insertion-orders",

  // --- creative ---
  creativeAssets: "api/creative-assets",
  creativeApprovals: "api/creative-assets/link-status",
  assetLinks: "api/asset-links",

  // --- delivery & pacing ---
  deliveryRecords: "api/delivery-records",
  pacingAlerts: "api/pacing-alerts",

  // --- publisher ---
  // publisherInbox: "publisher/io-inbox",
  // publisherDeliveryReports: "publisher/delivery-reports",
  publisherInvoices: "api/publisher-invoices",

  // --- finance ---
  clientInvoices: "api/client-invoices",
  publisherInvoiceRecon: "api/publisher-invoices",
  paymentTracker: "api/client-invoices/payment-tracker",

  // --- analytics ---
  analyticsKpis: "analytics/kpis",
  analyticsImpressions: "analytics/impressions-trend",
  analyticsSpendByChannel: "analytics/spend-by-channel",
  analyticsChannelPerf: "analytics/channel-performance",

  // --- notifications (real: notification service via gateway) ---
  // both need a userId query param appended by the caller, e.g.
  // `${ENDPOINTS.notifications}?userId=${user.userId}`
  notifications: "api/notifications",
  notificationsUnreadCount: "api/notifications/unread-count",

  // --- admin ---
  adminUsers: "api/auth/users",
  adminAuditLogs: "api/audit-logs",
  adminChannels: "admin/channels",
};

export default ENDPOINTS;
