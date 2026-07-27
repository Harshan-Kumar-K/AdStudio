/* ============================================================
   AdStudio · apiRequest helper
   Generic fetch wrapper for POST / PUT / PATCH / DELETE calls.
   Attaches the auth token, JSON-encodes the body, unwraps the ;    ApiResponse envelope (same convention as useApiData), and
   throws a readable Error on non-2xx responses so callers can ;    catch() it and show a message to the user.
   ============================================================ */

import { getToken } from "./apiClient";


/**
 * @param {string} url - the full URL for the API endpoint
 * @param {string} [options.method="GET"] - GET | POST | PUT | PATCH | DELETE
 * @param {object} [options.body] - request payload, will be JSON.stringify'd
 * @returns {Promise<any>} unwrapped `data` field from the ApiResponse envelope
 */
export async function apiRequest(url, { method = "GET", body } = {}) {
  const token = getToken();

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Try to parse JSON even on error responses, since the backend
  // usually sends { message: "..." } alongside non-2xx statuses.
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    const message =
      (json && (json.message || json.error)) || `HTTP ${res.status}`;
    throw new Error(message);
  }

  const payload =
    json && typeof json === "object" && "data" in json ? json.data : json;
console.log("seee ----  ",payload);

  return payload;

}

export default apiRequest;