// Liquorland — Coles Liquor retail stores (Liquorland, First Choice Liquor
// Market, Vintage Cellars). Employer: Liquorland (Australia) Pty Ltd, which the
// agreement calls "Coles Liquor".
//
// Instrument: the SAME agreement as coles.ts — Coles Retail Enterprise
// Agreement 2024, AG2024/1124, AE524516. Re-read from the FWC PDF on
// 24 September 2026 for the liquor-only terms:
//
//   cl 2.1.3   Coles Liquor job titles exist only at Level 1 ("Sales
//              Assistant") and Level 3 ("Senior Sales Assistant").
//   cl 3.1.1   Base rates are the general table unless A3.3 (junior rates),
//              A3.4 (apprentices), A4.3 (legacy liquor rates) or A5 applies.
//   A3         "Coles Supermarkets only" — so the junior percentages in A3.3
//              do NOT apply to Coles Liquor: liquor team members are paid the
//              adult rate at any age. Hence juniorScale: [].
//   A4.3       Legacy 2014 Liquor Agreement rates ($26.68, $27.93, $27.93) are
//              preserved only until the Coles rate overtakes them — which it
//              did well before 2026 (Level 1 $28.43, Level 3 $29.56).
//   A4.4.1     Liquor licence allowance $30.85/week, rising with the award.
//
// Rates, penalties and overtime are imported from coles.ts so the two pages
// can never drift apart; see that file for the cl 3.4.1 indexation arithmetic.

import type { EmployerPay } from "./types";
import { COLES_PAY } from "./coles";

const EA_URL = COLES_PAY.instrument.url;

const LIQUOR_TITLES: Record<string, string> = {
  "Level 1": "Sales Assistant — the Coles Liquor title for Level 1",
  "Level 3": "Senior Sales Assistant — the Coles Liquor title for Level 3",
};

const colesLevel = (level: string) => {
  const row = COLES_PAY.rates.find((r) => r.level === level);
  if (!row) throw new Error(`coles.ts has no ${level}`);
  return { ...row, description: LIQUOR_TITLES[level] };
};

export const LIQUORLAND_PAY: EmployerPay = {
  ...COLES_PAY,
  slug: "liquorland",
  name: "Liquorland",
  employerEntity: "Liquorland (Australia) Pty Ltd (\"Coles Liquor\")",
  industry: "liquor store",
  instrument: {
    ...COLES_PAY.instrument,
    coverage:
      "The Coles agreement covers Coles Liquor retail stores, including those trading as Liquorland, First Choice Liquor Market and Vintage Cellars, as well as Coles supermarkets. Liquor-only terms are in its Appendix 4. Salaried store managers and distribution centres fall outside it.",
  },
  verifiedOn: "24 September 2026",
  rates: [colesLevel("Level 1"), colesLevel("Level 3")],
  juniorScale: [],
  juniorNote:
    "The Coles agreement's junior percentages sit in Appendix 3, which applies to Coles Supermarkets only. Coles Liquor team members are therefore paid the adult rate for their level at any age.",
  publishedJuniorRates: undefined,
  penaltyNotes: [
    "Casual rates already include the 25% loading, and the agreement says no rates are cumulative or compounding (cl 3.1.2): Sunday casual is 175%, not 150% × 1.25.",
    "Work before 7am, after 11pm, or before 9am on a Sunday is outside the ordinary spread and is paid as overtime.",
    "If you do not get a 12-hour break between shifts, you are paid 200% until you do (cl 4.3).",
    "Coles Liquor staff may agree to work up to 6 hours before their meal break (Appendix A4.5.1).",
  ],
  notices: [
    "Liquorland, First Choice Liquor Market and Vintage Cellars staff are covered by the same agreement as Coles supermarkets, so the hourly rates are identical to Coles. The 2026 dollars apply the agreement's rule of lifting every level by the Retail Award Level 1 increase each July (cl 3.4.1) — 4.75% in 2026 — so your payslip may differ by a cent.",
    "If you hold a liquor licence required by state law, Coles Liquor pays a liquor licence allowance on top ($30.85 a week when the agreement was made, rising with the Retail Award allowance — cl A4.4.1).",
    "Long-serving staff on higher 2014 Liquor Agreement rates ($26.68 to $27.93) kept them only until the Coles rate caught up (cl A4.3); the 2026 rates are above all of them.",
  ],
  unverified: [
    "Coles Liquor job titles are given only for Levels 1 and 3. If you are classified at Level 2, 4, 5 or 6, see the full table on the Coles page.",
    "The current dollar amount of the liquor licence allowance — it follows the Retail Award allowance, which we have not re-verified for 2026.",
    "Salaried store manager pay — set by contract, not the agreement.",
  ],
  sources: [
    { title: "Coles Retail Enterprise Agreement 2024 (AE524516) — cl 2.1.3 and Appendix 4 (Coles Liquor)", publisher: "Fair Work Commission", url: EA_URL },
    ...COLES_PAY.sources.slice(1),
  ],
  faqs: [
    {
      q: "How much does Liquorland pay an hour in 2026?",
      a: "A Liquorland sales assistant (Level 1 under the Coles agreement) is paid $28.43 an hour as a permanent employee or $35.54 as a casual, from the first full pay period after 1 July 2026. A senior sales assistant (Level 3) gets $29.56, or $36.95 as a casual.",
    },
    {
      q: "Is Liquorland pay the same as Coles?",
      a: "Yes. Liquorland, First Choice Liquor Market and Vintage Cellars are run by Liquorland (Australia) Pty Ltd, which is covered by the Coles Retail Enterprise Agreement 2024 alongside Coles supermarkets, so the hourly rates and penalty rates are the same.",
    },
    {
      q: "Does Liquorland pay junior rates?",
      a: "No. The Coles agreement's junior percentages apply to Coles supermarkets only, so Coles Liquor team members are paid the adult rate for their level whatever their age.",
    },
    {
      q: "What are Liquorland penalty rates?",
      a: "Weekday evenings from 6pm and Saturdays pay base + 25% (casual + 50%). Sundays from 9am pay base + 50% (casual + 75%), and public holidays base + 125% (casual + 150%).",
    },
    {
      q: "Do Liquorland staff get a liquor licence allowance?",
      a: "Yes, if you hold a liquor licence under state or territory law. The agreement set it at $30.85 a week and ties later increases to the equivalent Retail Award allowance.",
    },
  ],
};
