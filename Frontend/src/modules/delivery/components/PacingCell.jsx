import React from "react";

/**
 * Small colored percentage cell used in both the Delivery Records table
 * and the Pacing Alerts table.
 *
 *   < 90%   -> red   (under-delivering)
 *   90-110% -> green (on track)
 *   > 110%  -> amber (over-delivering)
 */
export default function PacingCell({ pct }) {
  const tone =
    pct < 90 ? "var(--red-600)" : pct > 110 ? "var(--amber-600)" : "var(--green-600)";

  return (
    <span className="strong" style={{ color: tone }}>
      {pct}%
    </span>
  );
}
