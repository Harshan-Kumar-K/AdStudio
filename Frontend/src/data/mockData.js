/* ============================================================
   AdStudio · Mock data
   Used as a fallback so every screen renders even with no backend
   running on :9090. When a real backend is connected it is ignored.
   ============================================================ */

export const MOCK_ELIGIBILITY = [
  "dashboard",
  "advertiser",
  "campaign",
  "mediaplan",
  "creative",
  "delivery",
  "publisher",   // <-- excluded on purpose to show the red gate. Uncomment to enable.
  "finance",
  "analytics",
  "notifications",
  "admin",
  "profile",
];

export const MOCK_USER = {
  name: "Ava Sinclair",
  email: "ava.sinclair@adstudio.io",
  role: "Ad Operations Admin",
  accountId: "ACC-1001",
};

/* ---------------- Dashboard ---------------- */
export const MOCK_DASHBOARD_SUMMARY = {
  activeCampaigns: 24,
  activeCampaignsTrend: 12.5,
  totalSpend: 1284500,
  totalSpendTrend: 8.2,
  impressions: 184200000,
  impressionsTrend: 15.4,
  avgCtr: 0.62,
  avgCtrTrend: -3.1,
  budgetPacing: 78,
  openAlerts: 5,
};

export const MOCK_SPEND_TREND = [
  { label: "Jan", value: 142 },
  { label: "Feb", value: 168 },
  { label: "Mar", value: 155 },
  { label: "Apr", value: 198 },
  { label: "May", value: 224 },
  { label: "Jun", value: 212 },
  { label: "Jul", value: 256 },
  { label: "Aug", value: 248 },
];

export const MOCK_CHANNEL_MIX = [
  { label: "Display", value: 32, color: "#1f4396" },
  { label: "Video", value: 26, color: "#3d8bff" },
  { label: "Social", value: 21, color: "#5fa3ff" },
  { label: "Search", value: 13, color: "#94c2ff" },
  { label: "OOH", value: 8, color: "#c9ddff" },
];

export const MOCK_RECENT_CAMPAIGNS = [
  { id: "CMP-2041", name: "Summer Splash 2025", brand: "AquaPure", spend: 184200, impressions: "24.1M", status: "Active" },
  { id: "CMP-2038", name: "Drive Electric", brand: "Voltio Motors", spend: 312000, impressions: "41.8M", status: "Active" },
  { id: "CMP-2035", name: "Back to Campus", brand: "Nimbus Tech", spend: 96400, impressions: "12.3M", status: "Completed" },
  { id: "CMP-2030", name: "Festive Glow", brand: "Lumière Beauty", spend: 142800, impressions: "18.9M", status: "Active" },
  { id: "CMP-2027", name: "Q3 Brand Lift", brand: "Heritage Bank", spend: 208600, impressions: "27.4M", status: "PendingApproval" },
];

/* ---------------- Advertisers & Brands ---------------- */
export const MOCK_ADVERTISERS = [
  { id: "ADV-1001", companyName: "Voltio Motors", industry: "Automotive", accountManager: "Marcus Reed", annualBudget: 4200000, currency: "USD", status: "Active" },
  { id: "ADV-1002", companyName: "Nimbus Tech", industry: "Consumer Electronics", accountManager: "Priya Nair", annualBudget: 2800000, currency: "USD", status: "Active" },
  { id: "ADV-1003", companyName: "Lumière Beauty", industry: "Cosmetics", accountManager: "Sofia Marchetti", annualBudget: 1950000, currency: "USD", status: "Active" },
  { id: "ADV-1004", companyName: "Heritage Bank", industry: "Financial Services", accountManager: "Daniel Cho", annualBudget: 3600000, currency: "USD", status: "Active" },
  { id: "ADV-1005", companyName: "AquaPure", industry: "Beverages", accountManager: "Marcus Reed", annualBudget: 1200000, currency: "USD", status: "Inactive" },
  { id: "ADV-1006", companyName: "Trailhead Outdoors", industry: "Retail", accountManager: "Priya Nair", annualBudget: 880000, currency: "USD", status: "Suspended" },
];

export const MOCK_BRANDS = [
  { id: "BRD-3001", advertiser: "Voltio Motors", brandName: "Voltio EV", category: "Electric Vehicles", allocatedBudget: 2400000, spentToDate: 1512000, status: "Active", color: "#1f4396" },
  { id: "BRD-3002", advertiser: "Voltio Motors", brandName: "Voltio Charge", category: "Charging Network", allocatedBudget: 900000, spentToDate: 410000, status: "Active", color: "#3d8bff" },
  { id: "BRD-3003", advertiser: "Nimbus Tech", brandName: "Nimbus Phone", category: "Smartphones", allocatedBudget: 1600000, spentToDate: 1184000, status: "Active", color: "#0f9a67" },
  { id: "BRD-3004", advertiser: "Nimbus Tech", brandName: "Nimbus Buds", category: "Audio", allocatedBudget: 700000, spentToDate: 224000, status: "Active", color: "#7c4dff" },
  { id: "BRD-3005", advertiser: "Lumière Beauty", brandName: "Lumière Skin", category: "Skincare", allocatedBudget: 1100000, spentToDate: 869000, status: "Active", color: "#e0518a" },
  { id: "BRD-3006", advertiser: "Heritage Bank", brandName: "Heritage Wealth", category: "Investments", allocatedBudget: 1800000, spentToDate: 612000, status: "Active", color: "#d9912b" },
  { id: "BRD-3007", advertiser: "AquaPure", brandName: "AquaPure Sparkling", category: "Sparkling Water", allocatedBudget: 480000, spentToDate: 451000, status: "Discontinued", color: "#0a9bb5" },
];

/* ---------------- Campaign briefs & audiences ---------------- */
export const MOCK_BRIEFS = [
  { id: "BRF-5001", campaignName: "Drive Electric", brand: "Voltio EV", objective: "Awareness", geography: "United States", startDate: "2025-06-01", endDate: "2025-09-30", totalBudget: 780000, channels: "Video, Display, Social", submittedBy: "Marcus Reed", status: "Active" },
  { id: "BRF-5002", campaignName: "Charge Ahead", brand: "Voltio Charge", objective: "Consideration", geography: "California, Texas", startDate: "2025-07-15", endDate: "2025-10-15", totalBudget: 320000, channels: "Search, Display", submittedBy: "Marcus Reed", status: "Approved" },
  { id: "BRF-5003", campaignName: "Flagship Launch", brand: "Nimbus Phone", objective: "Conversion", geography: "North America", startDate: "2025-08-01", endDate: "2025-11-30", totalBudget: 640000, channels: "Social, Video, Search", submittedBy: "Priya Nair", status: "Submitted" },
  { id: "BRF-5004", campaignName: "Festive Glow", brand: "Lumière Skin", objective: "Retention", geography: "United States, Canada", startDate: "2025-10-01", endDate: "2025-12-24", totalBudget: 420000, channels: "Social, Display", submittedBy: "Sofia Marchetti", status: "Active" },
  { id: "BRF-5005", campaignName: "Wealth Builder", brand: "Heritage Wealth", objective: "Consideration", geography: "United States", startDate: "2025-09-01", endDate: "2025-12-31", totalBudget: 560000, channels: "Display, Search, OOH", submittedBy: "Daniel Cho", status: "Draft" },
  { id: "BRF-5006", campaignName: "Summer Splash", brand: "AquaPure Sparkling", objective: "Awareness", geography: "United States", startDate: "2025-05-01", endDate: "2025-08-31", totalBudget: 240000, channels: "OOH, Social", submittedBy: "Marcus Reed", status: "Completed" },
  { id: "BRF-5007", campaignName: "Pure Hydration", brand: "AquaPure Sparkling", objective: "Conversion", geography: "Florida", startDate: "2025-06-15", endDate: "2025-08-15", totalBudget: 96000, channels: "Social", submittedBy: "Marcus Reed", status: "Rejected" },
];

export const MOCK_AUDIENCES = [
  { id: "AUD-7001", brief: "Drive Electric", ageRange: "25-44", gender: "All", interests: "EVs, Sustainability, Tech", geography: "United States", deviceType: "All", status: "Active" },
  { id: "AUD-7002", brief: "Charge Ahead", ageRange: "30-55", gender: "All", interests: "EV owners, Road trips", geography: "California, Texas", deviceType: "Mobile", status: "Active" },
  { id: "AUD-7003", brief: "Flagship Launch", ageRange: "18-34", gender: "All", interests: "Gadgets, Photography", geography: "North America", deviceType: "Mobile", status: "Active" },
  { id: "AUD-7004", brief: "Festive Glow", ageRange: "21-40", gender: "Female", interests: "Skincare, Beauty, Wellness", geography: "United States", deviceType: "Mobile", status: "Active" },
  { id: "AUD-7005", brief: "Wealth Builder", ageRange: "35-60", gender: "All", interests: "Investing, Retirement", geography: "United States", deviceType: "Desktop", status: "Archived" },
];

/* ---------------- Media plans / line items / IOs ---------------- */
export const MOCK_MEDIA_PLANS = [
  { id: "MP-9001", brief: "Drive Electric", planner: "Lena Vogt", totalBudget: 760000, channelMix: "Video 45% · Display 30% · Social 25%", startDate: "2025-06-01", endDate: "2025-09-30", status: "Active" },
  { id: "MP-9002", brief: "Charge Ahead", planner: "Lena Vogt", totalBudget: 310000, channelMix: "Search 60% · Display 40%", startDate: "2025-07-15", endDate: "2025-10-15", status: "Approved" },
  { id: "MP-9003", brief: "Festive Glow", planner: "Omar Haddad", totalBudget: 410000, channelMix: "Social 55% · Display 45%", startDate: "2025-10-01", endDate: "2025-12-24", status: "Active" },
  { id: "MP-9004", brief: "Flagship Launch", planner: "Omar Haddad", totalBudget: 620000, channelMix: "Social 40% · Video 35% · Search 25%", startDate: "2025-08-01", endDate: "2025-11-30", status: "PendingApproval" },
  { id: "MP-9005", brief: "Wealth Builder", planner: "Lena Vogt", totalBudget: 540000, channelMix: "Display 40% · Search 35% · OOH 25%", startDate: "2025-09-01", endDate: "2025-12-31", status: "Draft" },
];

export const MOCK_LINE_ITEMS = [
  { id: "LI-1201", plan: "MP-9001", channel: "Video", publisher: "StreamMax", format: "Pre-roll 15s", plannedImpressions: 18000000, cpm: 12.5, plannedBudget: 225000, flightStart: "2025-06-01", flightEnd: "2025-09-30", progress: 72, status: "Live" },
  { id: "LI-1202", plan: "MP-9001", channel: "Display", publisher: "AdMesh Network", format: "300x250", plannedImpressions: 30000000, cpm: 4.2, plannedBudget: 126000, flightStart: "2025-06-01", flightEnd: "2025-09-30", progress: 65, status: "Live" },
  { id: "LI-1203", plan: "MP-9001", channel: "Social", publisher: "Connectly", format: "In-feed Video", plannedImpressions: 14000000, cpm: 8.0, plannedBudget: 112000, flightStart: "2025-06-15", flightEnd: "2025-09-30", progress: 54, status: "Live" },
  { id: "LI-1204", plan: "MP-9002", channel: "Search", publisher: "FindIt", format: "Text Ad", plannedImpressions: 9000000, cpm: 6.5, plannedBudget: 58500, flightStart: "2025-07-15", flightEnd: "2025-10-15", progress: 20, status: "Ordered" },
  { id: "LI-1205", plan: "MP-9003", channel: "Social", publisher: "Connectly", format: "Carousel", plannedImpressions: 16000000, cpm: 7.4, plannedBudget: 118400, flightStart: "2025-10-01", flightEnd: "2025-12-24", progress: 0, status: "Planned" },
  { id: "LI-1206", plan: "MP-9003", channel: "Display", publisher: "AdMesh Network", format: "728x90", plannedImpressions: 22000000, cpm: 3.8, plannedBudget: 83600, flightStart: "2025-10-01", flightEnd: "2025-12-24", progress: 0, status: "Planned" },
  { id: "LI-1207", plan: "MP-9001", channel: "Video", publisher: "CineReach", format: "CTV 30s", plannedImpressions: 6000000, cpm: 28.0, plannedBudget: 168000, flightStart: "2025-06-01", flightEnd: "2025-08-31", progress: 88, status: "Live" },
];

export const MOCK_INSERTION_ORDERS = [
  { id: "IO-4401", lineItem: "LI-1201", publisher: "StreamMax", orderDate: "2025-05-22", startDate: "2025-06-01", endDate: "2025-09-30", committedImpressions: 18000000, orderValue: 225000, status: "Confirmed" },
  { id: "IO-4402", lineItem: "LI-1202", publisher: "AdMesh Network", orderDate: "2025-05-22", startDate: "2025-06-01", endDate: "2025-09-30", committedImpressions: 30000000, orderValue: 126000, status: "Confirmed" },
  { id: "IO-4403", lineItem: "LI-1203", publisher: "Connectly", orderDate: "2025-06-02", startDate: "2025-06-15", endDate: "2025-09-30", committedImpressions: 14000000, orderValue: 112000, status: "Delivered" },
  { id: "IO-4404", lineItem: "LI-1204", publisher: "FindIt", orderDate: "2025-07-08", startDate: "2025-07-15", endDate: "2025-10-15", committedImpressions: 9000000, orderValue: 58500, status: "Sent" },
  { id: "IO-4405", lineItem: "LI-1207", publisher: "CineReach", orderDate: "2025-05-20", startDate: "2025-06-01", endDate: "2025-08-31", committedImpressions: 6000000, orderValue: 168000, status: "Disputed" },
  { id: "IO-4406", lineItem: "LI-1205", publisher: "Connectly", orderDate: "2025-09-18", startDate: "2025-10-01", endDate: "2025-12-24", committedImpressions: 16000000, orderValue: 118400, status: "Rejected" },
];

/* ---------------- Creative ---------------- */
export const MOCK_CREATIVE_ASSETS = [
  { id: "AST-6001", name: "Drive Electric Hero", brand: "Voltio EV", format: "Video", dimensions: "1920x1080", fileSizeKB: 8420, version: 3, uploadedBy: "Theo Klein", status: "Approved" },
  { id: "AST-6002", name: "EV Banner Leaderboard", brand: "Voltio EV", format: "Banner", dimensions: "728x90", fileSizeKB: 142, version: 2, uploadedBy: "Theo Klein", status: "Approved" },
  { id: "AST-6003", name: "Charge Network Map", brand: "Voltio Charge", format: "RichMedia", dimensions: "300x600", fileSizeKB: 980, version: 1, uploadedBy: "Mara Lopez", status: "PendingApproval" },
  { id: "AST-6004", name: "Nimbus Phone Reveal", brand: "Nimbus Phone", format: "Video", dimensions: "1080x1080", fileSizeKB: 6240, version: 1, uploadedBy: "Theo Klein", status: "PendingApproval" },
  { id: "AST-6005", name: "Festive Glow Carousel", brand: "Lumière Skin", format: "Native", dimensions: "1080x1350", fileSizeKB: 540, version: 4, uploadedBy: "Mara Lopez", status: "Approved" },
  { id: "AST-6006", name: "Wealth Podcast Spot", brand: "Heritage Wealth", format: "Audio", dimensions: "—", fileSizeKB: 3100, version: 1, uploadedBy: "Sasha Bright", status: "Rejected" },
  { id: "AST-6007", name: "Summer Splash Text", brand: "AquaPure Sparkling", format: "Text", dimensions: "—", fileSizeKB: 4, version: 2, uploadedBy: "Sasha Bright", status: "Archived" },
  { id: "AST-6008", name: "Buds In-feed", brand: "Nimbus Buds", format: "Banner", dimensions: "300x250", fileSizeKB: 96, version: 1, uploadedBy: "Mara Lopez", status: "Draft" },
];

export const MOCK_APPROVALS = [
  { id: "APR-8001", asset: "Drive Electric Hero", reviewer: "Nadia Frost", reviewDate: "2025-05-28", decision: "Approved", feedback: "Strong open. Approved for all placements.", status: "Completed" },
  { id: "APR-8002", asset: "Charge Network Map", reviewer: "Nadia Frost", reviewDate: "—", decision: "—", feedback: "Awaiting brand sign-off.", status: "Pending" },
  { id: "APR-8003", asset: "Nimbus Phone Reveal", reviewer: "Victor Hale", reviewDate: "—", decision: "—", feedback: "In review with legal.", status: "Pending" },
  { id: "APR-8004", asset: "Festive Glow Carousel", reviewer: "Nadia Frost", reviewDate: "2025-09-12", decision: "Approved", feedback: "v4 resolves the logo spacing.", status: "Completed" },
  { id: "APR-8005", asset: "Wealth Podcast Spot", reviewer: "Victor Hale", reviewDate: "2025-08-30", decision: "Rejected", feedback: "Disclaimer audio is below required length.", status: "Completed" },
  { id: "APR-8006", asset: "EV Banner Leaderboard", reviewer: "Nadia Frost", reviewDate: "2025-05-29", decision: "RevisionRequired", feedback: "Increase CTA contrast for AA compliance.", status: "Completed" },
];

export const MOCK_ASSET_LINKS = [
  { id: "LNK-2201", asset: "Drive Electric Hero", lineItem: "LI-1201", channel: "Video", linkedDate: "2025-05-30", status: "Active" },
  { id: "LNK-2202", asset: "EV Banner Leaderboard", lineItem: "LI-1202", channel: "Display", linkedDate: "2025-05-30", status: "Active" },
  { id: "LNK-2203", asset: "Festive Glow Carousel", lineItem: "LI-1205", channel: "Social", linkedDate: "2025-09-20", status: "Active" },
  { id: "LNK-2204", asset: "EV Banner Leaderboard", lineItem: "LI-1206", channel: "Display", linkedDate: "2025-09-21", status: "Replaced" },
];

/* ---------------- Delivery & pacing ---------------- */
export const MOCK_DELIVERY_RECORDS = [
  { id: "DR-3301", lineItem: "LI-1201", io: "IO-4401", reportingDate: "2025-08-10", deliveredImpressions: 12960000, clicks: 90720, spend: 162000, pacing: 102, source: "PublisherReport", status: "Accepted" },
  { id: "DR-3302", lineItem: "LI-1202", io: "IO-4402", reportingDate: "2025-08-10", deliveredImpressions: 19500000, clicks: 58500, spend: 81900, pacing: 96, source: "PublisherReport", status: "Accepted" },
  { id: "DR-3303", lineItem: "LI-1203", io: "IO-4403", reportingDate: "2025-08-10", deliveredImpressions: 7560000, clicks: 60480, spend: 60480, pacing: 84, source: "PublisherReport", status: "PendingVerification" },
  { id: "DR-3304", lineItem: "LI-1207", io: "IO-4405", reportingDate: "2025-08-09", deliveredImpressions: 5280000, clicks: 21120, spend: 147840, pacing: 118, source: "InternalEntry", status: "Disputed" },
  { id: "DR-3305", lineItem: "LI-1204", io: "IO-4404", reportingDate: "2025-08-08", deliveredImpressions: 1800000, clicks: 27000, spend: 11700, pacing: 67, source: "PublisherReport", status: "Accepted" },
];

export const MOCK_PACING_ALERTS = [
  { id: "PA-1101", lineItem: "LI-1204", channel: "Search", alertType: "UnderDelivery", alertDate: "2025-08-08", pacingPercent: 67, status: "Open" },
  { id: "PA-1102", lineItem: "LI-1207", channel: "Video", alertType: "OverDelivery", alertDate: "2025-08-09", pacingPercent: 118, status: "Open" },
  { id: "PA-1103", lineItem: "LI-1203", channel: "Social", alertType: "FlightEndApproaching", alertDate: "2025-08-12", pacingPercent: 84, status: "Actioned" },
  { id: "PA-1104", lineItem: "LI-1201", channel: "Video", alertType: "BudgetExhausted", alertDate: "2025-08-11", pacingPercent: 102, status: "Open" },
  { id: "PA-1105", lineItem: "LI-1202", channel: "Display", alertType: "UnderDelivery", alertDate: "2025-08-05", pacingPercent: 88, status: "Closed" },
];

/* ---------------- Publisher portal ---------------- */
export const MOCK_PUBLISHER_INBOX = [
  { id: "IO-4404", campaign: "Charge Ahead", advertiser: "Voltio Motors", format: "Text Ad", committedImpressions: 9000000, orderValue: 58500, startDate: "2025-07-15", endDate: "2025-10-15", status: "Sent" },
  { id: "IO-4407", campaign: "Wealth Builder", advertiser: "Heritage Bank", format: "300x600", committedImpressions: 12000000, orderValue: 72000, startDate: "2025-09-01", endDate: "2025-12-31", status: "Sent" },
  { id: "IO-4401", campaign: "Drive Electric", advertiser: "Voltio Motors", format: "Pre-roll 15s", committedImpressions: 18000000, orderValue: 225000, startDate: "2025-06-01", endDate: "2025-09-30", status: "Confirmed" },
];

export const MOCK_PUBLISHER_DELIVERY = [
  { id: "DR-3301", io: "IO-4401", reportingDate: "2025-08-10", impressions: 12960000, clicks: 90720, spend: 162000, status: "Accepted" },
  { id: "DR-3310", io: "IO-4401", reportingDate: "2025-07-10", impressions: 8100000, clicks: 56700, spend: 101250, status: "Accepted" },
];

export const MOCK_PUBLISHER_INVOICES = [
  { id: "PINV-7701", io: "IO-4401", amount: 162000, deliveredValue: 162000, variance: 0, receivedDate: "2025-08-12", status: "Reconciled" },
  { id: "PINV-7702", io: "IO-4405", amount: 168000, deliveredValue: 147840, variance: 20160, receivedDate: "2025-08-11", status: "Discrepancy" },
];

/* ---------------- Finance ---------------- */
export const MOCK_CLIENT_INVOICES = [
  { id: "CINV-5501", advertiser: "Voltio Motors", campaign: "Drive Electric", period: "Jul 2025", amount: 263250, commission: 39487, netBillable: 223762, issuedDate: "2025-08-01", status: "Issued" },
  { id: "CINV-5502", advertiser: "Lumière Beauty", campaign: "Festive Glow", period: "Jul 2025", amount: 118400, commission: 17760, netBillable: 100640, issuedDate: "2025-08-01", status: "Paid" },
  { id: "CINV-5503", advertiser: "Heritage Bank", campaign: "Wealth Builder", period: "Jul 2025", amount: 72000, commission: 10800, netBillable: 61200, issuedDate: "2025-08-01", status: "Overdue" },
  { id: "CINV-5504", advertiser: "Nimbus Tech", campaign: "Flagship Launch", period: "Jul 2025", amount: 96000, commission: 14400, netBillable: 81600, issuedDate: "—", status: "Draft" },
  { id: "CINV-5505", advertiser: "AquaPure", campaign: "Summer Splash", period: "Jun 2025", amount: 54200, commission: 8130, netBillable: 46070, issuedDate: "2025-07-01", status: "Disputed" },
];

export const MOCK_PUBLISHER_RECON = [
  { id: "PINV-7701", publisher: "StreamMax", io: "IO-4401", invoiceAmount: 162000, deliveredValue: 162000, variance: 0, receivedDate: "2025-08-12", status: "Reconciled" },
  { id: "PINV-7702", publisher: "CineReach", io: "IO-4405", invoiceAmount: 168000, deliveredValue: 147840, variance: 20160, receivedDate: "2025-08-11", status: "Discrepancy" },
  { id: "PINV-7703", publisher: "AdMesh Network", io: "IO-4402", invoiceAmount: 81900, deliveredValue: 81900, variance: 0, receivedDate: "2025-08-10", status: "Paid" },
  { id: "PINV-7704", publisher: "Connectly", io: "IO-4403", invoiceAmount: 62000, deliveredValue: 60480, variance: 1520, receivedDate: "2025-08-13", status: "Received" },
  { id: "PINV-7705", publisher: "FindIt", io: "IO-4404", invoiceAmount: 11700, deliveredValue: 11700, variance: 0, receivedDate: "2025-08-09", status: "Reconciled" },
];

export const MOCK_PAYMENT_TRACKER = {
  totalBilled: 1284500,
  collected: 968200,
  outstanding: 256100,
  overdue: 60200,
  paidCount: 18,
  overdueCount: 3,
  disputedCount: 2,
};

/* ---------------- Analytics ---------------- */
export const MOCK_ANALYTICS_KPIS = {
  totalImpressions: 184200000,
  totalClicks: 1142040,
  ctr: 0.62,
  totalSpend: 1284500,
  cpm: 6.97,
  cpc: 1.12,
  deliveryRate: 94.3,
  agencyRoi: 3.4,
};

export const MOCK_IMPRESSIONS_TREND = [
  { label: "W1", value: 18.2 },
  { label: "W2", value: 22.6 },
  { label: "W3", value: 21.1 },
  { label: "W4", value: 26.8 },
  { label: "W5", value: 28.4 },
  { label: "W6", value: 24.9 },
  { label: "W7", value: 31.2 },
  { label: "W8", value: 30.7 },
];

export const MOCK_SPEND_BY_CHANNEL = [
  { label: "Display", value: 392 },
  { label: "Video", value: 561 },
  { label: "Social", value: 248 },
  { label: "Search", value: 84 },
  { label: "OOH", value: 96 },
];

export const MOCK_CHANNEL_PERF = [
  { channel: "Display", impressions: "62.4M", ctr: 0.31, cpm: 4.1, deliveryRate: 96 },
  { channel: "Video", impressions: "48.9M", ctr: 0.74, cpm: 14.2, deliveryRate: 92 },
  { channel: "Social", impressions: "44.1M", ctr: 0.88, cpm: 7.6, deliveryRate: 95 },
  { channel: "Search", impressions: "16.2M", ctr: 1.42, cpm: 6.5, deliveryRate: 89 },
  { channel: "OOH", impressions: "12.6M", ctr: 0.0, cpm: 7.9, deliveryRate: 99 },
];

/* ---------------- Notifications ---------------- */
export const MOCK_NOTIFICATIONS = [
  { id: "NTF-1", message: "Insertion order <b>IO-4401</b> was confirmed by StreamMax.", category: "InsertionOrder", status: "Unread", createdDate: "12 min ago" },
  { id: "NTF-2", message: "Pacing alert: <b>LI-1204</b> is under-delivering at 67%.", category: "Pacing", status: "Unread", createdDate: "1 hour ago" },
  { id: "NTF-3", message: "Campaign brief <b>Flagship Launch</b> was submitted for approval.", category: "Brief", status: "Unread", createdDate: "3 hours ago" },
  { id: "NTF-4", message: "Creative <b>Festive Glow Carousel</b> v4 was approved.", category: "Creative", status: "Read", createdDate: "Yesterday" },
  { id: "NTF-5", message: "Publisher invoice <b>PINV-7702</b> flagged as a discrepancy.", category: "Billing", status: "Read", createdDate: "Yesterday" },
  { id: "NTF-6", message: "Client invoice <b>CINV-5503</b> is now overdue.", category: "Billing", status: "Read", createdDate: "2 days ago" },
  { id: "NTF-7", message: "Media plan <b>MP-9004</b> is pending your approval.", category: "MediaPlan", status: "Read", createdDate: "2 days ago" },
];

/* ---------------- Admin ---------------- */
export const MOCK_USERS = [
  { id: "USR-1", name: "Ava Sinclair", role: "Admin", email: "ava.sinclair@adstudio.io", phone: "+1 415 555 0110", accountId: "ACC-1001", status: "Active" },
  { id: "USR-2", name: "Marcus Reed", role: "AdvertiserBrand", email: "marcus.reed@adstudio.io", phone: "+1 415 555 0144", accountId: "ACC-1002", status: "Active" },
  { id: "USR-3", name: "Lena Vogt", role: "MediaPlanner", email: "lena.vogt@adstudio.io", phone: "+1 212 555 0173", accountId: "ACC-1003", status: "Active" },
  { id: "USR-4", name: "Theo Klein", role: "CreativeManager", email: "theo.klein@adstudio.io", phone: "+1 312 555 0188", accountId: "ACC-1004", status: "Active" },
  { id: "USR-5", name: "StreamMax Ops", role: "Publisher", email: "ops@streammax.tv", phone: "+1 646 555 0192", accountId: "ACC-2001", status: "Active" },
  { id: "USR-6", name: "Daniel Cho", role: "Finance", email: "daniel.cho@adstudio.io", phone: "+1 415 555 0205", accountId: "ACC-1005", status: "Inactive" },
  { id: "USR-7", name: "Priya Nair", role: "AdvertiserBrand", email: "priya.nair@adstudio.io", phone: "+1 408 555 0218", accountId: "ACC-1006", status: "Suspended" },
];

export const MOCK_AUDIT_LOGS = [
  { id: "AUD-9001", user: "Marcus Reed", action: "APPROVE_BRIEF", entityType: "CampaignBrief", timestamp: "2025-08-12 14:32" },
  { id: "AUD-9002", user: "Lena Vogt", action: "GENERATE_IO", entityType: "InsertionOrder", timestamp: "2025-08-12 13:08" },
  { id: "AUD-9003", user: "Theo Klein", action: "UPLOAD_ASSET", entityType: "CreativeAsset", timestamp: "2025-08-12 11:51" },
  { id: "AUD-9004", user: "Daniel Cho", action: "ISSUE_INVOICE", entityType: "ClientInvoice", timestamp: "2025-08-12 10:22" },
  { id: "AUD-9005", user: "Ava Sinclair", action: "SUSPEND_USER", entityType: "User", timestamp: "2025-08-11 17:40" },
  { id: "AUD-9006", user: "StreamMax Ops", action: "CONFIRM_IO", entityType: "InsertionOrder", timestamp: "2025-08-11 16:05" },
];

export const MOCK_CHANNELS = [
  { name: "Display", note: "Banner & rich media", icon: "banner" },
  { name: "Video", note: "Pre/mid-roll, CTV", icon: "video" },
  { name: "Social", note: "In-feed, stories", icon: "native" },
  { name: "Search", note: "Text & shopping", icon: "text" },
  { name: "OOH", note: "Billboards, transit", icon: "rich" },
  { name: "Print", note: "Magazine & press", icon: "text" },
  { name: "Radio", note: "Spot & sponsorship", icon: "audio" },
];

export const MOCK_RATE_CARDS = [
  { publisher: "StreamMax", channel: "Video", format: "Pre-roll 15s", baseCpm: 12.5, floorCpm: 9.0 },
  { publisher: "CineReach", channel: "Video", format: "CTV 30s", baseCpm: 28.0, floorCpm: 22.0 },
  { publisher: "AdMesh Network", channel: "Display", format: "300x250", baseCpm: 4.2, floorCpm: 2.8 },
  { publisher: "Connectly", channel: "Social", format: "In-feed Video", baseCpm: 8.0, floorCpm: 5.5 },
  { publisher: "FindIt", channel: "Search", format: "Text Ad", baseCpm: 6.5, floorCpm: 4.0 },
];

export default {};
