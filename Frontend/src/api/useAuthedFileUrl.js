import { useEffect, useState } from "react";
import { getToken } from "./apiClient.js";

/**
 * The gateway requires a valid JWT (Authorization: Bearer <token>) on
 * /api/creative-assets/**, including the /file endpoint. A plain
 * <img src="..."> is loaded natively by the browser, which can't attach
 * that header - so it always gets a 401 and silently fails.
 *
 * This fetches the file manually (same auth header every other API call
 * in the app uses) and turns it into a local blob: URL that <img>/<video>/
 * <audio> can load normally.
 */
export function useAuthedFileUrl(url) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [failed, setFailed] = useState(false);
  // Exposed so callers can show *why* it failed (401 vs 404 vs network
  // error) instead of just silently swapping in a fallback icon - that
  // silence is exactly what makes "the image just doesn't show" so hard
  // to diagnose from the UI alone.
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    let objectUrl;
    let cancelled = false;
    setBlobUrl(null);
    setFailed(false);
    setError(null);

    const token = getToken();
    if (!token) {
      setFailed(true);
      setError("No auth token in localStorage - are you logged in?");
      return;
    }

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) {
          let detail = "";
          try {
            detail = await res.text();
          } catch {
            /* ignore */
          }
          throw new Error(`HTTP ${res.status}${detail ? ` - ${detail}` : ""}`);
        }
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        if (blob.size === 0) throw new Error("File endpoint returned an empty body");
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch((err) => {
        if (cancelled) return;
        setFailed(true);
        setError(err?.message || "Failed to load file");
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return { blobUrl, failed, error };
}

export default useAuthedFileUrl;