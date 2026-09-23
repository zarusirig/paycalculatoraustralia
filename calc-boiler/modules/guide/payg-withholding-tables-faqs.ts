// Shared FAQ copy for the /payg-withholding-tables/ hub.
//
// Read by BOTH the rendered accordion (plus its sr-only crawlable mirror) and
// the FAQPage JSON-LD, so the structured data cannot drift from the page.
// Dollar figures are computed from the Schedule 1 engine, never typed in.

import { formatAUD } from "@/lib/constants";
import {
  calculatePAYGWithholding,
  NO_TFN_RATES,
  PAYG_FINANCIAL_YEAR,
  SCHEDULE_5_WITHHOLDING_LIMIT,
} from "@/lib/constants/payg-withholding";
import type { TaxTableFaq } from "@/modules/tax-tables/weekly-tax-table-faqs";

// Salary sacrifice example: $90,000 vs $80,000 a year, paid weekly.
const weekly90k = calculatePAYGWithholding(90_000 / 52, "weekly").totalWithheld;
const weekly80k = calculatePAYGWithholding(80_000 / 52, "weekly").totalWithheld;

export const PAYG_HUB_FAQS: readonly TaxTableFaq[] = [
  {
    q: "Which PAYG tax table do I use?",
    a: `Use the table that matches how often the employee is paid: the weekly tax table (NAT 1005), the fortnightly tax table (NAT 1006) or the monthly tax table (NAT 1007). All three are generated from the same Schedule 1 (NAT 1004) formulas for ${PAYG_FINANCIAL_YEAR}. Bonuses, commissions and back payments use Schedule 5 (NAT 3348) instead.`,
  },
  {
    q: "What does PAYG mean in Australia?",
    a: "PAYG stands for pay as you go. Under PAYG withholding, your employer deducts an amount for income tax from each pay and sends it to the Australian Taxation Office (ATO) on your behalf, so the tax on your wages is paid through the year rather than as one bill after you lodge your return.",
  },
  {
    q: "Why does my PAYG withholding seem higher than my tax bracket?",
    a: "The tables include the 2% Medicare levy, and they assume you earn the same amount every pay for the whole year. If your income varies, you start part-way through the year, or you have deductions the tables cannot see, more may be withheld than your final tax bill, and the difference comes back as a refund when you lodge.",
  },
  {
    q: "What happens if I don't give my employer my tax file number?",
    a: `If you have not quoted a TFN, have not claimed an exemption and have not told your employer you have applied for one, they must withhold ${NO_TFN_RATES.resident * 100}% from a resident (${NO_TFN_RATES.foreignResident * 100}% from a foreign resident) from every dollar, ignoring cents. If you have said on your declaration that you have applied for a TFN, you have 28 days to provide it before those rates apply. Any excess is refunded when you lodge your tax return.`,
  },
  {
    q: "Do I claim the tax-free threshold on a second job?",
    a: "Usually not. You can claim the tax-free threshold from only one payer at a time, normally the one that pays you the most. For other jobs you answer no to the threshold question on the TFN declaration, and those employers withhold using the 'no tax-free threshold' column, which withholds from the first dollar. Claiming the threshold at two jobs at once usually leaves you with a tax bill.",
  },
  {
    q: "How are bonuses withheld under PAYG?",
    a: `Bonuses, commissions and back payments are withheld under Schedule 5 (NAT 3348), not the regular tables. Its methods work out the extra withholding by adding a share of the payment to normal pay and measuring the difference, rather than treating the bonus as if it were paid every period. The amount withheld from the additional payment is capped at ${SCHEDULE_5_WITHHOLDING_LIMIT * 100}% of that payment.`,
  },
  {
    q: "Is the Medicare levy included in the PAYG withholding tables?",
    a: "Yes. The standard tables include the 2% Medicare levy, shaded in at low incomes, so employers do not calculate it separately. They do not include the Medicare levy surcharge, which is assessed on your tax return. A payee who expects to pay the surcharge can ask for more to be withheld using a Medicare levy variation declaration.",
  },
  {
    q: "How does a HECS-HELP debt affect my PAYG withholding?",
    a: "If you tell your employer on your TFN or withholding declaration that you have a study and training support loan (HELP, VSL, SSL, AASL or FS), they add a loan component from Schedule 8 (NAT 3539) on top of the income tax in each pay. It is a separate calculation from the income tax table, and it counts towards your compulsory repayment for the year.",
  },
  {
    q: "What withholding rate applies to foreign residents?",
    a: "Foreign residents for tax purposes have no tax-free threshold and pay no Medicare levy, so their withholding uses a separate scale that starts at 30 cents in the dollar from the first dollar. Working holiday makers on subclass 417 or 462 visas use Schedule 15 instead, which starts at 15%.",
  },
  {
    q: "Is PAYG withholding the employer's or the employee's responsibility?",
    a: "The employer's. The employer must register for PAYG withholding, work out and withhold the correct amount, report it and pay it to the ATO by the due date. Penalties apply to the employer for failing to withhold or pay.",
  },
  {
    q: "Does salary sacrifice reduce PAYG withholding?",
    a: `Yes. An effective salary sacrifice arrangement reduces the gross pay the table is applied to. For example, sacrificing ${formatAUD(10_000)} a year into super on a ${formatAUD(90_000)} salary paid weekly lowers the weekly withholding from ${formatAUD(weekly90k)} to ${formatAUD(weekly80k)} — about ${formatAUD(weekly90k - weekly80k)} a week — before any study loan component. Sacrificed super contributions are generally taxed at 15% in the fund instead.`,
  },
  {
    q: "How often are the PAYG withholding tables updated?",
    a: `The ATO reissues the tables when tax rates, thresholds or the Medicare levy thresholds change, usually from 1 July. For ${PAYG_FINANCIAL_YEAR}, new tables were published on 17 June 2026 for payments made from 1 July 2026, reflecting the cut in the second tax rate from 16% to 15%. The previous regular tables had applied unchanged from 1 July 2024 to 30 June 2026.`,
  },
  {
    q: "What happens if too much PAYG is withheld from my pay?",
    a: "It comes back as a refund when you lodge your tax return. The ATO works out your actual tax for the year and subtracts everything withheld; if more was withheld than you owe, you are refunded the difference. Common causes are starting a job part-way through the year, unpaid leave and work-related deductions the tables do not account for.",
  },
] as const;
