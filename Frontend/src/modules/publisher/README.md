# Publisher Portal — split into components

## Where to put these files

Drop this whole folder in as `src/pages/publisher/` (same depth as the
original `PublisherPortal.jsx` you had), so the existing relative imports
(`../../components/...`, `../../api/...`, `../../assets/...`, `../../data/...`)
keep resolving correctly. If your folder is nested differently, just adjust
those `../../` prefixes.

## Files

| File | Responsibility |
|---|---|
| `PublisherPortal.jsx` | Top-level container. Fetches data for all 3 tabs with `useApiData`, holds the active tab and the "show form" state, renders the modal. |
| `PublisherInboxTab.jsx` | IO inbox table. Wires **Confirm** / **Reject** buttons to the backend via `apiClient`. |
| `DeliveryReportsTab.jsx` | Read-only delivery reports table. |
| `PublisherInvoicesTab.jsx` | Read-only invoices table. |
| `DeliveryReportForm.jsx` | The input-taking form (modal) used to submit a new delivery report. Kept in its own file so it can be reused or dropped into another screen later. |
| `index.js` | Barrel file — lets you do `import { PublisherPortal } from "./pages/publisher"`. |

## Backend endpoints these components expect

Your existing `ENDPOINTS.publisherInbox`, `ENDPOINTS.publisherDeliveryReports`,
and `ENDPOINTS.publisherInvoices` are reused as-is for the `GET` list calls
(that part was already working in your original file).

Two new calls were added, both using the `apiClient` you already have:

1. **Confirm / reject an insertion order** (`PublisherInboxTab.jsx`)
   ```
   POST {API_BASE}/{ENDPOINTS.publisherInbox}/{id}/confirm
   POST {API_BASE}/{ENDPOINTS.publisherInbox}/{id}/reject
   ```
   In Spring Boot terms, something like:
   ```java
   @PostMapping("/publisher/inbox/{id}/confirm")
   @PostMapping("/publisher/inbox/{id}/reject")
   ```

2. **Create a delivery report** (`DeliveryReportForm.jsx`)
   ```
   POST {API_BASE}/{ENDPOINTS.publisherDeliveryReports}
   Body: { io, reportingDate, impressions, clicks, spend }
   ```
   ```java
   @PostMapping("/publisher/delivery-reports")
   public ApiResponse<DeliveryReportDto> create(@RequestBody DeliveryReportRequest req) { ... }
   ```

If your real route names differ, they only need to change in
`PublisherInboxTab.jsx` and `DeliveryReportForm.jsx` — everything else is
unaffected.

## Notes

- The modal in `DeliveryReportForm.jsx` uses inline styles for the
  overlay/box positioning (so it renders correctly even before you've
  added dedicated CSS for it), but reuses your existing `btn` and `card`
  classes for buttons and the panel, so it stays visually consistent with
  the rest of the app.
- Both `PublisherInboxTab` and `DeliveryReportForm` show an inline error
  message on failed requests instead of crashing the page — swap in your
  own toast/notification component if you have one.
- After a successful Confirm/Reject or a successful report submission,
  the relevant tab is refreshed via `useApiData`'s `reload()` — no full
  page reload needed.
