/* ============================================================
   AdStudio · useApiData hook
   Fetches `${API_BASE}/<endpoint>` (port 9090) and unwraps the
   ApiResponse envelope. If the backend is unreachable (e.g. you are
   running the UI on its own), it transparently falls back to the
   mock data passed in, so every screen still renders real-looking
   content. Returns { data, loading, error, isMock, reload }.
   ============================================================ */

import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "./endpoints";
import { getToken } from "./apiClient";

export function useApiData(endpoint, mockData, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMock, setIsMock] = useState(false);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const token = getToken();
    fetch(`${API_BASE}/${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const payload =
          json && typeof json === "object" && "data" in json ? json.data : json;
        setData(payload);
        setIsMock(false);
        setLoading(false);
      })
      .catch(() => {
        // Backend not reachable -> use mock data after a short, realistic delay.
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
  }, [endpoint, ...deps]);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  return { data, loading, error, isMock, reload: load };
}

export default useApiData;
