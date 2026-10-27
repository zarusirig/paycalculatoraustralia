import { formatAUD } from "@/lib/constants";
import { FTL_MAX_INDIVIDUAL, PENALTY_UNIT } from "@/lib/constants/tax-calendar-2026-27";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources: ATO "Failure to
// lodge on time penalty" (QC33410, updated 22 Jun 2026) and "Penalty units"
// (updated 26 Jun 2026), read 5 October 2026. See lib/constants/late-lodgement.ts.

export const LATE_TAX_RETURN_FAQS: Faq[] = [
  {
    q: "What is the penalty for lodging a tax return late?",
    a: `The ATO can charge a failure-to-lodge penalty of one penalty unit for every ${PENALTY_UNIT.ftlDaysPerUnit} days (or part of ${PENALTY_UNIT.ftlDaysPerUnit} days) the return is overdue, up to a maximum of ${PENALTY_UNIT.ftlMaxUnits} units. A penalty unit is ${formatAUD(PENALTY_UNIT.amount)} on or after ${PENALTY_UNIT.from}, so the most an individual can be charged is ${formatAUD(FTL_MAX_INDIVIDUAL)}.`,
  },
  {
    q: "What is the deadline to lodge the 2025-26 tax return?",
    a: `If you lodge it yourself, the due date is ${RETURN_2026.selfLodgeDueDate}. That is a Saturday, and the ATO moves a weekend due date to the next business day, so in practice it is Monday 2 November 2026. If you use a registered tax agent and sign up with them before 31 October, most clients have until ${RETURN_2026.agentDueDateMostPeople}.`,
  },
  {
    q: "Will the ATO fine me if I am owed a refund?",
    a: "Generally not. The ATO says it will not usually issue a failure-to-lodge penalty notice for a late-lodged tax return that results in a refund or a nil result, unless the penalty was applied before the return was lodged. Late lodgement still delays your refund.",
  },
  {
    q: "Does the ATO warn you before it charges the penalty?",
    a: "Yes. The ATO says it generally does not apply penalties in isolated cases of late lodgement, and that if you fail to lodge on time it will warn you by phone or in writing and issue a notice to lodge before it applies a penalty.",
  },
  {
    q: "How much is a penalty unit?",
    a: `${formatAUD(PENALTY_UNIT.amount)} for failures on or after ${PENALTY_UNIT.from}, and ${formatAUD(PENALTY_UNIT.previousAmount)} from ${PENALTY_UNIT.previousPeriod}. The ATO publishes the current value on its penalty units page.`,
  },
  {
    q: "Can I get a late lodgement penalty removed?",
    a: "You can ask the ATO to remit all or part of the penalty, and it considers your circumstances. It expects you to lodge your outstanding returns first. Circumstances it would likely accept include severe illness of you, a carer or your agent, a disaster, family violence, or missing information from an employer. It would likely decline a request because you were on holiday, busy at work or had a short-term illness such as a cold.",
  },
  {
    q: "Am I protected if my tax agent lodges late?",
    a: "Possibly. The ATO's safe harbour means you are not liable for the penalty if you gave your registered tax or BAS agent all the information they needed in time and the agent's failure to lodge was not reckless or an intentional disregard of the law. You must be able to show you supplied the information. If safe harbour does not apply you can still ask for remission.",
  },
  {
    q: "Is there interest on top of the penalty?",
    a: "If you owe tax, the ATO charges general interest charge on the unpaid amount from the due date for payment until it is paid. The rate is set each quarter, so check the ATO's current rate. The failure-to-lodge penalty and the interest are separate charges.",
  },
  {
    q: "How do I lodge a late tax return?",
    a: "Lodge it as soon as you can. Most people lodge online through myTax in myGov, where the ATO pre-fills most details, or ask a registered tax agent. The penalty is counted while the return is overdue, so lodging sooner is always cheaper. Use the tax return calculator to estimate your refund or bill first.",
  },
];
