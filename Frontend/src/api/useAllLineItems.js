/* ============================================================
   AdStudio · useAllLineItems hook
   ------------------------------------------------------------
   The Media Planner backend only exposes line items *scoped to a
   single plan*:
       GET /api/media-plans/{planId}/line-items
   There is no flat "all line items" endpoint - ENDPOINTS.lineItems
   ("api/line-items") only supports /{id}, /{id}/status, etc. for a
   single line item, not a collection GET. Calling it as a list
   endpoint 404s and silently falls back to mock data.

   Creative (asset -> line item linking) and Delivery (delivery
   records) both need a real, single source of truth for "which line
   items actually exist", sourced from the media planner - not two
   disconnected mock lists that happen to look similar.

   This hook:
     1. Fetches every media plan (GET /api/media-plans, paged - we
        ask for a large page size so we don't have to page through).
     2. Fetches each plan's line items in parallel.
     3. Flattens them into one array, tagging each with its planId,
        so both modules can present the exact same dropdown contents.

   Falls back to `mockData` if the media-plan service is unreachable,
   same contract as useApiData.
   ============================================================ */

import { useState, useEffect, useCallback } from "react";
import { API_BASE, ENDPOINTS } from "./endpoints.js";
import { getToken } from "./apiClient.js";

function unwrap(json) {
  return json && typeof json === "object" && "data" in json ? json.data : json;
}

function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.content)) return payload.content;
  return [];
}

export function useAllLineItems(mockData = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);

    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    async function run() {
      const plansRes = await fetch(`${API_BASE}/${ENDPOINTS.mediaPlans}?size=200`, { headers });
      if (!plansRes.ok) throw new Error(`HTTP ${plansRes.status}`);
      const plans = toArray(unwrap(await plansRes.json()));

      const perPlan = await Promise.all(
        plans.map(async (plan) => {
          const planId = plan.planId ?? plan.id;
          if (planId == null) return [];
          try {
            const res = await fetch(`${API_BASE}/api/media-plans/${planId}/line-items`, { headers });
            if (!res.ok) return [];
            const items = toArray(unwrap(await res.json()));
            return items.map((li) => ({ ...li, planId }));
          } catch {
            return [];
          }
        })
      );

      return perPlan.flat();
    }

    run()
      .then((flat) => {
        if (cancelled) return;
        setData(flat);
        setIsMock(false);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        const t = setTimeout(() => {
          if (cancelled) return;
          setData(mockData);
          setIsMock(true);
          setLoading(false);
        }, 350);
        return () => clearTimeout(t);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  return { data, loading, isMock, reload: load };
}

export default useAllLineItems;