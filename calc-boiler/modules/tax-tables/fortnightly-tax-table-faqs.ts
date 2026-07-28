// Shared FAQ copy for /fortnightly-tax-table/ (ATO NAT 1006).
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) and
// the FAQPage JSON-LD, so the structured data cannot drift from the page.

import { formatAUD } from "@/lib/constants";
import { calculatePAYGWithholding, NO_TFN_RATES } from "@/lib/constants/payg-withholding";
import type { TaxTableFaq } from "./weekly-tax-table-faqs";
import { ATO_FORTNIGHTLY, ATO_WORKED_EXAMPLES, FORTNIGHTLY_EXTRA_PAY } from "./ato-schedules";

const ex = ATO_WORKED_EXAMPLES.fortnightly;
const at2000 = calculatePAYGWithholding(2_000, "fortnightly");
const at3000 = calculatePAYGWithholding(3_000, "fortnightly", { hasSTSL: true });
const at2000Foreign = calculatePAYGWithholding(2_000, "fortnightly", { foreignResident: true });

export const FORTNIGHTLY_TAX_TABLE_FAQS: readonly TaxTableFaq[] = [
  {
    q: "What is the fortnightly tax table NAT number?",
    a: `The ATO publishes the fortnightly tax table as ${ATO_FORTNIGHTLY.nat}. The current edition was published on ${ATO_FORTNIGHTLY.published} and applies to payments made from 1 July 2026 — the 2026-27 financial year. Anything labelled 2025-26 or earlier will over-withhold, because the second marginal rate fell from 16% to 15% on 1 July 2026.`,
  },
  {
    q: "How much tax is withheld from $2,000 a fortnight?",
    a: `Under the 2026-27 fortnightly tax table, ${formatAUD(2_000)} a fortnight with the tax-free threshold claimed and no study loan has ${formatAUD(at2000.totalWithheld)} withheld, leaving ${formatAUD(at2000.netPerPeriod)}. That is about ${Math.round((at2000.totalWithheld / 2_000) * 100)}% of gross and already includes the 2% Medicare levy.`,
  },
  {
    q: "Which column of the fortnightly tax table applies to me?",
    a: `Column 2 is "with tax-free threshold" and is the normal column for your main job. Column 3 is "no tax-free threshold", used for second jobs. The ATO's published example: fortnightly earnings of ${formatAUD(ex.earnings, 2)} are looked up as ${formatAUD(ex.lookup)} after ignoring cents, giving ${formatAUD(ex.withTFT)} in column 2 and ${formatAUD(ex.noTFT)} in column 3. The gap between the two columns is what the tax-free threshold is worth in each pay.`,
  },
  {
    q: "Why is every fortnightly withholding amount an even number of dollars?",
    a: "Because of how the ATO builds the table. Fortnightly earnings are halved to a weekly equivalent, the weekly Schedule 1 formula is applied, that weekly result is rounded to the nearest dollar, and only then is it doubled. Doubling a whole number always gives an even number, so a genuine NAT 1006 figure is never an odd dollar amount. An odd fortnightly figure is a reliable sign that a calculator has annualised and divided instead of following the schedule.",
  },
  {
    q: "Is fortnightly withholding just double the weekly amount?",
    a: "Effectively yes, and by design — the ATO derives one from the other. A fortnightly figure equals twice the weekly withholding on half the fortnightly pay. Splitting the same salary into weekly instead of fortnightly pays therefore does not change your annual tax; it only changes the rounding by a dollar or two across the year.",
  },
  {
    q: "What happens in a 27-fortnight year?",
    a: `The table assumes ${FORTNIGHTLY_EXTRA_PAY.standardPayCount} pays a year. Some financial years contain ${FORTNIGHTLY_EXTRA_PAY.extraPayCount} fortnightly pay days depending on the pay date, and that extra pay is withheld as an ordinary fortnight — so across the year you are under-withheld and can face a bill instead of a refund. Employers should let payees know. A payee who wants to cover it can ask payroll to withhold an extra ${formatAUD(FORTNIGHTLY_EXTRA_PAY.bands[0].additional)}, ${formatAUD(FORTNIGHTLY_EXTRA_PAY.bands[1].additional)} or ${formatAUD(FORTNIGHTLY_EXTRA_PAY.bands[2].additional)} a fortnight depending on earnings, using the ATO's additional withholding table.`,
  },
  {
    q: "Does the fortnightly tax table include the Medicare levy?",
    a: "Yes. Every amount in the standard columns has the 2% Medicare levy built in, including the low-income shading that phases it in rather than applying it from the first dollar. The Medicare Levy Surcharge is not included — it is assessed on your tax return if your income is above the threshold and you have no private hospital cover.",
  },
  {
    q: "What does the STSL column add to fortnightly withholding?",
    a: `STSL covers HELP, VET Student Loan, Financial Supplement, Student Start-up Loan and Australian Apprenticeship Support Loan debts. Its component comes from ATO Schedule 8 (NAT 3539) using separate coefficients, and it is added on top of the income tax. At ${formatAUD(3_000)} a fortnight with the threshold claimed, the loan component is ${formatAUD(at3000.stslWithheld)} on top of ${formatAUD(at3000.paygWithheld)} of income tax. Like the main table, it is derived weekly and doubled, so it is always an even amount.`,
  },
  {
    q: "How is a foreign resident withheld on a fortnightly pay?",
    a: `Foreign residents use ATO Scale 3 — no tax-free threshold and no Medicare levy — so withholding starts at 30 cents in the dollar from the first dollar. At ${formatAUD(2_000)} a fortnight that is ${formatAUD(at2000Foreign.totalWithheld)}, well above the resident figure. A foreign resident who has not given you a valid TFN is withheld at a flat ${NO_TFN_RATES.foreignResident * 100}%. Working holiday makers use Schedule 15 (NAT 75531) instead.`,
  },
  {
    q: "What if the employee has no tax file number?",
    a: `Withhold ${NO_TFN_RATES.resident * 100}% from a resident and ${NO_TFN_RATES.foreignResident * 100}% from a foreign resident, ignoring cents, once the payee has failed to quote a TFN, has not claimed an exemption and has not advised that they have applied for one. A payee who says on their declaration that they have applied has 28 days. While the no-TFN rate applies, do not allow tax offsets, do not make Medicare levy adjustments and do not withhold a study loan component.`,
  },
  {
    q: "Is superannuation deducted using this table?",
    a: "No. The 12% superannuation guarantee is paid by your employer on top of your gross wage and goes to your super fund — it never appears in the withholding table and is not taken out of your pay. Only PAYG income tax and any study loan component are withheld. Salary sacrificed super is different: it reduces the gross figure the table is applied to.",
  },
  {
    q: "Where is the official ATO fortnightly tax table?",
    a: `${ATO_FORTNIGHTLY.nat} is published at ${ATO_FORTNIGHTLY.pageUrl}, with a printable PDF look-up table and an XLSX look-up tool. Both are linked directly from this page. This page reproduces the same Schedule 1 coefficient formulas, but for payroll compliance you should confirm against the current ATO publication.`,
  },
] as const;
