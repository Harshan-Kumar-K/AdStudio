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



// for analytics table
const CHANNELS = ["Display", "Video", "Social", "Search", "OOH"];

export function getChannelPerformance(lineItems = []) {
  // Group input by channel
  const grouped = lineItems.reduce((acc, item) => {
    const ch = item.channel;
    if (!acc[ch]) acc[ch] = [];
    acc[ch].push(item);
    return acc;
  }, {});

  return CHANNELS.map((channel) => {
    const items = grouped[channel];

    // No data for this channel at all (e.g. OOH) -> zero row
    if (!items || items.length === 0) {
      return { channel, impressions: "0", ctr: 0, cpm: 0, deliveryRate: 0 };
    }

    const totalImpressions = items.reduce(
      (sum, i) => sum + (i.plannedImpressions || 0),
      0
    );

    const totalPlannedBudget = items.reduce(
      (sum, i) => sum + (i.plannedBudget || 0),
      0
    );

    const avgCpm =
      items.reduce((sum, i) => sum + (i.cpm || 0), 0) / items.length;

    const completedCount = items.filter((i) => i.status === "Completed").length;
    const deliveryRate = Math.round((completedCount / items.length) * 100);

    return {
      channel,
      impressions: formatCompact(totalImpressions),
      ctr:  Number(totalPlannedBudget.toFixed(2)),
      cpm: Number(avgCpm.toFixed(2)),
      deliveryRate,
    };
  });
}


export function getSpendByChannel(lineItems) {
  // seed every channel with 0 first

  
  const totals = CHANNELS.reduce((acc, ch) => ({ ...acc, [ch]: 0 }), {});

  for (const { channel, plannedBudget } of lineItems || []) {
    if (totals[channel] === undefined) continue; // ignore unknown/unexpected channel values
    totals[channel] += plannedBudget || 0;
  }

  return CHANNELS.map((label) => ({
    label,
    value: Math.round(totals[label] * 100) / 100,
  }));
}