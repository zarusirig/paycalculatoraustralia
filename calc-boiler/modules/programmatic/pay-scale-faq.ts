// "Which published pay scales pay about $X a year?" — the FAQ that goes with
// PayScaleSection on /hourly-to-salary/[rate]/ and /salary-to-hourly/[amount]/
// (10 Oct 2026). Takes the table's own rows, so the answer lists exactly them
// (as the award question lists the award table's rows).

import { formatAUD } from "@/lib/constants/australian-tax";
import type { PayScaleMatch } from "@/lib/data/pay-scale-index";
import type { FaqItem } from "@/lib/faq";

export function payScaleFaq(points: readonly PayScaleMatch[], annual: number, halfWindow: number): FaqItem | null {
  if (points.length === 0) return null;
  const a = formatAUD(annual);
  return {
    q: `Which published pay scales pay about ${a} a year?`,
    a: `Within ${formatAUD(halfWindow)} of ${a}, one point per employer: ${points
      .map((p) => `${p.group}, ${p.label}, ${formatAUD(p.annual)}`)
      .join("; ")}. These are full-time base salaries; hours, allowances and super differ between employers.`,
  };
}
