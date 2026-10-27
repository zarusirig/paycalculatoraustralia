import { formatAUD } from "@/lib/constants";
import { calculateFifoPay, FIFO_DEFAULTS, LAFHA_STATUTORY_FOOD } from "@/lib/constants/fifo-pay";
import { AWE_BY_INDUSTRY, AWE_RELEASE, annualise } from "@/lib/data/average-salary";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Tax-treatment sources are
// cited in lib/constants/fifo-pay.ts (ATO pages read 24 September 2026).

const EXAMPLE = calculateFifoPay({ ...FIFO_DEFAULTS, hourlyRate: 55 });
const MINING = AWE_BY_INDUSTRY.find((r) => r.label === "Mining");

export const FIFO_FAQS: Faq[] = [
  {
    q: "How is FIFO pay calculated?",
    a: `Most FIFO jobs pay an hourly rate. Hours up to your ordinary hours (usually 38 a week, averaged over the roster cycle) are paid at the base rate and the rest as overtime, plus any shift loadings and site allowances. On a 2:1 roster of 12-hour shifts at ${formatAUD(55)} an hour with overtime at time and a half, that is ${EXAMPLE.hoursPerCycle} hours a swing, ${formatAUD(EXAMPLE.annual.gross)} a year gross and about ${formatAUD(EXAMPLE.tax.takeHomePay)} after tax.`,
  },
  {
    q: "How much do FIFO workers earn in Australia?",
    a: MINING
      ? `The ABS puts average full-time ordinary time earnings in mining at ${formatAUD(MINING.weekly, 2)} a week (${AWE_RELEASE.referencePeriod}), about ${formatAUD(annualise(MINING.weekly))} a year before overtime. FIFO workers on long rosters often earn more because 12-hour shifts create overtime. Your own pay depends on your enterprise agreement, role and roster.`
      : "Your pay depends on your enterprise agreement, role and roster.",
  },
  {
    q: "Are FIFO workers eligible for the zone tax offset?",
    a: "Not if they live outside the zone. The ATO bases eligibility on your usual place of residence and says you're not eligible if you work in a remote area but don't live there, for example as a fly-in fly-out worker. A FIFO worker whose own home is in a zone can still claim.",
  },
  {
    q: "Is a living-away-from-home allowance taxed?",
    a: `A LAFHA is a fringe benefit, so it isn't taxed as your income: your employer pays fringe benefits tax on it, reduced by exempt accommodation and food components if you're a FIFO or DIDO worker and give the right declaration. The food component is reduced by a statutory amount of ${formatAUD(LAFHA_STATUTORY_FOOD.adultWeekly)} a week per adult.`,
  },
  {
    q: "Is a FIFO travel allowance taxable?",
    a: "Yes. The ATO treats a travel allowance as assessable income, so it's taxed with your wages. You can't claim the cost of getting between home and your regular work site, even by plane and even if you live a long way away: the ATO counts that travel as private.",
  },
  {
    q: "Can I claim flights to site as a tax deduction?",
    a: "Generally no. Travel between your home and your regular place of work is private, however far it is. Flights your employer books and pays for aren't your expense, so there's nothing to claim.",
  },
  {
    q: "Is FIFO overtime taxed more?",
    a: "No. Overtime is taxed at your ordinary marginal rate once it's added to your annual income. It can look taxed more on a payslip because the pay-period withholding treats a big pay as if you earned that every period, but it evens out when you lodge your return.",
  },
  {
    q: "Does super get paid on FIFO overtime?",
    a: "Usually not. Super Guarantee is paid on ordinary time earnings, which excludes overtime. Shift loadings and most site allowances paid for ordinary hours are ordinary time earnings, so super is paid on them.",
  },
];
