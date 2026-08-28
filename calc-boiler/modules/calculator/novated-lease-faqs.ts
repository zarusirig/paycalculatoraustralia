// FAQ copy for /novated-lease-calculator/. Every figure comes from
// lib/constants/novated-lease.ts (verified at ato.gov.au) or from the shared
// tax engine — nothing is typed in by hand here.
import { formatAUD, formatPercent, HECS_HELP, QUALIFYING_EARNINGS } from "@/lib/constants";
import {
  EV_EXEMPTION,
  FBT,
  LUXURY_CAR_TAX,
  NOVATED_LEASE_SOURCES,
  RESIDUAL_MINIMUM_PCT,
  calculateNovatedLease,
  ecmBreakEvenMarginalRate,
  fbtPayable,
  statutoryTaxableValue,
} from "@/lib/constants/novated-lease";

export interface NovatedLeaseFaq {
  q: string;
  a: string;
}

// A single worked case reused across the answers so the FAQ, the page body and
// the calculator can never disagree: $100,000 salary, $60,000 electric car,
// 5-year term, $5,000 a year of running costs.
const EV = calculateNovatedLease({
  salary: 100_000,
  vehiclePrice: 60_000,
  termYears: 5,
  annualRunningCosts: 5_000,
  vehicleType: "bev",
  fbtMethod: "ecm",
});
const EV_HECS = calculateNovatedLease({
  salary: 100_000,
  vehiclePrice: 60_000,
  termYears: 5,
  annualRunningCosts: 5_000,
  vehicleType: "bev",
  fbtMethod: "ecm",
  includeHECS: true,
});
const PETROL_ECM = calculateNovatedLease({
  salary: 100_000,
  vehiclePrice: 45_000,
  termYears: 5,
  annualRunningCosts: 6_000,
  vehicleType: "other",
  fbtMethod: "ecm",
});
const PETROL_STAT = calculateNovatedLease({
  salary: 100_000,
  vehiclePrice: 45_000,
  termYears: 5,
  annualRunningCosts: 6_000,
  vehicleType: "other",
  fbtMethod: "statutory",
});

export const NOVATED_LEASE_FAQS: readonly NovatedLeaseFaq[] = [
  {
    q: "How much tax do you save with a novated lease?",
    a: `The saving is the tax you no longer pay on the part of your salary that goes to the car, less any FBT and less the post-tax employee contribution. On ${formatAUD(100_000)} with a ${formatAUD(60_000)} electric car over five years and ${formatAUD(5_000)} a year of running costs, the pre-tax deduction is ${formatAUD(EV.preTaxDeduction)} a year and take-home pay falls ${formatAUD(EV.annualCostToYou)} — so the tax system carries ${formatAUD(EV.preTaxDeduction - EV.annualCostToYou)} of the ${formatAUD(EV.preTaxDeduction)}. Enter your own salary and car price above; the answer moves with your marginal rate.`,
  },
  {
    q: "Is a novated lease worth it?",
    a: `It depends on the car and the FBT treatment, not on your salary alone. Over five years, the ${formatAUD(60_000)} electric car above costs ${formatAUD(EV.leaseTotalCost)} out of take-home pay including the ${formatAUD(EV.residual)} residual, against ${formatAUD(EV.buyTotalCost)} to buy the same car and run it from after-tax income — ${formatAUD(EV.difference)} better. A ${formatAUD(45_000)} petrol car on the employee contribution method comes out ${formatAUD(PETROL_ECM.difference)} ahead; the same car left on the statutory formula is ${formatAUD(Math.abs(PETROL_STAT.difference))} worse off than buying it. Neither side of that comparison includes lease interest.`,
  },
  {
    q: "How is FBT calculated on a novated lease?",
    a: `Under the statutory formula the taxable value is (A x B x C ÷ D) − E: A is the base value (the GST-inclusive cost price, excluding registration and stamp duty), B is the statutory rate of ${formatPercent(FBT.statutoryRate, 0)}, C is the days the car was available for private use, D is the days in the FBT year, and E is your post-tax employee contribution. FBT is then ${formatPercent(FBT.rate, 0)} of that value grossed up at ${FBT.grossUpType1}. On a ${formatAUD(60_000)} car that is ${formatAUD(statutoryTaxableValue(60_000))} of taxable value and ${formatAUD(fbtPayable(statutoryTaxableValue(60_000)))} of FBT for a full year.`,
  },
  {
    q: "What is the Employee Contribution Method (ECM)?",
    a: `ECM means paying part of the car's cost from post-tax salary. Every dollar of employee contribution reduces the FBT taxable value by a dollar, and a dollar of taxable value costs ${formatAUD(FBT.grossUpType1 * FBT.rate, 2)} in FBT — so contributing the full statutory value wipes out the FBT entirely. It pays until your marginal rate reaches ${formatPercent(ecmBreakEvenMarginalRate(), 1)}, which is above the ${formatPercent(0.47, 0)} top rate including the Medicare levy, so in ${LUXURY_CAR_TAX.financialYear} ECM is the cheaper method at every marginal rate.`,
  },
  {
    q: "Are electric cars exempt from FBT on a novated lease?",
    a: `A battery electric or hydrogen fuel cell car is exempt if it was first held and used on or after ${EV_EXEMPTION.firstHeldAndUsedFrom} and luxury car tax has never been payable on it — that means a GST-inclusive value at or under the LCT fuel-efficient threshold, ${formatAUD(LUXURY_CAR_TAX.fuelEfficientThreshold)} for ${LUXURY_CAR_TAX.financialYear}. One dollar over and the whole exemption is gone, not just the excess. Associated running costs — registration, insurance, repairs, and electricity to charge it — are exempt too.`,
  },
  {
    q: "Can I still get the FBT exemption on a plug-in hybrid?",
    a: `Only under a pre-existing arrangement. From ${EV_EXEMPTION.phevExcludedFrom} a plug-in hybrid is no longer a zero or low emissions vehicle, so a PHEV novated lease signed today is fully subject to FBT. A PHEV keeps the exemption only where it was used, or available for use, before that date and there is a financially binding commitment to keep providing it — and the ATO has no discretion to extend the date, even for delivery delays. Any change to that commitment, including an optional extension, a change to the lease payments or residual, or a change of employer, ends the exemption from that point.`,
  },
  {
    q: "Does a novated lease affect my HECS-HELP repayments?",
    a: `Yes, and in both directions. The pre-tax deduction lowers your taxable income, but the car also creates a reportable fringe benefits amount, and your compulsory repayment is worked out on repayment income — taxable income plus that reportable amount. On the ${formatAUD(60_000)} electric car above, the reportable amount is ${formatAUD(EV_HECS.reportableFringeBenefits)}, which lifts repayment income to ${formatAUD(EV_HECS.after.incomeTestIncome)} and the repayment from ${formatAUD(EV_HECS.before.hecsRepayment)} to ${formatAUD(EV_HECS.after.hecsRepayment)} — ${formatAUD(EV_HECS.after.hecsRepayment - EV_HECS.before.hecsRepayment)} more, on a ${formatAUD(HECS_HELP.minimumThreshold)} threshold. An FBT-exempt car is not exempt from reporting.`,
  },
  {
    q: "Does a novated lease change my Medicare levy surcharge?",
    a: `It can. Your reportable fringe benefits amount is added to income for the Medicare levy surcharge test, so a lease can pull your surcharge income back over a tier threshold even while your taxable income falls below it. The same amount counts for Division 293 tax and the private health insurance rebate. It is never taxed itself — it only sits in the income tests.`,
  },
  {
    q: "How does a novated lease show up on my payslip?",
    a: `As two lines, not one. The pre-tax (salary sacrifice) deduction comes off your gross before tax is worked out, so your taxable income and your PAYG withholding both fall. Any employee contribution appears as a separate post-tax deduction after tax. Check that the pre-tax line matches your packaging quote's lease and running-cost budget, that the post-tax line matches the FBT taxable value if you are on ECM, and that your year-to-date gross has fallen by the pre-tax amount.`,
  },
  {
    q: "Is the FBT year the same as the financial year?",
    a: `No. The FBT year runs ${FBT.yearStart} to ${FBT.yearEnd} — currently ${FBT.yearLabel} — while the income year runs 1 July to 30 June. The statutory formula apportions by days in the FBT year, so a lease starting mid-year produces a part-year taxable value, and the reportable amount for an FBT year appears on your income statement for the income year ending on the following 30 June.`,
  },
  {
    q: "Does a novated lease reduce my superannuation?",
    a: `It should not. Under Payday Super, qualifying earnings include salary sacrificed amounts that would otherwise be qualifying earnings, so your employer's super should still be calculated on your pre-sacrifice salary. Check your payslip: if the super line fell when the lease started, ask payroll which figure they are using.`,
  },
  {
    q: "What is the residual or balloon payment at the end of a novated lease?",
    a: `A percentage of the original cost that you pay from after-tax money if you want to keep the car. The ATO's minimum residuals are ${formatPercent(RESIDUAL_MINIMUM_PCT[1], 2)} for a one-year lease, ${formatPercent(RESIDUAL_MINIMUM_PCT[3], 2)} for three years and ${formatPercent(RESIDUAL_MINIMUM_PCT[5], 2)} for five — so a ${formatAUD(60_000)} car on a five-year lease still has ${formatAUD(60_000 * RESIDUAL_MINIMUM_PCT[5])} to pay at the end. The calculator counts the residual in the total, because otherwise the comparison against buying the car is not a fair one.`,
  },
];

/** Source list rendered under the calculator, and in the manifest. */
export const NOVATED_LEASE_SOURCE_LINKS = [
  { title: "Fringe benefits tax – rates and thresholds", url: NOVATED_LEASE_SOURCES.fbtRatesAndThresholds, publisher: "Australian Taxation Office" },
  { title: "Taxable value of a car fringe benefit (statutory formula)", url: NOVATED_LEASE_SOURCES.taxableValueOfACarFringeBenefit, publisher: "Australian Taxation Office" },
  { title: "Electric cars exemption", url: NOVATED_LEASE_SOURCES.electricCarsExemption, publisher: "Australian Taxation Office" },
  { title: "FBT on plug-in hybrid electric vehicles", url: NOVATED_LEASE_SOURCES.phevExemption, publisher: "Australian Taxation Office" },
  { title: "Luxury car tax rate and thresholds", url: NOVATED_LEASE_SOURCES.lctThresholds, publisher: "Australian Taxation Office" },
  { title: "Reportable fringe benefits for employees", url: NOVATED_LEASE_SOURCES.reportableFringeBenefits, publisher: "Australian Taxation Office" },
  { title: "Consequences of having a reportable fringe benefits amount", url: NOVATED_LEASE_SOURCES.reportableConsequences, publisher: "Australian Taxation Office" },
  { title: "TD 93/142 – minimum residual values", url: NOVATED_LEASE_SOURCES.residualValues, publisher: "Australian Taxation Office" },
  { title: "What payments are qualifying earnings (Payday Super)", url: QUALIFYING_EARNINGS.sourceUrl, publisher: "Australian Taxation Office" },
];
