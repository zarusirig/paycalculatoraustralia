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
import { FY_CYCLES, fyLabel, fyLabelOr, fyWindow, adjacentFys, type FyCycleConfig } from "./fy-tax-table-data";
import { ATO_WORKED_EXAMPLES } from "./ato-schedules";

export function fyTaxTableFaqs(cycle: FyCycleConfig, fy: PaygFinancialYear): TaxTableFaq[] {
  const info = PAYG_YEAR_INFO[fy];
  const f = cycle.frequency;
  const g = cycle.exampleGross;
  const label = fyLabel(fy);
  const labelOr = fyLabelOr(fy);
  const tft = calculatePAYGWithholding(g, f, { financialYear: fy });
  const noTft = calculatePAYGWithholding(g, f, { claimsTaxFreeThreshold: false, financialYear: fy });
  const { newer } = adjacentFys(fy);
  const ex = ATO_WORKED_EXAMPLES[f];
  // The 2025-26 page is the ATO's one edition for 1 July 2024 to 30 June 2026.
  const sharedEdition = info.coversYears.length > 1;

  const faqs: TaxTableFaq[] = [
    {
      q: `Which ${cycle.period}ly tax table applies to a payment made in ${labelOr}?`,
      a: `The ATO looks at the date the payment is made, not the period the work covers. A ${cycle.period}ly payment made from ${fyWindow(fy)} uses the ${label} table on this page (${cycle.ato.nat}, built from Schedule 1, NAT 1004). ${
        sharedEdition
          ? "The ATO issued one edition for payments made from 1 July 2024 to 30 June 2026 and did not reissue it on 1 July 2025, so 2024-25 and 2025-26 use the same amounts."
          : "It replaced the edition that applied from 1 July 2024 to 30 June 2026."
      }`,
    },
    {
      q: `How much tax is withheld from ${formatAUD(g)} a ${cycle.period} in ${labelOr}?`,
      a: `Under the ${label} ${cycle.period}ly table, ${formatAUD(g)} a ${cycle.period} with the tax-free threshold claimed and no study loan has ${formatAUD(tft.totalWithheld)} withheld, leaving ${formatAUD(tft.netPerPeriod)}. Without the threshold (a typical second job) ${formatAUD(noTft.totalWithheld)} is withheld. Both include the 2% Medicare levy.`,
    },
    sharedEdition
      ? {
          q: `Did the ${cycle.period}ly tax table change between 2024-25 and 2025-26?`,
          a: `No. The ATO's lists of tax tables for 2024-25 and for 2025-26 both point to the same ${cycle.period}ly table (${cycle.ato.nat}) for payments made from 1 July 2024 to 30 June 2026, so ${formatAUD(g)} a ${cycle.period} has ${formatAUD(tft.totalWithheld)} withheld in either year. The table next changed on 1 July 2026, when the 16% rate on $18,201 to $45,000 fell to 15%: the same ${formatAUD(g)} now has ${formatAUD(withholdingForPeriod(g, f, "tft", "2026-27"))} withheld.`,
        }
      : {
          q: `Is the ${label} ${cycle.period}ly tax table different from 2025-26?`,
          a: `Yes. From 1 July 2026 the 16% rate on $18,201 to $45,000 fell to 15% and the Medicare levy low-income thresholds built into the table rose. The same ${formatAUD(g)} a ${cycle.period} had ${formatAUD(withholdingForPeriod(g, f, "tft", "2025-26"))} withheld under the 2024-25 and 2025-26 table and has ${formatAUD(tft.totalWithheld)} withheld under this one.`,
        },
    {
      q: `Is a study loan (HELP) amount included in the ${label} table?`,
      a: info.stslSupported
        ? `The standard columns are income tax only. The study and training support loan component comes from Schedule 8 (NAT 3539) and is added on top; the lookup on this page includes it when you tick the study loan box.`
        : `No. The columns here are income tax only (including the Medicare levy). Study and training support loan amounts come from a separate ATO schedule (Schedule 8), which had three editions across these two years: from 1 July 2024, from 1 July 2025 and from 24 September 2025. For a payee with a HELP or similar debt, check the Schedule 8 edition in force on the pay date.`,
    },
    {
      q: `Does the ${label} table still matter once ${sharedEdition ? "those years have" : "the year has"} ended?`,
      a: `Yes, for payroll corrections, back-pay runs and audits of a pay dated in ${labelOr}: the amount to withhold is fixed by the table in force on the pay date. It does not set your actual tax, which is worked out on your tax return for the year. ${
        newer ? `Pay dates from ${fyWindow(newer).split(" to ")[0]} use the ${fyLabel(newer)} table instead.` : "Pay dates from 1 July 2027 will need the next edition the ATO publishes."
      }`,
    },
    {
      q: `What is the ATO's own ${cycle.period}ly worked example?`,
      a: `The ATO's example for ${cycle.ato.nat}: ${cycle.period}ly earnings of ${formatAUD(ex.earnings, 2)} are looked up as ${formatAUD(ex.lookup, ex.lookup % 1 ? 2 : 0)}, giving ${formatAUD(ex.withTFT)} with the tax-free threshold and ${formatAUD(ex.noTFT)} without. ${fy === "2026-27" ? "" : `Those two figures come from the current (2026-27) edition; for ${labelOr} the same earnings give ${formatAUD(withholdingForPeriod(ex.earnings, f, "tft", fy))} and ${formatAUD(withholdingForPeriod(ex.earnings, f, "noTft", fy))}.`}`,
    },
  ];
  return faqs;
}

export { FY_CYCLES };
