/* AdStudio · formatting helpers */



/* 1284500 -> $1.28M ; 184200000 -> 184.2M */
export function formatCompact(n, { money = false } = {}) {
  if (n == null || isNaN(n)) return "—";
  const abs = Math.abs(n);
  let out;
  if (abs >= 1e7) out = (n / 1e7).toFixed(1) + "Cr";      // Crore = 10,000,000
  else if (abs >= 1e5) out = (n / 1e5).toFixed(1) + "L";  // Lakh = 100,000
  else if (abs >= 1e3) out = (n / 1e3).toFixed(1) + "K";  // Thousand
  else out = String(n);
   return money ? "₹" + out : out;
}

export function formatNumber(n) {
  if (n == null || isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US").format(n);
}
