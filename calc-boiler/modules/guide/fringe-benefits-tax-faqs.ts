// Shared FAQ copy for /fringe-benefits-tax/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in the page file, so the structured data
// cannot drift from the page. FBT rates, gross-up factors, caps and the
// reporting threshold come from lib/constants/novated-lease.ts.

import { formatAUD, formatPercent, MEDICARE_LEVY, TAX_BRACKETS } from "@/lib/constants";
import { capFaceValue, FBT, FBT_CAPS, LUXURY_CAR_TAX } from "@/lib/constants/novated-lease";
import type { FaqItem } from "@/lib/faq";

const RATE = formatPercent(FBT.rate, 0);
const TOP = formatPercent(TAX_BRACKETS[TAX_BRACKETS.length - 1].rate, 0);
const ML = formatPercent(MEDICARE_LEVY.rate, 0);
const T1 = FBT.grossUpType1.toFixed(4);
const T2 = FBT.grossUpType2.toFixed(4);

export const FBT_FAQS: readonly FaqItem[] = [
  {
    q: "Do employees pay FBT?",
    a: `No. FBT is an employer obligation. The employer calculates the taxable value of the non-cash benefits provided to staff (or their associates), grosses it up, applies the ${RATE} FBT rate, and lodges and pays FBT directly to the ATO. However, the reportable fringe benefits amount (RFBA) appears on the employee's income statement and affects income-tested obligations including HECS-HELP repayments, Medicare levy surcharge, and Centrelink payments.`,
  },
  {
    q: "When is the FBT year?",
    a: "The FBT year runs from 1 April to 31 March — different from the income tax year (1 July to 30 June). Employers lodge FBT returns and pay FBT by 21 May each year, or by 25 June if lodging electronically through a registered tax agent. Quarterly FBT instalments may also apply.",
  },
  {
    q: "What is the FBT rate in Australia?",
    a: `The FBT rate is ${RATE} for the FBT year ending ${FBT.yearEnding}. This equals the top marginal income tax rate of ${TOP} plus the ${ML} Medicare levy. The rate has remained at ${RATE} since 1 April 2017. FBT is applied to the grossed-up taxable value of non-cash benefits, using the Type 1 (${T1}) or Type 2 (${T2}) gross-up factor.`,
  },
  {
    q: "Are electric vehicles exempt from FBT?",
    a: `Yes. Under the Electric Car Discount, eligible battery electric vehicles first held and used on or after 1 July 2022 are FBT-exempt (plug-in hybrids only where the arrangement was entered into before 1 April 2025), provided the car's value at first retail sale is below the luxury car tax limit for fuel-efficient vehicles (${formatAUD(LUXURY_CAR_TAX.fuelEfficientThreshold, 0)} for FY${LUXURY_CAR_TAX.financialYear}). This exemption makes novated leasing for EVs significantly more cost-effective.`,
  },
  {
    q: "What does \"grossing up\" mean for FBT?",
    a: `Grossing up converts the taxable value of a fringe benefit to its pre-tax salary equivalent. This reflects the gross income an employee would need to earn to purchase the same benefit after paying income tax. The Type 1 gross-up rate is ${T1} (when the employer claims GST credits) and the Type 2 rate is ${T2} (when no GST credit is claimed).`,
  },
  {
    q: "What's the difference between Type 1 and Type 2 fringe benefits?",
    a: `Type 1 benefits are those on which the employer is entitled to claim a GST credit — they use the higher gross-up factor of ${T1}. Type 2 benefits are those on which no GST credit is available (such as GST-free or input-taxed supplies like residential rent) — they use the lower gross-up factor of ${T2}. The FBT rate of ${RATE} applies to both, but the higher Type 1 gross-up means Type 1 benefits attract more FBT for the same taxable value.`,
  },
  {
    q: "Does RFBA increase the amount of tax I pay?",
    a: "Reportable fringe benefits amounts are not taxed again in the employee's hands — the employer has already paid FBT on the benefit — and they are not added to your assessable income. RFBA is used to calculate adjusted taxable income and other income tests, so it can still increase income-tested amounts such as the Medicare levy surcharge, HECS-HELP repayments and Division 293 tax, and reduce Family Tax Benefit, Centrelink payments and the super co-contribution.",
  },
  {
    q: "What qualifies as a minor benefit exemption?",
    a: "A minor benefit is one with a notional taxable value of less than $300 that is provided infrequently and irregularly, and is not a regular or expected part of the employee's remuneration. Common examples include Christmas gifts, occasional taxi fares home after overtime, and infrequent team meals. Benefits that are provided regularly or as part of a salary packaging arrangement do not qualify, regardless of the value.",
  },
  {
    q: "Can employees reduce FBT by making contributions?",
    a: "Yes. Employees can make after-tax (post-tax) contributions toward the cost of a fringe benefit. Each dollar contributed reduces the taxable value by one dollar, which reduces the grossed-up amount and therefore the employer's FBT liability. This strategy is commonly used with novated leases and salary-packaged cars under the Employee Contribution Method (ECM).",
  },
  {
    q: "Do not-for-profit employees get FBT concessions?",
    a: `Yes. Public benevolent institutions (PBIs) and health promotion charities receive a grossed-up FBT exemption cap of ${formatAUD(FBT_CAPS.pbiAndHealthPromotionCharity)} per employee per FBT year, about ${formatAUD(capFaceValue(FBT_CAPS.pbiAndHealthPromotionCharity))} of GST-free benefits. Public and not-for-profit hospitals and public ambulance services have a cap of ${formatAUD(FBT_CAPS.hospitalAndAmbulance)}, about ${formatAUD(capFaceValue(FBT_CAPS.hospitalAndAmbulance))}. Salary-packaged meal entertainment has its own separate ${formatAUD(FBT_CAPS.salaryPackagedEntertainment)} grossed-up cap. Benefits within these caps are FBT-exempt. Benefits exceeding the cap attract FBT at the standard ${RATE} rate.`,
  },
  {
    q: "What is the difference between the statutory formula and operating cost method?",
    a: `The statutory formula method values the car benefit at ${formatPercent(FBT.statutoryRate, 0)} of the car's base value, regardless of how many kilometres are driven. The operating cost method calculates FBT based on actual running costs (fuel, insurance, registration, servicing, depreciation) multiplied by the private-use percentage determined from a valid 12-week logbook. Cars with a high business-use percentage typically attract less FBT under the operating cost method.`,
  },
  {
    q: "Is FBT tax-deductible for the employer?",
    a: "Yes. The FBT amount paid is a tax-deductible expense for the employer. The cost of providing the fringe benefit itself (e.g., car lease payments, gym membership fees) is also deductible. This means the effective after-tax cost of FBT to the employer is the FBT amount multiplied by (1 minus the company tax rate), which is 25% or 30% depending on the entity type.",
  },
  {
    q: "When does an employer need to register for FBT?",
    a: `An employer must register for FBT with the ATO as soon as it provides fringe benefits that create an FBT liability, and must lodge an FBT return for every year in which it has a liability. If a registered employer has no FBT to pay for a year, it can lodge an FBT non-lodgment advice instead of a return. The ${formatAUD(FBT.reportableThreshold)} figure is a separate test: once an employee's taxable fringe benefits exceed ${formatAUD(FBT.reportableThreshold)} in an FBT year, the grossed-up amount must be reported on their income statement.`,
  },
];
