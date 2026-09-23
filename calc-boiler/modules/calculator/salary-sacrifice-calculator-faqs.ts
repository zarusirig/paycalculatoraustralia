// Shared FAQ copy for /salary-sacrifice-calculator/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in
// app/salary-sacrifice-calculator/page.tsx, so the structured data cannot drift
// from the page. Caps, rates and thresholds come from lib/constants.

import { EMPLOYMENT, MEDICARE_LEVY, SITE_CONFIG, SUPER_GUARANTEE, TAX_BRACKETS, formatAUD } from "@/lib/constants";
import { EV_EXEMPTION, FBT, FBT_CAPS, capFaceValue } from "@/lib/constants/novated-lease";
import {
  CARRY_FORWARD,
  CONTRIBUTIONS_TAX_RATE,
  DIVISION_293,
  carryForwardWindow,
} from "@/lib/constants/super-contributions";
import type { FaqItem } from "@/lib/faq";

const FY = SITE_CONFIG.financialYear;
const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const CAP = SUPER_GUARANTEE.concessionalCap;
const CF_WINDOW = carryForwardWindow();

// $100,000 salary: employer SG and the room left under the concessional cap.
const EX_SALARY = 100_000;
const EX_SG = EX_SALARY * SUPER_GUARANTEE.rate;

// $10,000 sacrificed on $80,000 — the salary sits in the 30% bracket.
const SACRIFICE = 10_000;
const MID_RATE = TAX_BRACKETS[2].rate;
const TAKE_HOME_DROP = SACRIFICE * (1 - MID_RATE - MEDICARE_LEVY.rate);

const SECOND = TAX_BRACKETS[1];
const TOP_RATES = TAX_BRACKETS.slice(3).map((b) => b.rate);
const DIV293_TOTAL = CONTRIBUTIONS_TAX_RATE + DIVISION_293.rate;

const LAPTOP = 2_500;

export const SALARY_SACRIFICE_FAQS: readonly FaqItem[] = [
  {
    q: "What is salary sacrificing?",
    a: "Salary sacrificing is an ATO-approved arrangement where an employee agrees to receive a lower gross salary in exchange for the employer providing a benefit of equivalent value — such as additional super contributions, a novated car lease, or a portable electronic device. The arrangement reduces the employee's assessable income, resulting in lower income tax and PAYG withholding.",
  },
  {
    q: "How much can I salary sacrifice into super?",
    a: `There is no legal limit on the amount you can salary sacrifice, but total concessional super contributions (employer SG + salary sacrifice + personal deductible contributions) over the ${formatAUD(CAP)} cap for ${FY} are taxed at your marginal rate. On a ${formatAUD(EX_SALARY)} salary, your employer contributes ${formatAUD(EX_SG)} in SG, leaving room for up to ${formatAUD(CAP - EX_SG)} in salary sacrifice.`,
  },
  {
    q: "Does salary sacrifice reduce my take-home pay?",
    a: `Yes. The sacrificed amount is deducted before income tax is calculated, reducing your net pay. The reduction is smaller than the sacrifice amount because of the tax saving. Sacrificing ${formatAUD(SACRIFICE)} on an $80,000 salary reduces take-home pay by approximately ${formatAUD(TAKE_HOME_DROP)} — the remaining ${formatAUD(SACRIFICE - TAKE_HOME_DROP)} is the income tax and Medicare levy you no longer pay.`,
  },
  {
    q: "Do I pay tax on salary sacrificed super?",
    a: `Yes. The super fund deducts ${pct(CONTRIBUTIONS_TAX_RATE)} contributions tax on all concessional contributions, including salary sacrifice amounts. Because ${pct(CONTRIBUTIONS_TAX_RATE)} is lower than the marginal income tax rates of ${TAX_BRACKETS.slice(2).map((b) => pct(b.rate)).join(", ").replace(/, ([^,]*)$/, " and $1")}, the employee pays less total tax than receiving the same amount as cash salary.`,
  },
  {
    q: "Is salary sacrificing suitable for everyone?",
    a: `No. It is most beneficial for middle-to-high income earners. Up to ${formatAUD(SECOND.max)}, your marginal income tax rate is ${pct(SECOND.rate)} for ${FY} — the same as the ${pct(CONTRIBUTIONS_TAX_RATE)} contributions tax — so salary sacrificing into super saves little beyond the ${pct(MEDICARE_LEVY.rate)} Medicare levy, and the money is locked away until you reach preservation age.`,
  },
  {
    q: "Can I salary sacrifice into things other than super?",
    a: `Yes. Salary sacrifice arrangements can cover novated car leases, portable electronic devices, and additional employer super contributions. Non-super items attract Fringe Benefits Tax (FBT) unless they qualify for an exemption. Super sacrifice is the most tax-effective option for most Australian employees because concessional contributions are taxed at only ${pct(CONTRIBUTIONS_TAX_RATE)}.`,
  },
  {
    q: "Does salary sacrifice reduce my HECS-HELP repayment?",
    a: "No. The ATO calculates HECS-HELP repayments against your repayment income, which includes taxable income plus reportable employer super contributions plus reportable fringe benefits. Salary sacrifice reduces taxable income but the sacrificed amounts are added back as reportable items, so the net effect on your HECS repayment is zero. Use the HECS-HELP Calculator to model your repayment obligation.",
    links: { "HECS-HELP Calculator": "/hecs-help-calculator/" },
  },
  {
    q: "What is Division 293 tax and does it affect my salary sacrifice?",
    a: `Division 293 imposes an additional ${pct(DIVISION_293.rate)} tax on concessional contributions when your income plus concessional super exceeds ${formatAUD(DIVISION_293.threshold)}. This brings the total contributions tax to ${pct(DIV293_TOTAL)}. Even at ${pct(DIV293_TOTAL)}, salary sacrifice saves tax for earners in the ${TOP_RATES.map(pct).join(" or ")} brackets because the marginal rate plus Medicare levy (${TOP_RATES.map((r) => pct(r + MEDICARE_LEVY.rate)).join(" or ")}) still exceeds the ${pct(DIV293_TOTAL)} rate.`,
  },
  {
    q: "Can I change my salary sacrifice amount mid-year?",
    a: "Yes. Most employers allow adjustments to salary sacrifice arrangements at any time, though some restrict changes to quarterly intervals. Changes apply to future pay periods only — you cannot retrospectively sacrifice income already received. Contact your payroll team to confirm your employer's specific adjustment schedule.",
  },
  {
    q: "Can I carry forward unused concessional cap amounts?",
    a: `Yes. If your total super balance is below ${formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)} on 30 June of the previous financial year, you can carry forward unused concessional cap amounts from up to ${CARRY_FORWARD.years} prior years — for FY${FY}, the years ${CF_WINDOW[0]?.year} to ${CF_WINDOW[CF_WINDOW.length - 1]?.year}. Unused amounts older than ${CARRY_FORWARD.years} years expire. This allows a larger one-off salary sacrifice in a high-income year without exceeding the cap.`,
  },
  {
    q: "Should I salary sacrifice or pay off my mortgage faster?",
    a: `The answer depends on your mortgage interest rate versus expected after-tax super return. At a 6% mortgage rate, salary sacrifice into super typically delivers a better after-tax outcome because the ${pct(CONTRIBUTIONS_TAX_RATE)} concessional tax rate is significantly lower than the ${pct(MID_RATE)}+ marginal rate on the same income used for extra mortgage repayments. If your mortgage rate is higher than your expected super return after the tax advantage, prioritise the mortgage. Run the numbers at your specific salary using the calculator above.`,
  },
  {
    q: "Can I salary sacrifice a car?",
    a: `Yes, through a novated lease. Your employer deducts lease payments and running costs (fuel, insurance, registration, servicing) from your pre-tax salary. Battery electric and hydrogen fuel cell cars first held and used from ${EV_EXEMPTION.firstHeldAndUsedFrom}, and on which luxury car tax has never been payable, are FBT-exempt under the Electric Car Discount. Plug-in hybrids stopped qualifying on ${EV_EXEMPTION.phevExcludedFrom} unless the car was already held and used, and a binding commitment made, before that date.`,
  },
  {
    q: "Can salary sacrifice reduce my pay below minimum wage?",
    a: `No. A salary sacrifice arrangement cannot reduce an employee's cash earnings below the national minimum wage of ${formatAUD(EMPLOYMENT.minimumWageHourly, 2)} per hour (${formatAUD(EMPLOYMENT.minimumWageWeekly, 2)} per ${EMPLOYMENT.standardWeeklyHours}-hour week) or the applicable award/enterprise agreement rate. If the proposed sacrifice would breach this threshold, the employer must reject or reduce the arrangement.`,
  },
  {
    q: "Does salary sacrifice affect Centrelink payments?",
    a: "It depends on the specific payment. Services Australia calculates eligibility for Family Tax Benefit, childcare subsidies, and other income-tested payments using adjusted taxable income (ATI), which adds back reportable super contributions and reportable fringe benefits. Salary sacrifice reduces taxable income but increases reportable items, so ATI remains similar. The net impact on Centrelink eligibility is typically minimal.",
  },
  {
    q: "Do not-for-profit employees get extra salary sacrifice benefits?",
    a: `Yes. Employees of public benevolent institutions (PBIs) and health promotion charities have a ${formatAUD(FBT_CAPS.pbiAndHealthPromotionCharity)} grossed-up FBT exemption cap per FBT year, which covers about ${formatAUD(capFaceValue(FBT_CAPS.pbiAndHealthPromotionCharity))} of rent, mortgage repayments or other GST-free living expenses. Employees of public and not-for-profit hospitals and public ambulance services have a lower ${formatAUD(FBT_CAPS.hospitalAndAmbulance)} grossed-up cap, about ${formatAUD(capFaceValue(FBT_CAPS.hospitalAndAmbulance))} of expenses. A separate ${formatAUD(FBT_CAPS.salaryPackagedEntertainment)} grossed-up cap (about ${formatAUD(capFaceValue(FBT_CAPS.salaryPackagedEntertainment))} of meals) applies on top for salary-packaged meal entertainment. See the Salary Packaging Guide for worked examples.`,
    links: { "Salary Packaging Guide": "/salary-packaging-guide/" },
  },
  {
    q: "Can I salary sacrifice a laptop or phone?",
    a: `Yes. Portable electronic devices used primarily for employment duties are FBT-exempt. Eligible items include laptops, tablets, mobile phones, and GPS devices. The exemption applies to 1 device per category per FBT year (${FBT.yearStart} to ${FBT.yearEnd}). The employer purchases the device from your pre-tax salary, reducing your taxable income by the device cost. A ${formatAUD(LAPTOP)} laptop at a ${pct(MID_RATE)} marginal rate saves ${formatAUD(LAPTOP * MID_RATE)} in income tax.`,
  },
];
