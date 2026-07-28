// Shared FAQ copy for /sapto-calculator/.
//
// Read by both the rendered accordion and the FAQPage JSON-LD so the structured
// data cannot drift from the visible page.

import { formatAUD } from "@/lib/constants";
import { SAPTO_BANDS, SAPTO_INCOME_YEAR, SAPTO_REDUCTION_RATE } from "@/lib/constants/sapto";

const S = SAPTO_BANDS.single;
const C = SAPTO_BANDS.couple;
const I = SAPTO_BANDS.illnessSeparated;

export interface SaptoFaq {
  q: string;
  a: string;
}

export const SAPTO_FAQS: readonly SaptoFaq[] = [
  {
    q: "How much is SAPTO?",
    a: `The maximum seniors and pensioners tax offset is ${formatAUD(S.maxOffset)} if you are single, ${formatAUD(C.maxOffset)} for each partner of a couple living together, and ${formatAUD(I.maxOffset)} for each partner of an illness-separated couple, for the ${SAPTO_INCOME_YEAR} income year. You receive the full amount if your rebate income is below the shading-out threshold — ${formatAUD(S.shadingOutThreshold)} for singles.`,
  },
  {
    q: "What is the SAPTO income threshold?",
    a: `There are two thresholds. Below the shading-out threshold you get the maximum offset: ${formatAUD(S.shadingOutThreshold)} single, ${formatAUD(C.shadingOutThreshold)} each for a couple, ${formatAUD(I.shadingOutThreshold)} each if illness-separated. At or above the cut-out threshold you get nothing: ${formatAUD(S.cutOutThreshold)} single, ${formatAUD(C.cutOutThreshold)} each for a couple, ${formatAUD(I.cutOutThreshold)} each if illness-separated.`,
  },
  {
    q: "Who is eligible for SAPTO?",
    a: "You must meet two conditions. First, you must receive an Australian Government pension or allowance — Age Pension, Carer Payment, Parenting Payment (single), Disability Support Pension if you are age-pension age, or a DVA service pension — or qualify for the age pension without claiming it. Second, your rebate income must be under the relevant limit. Age-pension age has been 67 since 1 July 2023.",
  },
  {
    q: "How is SAPTO calculated for a couple?",
    a: `Two different incomes are used, which catches people out. Eligibility is tested on HALF your combined rebate income against the cut-out threshold of ${formatAUD(C.cutOutThreshold)}. But the offset amount is then worked out on your OWN rebate income against the shading-out threshold of ${formatAUD(C.shadingOutThreshold)}. So a couple can qualify while one partner still receives nothing because their individual income is too high.`,
  },
  {
    q: "What is rebate income?",
    a: "Rebate income is broader than taxable income. It is your taxable income plus reportable superannuation contributions, total net investment loss, and adjusted fringe benefits. Using taxable income alone will overstate your offset.",
  },
  {
    q: "How fast does SAPTO reduce?",
    a: `The offset reduces by ${SAPTO_REDUCTION_RATE * 100} cents for every dollar of rebate income above the shading-out threshold, and the ATO rounds the result up to the nearest whole dollar. A single person on ${formatAUD(39_000)} gets ${formatAUD(2_230)} − ((${formatAUD(39_000)} − ${formatAUD(34_919)}) × 0.125) = $1,719.88, rounded up to $1,720.`,
  },
  {
    q: "Can I transfer unused SAPTO to my spouse?",
    a: "Yes. If you and your spouse are both eligible and one of you does not use the whole offset, the unused part can transfer. The ATO works this out when you lodge. Where your spouse's taxable income is $6,000 or less the full amount transfers; above that it reduces by 15 cents in the dollar.",
  },
  {
    q: "Is SAPTO refundable?",
    a: "No. SAPTO is non-refundable, so it reduces your tax payable to a minimum of zero but does not generate a cash refund on its own. Any excess is lost rather than carried forward.",
  },
  {
    q: "Does SAPTO affect the Medicare levy?",
    a: "Yes, favourably. If you are entitled to at least $1 of SAPTO you also qualify for a higher Medicare levy low-income threshold. If your income reduces your SAPTO to zero, you cannot use the SAPTO Medicare threshold.",
  },
  {
    q: "Can I claim SAPTO and the Low Income Tax Offset together?",
    a: "Yes. SAPTO, LITO and the zone tax offset are separate non-refundable offsets that stack. Together they can reduce your tax to zero but not below it.",
  },
  {
    q: "Which financial year do these SAPTO amounts apply to?",
    a: `The ${SAPTO_INCOME_YEAR} income year — the return being lodged now. The ATO publishes SAPTO thresholds with each year's rates, and had not released ${"2026-27"} figures when this page was last verified.`,
  },
  {
    q: "What if I was in jail during the year?",
    a: "You cannot claim SAPTO if you were in jail for the whole income year.",
  },
] as const;
