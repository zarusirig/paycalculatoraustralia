// Shared FAQ copy for /weekly-tax-table/ (ATO NAT 1005).
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) and
// the FAQPage JSON-LD, so the structured data cannot drift from the page.

import { formatAUD } from "@/lib/constants";
import { calculatePAYGWithholding, NO_TFN_RATES } from "@/lib/constants/payg-withholding";
import { ATO_WEEKLY, ATO_WORKED_EXAMPLES, WEEKLY_EXTRA_PAY } from "./ato-schedules";

export interface TaxTableFaq {
  q: string;
  a: string;
}

const ex = ATO_WORKED_EXAMPLES.weekly;
const at1000 = calculatePAYGWithholding(1_000, "weekly");
const at1500 = calculatePAYGWithholding(1_500, "weekly", { hasSTSL: true });
const at1000Foreign = calculatePAYGWithholding(1_000, "weekly", { foreignResident: true });

export const WEEKLY_TAX_TABLE_FAQS: readonly TaxTableFaq[] = [
  {
    q: "What is the weekly tax table NAT number?",
    a: `The ATO publishes the weekly tax table as ${ATO_WEEKLY.nat}. The current edition was published on ${ATO_WEEKLY.published} and applies to payments made from 1 July 2026 — the 2026-27 financial year. If a payroll system or printed sheet is labelled with an earlier year, it is out of date and will over-withhold.`,
  },
  {
    q: "Which column of the weekly tax table applies to me?",
    a: `Column 2 is "with tax-free threshold" — the standard column for your main job. Column 3 is "no tax-free threshold", used for a second job or where you have not claimed the threshold. Your answers on the Tax file number declaration decide the column, not your employer's preference. The ATO's own example: weekly earnings of ${formatAUD(ex.earnings, 2)} are looked up as ${formatAUD(ex.lookup)}, giving ${formatAUD(ex.withTFT)} in column 2 and ${formatAUD(ex.noTFT)} in column 3.`,
  },
  {
    q: "How much tax is withheld from $1,000 a week?",
    a: `Under the 2026-27 weekly tax table, ${formatAUD(1_000)} a week with the tax-free threshold claimed and no study loan has ${formatAUD(at1000.totalWithheld)} withheld, leaving ${formatAUD(at1000.netPerPeriod)} in hand. That is about ${Math.round((at1000.totalWithheld / 1_000) * 100)}% of gross, and it already includes the 2% Medicare levy.`,
  },
  {
    q: "Does the weekly tax table include the Medicare levy?",
    a: "Yes. The 2% Medicare levy is built into every amount in the standard columns, including the low-income shading that phases the levy in gradually. What is not included is the Medicare Levy Surcharge, which applies to higher earners without private hospital cover and is assessed on your tax return rather than withheld from your pay.",
  },
  {
    q: "What does the STSL column add to my weekly withholding?",
    a: `STSL stands for study and training support loans — HELP, VET Student Loan, Financial Supplement, Student Start-up Loan and Australian Apprenticeship Support Loan debts. The component comes from ATO Schedule 8 (NAT 3539), which has its own coefficients, and is added on top of the ordinary withholding. At ${formatAUD(1_500)} a week with the threshold claimed, the loan component is ${formatAUD(at1500.stslWithheld)} on top of ${formatAUD(at1500.paygWithheld)} in income tax.`,
  },
  {
    q: "What happens if an employee does not give you a TFN?",
    a: `If a payee has not quoted a tax file number, has not claimed an exemption, and has not told you they have applied for one, you must withhold ${NO_TFN_RATES.resident * 100}% from a resident's payments and ${NO_TFN_RATES.foreignResident * 100}% from a foreign resident's, ignoring cents. If they state on their Tax file number declaration that they have applied for a TFN, they get 28 days before those flat rates begin. Do not allow tax offsets, Medicare levy adjustments or study loan withholding when the no-TFN rates apply.`,
  },
  {
    q: "How does the weekly tax table work for a foreign resident?",
    a: `Foreign residents use ATO Scale 3: no tax-free threshold and no Medicare levy, so withholding begins at 30 cents in the dollar from the first dollar. At ${formatAUD(1_000)} a week that is ${formatAUD(at1000Foreign.totalWithheld)}, noticeably more than a resident on the same pay. A foreign resident who has not provided a valid TFN is withheld at a flat ${NO_TFN_RATES.foreignResident * 100}% instead. Working holiday makers are different again and use Schedule 15 (NAT 75531).`,
  },
  {
    q: "What happens when there are 53 pays in a financial year?",
    a: `The weekly tax table is built on ${WEEKLY_EXTRA_PAY.standardPayCount} pays a year. Some financial years contain ${WEEKLY_EXTRA_PAY.extraPayCount} weekly pay days depending on where the pay date falls, and the extra pay is withheld as though it were an ordinary week — so slightly too little tax is collected across the year and the shortfall lands on the tax assessment. Employers should tell payees when it happens. A payee who wants to avoid a bill can ask for an extra ${formatAUD(WEEKLY_EXTRA_PAY.bands[0].additional)} to ${formatAUD(WEEKLY_EXTRA_PAY.bands[2].additional)} a week, depending on earnings, using the ATO's additional withholding table.`,
  },
  {
    q: "Is overtime taxed using the weekly tax table?",
    a: "Yes. Overtime paid in a normal pay run is added to that week's gross earnings and withheld from the same table row for the higher total. That can push a big week into a higher band, but the excess comes back as a refund at tax time because your annual tax depends on annual income. Lump-sum bonuses, commissions and back payments are different — they use Schedule 5 (NAT 3348) instead.",
  },
  {
    q: "Why is my payslip withholding slightly different from this table?",
    a: "Common causes are salary sacrifice (withholding is calculated on the reduced gross), a tax offset claimed through a Withholding declaration, a Medicare levy adjustment, extra voluntary withholding, or a withholding variation. Payroll may also be applying an out-of-date table. If none of those explain the gap, check your Tax file number declaration settings with payroll — the difference between column 2 and column 3 is the single most common cause.",
  },
  {
    q: "Where is the official ATO weekly tax table PDF?",
    a: `The ATO publishes ${ATO_WEEKLY.nat} at ${ATO_WEEKLY.pageUrl}, with a printable look-up table in PDF and a spreadsheet look-up tool in XLSX. Both are linked directly from this page. For payroll compliance always confirm against the current ATO publication; this page reproduces the same Schedule 1 formulas so you can check a figure quickly.`,
  },
  {
    q: "Do I use the weekly tax table for leave and termination payments?",
    a: "Ordinary holiday pay and long service leave taken while still employed are included in normal weekly earnings and withheld from this table. Leave loading paid as a lump sum uses Schedule 5. Unused annual or long service leave paid out on termination uses Schedule 7 (NAT 3351), and employment termination payments such as redundancy use Schedule 11 (NAT 70980). Do not withhold a study loan component from lump-sum termination payments.",
  },
] as const;
