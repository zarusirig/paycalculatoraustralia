/** Percentage with up to `max` decimals and trailing zeros trimmed: 0.0545 → "5.45%", 0.012125 → "1.2125%". */
export function pctTrim(v: number, max = 2): string {
  const s = (v * 100).toFixed(max);
  return `${s.includes(".") ? s.replace(/0+$/, "").replace(/\.$/, "") : s}%`;
}

/** $1,500,000 → "$1.5m"; $10,400,000 → "$10.4m". */
export function millions(v: number): string {
  const m = v / 1_000_000;
  return `$${Number.isInteger(m) ? m : Number(m.toFixed(2))}m`;
}
