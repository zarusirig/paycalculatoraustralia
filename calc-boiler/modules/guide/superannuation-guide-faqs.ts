// Shared FAQ copy for /superannuation-guide/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/superannuation-guide/page.tsx,
// so the structured data cannot drift from the page. Rates, caps and ages come
// from lib/constants.

import { SITE_CONFIG, SUPER_GUARANTEE, SUPER_GUARANTEE_CHARGE, formatAUD, formatPercent } from "@/lib/constants";
import { PRESERVATION_AGE_TABLE } from "@/lib/constants/pension-age";
import {
  CONTRIBUTIONS_TAX_RATE,
  DIVISION_293,
  ECC_MAX_RELEASE,
  ECC_TAX_OFFSET_RATE,
} from "@/lib/constants/super-contributions";
import type { FaqItem } from "@/lib/faq";

const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
const CONTRIB = formatPercent(CONTRIBUTIONS_TAX_RATE, 0);
const TRP = 100_000;
const TRP_BASE = TRP / (1 + SUPER_GUARANTEE.rate);

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const PRESERVATION_TEXT = PRESERVATION_AGE_TABLE.map((b) => {
  if (!b.bornFrom && b.bornTo) return `Anyone born before ${fmtDate(nextDay(b.bornTo))} has a preservation age of ${b.years}.`;
  if (b.bornFrom && !b.bornTo) return `Born on or after ${fmtDate(b.bornFrom)}: ${b.years}.`;
  return `Born between ${fmtDate(b.bornFrom!)} and ${fmtDate(b.bornTo!)}: ${b.years}.`;
}).join(" ");
function nextDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}
const MIN_PRESERVATION = PRESERVATION_AGE_TABLE[0].years;
const MAX_PRESERVATION = PRESERVATION_AGE_TABLE[PRESERVATION_AGE_TABLE.length - 1].years;

export const SUPERANNUATION_GUIDE_FAQS: readonly FaqItem[] = [
  {
    q: `What is the Super Guarantee rate for FY${SITE_CONFIG.financialYear}?`,
    a: `The Superannuation Guarantee rate is ${SG}, unchanged since ${SUPER_GUARANTEE.effectiveDate}. This is the legislated peak rate after annual 0.5% increases since FY2021-22. Since ${SUPER_GUARANTEE.paydaySuperStart}, employers must pay ${SG} of an employee's qualifying earnings into their fund every payday, received within ${SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days.`,
  },
  {
    q: "Does superannuation come out of my salary?",
    a: `It depends on your contract structure. A "Base Salary + Super" contract means the employer pays ${SG} on top of your base pay, with no reduction to your salary. A "Total Remuneration Package" (TRP) contract includes super within the total figure — so ${SG} is deducted from the package to determine your base salary. On a ${formatAUD(TRP)} TRP, your base salary is approximately ${formatAUD(TRP_BASE)} and super is ${formatAUD(TRP - TRP_BASE)}.`,
  },
  {
    q: "Can I choose my own super fund?",
    a: "Yes. Most Australian employees have the legal right to choose their own superannuation fund by completing a Standard Choice Form. If you do not nominate a fund, your employer checks the ATO for your existing \"stapled fund.\" If no stapled fund exists, the employer opens an account in their default MySuper fund.",
  },
  {
    q: "What happens if I exceed the concessional cap?",
    a: `Excess concessional contributions above ${formatAUD(SUPER_GUARANTEE.concessionalCap)} are added to your assessable income and taxed at your marginal rate (instead of the ${CONTRIB} super rate). You receive a ${formatPercent(ECC_TAX_OFFSET_RATE, 0)} tax offset for the contributions tax already paid inside the fund. You can elect to withdraw up to ${formatPercent(ECC_MAX_RELEASE, 0)} of the excess from your super fund to cover the additional tax bill.`,
  },
  {
    q: "When can I access my super?",
    a: `You can access your super when you reach your preservation age (between ${MIN_PRESERVATION} and ${MAX_PRESERVATION}, depending on date of birth) and have permanently retired, or when you turn 65 regardless of employment status. Early access is available only for severe financial hardship, terminal medical conditions, permanent incapacity, compassionate grounds, or under the First Home Super Saver Scheme (FHSSS) for up to $50,000.`,
  },
  {
    q: "What is Division 293 tax on super?",
    a: `Division 293 imposes an additional ${formatPercent(DIVISION_293.rate, 0)} tax on concessional super contributions for individuals whose income plus concessional contributions exceed ${formatAUD(DIVISION_293.threshold)}. The total tax on super contributions for affected individuals is ${formatPercent(CONTRIBUTIONS_TAX_RATE + DIVISION_293.rate, 0)} (${CONTRIB} standard contributions tax + ${formatPercent(DIVISION_293.rate, 0)} Division 293). You can choose to pay the Division 293 assessment from your super fund or from personal funds.`,
  },
  {
    q: "What do I do if my employer is not paying my super?",
    a: "First, check your payslips and myGov ATO portal to confirm contributions are missing. Raise the issue with your employer directly. If the employer does not resolve the shortfall, lodge an \"Unpaid super enquiry\" through the ATO website or by calling 13 10 20. The ATO can audit the employer, impose the Superannuation Guarantee Charge (SGC), and direct payment including interest. You can lodge the complaint anonymously.",
  },
  {
    q: "How do I find lost super accounts?",
    a: "Log in to myGov and link the ATO service. Navigate to the \"Super\" section, where the ATO displays all known accounts including lost and unclaimed super. You can consolidate multiple accounts into a single fund directly through the myGov portal at no cost.",
  },
  {
    q: "Do contractors get superannuation?",
    a: `Contractors hired wholly or principally for their labour are treated as employees for super purposes and are entitled to the ${SG} SG, even if they invoice with an ABN. Independent contractors who control how, when, and where work is performed and supply their own tools are generally not entitled to employer super. The distinction depends on the substance of the arrangement, not the label on the contract.`,
  },
  {
    q: "Is super paid on bonuses?",
    a: "Usually, yes. The ATO lists performance, Christmas, sign-on and referral bonuses as part of qualifying earnings, so they attract SG. The exception is a bonus paid solely for work performed entirely outside ordinary hours (for example, one tied only to overtime), which is excluded. The classification depends on what the bonus is paid for, not its label.",
  },
  {
    q: "Is salary sacrifice into super better than personal contributions?",
    a: `Both methods receive the same ${CONTRIB} concessional tax rate inside super, and both count toward the ${formatAUD(SUPER_GUARANTEE.concessionalCap)} cap. Salary sacrifice reduces your assessable income before PAYG withholding, giving you the tax benefit in every pay cycle. Personal deductible contributions require you to wait until you lodge your tax return to claim the deduction. Neither lowers your income for the Medicare levy surcharge: salary sacrificed amounts and personal deductible contributions are both reportable super contributions, which are added back when the MLS income test is applied.`,
  },
  {
    q: "What is my preservation age?",
    a: `Preservation age depends on your date of birth. ${PRESERVATION_TEXT}`,
  },
];
