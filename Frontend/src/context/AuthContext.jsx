/* ============================================================
   AdStudio · Auth context
   Holds the signed-in user, JWT and the eligibility list.
   On login it calls the dummy backend on :9090; if that is
   unreachable it signs in locally so the UI is fully usable.
   The eligibility list (GET /eligibilityList) decides which
   portals are unlocked vs. show the red "Not authorized" box.
   ============================================================ */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE, ENDPOINTS } from "../api/endpoints";
import { getToken, setToken, clearToken } from "../api/apiClient";
import { MOCK_ELIGIBILITY } from "../data/mockData";

const AuthContext = createContext(null);

const USER_KEY = "adstudio_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [eligibility, setEligibility] = useState([]);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityIsMock, setEligibilityIsMock] = useState(false);

  const isAuthenticated = !!getToken() && !!user;

  /* ---- fetch the eligibility list from :9090 (mock fallback) ---- */
  const loadEligibility = useCallback(async () => {
    setEligibilityLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.eligibilityList}`, {
        headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
      });
      if (!res.ok) throw new Error("no backend");
      const json = await res.json();
      const list = Array.isArray(json) ? json : json.data;
      setEligibility(list || MOCK_ELIGIBILITY);
      setEligibilityIsMock(false);
    } catch {
      // No backend on :9090 -> use the mock eligibility list.
      // setEligibility(MOCK_ELIGIBILITY);
      // setEligibilityIsMock(true);
      console.log("eligibility fetching error");
      
    } finally {
      setEligibilityLoading(false);
    }
  }, []);

  // Load eligibility once we have a session.
  useEffect(() => {
    if (isAuthenticated) loadEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  /* ---- login ---- */
  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/${ENDPOINTS.login}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("backend login failed");
      const json = await res.json();
      const payload = json.data || json;
      console.log("here ---->>> ",payload);
      
      setToken(payload.token || "live-session");
      const u = payload.user || {
        name: payload.name || "not fetched",
        email,
        role: payload.role || "not fetched",
        userId : payload.userId,
        token : payload.token
      };
      localStorage.setItem(USER_KEY, JSON.stringify(u)); // this is how we are storing into the browser local storage
      setUser(u);
      return { ok: true };
    } catch {
      // Dummy/offline login so the UI is usable without a backend.
      return { ok: true, demo: true };
    }
  }, []);

  /* ---- register ---- */
const register = useCallback(async (name, email, phone, role, password) => {
  try {
    const res = await fetch(`${API_BASE}/${ENDPOINTS.register}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, role, password }),
    });

    if (!res.ok) throw new Error("backend registration failed");

    const json = await res.json();
    const payload = json.data || json;

    return { ok: true };
 } catch (err) {
    // Backend on :9090 unreachable -> surface the error instead of faking a session.
     return { ok: false, error: err?.message || "Registration failed." };
  }
}, []);

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setEligibility([]);
  }, []);

  const isPortalAllowed = useCallback(
    (key) => eligibility.includes(key),
    [eligibility]
  );

  const value = {
    user,
    isAuthenticated,
    eligibility,
    eligibilityLoading,
    eligibilityIsMock,
    login,
    register,
    logout,
    isPortalAllowed,
    reloadEligibility: loadEligibility,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
