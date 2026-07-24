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
  campaignBriefs: "campaign/briefs",
  targetAudiences: "campaign/target-audiences",

  // --- media plan & insertion orders ---
  mediaPlans: "api/media-plans",
  lineItems: "api/line-items",
  insertionOrders: "api/insertion-orders",

  // --- creative ---
  creativeAssets: "creative/assets",
  creativeApprovals: "creative/approvals",
  assetLinks: "creative/asset-links",

  // --- delivery & pacing ---
  deliveryRecords: "delivery/records",
  pacingAlerts: "delivery/pacing-alerts",

  // --- publisher ---
  publisherInbox: "publisher/io-inbox",
  publisherDeliveryReports: "publisher/delivery-reports",
  publisherInvoices: "publisher/invoices",

  // --- finance ---
  clientInvoices: "finance/client-invoices",
  publisherInvoiceRecon: "finance/publisher-invoices",
  paymentTracker: "finance/payment-tracker",

  // --- analytics ---
  analyticsKpis: "analytics/kpis",
  analyticsImpressions: "analytics/impressions-trend",
  analyticsSpendByChannel: "analytics/spend-by-channel",
  analyticsChannelPerf: "analytics/channel-performance",

  // --- notifications ---
  notifications: "notifications/list",

  // --- admin ---
  adminUsers: "admin/users",
  adminAuditLogs: "admin/audit-logs",
  adminChannels: "admin/channels",
  adminRateCards: "admin/rate-cards",
};

export default ENDPOINTS;
