// Shared FAQ copy for /super-co-contribution/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/super-co-contribution/page.tsx,
// so the structured data cannot drift from the page. Thresholds come from
// CO_CONTRIBUTION and SPOUSE_OFFSET in lib/constants/super-contributions.ts.

import { formatAUD } from "@/lib/constants";
import { CO_CONTRIBUTION as CC, SPOUSE_OFFSET as SO } from "@/lib/constants/super-contributions";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;

export const SUPER_CO_CONTRIBUTION_FAQS: readonly FaqItem[] = [
  {
    q: "How much is the government super co-contribution?",
    a: `The government matches 50 cents for every $1.00 of eligible personal (non-concessional) super contributions, up to a maximum of ${formatAUD(CC.maxEntitlement)} per financial year. To receive the full ${formatAUD(CC.maxEntitlement)} in ${CC.incomeYear}, you need to contribute ${formatAUD(CC.contributionForMax)} and have total income of ${formatAUD(CC.lowerThreshold)} or less. The maximum co-contribution reduces progressively for incomes between ${formatAUD(CC.lowerThreshold)} and ${formatAUD(CC.higherThreshold)}, where it reaches zero.`,
  },
  {
    q: "Do I need to apply for the super co-contribution?",
    a: "No. The ATO automatically determines your eligibility when you lodge your income tax return. If you qualify, the co-contribution is paid directly into your super fund — usually within 60 days of your tax return being processed. Make sure your super fund has your tax file number and your details are up to date with the ATO via your myGov account.",
  },
  {
    q: "What is the spouse super contribution tax offset?",
    a: `If you contribute after-tax money to your spouse's super fund and their income is below ${formatAUD(SO.spouseIncomeCutOff)}, you can claim a tax offset of up to ${formatAUD(SO.maxOffset)}. The maximum offset applies when you contribute ${formatAUD(SO.maxContribution)} or more and your spouse earns ${formatAUD(SO.spouseIncomeLower)} or less. The offset is ${pct(SO.rate)} of the eligible contribution amount and phases out between ${formatAUD(SO.spouseIncomeLower)} and ${formatAUD(SO.spouseIncomeCutOff)} spouse income.`,
  },
  {
    q: "Does salary sacrifice count for the co-contribution?",
    a: "No. Salary sacrifice contributions are concessional (pre-tax) contributions. The co-contribution only matches non-concessional (after-tax) personal contributions — money you transfer from your own bank account to your super fund. The two strategies are separate and can be used alongside each other.",
  },
  {
    q: "Can self-employed people get the co-contribution?",
    a: `Yes, provided at least ${pct(CC.eligibleIncomeShare)} of your total income comes from employment or business activities (not passive income like investments or rental). Self-employed people who meet the income thresholds and make personal non-concessional contributions are fully eligible. However, if you claim a tax deduction for a personal super contribution, that portion becomes a concessional contribution and does not count towards the co-contribution.`,
  },
  {
    q: "Can I receive both the co-contribution and spouse offset?",
    a: "Yes, but they apply to different people. The low-income spouse can receive the government co-contribution on their own personal contributions. Simultaneously, the higher-earning partner can contribute to the low-income spouse's super and claim the spouse offset on their own tax return. The two benefits stack — one rewards personal contributions, the other rewards spousal support.",
  },
  {
    q: "When do I need to make contributions by?",
    a: "Personal super contributions must be received by your super fund on or before 30 June of the relevant financial year. Allow 3-5 business days for bank transfers to process. Contributions received after 30 June count towards the following financial year. The spouse contribution for the tax offset follows the same deadline.",
  },
];
