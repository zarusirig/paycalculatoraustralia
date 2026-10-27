// Shared FAQ copy for /fortnightly-tax-table/ (ATO NAT 1006).
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) and
// the FAQPage JSON-LD, so the structured data cannot drift from the page.

import { formatAUD, SUPER_GUARANTEE, TAX_BRACKETS_2025_26, TAX_BRACKETS_2026_27 } from "@/lib/constants";
import {
  calculatePAYGWithholding,
  withholdingForPeriod,
  CSV_TABLE_RANGES,
  NO_TFN_RATES,
  PAYG_FINANCIAL_YEAR,
  PAYG_PREVIOUS_FINANCIAL_YEAR,
  PAYG_TABLES_UPDATED,
  PAYG_YEAR_INFO,
  SCALE_2_MEDICARE,
} from "@/lib/constants/payg-withholding";
import type { TaxTableFaq } from "./weekly-tax-table-faqs";
import { ATO_FORTNIGHTLY, ATO_WORKED_EXAMPLES, FORTNIGHTLY_EXTRA_PAY } from "./ato-schedules";

const ex = ATO_WORKED_EXAMPLES.fortnightly;
const at2000 = calculatePAYGWithholding(2_000, "fortnightly");
const at3000 = calculatePAYGWithholding(3_000, "fortnightly", { hasSTSL: true });
const at2000Foreign = calculatePAYGWithholding(2_000, "fortnightly", { foreignResident: true });
const at3000Now = withholdingForPeriod(3_000, "fortnightly", "tft", PAYG_FINANCIAL_YEAR);
const at3000Prev = withholdingForPeriod(3_000, "fortnightly", "tft", PAYG_PREVIOUS_FINANCIAL_YEAR);
// The band whose rate changed on 1 July 2026, read from the bracket constants.
const cutBand = TAX_BRACKETS_2026_27[1];
const cutBandRange = `${formatAUD(cutBand.min)} and ${formatAUD(cutBand.max)}`;
const rateNow = Math.round(cutBand.rate * 100);
const ratePrev = Math.round(TAX_BRACKETS_2025_26[1].rate * 100);
const medicarePct = Math.round(SCALE_2_MEDICARE.rate * 100);

export const FORTNIGHTLY_TAX_TABLE_FAQS: readonly TaxTableFaq[] = [
  {
    q: "What is the fortnightly tax table NAT number?",
    a: `The ATO publishes the fortnightly tax table as ${ATO_FORTNIGHTLY.nat}. The current edition was published on ${ATO_FORTNIGHTLY.published} and applies to ${PAYG_YEAR_INFO[PAYG_FINANCIAL_YEAR].appliesTo} (the ${PAYG_FINANCIAL_YEAR} financial year). A fortnightly tax table labelled ${PAYG_PREVIOUS_FINANCIAL_YEAR} or earlier will over-withhold, because the rate on income between ${cutBandRange} fell from ${ratePrev}% to ${rateNow}% on ${PAYG_TABLES_UPDATED}.`,
  },
  {
    q: "How much tax is withheld from $2,000 a fortnight?",
    a: `Under the ${PAYG_FINANCIAL_YEAR} fortnightly tax table, ${formatAUD(2_000)} a fortnight with the tax-free threshold claimed and no study loan has ${formatAUD(at2000.totalWithheld)} withheld, leaving ${formatAUD(at2000.netPerPeriod)}. That is about ${Math.round((at2000.totalWithheld / 2_000) * 100)}% of gross and already includes the ${medicarePct}% Medicare levy.`,
  },
  {
    q: "Which column of the fortnightly tax table applies to me?",
    a: `Column 2 is "with tax-free threshold" and is the normal column for your main job. Column 3 is "no tax-free threshold" and is the column for a second job. In the ATO's published example, fortnightly earnings of ${formatAUD(ex.earnings, 2)} are looked up as ${formatAUD(ex.lookup)} after ignoring cents, giving ${formatAUD(ex.withTFT)} in column 2 and ${formatAUD(ex.noTFT)} in column 3. The gap between the two columns is what the tax-free threshold is worth in each pay.`,
  },
  {
    q: "Why is every fortnightly withholding amount an even number of dollars?",
    a: "Every fortnightly withholding amount is even because the ATO works it out weekly and then doubles it. Fortnightly earnings are halved to a weekly equivalent, the weekly Schedule 1 formula is applied, that weekly result is rounded to the nearest dollar, and only then is it doubled. Doubling a whole number always gives an even number, so a genuine NAT 1006 figure is never an odd dollar amount. An odd fortnightly figure is a reliable sign that a calculator has annualised and divided instead of following the schedule.",
  },
  {
    q: "Is fortnightly withholding just double the weekly amount?",
    a: "Yes, in effect, because the ATO derives the fortnightly table from the weekly one. A fortnightly figure equals twice the weekly withholding on half the fortnightly pay. Splitting the same salary into weekly instead of fortnightly pays therefore does not change your annual tax; it only changes the rounding by a dollar or two across the year.",
  },
  {
    q: "What happens in a 27-fortnight year?",
    a: `The fortnightly tax table assumes ${FORTNIGHTLY_EXTRA_PAY.standardPayCount} pays a year. Some financial years contain ${FORTNIGHTLY_EXTRA_PAY.extraPayCount} fortnightly pay days, depending on the pay date. That extra pay is withheld as an ordinary fortnight, so across the year you are under-withheld and can face a tax bill instead of a refund. Employers should let payees know. A payee who wants to cover the shortfall can ask payroll to withhold an extra ${formatAUD(FORTNIGHTLY_EXTRA_PAY.bands[0].additional)}, ${formatAUD(FORTNIGHTLY_EXTRA_PAY.bands[1].additional)} or ${formatAUD(FORTNIGHTLY_EXTRA_PAY.bands[2].additional)} a fortnight depending on earnings, as set out in the ATO's additional withholding table.`,
  },
  {
    q: "Does the fortnightly tax table include the Medicare levy?",
    a: `Yes. Both standard columns (ATO Scales 1 and 2) include the ${medicarePct}% Medicare levy. In column 2 (tax-free threshold claimed) the levy is shaded in for low incomes: none is included for an annual taxable income of ${formatAUD(SCALE_2_MEDICARE.annualThreshold)} or less, and it phases in between that figure and ${formatAUD(SCALE_2_MEDICARE.annualShadeInThreshold)}. The Medicare Levy Surcharge is not included. It is assessed on your tax return if your income is above the threshold and you have no private hospital cover.`,
  },
  {
    q: "What does the STSL column add to fortnightly withholding?",
    a: `The STSL column adds a study and training support loan component on top of the income tax. STSL covers HELP, VET Student Loan, Financial Supplement, Student Start-up Loan and Australian Apprenticeship Support Loan debts. The loan component comes from ATO Schedule 8 (NAT 3539), which uses separate coefficients. At ${formatAUD(3_000)} a fortnight with the threshold claimed, the loan component is ${formatAUD(at3000.stslWithheld)} on top of ${formatAUD(at3000.paygWithheld)} of income tax. Like the main table, it is derived weekly and doubled, so it is always an even amount.`,
  },
  {
    q: "How is a foreign resident withheld on a fortnightly pay?",
    a: `Foreign residents use ATO Scale 3 (no tax-free threshold and no Medicare levy), so withholding starts at 30 cents in the dollar from the first dollar. At ${formatAUD(2_000)} a fortnight that is ${formatAUD(at2000Foreign.totalWithheld)}, well above the resident figure. A foreign resident who has not given you a valid TFN is withheld at a flat ${NO_TFN_RATES.foreignResident * 100}%. Working holiday makers use Schedule 15 (NAT 75531) instead.`,
  },
  {
    q: "What if the employee has no tax file number?",
    a: `Withhold ${NO_TFN_RATES.resident * 100}% from a resident and ${NO_TFN_RATES.foreignResident * 100}% from a foreign resident, ignoring cents, once the payee has failed to quote a TFN, has not claimed an exemption and has not advised that they have applied for one. A payee who says on their declaration that they have applied has 28 days. While the no-TFN rate applies, do not allow tax offsets, do not make Medicare levy adjustments and do not withhold a study loan component.`,
  },
  {
    q: "Is superannuation deducted using this table?",
    a: `No. The ${Math.round(SUPER_GUARANTEE.rate * 100)}% superannuation guarantee is paid by your employer on top of your gross wage and goes to your super fund. It never appears in the withholding table and is not taken out of your pay. Only PAYG income tax and any study loan component are withheld. Salary sacrificed super is different: it reduces the gross figure the table is applied to.`,
  },
  {
    q: "Where is the official ATO fortnightly tax table?",
    a: `${ATO_FORTNIGHTLY.nat} is published at ${ATO_FORTNIGHTLY.pageUrl}, with a printable PDF look-up table and an XLSX look-up tool. Both are linked directly from this page. This page reproduces the same Schedule 1 coefficient formulas, but for payroll compliance you should confirm against the current ATO publication.`,
  },
  {
    q: `What changed between the ${PAYG_PREVIOUS_FINANCIAL_YEAR} and ${PAYG_FINANCIAL_YEAR} fortnightly tax tables?`,
    a: `The rate on income between ${cutBandRange} fell from ${ratePrev}% to ${rateNow}% on ${PAYG_TABLES_UPDATED}, so the ATO reissued ${ATO_FORTNIGHTLY.nat} with new Schedule 1 coefficients. At ${formatAUD(3_000)} a fortnight with the tax-free threshold claimed, withholding is ${formatAUD(at3000Prev)} under the ${PAYG_PREVIOUS_FINANCIAL_YEAR} table and ${formatAUD(at3000Now)} under ${PAYG_FINANCIAL_YEAR}. Use the year toggle on this page to see ${PAYG_PREVIOUS_FINANCIAL_YEAR} amounts for an older pay run.`,
  },
  {
    q: "Can I download the fortnightly tax table as a spreadsheet?",
    a: `Yes. The "Download CSV" button above the table builds the fortnightly tax table in $2 steps (the ATO's fortnightly amounts only change every $2) up to ${formatAUD(CSV_TABLE_RANGES.fortnightly.to)} a fortnight, for whichever financial year is selected. The CSV has columns for the tax-free threshold claimed and not claimed, a study loan (${PAYG_FINANCIAL_YEAR} only) and foreign residents. It opens in Excel, Numbers or Google Sheets. The ATO also publishes its own XLSX look-up tool, linked on this page.`,
  },
] as const;
