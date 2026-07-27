/* AdStudio · formatting helpers */

export function formatCurrency(n, currency = "USD") {
  if (n == null || isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

/* 1284500 -> $1.28M ; 184200000 -> 184.2M */
export function formatCompact(n, { money = false } = {}) {
  if (n == null || isNaN(n)) return "—";
  const abs = Math.abs(n);
  let out;
  if (abs >= 1e9) out = (n / 1e9).toFixed(1) + "B";
  else if (abs >= 1e6) out = (n / 1e6).toFixed(1) + "M";
  else if (abs >= 1e3) out = (n / 1e3).toFixed(1) + "K";
  else out = String(n);
  return money ? "$" + out : out;
}

export function formatNumber(n) {
  if (n == null || isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US").format(n);
}
