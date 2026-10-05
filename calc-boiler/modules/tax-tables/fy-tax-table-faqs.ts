// FAQ copy for the year-locked tax-table pages. Read by BOTH the rendered
// accordion (plus its sr-only mirror) and the FAQPage JSON-LD, so they cannot
// drift (npm run check:faq).

import { formatAUD } from "@/lib/constants";
import {
  PAYG_YEAR_INFO,
  calculatePAYGWithholding,
  withholdingForPeriod,
  type PaygFinancialYear,
} from "@/lib/constants/payg-withholding";
import type { TaxTableFaq } from "./weekly-tax-table-faqs";
import { FY_CYCLES, fyWindow, adjacentFys, type FyCycleConfig } from "./fy-tax-table-data";
import { ATO_WORKED_EXAMPLES } from "./ato-schedules";

export function fyTaxTableFaqs(cycle: FyCycleConfig, fy: PaygFinancialYear): TaxTableFaq[] {
  const info = PAYG_YEAR_INFO[fy];
  const f = cycle.frequency;
  const g = cycle.exampleGross;
  const tft = calculatePAYGWithholding(g, f, { financialYear: fy });
  const noTft = calculatePAYGWithholding(g, f, { claimsTaxFreeThreshold: false, financialYear: fy });
  const { newer } = adjacentFys(fy);
  const ex = ATO_WORKED_EXAMPLES[f];
  const sameAsOlder = fy === "2024-25" || fy === "2025-26";

  const faqs: TaxTableFaq[] = [
    {
      q: `Which ${cycle.period}ly tax table applies to a payment made in ${fy}?`,
      a: `The ATO looks at the date the payment is made, not the period the work covers. A ${cycle.period}ly payment made between ${fyWindow(fy)} uses the ${fy} table on this page (${cycle.ato.nat}, built from Schedule 1, NAT 1004). ${
        sameAsOlder
          ? "The ATO issued one Schedule 1 edition that applied to payments made from 1 July 2024 to 30 June 2026, so the 2024-25 and 2025-26 amounts are identical."
          : "It replaced the edition that applied from 1 July 2024 to 30 June 2026."
      }`,
    },
    {
      q: `How much tax is withheld from ${formatAUD(g)} a ${cycle.period} in ${fy}?`,
      a: `Under the ${fy} ${cycle.period}ly table, ${formatAUD(g)} a ${cycle.period} with the tax-free threshold claimed and no study loan has ${formatAUD(tft.totalWithheld)} withheld, leaving ${formatAUD(tft.netPerPeriod)}. Without the threshold (a typical second job) ${formatAUD(noTft.totalWithheld)} is withheld. Both include the 2% Medicare levy.`,
    },
    {
      q: `Is the ${fy} ${cycle.period}ly tax table different from other years?`,
      a: sameAsOlder
        ? `The coefficients for 2024-25 and 2025-26 are the same, because the ATO published one Schedule 1 edition for both years. From 1 July 2026 a new edition applies: the 16% rate on $18,201 to $45,000 fell to 15%, so ${formatAUD(g)} a ${cycle.period} now has ${formatAUD(withholdingForPeriod(g, f, "tft", "2026-27"))} withheld with the threshold, against ${formatAUD(tft.totalWithheld)} under the ${fy} table.`
        : `Yes. From 1 July 2026 the 16% rate on $18,201 to $45,000 fell to 15%. The same ${formatAUD(g)} a ${cycle.period} had ${formatAUD(withholdingForPeriod(g, f, "tft", "2025-26"))} withheld under the 2025-26 table and has ${formatAUD(tft.totalWithheld)} withheld under this one.`,
    },
    {
      q: `Is a study loan (HELP) amount included in the ${fy} table?`,
      a: info.stslSupported
        ? `The standard columns are income tax only. The study and training support loan component comes from Schedule 8 (NAT 3539) and is added on top; the lookup on this page includes it when you tick the study loan box.`
        : `No. The columns here are income tax only (including the Medicare levy). Study and training support loan amounts come from a separate ATO schedule (Schedule 8) whose ${fy} edition this page does not carry, so check the ATO's Schedule 8 for a payee with a HELP or similar debt in ${fy}.`,
    },
    {
      q: `Does the ${fy} table still matter once the year has ended?`,
      a: `Yes, for payroll corrections, back-pay runs and audits of a pay dated in ${fy}: the amount to withhold is fixed by the table in force on the pay date. It does not set your actual tax, which is worked out on your tax return for the year. ${
        newer ? `Pay dates from ${fyWindow(newer).split(" to ")[0]} use the ${newer} table instead.` : "Pay dates from 1 July 2027 will need the next edition the ATO publishes."
      }`,
    },
    {
      q: `What is the ATO's own ${cycle.period}ly worked example?`,
      a: `The ATO's example for ${cycle.ato.nat}: ${cycle.period}ly earnings of ${formatAUD(ex.earnings, 2)} are looked up as ${formatAUD(ex.lookup, ex.lookup % 1 ? 2 : 0)}, giving ${formatAUD(ex.withTFT)} with the tax-free threshold and ${formatAUD(ex.noTFT)} without. ${fy === "2026-27" ? "" : `Those two figures come from the current (2026-27) edition; for ${fy} the same earnings give ${formatAUD(withholdingForPeriod(ex.earnings, f, "tft", fy))} and ${formatAUD(withholdingForPeriod(ex.earnings, f, "noTft", fy))}.`}`,
    },
  ];
  return faqs;
}

export { FY_CYCLES };
