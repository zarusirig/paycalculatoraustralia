// Shared FAQ copy for /payday-super/ — read by the rendered accordion and the
// FAQPage JSON-LD so the structured data cannot drift from the visible page.
//
// Every figure is pulled from australian-tax.ts or payday-super.ts; sources
// are cited in those files (verified 23 Sep 2026). The SGC detail is kept
// short here on purpose — /super-guarantee-charge/ owns that topic.

import { formatAUD } from "@/lib/constants";
import {
  QUALIFYING_EARNINGS,
  SUPER_GUARANTEE,
  SUPER_GUARANTEE_CHARGE,
} from "@/lib/constants/australian-tax";
import { PAYDAY_SUPER_LAW, SBSCH_CLOSURE } from "@/lib/constants/payday-super";

const C = SUPER_GUARANTEE_CHARGE.current;
const L = SUPER_GUARANTEE_CHARGE.legacy;
const RATE = `${SUPER_GUARANTEE.rate * 100}%`;

export const PAYDAY_SUPER_FAQS: readonly { q: string; a: string }[] = [
  {
    q: "What is Payday Super?",
    a: `Payday Super is the rule that employers must pay the super guarantee for each payday instead of quarterly. It applies to qualifying earnings paid from ${SUPER_GUARANTEE.paydaySuperStart}. The ${RATE} contribution must be received by the employee's super fund within ${C.businessDaysToPay} business days after payday.`,
  },
  {
    q: "When does Payday Super start?",
    a: `It started on ${SUPER_GUARANTEE.paydaySuperStart} and applies to earnings paid on or after that date. Earnings paid up to 30 June 2026 stayed under the old quarterly rules. The last quarterly payment for the June 2026 quarter was due ${L.finalQuarterSGDue}.`,
  },
  {
    q: "What is the Payday Super legislation?",
    a: `The main law is the ${PAYDAY_SUPER_LAW.act} (${PAYDAY_SUPER_LAW.actNumber}). It passed alongside the ${PAYDAY_SUPER_LAW.companionAct}, which rebuilt the super guarantee charge, and the ${PAYDAY_SUPER_LAW.regulations}. The package commenced on ${PAYDAY_SUPER_LAW.commencement}.`,
  },
  {
    q: "How many days does my employer have to pay super under Payday Super?",
    a: `The contribution must be received by your fund, not just sent, within ${C.businessDaysToPay} business days after payday. The first contribution for a new employee, or the first to a new fund after a change, gets ${C.businessDaysNewEmployee} business days. Weekends do not count as business days. A public holiday that covers a whole state or territory also doesn't count, anywhere in Australia.`,
  },
  {
    q: "Does super now get paid on overtime?",
    a: `Generally, no. Under Payday Super, super is calculated on "qualifying earnings", which are basically ordinary time earnings with one addition: ${QUALIFYING_EARNINGS.onlyChangeFromOTE}. Overtime is still excluded where your award or agreement clearly sets out your ordinary hours.`,
  },
  {
    q: "Is the super guarantee rate still 12%?",
    a: `Yes. The rate is ${RATE} of qualifying earnings. It reached 12% on ${SUPER_GUARANTEE.effectiveDate} and no further increase is legislated. Payday Super changed when super is paid, not the rate. The maximum contribution base is now an annual ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}, so an employer does not have to pay SG on qualifying earnings above that in a year.`,
  },
  {
    q: "What happens if my employer pays super late?",
    a: `If super isn't received within the deadline, the employer owes the super guarantee charge. The charge includes the shortfall, interest at the general interest charge rate compounded daily, and an administrative uplift of up to ${C.administrativeUpliftMax * 100}%. The ATO passes the super and interest on to your fund. Employers no longer lodge a statement. The ATO assesses the charge itself.`,
  },
  {
    q: "Is the Small Business Superannuation Clearing House still available?",
    a: `No. The ATO's Small Business Superannuation Clearing House closed to new users on ${SBSCH_CLOSURE.closedToNewUsers}. Existing users could keep using it until ${SBSCH_CLOSURE.lastDayForExistingUsers}. It is no longer accessible, so employers now pay through payroll software, a commercial clearing house or their default fund.`,
  },
  {
    q: "How can I check my employer is paying super each payday?",
    a: "Your payslip must show the super contribution for that pay period (or the amount your employer intends to pay) and which fund it goes to. Compare it with the deposits in your fund account, or check the employer contributions reported to the ATO through myGov. If money is missing, ask your employer first. If that doesn't fix it, report unpaid super to the ATO.",
  },
];
