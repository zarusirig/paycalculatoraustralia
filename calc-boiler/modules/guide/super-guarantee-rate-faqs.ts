import { SITE_CONFIG, SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";

// Shared by /super-guarantee-rate-history/ and its FAQPage JSON-LD. Rates are
// the ATO's super guarantee table (read 23 Sep 2026); see the page module.

const RATE = formatPercent(SUPER_GUARANTEE.rate, 0);
const FY = SITE_CONFIG.financialYear;

export const SG_RATE_FAQS: readonly { q: string; a: string }[] = [
  {
    q: `What is the superannuation rate for ${FY}?`,
    a: `${RATE}. The super guarantee rate rose from ${formatPercent(SUPER_GUARANTEE.previousRate, 1)} to ${RATE} on ${SUPER_GUARANTEE.effectiveDate} and is unchanged for ${FY}. Your employer pays it on top of your wages, so on a ${formatAUD(80_000)} salary that is ${formatAUD(80_000 * SUPER_GUARANTEE.rate)} a year.`,
  },
  {
    q: "Is the super guarantee going up to 15%?",
    a: `Not under current law. The Superannuation Guarantee (Administration) Act sets the rate at ${RATE}, and the ATO lists ${RATE} for 1 July 2027 onwards. Only Norfolk Island is still stepping up, from ${formatPercent(SUPER_GUARANTEE.norfolkIslandRate, 0)} in ${FY} to 12% on 1 July 2027.`,
  },
  {
    q: "What changed for super on 1 July 2026?",
    a: `Not the rate. Payday Super started on ${SUPER_GUARANTEE.paydaySuperStart}: employers now pay SG for each payday instead of quarterly, calculated on qualifying earnings, and the maximum contribution base became an annual ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}.`,
  },
  {
    q: "What was the super guarantee rate before 12%?",
    a: "11.5% in 2024-25, 11% in 2023-24, 10.5% in 2022-23 and 10% in 2021-22. Before that it was 9.5% for seven years, from 1 July 2014 to 30 June 2021, and 9% from 2002 to 2013.",
  },
  {
    q: "Does salary sacrifice reduce my employer's super guarantee?",
    a: `No. The ATO says salary sacrifice doesn't reduce the amount your employer calculates your super on, and can't count towards the super guarantee. Your employer pays the full ${RATE} as if you hadn't sacrificed, and both count towards the ${formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap.`,
  },
];
