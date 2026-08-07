# AdStudio — Frontend

A stylish React 18 frontend for **AdStudio**, a digital advertising & campaign
management platform (advertisers, brands, media planning, creative, delivery,
publishers, billing and analytics).

Built with **React 18 + plain CSS + JavaScript (JSX)**. No TypeScript, no UI
framework, no chart library — all components and charts are hand-built so the
look is fully custom (navy + white, with sky-blue accents and red/green only on
specific action buttons).

---

## 1. Run it

You need **Node.js 18+** and npm.

```bash
npm install      # install React 18, react-dom, react-router-dom, Vite
npm run dev      # start the dev server (opens http://localhost:5173)
```

Other scripts:

```bash
npm run build    # production build into dist/
npm run preview  # preview the production build
```

The app runs **stand-alone** — you do **not** need the backend to see it. Every
screen falls back to realistic sample data if no backend is found (see §3).

### Signing in

Sign-in is in **demo mode**: any email + password works. On the login page you
can also tap a **role chip** (Admin / Advertiser / Planner / Creative / Finance)
to prefill credentials. A friendly cartoon avatar is shown on the login/register
screens.

---

## 2. What's inside

Left sidebar lists **every portal/feature**, grouped into sections:

| Section | Portals |
|---|---|
| Overview | Dashboard |
| Campaign Management | Advertisers & Brands · Campaign Briefs · Media Planning · Creative Studio |
| Operations | Delivery & Pacing · Publisher Portal |
| Finance & Insights | Billing & Finance · Analytics & Reports |
| System | Notifications · Admin Console |

Each page maps to a module in the system design: IAM/Admin, Advertiser & Brand,
Campaign Planning, Media Plan & Insertion Orders, Creative Assets, Delivery &
Performance, Billing/Reconciliation, and Analytics — with tabs, status badges,
tables, KPI cards, progress bars and custom SVG charts.

---

## 3. Backend wiring (single port **9090**)

All API calls go to **one** base URL: `http://localhost:9090`. The endpoint
names are defined in `src/api/endpoints.js`. If a real backend answers, it is
used and unwraps the standard `{ success, data, message }` envelope; otherwise
the page quietly shows sample data and a small **"Sample data"** flag appears in
the page header.

Key endpoints (all relative to `http://localhost:9090/`):

```
eligibilityList                 -> which portals the user may open
auth/login, auth/register

dashboard/summary | spend-trend | channel-mix | recent-campaigns
advertiser/list  | advertiser/brands
campaign/briefs  | campaign/target-audiences
mediaplan/list   | mediaplan/line-items | mediaplan/insertion-orders
creative/assets  | creative/approvals   | creative/asset-links
delivery/records | delivery/pacing-alerts
publisher/io-inbox | publisher/delivery-reports | publisher/invoices
finance/client-invoices | finance/publisher-invoices | finance/payment-tracker
analytics/kpis | impressions-trend | spend-by-channel | channel-performance
notifications/list
admin/users | admin/audit-logs | admin/channels | admin/rate-cards
```

> Note: the team's Spring Boot backend defaults to port **8080**. This frontend
> intentionally calls **9090** as requested. Point them at the same port (run
> the backend on 9090, or change `API_BASE` in `src/api/endpoints.js`) when you
> wire them together.

---

## 4. Authorization — the red "Not authorized" box

On sign-in the app calls **`GET http://localhost:9090/eligibilityList`** and
stores the returned array of portal keys. For any portal **not** in that list,
the page shows a red **"You are not authorized for this portal"** box and **no
content** is rendered. Eligible portals open normally. Non-eligible portals also
show a small lock icon in the sidebar.

**Demo behaviour:** with no backend running, the app uses a mock eligibility
list that authorizes everything **except the Publisher Portal** — so you can see
the red gate immediately. Open **Publisher Portal** from the sidebar to view it.

To change what's unlocked, edit `MOCK_ELIGIBILITY` in
`src/data/mockData.js` (uncomment `"publisher"` to unlock the Publisher Portal,
or remove other keys to see more gates).

---

## 5. Folder structure

```
adstudio-frontend/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                 # entry: providers + router + global CSS
    ├── App.jsx                  # route table + per-portal eligibility guards
    ├── index.css                # design tokens (navy palette, fonts, resets)
    ├── api/
    │   ├── endpoints.js         # single base URL (:9090) + endpoint names
    │   └── apiClient.js         # fetch wrapper, JWT header, envelope unwrap
    ├── context/
    │   └── AuthContext.jsx      # auth + eligibility list (with mock fallback)
    ├── hooks/
    │   └── useApiData.js        # fetch-with-mock-fallback hook
    ├── config/
    │   └── portals.jsx          # portal registry (drives sidebar + routes)
    ├── data/
    │   └── mockData.js          # eligibility + sample data for every module
    ├── utils/
    │   └── format.js     
    ├── assets/
    │   ├── icons.jsx            # custom inline SVG icon set
    │   ├── Logo.jsx             # AdStudio logo mark
    │   └── LoginArt.jsx         # cartoon user avatar + login illustration
    ├── styles/
    │   ├── ui.css               # buttons, cards, tables, badges, forms, gate
    │   ├── layout.css           # sidebar + navbar + app shell
    │   ├── auth.css             # login / register split-panel
    │   └── pages.css            # dashboards, grids, charts, module pages
    ├── components/
    │   ├── Layout.jsx  Sidebar.jsx  Navbar.jsx
    │   ├── ProtectedRoute.jsx   # requires sign-in
    │   ├── PortalGuard.jsx      # eligibility gate -> NotAuthorized
    │   ├── NotAuthorized.jsx    # the red box
    │   ├── PageHeader.jsx  StatCard.jsx  StatusBadge.jsx
    │   ├── DataTable.jsx  Tabs.jsx  ProgressBar.jsx  Loader.jsx
    │   └── charts/              # BarChart, LineChart, DonutChart (SVG)
    └── modules/                 # one folder per business area
        ├── auth/        Login.jsx, Register.jsx
        ├── dashboard/   Dashboard.jsx
        ├── advertiser/  AdvertiserPortal.jsx
        ├── campaign/    CampaignBriefs.jsx
        ├── mediaplan/   MediaPlanning.jsx
        ├── creative/    CreativeStudio.jsx
        ├── delivery/    DeliveryTracking.jsx
        ├── publisher/   PublisherPortal.jsx
        ├── finance/     FinanceDashboard.jsx
        ├── analytics/   Analytics.jsx
        ├── notifications/ Notifications.jsx
        └── admin/       AdminConsole.jsx
```

---

## 6. Notes

- **JavaScript only.** All components are `.jsx`, all utilities `.js`. There is
  no TypeScript anywhere.
- **Styling** is plain CSS with CSS variables in `src/index.css`. Palette is
  navy-dominant on white; sky blue is used sparingly; green/red appear only on
  specific action buttons (e.g. Approve / Reject) and status badges.
- **Charts** are hand-built SVG (no chart library) so they stay on-palette and
  add no dependencies.
- **State**: the JWT and user are stored in `localStorage` (standard for a local
  React app). Sign out clears them.
- Built for **React 18** (`react@^18.3.1`) for long-term support.
