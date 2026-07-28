// Shared FAQ copy for /monthly-tax-table/ (ATO NAT 1007).
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) and
// the FAQPage JSON-LD, so the structured data cannot drift from the page.

import { formatAUD } from "@/lib/constants";
import { calculatePAYGWithholding, NO_TFN_RATES } from "@/lib/constants/payg-withholding";
import type { TaxTableFaq } from "./weekly-tax-table-faqs";
import { ATO_MONTHLY, ATO_WORKED_EXAMPLES } from "./ato-schedules";

const ex = ATO_WORKED_EXAMPLES.monthly;
const at6500 = calculatePAYGWithholding(6_500, "monthly");
const at8000 = calculatePAYGWithholding(8_000, "monthly", { hasSTSL: true });
const at6500Foreign = calculatePAYGWithholding(6_500, "monthly", { foreignResident: true });

export const MONTHLY_TAX_TABLE_FAQS: readonly TaxTableFaq[] = [
  {
    q: "What is the monthly tax table NAT number?",
    a: `The ATO publishes the monthly tax table as ${ATO_MONTHLY.nat}. The current edition was published on ${ATO_MONTHLY.published} and applies to payments made from 1 July 2026 — the 2026-27 financial year. It was reissued because the marginal rate on income between $18,201 and $45,000 fell from 16% to 15% on that date.`,
  },
  {
    q: "How much tax is withheld from a $6,500 monthly salary?",
    a: `Under the 2026-27 monthly tax table, ${formatAUD(6_500)} a month — a ${formatAUD(78_000)} annual salary — with the tax-free threshold claimed and no study loan has ${formatAUD(at6500.totalWithheld)} withheld, leaving ${formatAUD(at6500.netPerPeriod)}. That is roughly ${Math.round((at6500.totalWithheld / 6_500) * 100)}% of gross and includes the 2% Medicare levy.`,
  },
  {
    q: "Is monthly withholding just the weekly amount times four?",
    a: `No, and this is the most common monthly payroll error. A month averages about 4.33 weeks, not four. The ATO converts monthly earnings to a weekly equivalent by multiplying by 3 and dividing by 13, applies the weekly Schedule 1 formula, then converts back by multiplying by 13 and dividing by 3. Using weekly × 4 understates withholding by roughly 8%.`,
  },
  {
    q: "Why does the monthly table ask for cents when the weekly one does not?",
    a: `Because of a quirk in the conversion. For weekly and fortnightly pay you ignore cents before looking up the amount. For monthly pay the ATO tells you to enter the earnings including cents, and adds a specific rule: if the monthly amount ends in exactly 33 cents, add one cent before converting. The ATO's own example uses ${formatAUD(ex.earnings, 2)}, which gives ${formatAUD(ex.withTFT)} with the tax-free threshold and ${formatAUD(ex.noTFT)} without it.`,
  },
  {
    q: "Which column of the monthly tax table applies to me?",
    a: "Column 2 is \"with tax-free threshold\" — the standard column for your main job. Column 3 is \"no tax-free threshold\", used for a second job or where the threshold has not been claimed. The answers on your Tax file number declaration decide which applies. Do not allow tax offsets or a Medicare levy adjustment when using column 3.",
  },
  {
    q: "Does a monthly pay cycle ever have a 13th pay?",
    a: "No. Twelve calendar months means exactly 12 monthly pay days every financial year, so monthly payroll never hits the extra-pay problem that weekly (53 pays) and fortnightly (27 pays) cycles run into. That is one genuine administrative advantage of monthly pay: withholding across the year always lines up with what the table assumes.",
  },
  {
    q: "Does the monthly tax table include the Medicare levy?",
    a: "Yes. The 2% Medicare levy is built into every amount in the standard columns, including the low-income shading. The Medicare Levy Surcharge is not included — it is assessed on your tax return if you earn above the surcharge threshold without private hospital cover.",
  },
  {
    q: "What does the STSL column add to monthly withholding?",
    a: `STSL covers HELP, VET Student Loan, Financial Supplement, Student Start-up Loan and Australian Apprenticeship Support Loan debts. The component is calculated under ATO Schedule 8 (NAT 3539) on the same weekly equivalent, then converted back to a month. At ${formatAUD(8_000)} a month with the threshold claimed, that is ${formatAUD(at8000.stslWithheld)} of loan repayment on top of ${formatAUD(at8000.paygWithheld)} of income tax.`,
  },
  {
    q: "How is a foreign resident withheld on a monthly salary?",
    a: `Foreign residents use ATO Scale 3: no tax-free threshold, no Medicare levy, and withholding from the first dollar at 30 cents in the dollar. At ${formatAUD(6_500)} a month that is ${formatAUD(at6500Foreign.totalWithheld)}. A foreign resident who has not provided a valid TFN is withheld at a flat ${NO_TFN_RATES.foreignResident * 100}% of earnings, ignoring cents.`,
  },
  {
    q: "What if a monthly-paid employee has no TFN?",
    a: `Withhold ${NO_TFN_RATES.resident * 100}% from a resident and ${NO_TFN_RATES.foreignResident * 100}% from a foreign resident, ignoring cents, once they have failed to quote a TFN, have not claimed an exemption and have not advised that they have applied for one. If they state on their declaration that they have applied, they get 28 days first. While the no-TFN rate applies, allow no tax offsets, make no Medicare levy adjustment and withhold no study loan component.`,
  },
  {
    q: "Why was so much tax withheld in the month I got my bonus?",
    a: "Because adding a lump sum to a normal monthly pay and using this table tells the formula you earn that combined amount every month, which annualises you into a much higher bracket. That is not the correct treatment. Bonuses, commissions and back payments that relate to more than one pay period should be withheld under Schedule 5 (NAT 3348), which spreads the payment across the year and usually withholds substantially less.",
  },
  {
    q: "Where is the official ATO monthly tax table?",
    a: `${ATO_MONTHLY.nat} is published at ${ATO_MONTHLY.pageUrl}, with a printable PDF look-up table and an XLSX look-up tool, both linked from this page. This page applies the same Schedule 1 coefficient formulas, but confirm payroll-critical figures against the current ATO publication.`,
  },
] as const;
