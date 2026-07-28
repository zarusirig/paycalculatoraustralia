// Shared FAQ copy for /super-guarantee-charge/.
//
// Read by both the rendered accordion and the FAQPage JSON-LD so the
// structured data cannot drift from the visible page.
//
// Two regimes run in parallel and conflating them is the accuracy risk here:
// Payday Super governs qualifying earnings paid from 1 July 2026, and the old
// quarterly charge still governs earnings paid up to 30 June 2026 — whose
// final statement is due 28 August 2026.
//
// Three things primary-source verification corrected on 28 July 2026 and that
// most secondary coverage gets wrong: the late payment penalty is NOT an SGC
// component, the administrative uplift is two stacking reductions rather than
// one all-or-nothing test, and the $1,200 choice-loading cap is per notice
// period. All three are reflected below.

import { formatAUD } from "@/lib/constants";
import {
  GENERAL_INTEREST_CHARGE,
  PAYDAY_SUPER_CAP_RELIEF,
  QUALIFYING_EARNINGS,
  SUPER_GUARANTEE,
  SUPER_GUARANTEE_CHARGE,
} from "@/lib/constants/australian-tax";

const C = SUPER_GUARANTEE_CHARGE.current;
const L = SUPER_GUARANTEE_CHARGE.legacy;
const pct = (v: number) => `${(v * 100).toFixed((v * 100) % 1 === 0 ? 0 : 2)}%`;

export interface SgcFaq {
  q: string;
  a: string;
}

export const SGC_FAQS: readonly SgcFaq[] = [
  {
    q: "What is the super guarantee charge?",
    a: `The super guarantee charge (SGC) is what an employer owes the ATO when superannuation is not paid in full and on time. It is deliberately more expensive than paying the super would have been. Since Payday Super commenced on ${SUPER_GUARANTEE.paydaySuperStart} the charge has exactly four components for each payday: the individual final super guarantee shortfall, notional earnings on it at the general interest charge rate ${C.interestBasis}, an administrative uplift of up to ${pct(C.administrativeUpliftMax)}, and a choice loading where choice-of-fund rules were not followed. A late payment penalty can follow later, but it is a separate penalty rather than part of the charge.`,
  },
  {
    q: "Do I still need to lodge a super guarantee charge statement?",
    a: `Not for paydays from ${SUPER_GUARANTEE.paydaySuperStart} — the ATO now calculates the charge and issues a notice of assessment, and there is no statement to lodge. But the old obligation is still live for the June 2026 quarter and earlier. If you missed the ${L.finalQuarterSGDue} due date for that final quarter, you must lodge a super guarantee charge statement and pay the charge by ${L.finalQuarterStatementDue}. That is the last one there will ever be.`,
  },
  {
    q: "When does super have to be paid under Payday Super?",
    a: `The contribution must be RECEIVED by the employee's fund within ${C.businessDaysToPay} business days of payday — not merely sent by then. That distinction catches people out, because clearing house and fund processing time counts against you. A longer ${C.businessDaysNewEmployee} business day deadline covers two situations: a new employee, and a first contribution to a new fund for an existing employee after you stopped contributing to another one. A business day excludes weekends and public holidays, and a public holiday anywhere in Australia removes a day nationally.`,
  },
  {
    q: "Is the super guarantee charge tax-deductible?",
    a: `Yes for paydays from ${SUPER_GUARANTEE.paydaySuperStart}, which reverses the old position — the legacy quarterly SGC was expressly not deductible, and that was much of what made it punitive. All four components of the new charge are deductible. Two things attached to it are not: the general interest charge that accrues on a late SGC payment, and the late payment penalty. SGC relating to quarterly periods before 1 July 2026 also remains non-deductible. Guides still saying flatly that "the SGC is not deductible" are describing a regime that ended on 30 June 2026.`,
  },
  {
    q: "How is the super guarantee charge calculated?",
    a: `Start with the shortfall — the super that should have been paid for that payday. Add notional earnings on it at the general interest charge rate, ${C.interestBasis}, from the day the contribution was due. Add the administrative uplift, which starts at ${pct(C.administrativeUpliftMax)} of the shortfall plus notional earnings and can be reduced to nil. If choice-of-fund rules were not followed, add a choice loading of ${pct(C.choiceLoading)} of the ${C.choiceLoadingBasis}, capped at ${formatAUD(C.choiceLoadingCap)} for each ${C.choiceLoadingCapBasis} rather than per payday or per employee.`,
  },
  {
    q: "What is the current general interest charge rate?",
    a: `${pct(GENERAL_INTEREST_CHARGE.annualRate)} a year for the ${GENERAL_INTEREST_CHARGE.quarter} quarter, which the ATO publishes as a daily rate of ${GENERAL_INTEREST_CHARGE.dailyRatePercent}%, compounded daily. It was ${pct(GENERAL_INTEREST_CHARGE.previousQuarter.annualRate)} in ${GENERAL_INTEREST_CHARGE.previousQuarter.label}. This rate resets every quarter and is the figure on this page most likely to go out of date — the next one is generally announced about two weeks before the quarter starts. Daily compounding is what makes an unpaid shortfall grow faster than most employers expect.`,
  },
  {
    q: "Can the administrative uplift be reduced to nil?",
    a: `Yes, and it is worth understanding how because there are two separate reductions that stack rather than one test to pass. The uplift starts at ${pct(C.administrativeUpliftMax)}. Having no ATO-initiated assessment in the two years to that payday takes 20 percentage points off. Making a voluntary disclosure before an assessment takes off up to 40 more, depending on how fast you move: disclosing within 30 days removes the full 40. An employer with a clean two-year record who discloses within 30 days gets to nil. One who does neither stays at ${pct(C.administrativeUpliftMax)}. Because the disclosure reduction decays with time, disclosing quickly beats disclosing precisely.`,
  },
  {
    q: "What is the late payment penalty, and can it be waived?",
    a: `${pct(C.latePayment.penalty)} of the outstanding charge, rising to ${pct(C.latePayment.penaltyRepeatWithin24Months)} if you were liable for the same penalty in the previous 24 months. It is not part of the SGC and it does not arise automatically — it comes only after the charge is assessed, goes unpaid for 28 days, a Notice to Pay is issued, and it remains unpaid a further 28 days. The ATO says it cannot be remitted, so there is no disclosure route out of it, but it does reduce to nil under an exceptional circumstance determination, and if the ATO reduces the underlying charge the penalty reduces with it.`,
  },
  {
    q: "Does Payday Super mean super is now paid on overtime?",
    a: `No, and this is the most common misconception about the change. Payday Super calculates SG on "qualifying earnings" instead of ordinary time earnings, which sounds like a broadening — but the ATO states that the only additional payment type is ${QUALIFYING_EARNINGS.onlyChangeFromOTE}. Everything counted for SG up to 30 June 2026 still counts, and nothing else was added. Overtime remains excluded where ordinary hours are clearly identified in an award or agreement, as do bonuses solely for work performed entirely outside ordinary hours and annual leave loading tied to a lost overtime opportunity. What changed is the timing and the penalties, not the base.`,
  },
  {
    q: "Is there a cap on how much super an employer must pay?",
    a: `Yes. The maximum contribution base caps the earnings on which SG is compulsory. From ${SUPER_GUARANTEE.paydaySuperStart} it is an ANNUAL figure of ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}, a structural change from the previous ${formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026)} per quarter. It is derived from the concessional cap: ${formatAUD(SUPER_GUARANTEE.concessionalCap)} × 100 ÷ 12, rounded down to the nearest $10. At ${pct(SUPER_GUARANTEE.rate)} that caps compulsory SG at about ${formatAUD(SUPER_GUARANTEE.maxSGAnnual)} a year. Being annual, it is a running year-to-date test rather than a per-payday one, and it resets each financial year.`,
  },
  {
    q: "What were the old quarterly SGC rules?",
    a: `They still govern earnings paid up to 30 June 2026, so they are not merely history. That charge was the shortfall calculated on total salary and wages rather than OTE — which made it larger than the super actually owed — plus nominal interest at ${pct(L.nominalInterestRate)} a year running from the start of the quarter, plus an administration fee of ${formatAUD(L.adminFeePerEmployeePerQuarter)} per employee per quarter. It was not deductible, a statement had to be lodged, choice liability was capped at ${formatAUD(L.choiceLiabilityCap)}, and the interest could not be reduced or waived. One trap on the way out: the late payment offset is not available for the final June quarter, and contributions received on or after ${L.tooLateForJuneQuarter} cannot be applied to it at all.`,
  },
  {
    q: "Will employees be pushed over their concessional cap by Payday Super?",
    a: `It is possible, because more frequent contributions can shift which financial year some of them land in. Relief has been ${PAYDAY_SUPER_CAP_RELIEF.announced ? "announced" : "proposed"} — Treasury said in February 2026 that it would introduce technical amendments — but as at 28 July 2026 the ATO's own guidance still states in terms that "${PAYDAY_SUPER_CAP_RELIEF.atoWording}" Until it is legislated, the ordinary rules apply: the concessional cap is ${formatAUD(SUPER_GUARANTEE.concessionalCap)}, and the existing options are to reduce voluntary contributions, or to apply to have contributions disregarded or reallocated. Do not plan on relief that does not yet exist.`,
  },
  {
    q: "What happens if my employer has not paid my super?",
    a: `Check your payslips and your myGov ATO account first. Under Payday Super contributions should land within roughly a fortnight of each payday, so a gap is now visible in weeks rather than months — that is the single biggest practical benefit of the change for employees. Raise it with your employer. If it is not resolved, lodge an unpaid super enquiry with the ATO, which can be done anonymously. The ATO can audit the employer and raise the charge, and the liability does not lapse quietly with time.`,
  },
];
