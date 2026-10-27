// FAQ copy for /minimum-wage-history-australia/, shared by the page and its
// FAQPage JSON-LD. Figures come from NMW_HISTORY, never re-keyed.
//
// Rewritten 23 Sep 2026: the previous copy put $26.44 against "1 July 2024"
// and left 2025-26 as "TBD". The correct 2024-25 rate was $24.10.

import { formatAUD } from "@/lib/constants";
import { NMW_DECISION, NMW_HISTORY } from "@/lib/constants/minimum-wage";

const money = (v: number) => formatAUD(v, 2);
const first = NMW_HISTORY[0];
const last = NMW_HISTORY[NMW_HISTORY.length - 1];
const largest = NMW_HISTORY.slice(1).reduce((a, b) => (b.increase! > a.increase! ? b : a));
const largestPrev = NMW_HISTORY[NMW_HISTORY.indexOf(largest) - 1];
const smallest = NMW_HISTORY.slice(1).reduce((a, b) => (b.increase! < a.increase! ? b : a));

export const TOTAL_GROWTH = last.weekly / first.weekly - 1;
export { first as HISTORY_FIRST, last as HISTORY_LAST, largest as HISTORY_LARGEST, smallest as HISTORY_SMALLEST };

export const HISTORY_FAQS: readonly { q: string; a: string }[] = [
  {
    q: "How much has the minimum wage increased since 2010?",
    a: `The National Minimum Wage rose from ${money(first.weekly)} a week (${money(first.hourly)} an hour) on ${first.operativeFrom} to ${money(last.weekly)} (${money(last.hourly)} an hour) from ${last.operativeFrom}, an increase of ${(TOTAL_GROWTH * 100).toFixed(1)}% over ${NMW_HISTORY.length - 1} annual reviews.`,
  },
  {
    q: "What was the largest minimum wage increase?",
    a: `The largest increase since 2010 was ${largest.published} from ${largest.operativeFrom}, taking the hourly rate from ${money(largestPrev.hourly)} to ${money(largest.hourly)}. The smallest was ${smallest.published} from ${smallest.operativeFrom}, during the COVID-19 downturn.`,
  },
  {
    q: "What was the minimum wage in 2024 and 2025?",
    a: `From 1 July 2024 the National Minimum Wage was ${money(NMW_HISTORY.find((r) => r.fy === "2024-25")!.hourly)} an hour (${money(NMW_HISTORY.find((r) => r.fy === "2024-25")!.weekly)} a week). From 1 July 2025 it was ${money(NMW_HISTORY.find((r) => r.fy === "2025-26")!.hourly)} an hour (${money(NMW_HISTORY.find((r) => r.fy === "2025-26")!.weekly)} a week). It rose to ${money(last.hourly)} from ${last.operativeFrom}.`,
  },
  {
    q: "How often does the minimum wage increase?",
    a: `Once a year. The Fair Work Commission's Annual Wage Review sets the National Minimum Wage and all modern award rates, usually announced in late May or June, with the new rates applying from the first full pay period on or after 1 July. The next review is the ${NMW_DECISION.nextReview}.`,
  },
];
