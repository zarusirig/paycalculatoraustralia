// Shared FAQ copy for /salary-sacrifice-vs-mortgage/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in
// app/salary-sacrifice-vs-mortgage/page.tsx, so the structured data cannot
// drift from the page. Caps, rates and ages come from lib/constants.

import { MEDICARE_LEVY, SITE_CONFIG, SUPER_GUARANTEE, TAX_BRACKETS, formatAUD } from "@/lib/constants";
import { PRESERVATION_AGE_TABLE } from "@/lib/constants/pension-age";
import { CARRY_FORWARD, CONTRIBUTIONS_TAX_RATE } from "@/lib/constants/super-contributions";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const cents = (r: number) => `${Math.round(r * 100)} cents`;
const [, , MID, HIGH, TOP] = TAX_BRACKETS.map((b) => b.rate);
const PRESERVATION_AGE = PRESERVATION_AGE_TABLE[PRESERVATION_AGE_TABLE.length - 1].years;
const MONTHLY = 500;
const HIGH_SAVING = MONTHLY * 12 * (HIGH - CONTRIBUTIONS_TAX_RATE);

export const SALARY_SACRIFICE_VS_MORTGAGE_FAQS: readonly FaqItem[] = [
  {
    q: "Is salary sacrifice into super better than paying off a mortgage?",
    a: `Salary sacrifice into super generally gives the better long-term outcome when your marginal tax rate is high (${pct(HIGH)} or more) and your mortgage rate is below 5-6%. Extra mortgage repayments win when mortgage rates are high and you need access to the money. The deciding factors are your marginal tax rate, your mortgage rate and your time to retirement.`,
  },
  {
    q: "How much tax do I save by salary sacrificing into super?",
    a: `Salary sacrifice contributions are taxed at ${pct(CONTRIBUTIONS_TAX_RATE)} inside super, compared to your marginal tax rate (up to ${pct(TOP)}). If your marginal rate is ${pct(MID)}, you save ${cents(MID - CONTRIBUTIONS_TAX_RATE)} per dollar. At ${pct(HIGH)}, you save ${cents(HIGH - CONTRIBUTIONS_TAX_RATE)}. At ${pct(TOP)}, you save ${cents(TOP - CONTRIBUTIONS_TAX_RATE)}. You also save the ${pct(MEDICARE_LEVY.rate)} Medicare levy on every dollar sacrificed. For someone in the ${pct(HIGH)} bracket salary sacrificing ${formatAUD(MONTHLY)}/month, that is ${formatAUD(HIGH_SAVING)} per year in income tax savings before the Medicare levy.`,
  },
  {
    q: "Can I access salary sacrificed super to pay off my mortgage?",
    a: `Not until you reach preservation age (${PRESERVATION_AGE} for anyone born on or after 1 July 1964) and meet a condition of release such as retirement. There is no provision to withdraw super for mortgage payments under normal circumstances. Early access is only available in limited cases such as severe financial hardship, terminal illness, or compassionate grounds approved by the ATO. That is the trade-off: salary sacrifice saves you tax now, but the money stays in super until preservation age.`,
  },
  {
    q: "What is the maximum I can salary sacrifice into super?",
    a: `The concessional contributions cap is ${formatAUD(SUPER_GUARANTEE.concessionalCap)} per year for FY${SITE_CONFIG.financialYear}. The cap includes both employer SG contributions and your salary sacrifice. Unused cap amounts from the previous ${CARRY_FORWARD.years} financial years can be carried forward if your total super balance is under ${formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)}. Use the Salary Sacrifice Calculator to see the tax saving on your own salary.`,
    links: { "Salary Sacrifice Calculator": "/salary-sacrifice-calculator/" },
  },
  {
    q: "Should I do both salary sacrifice and extra mortgage payments?",
    a: `A hybrid approach often works best. Salary sacrifice enough to capture the tax benefit (especially if you are in the ${pct(HIGH)} or ${pct(TOP)} bracket), then direct surplus cash to mortgage repayments or an offset account for the certain return at your mortgage interest rate. You get the super tax saving and keep the rest of your cash accessible through redraw or the offset account.`,
  },
];
