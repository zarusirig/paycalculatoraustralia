// Shared FAQ copy for /mining-fifo-pay-guide/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/mining-fifo-pay-guide/page.tsx,
// so the structured data cannot drift from the page. LAFHA and zone-offset
// treatment follows the ATO sources cited in lib/constants/fifo-pay.ts.

import { formatPercent } from "@/lib/constants";
import { FIFO_DAYS_PER_YEAR, LAFHA_STATUTORY_FOOD } from "@/lib/constants/fifo-pay";
import { MINING_AWARD } from "@/lib/constants/modern-awards-oct2";
import type { FaqItem } from "@/lib/faq";

// Days on site a year for a roster, on the same 364-day year the FIFO
// calculator uses (lib/constants/fifo-pay.ts).
const daysOnSite = (on: number, off: number) => Math.round((on * FIFO_DAYS_PER_YEAR) / (on + off));

// Mining Industry Award 2020 overtime rates (cl 20.1 to 20.2), from the award
// data verified in lib/constants/modern-awards-oct2.ts.
const MINING_OVERTIME = MINING_AWARD.overtime
  .map((r) => `${r.label}: ${formatPercent(r.fullTime, 0)}`)
  .join("; ");

export const MINING_FIFO_FAQS: readonly FaqItem[] = [
  {
    q: "How much do FIFO miners earn in Australia?",
    a: "FIFO mining salaries typically range from $100,000 to $200,000+ depending on role, experience, and roster type. Entry-level labourers start around $80,000 to $110,000, while experienced drillers, electricians, and site managers can earn $160,000 to $220,000. The Pilbara in WA and the Bowen Basin in QLD offer the highest pay.",
  },
  {
    q: "Can FIFO workers claim the zone tax offset?",
    a: "Generally no. Since 2015, FIFO workers who maintain their usual place of residence outside the remote zone are not eligible for the zone tax offset. The offset requires the zone to be your \"usual place of residence.\" Only workers who genuinely live in a zone, including FIFO workers whose home is itself in a zone, can claim it.",
  },
  {
    q: "What is LAFHA for FIFO workers?",
    a: "A Living Away From Home Allowance (LAFHA) is a payment from your employer to cover the extra food and accommodation costs of living away from your usual residence for work. For FIFO workers it typically covers meals and accommodation while on site or in transit.",
  },
  {
    q: "Is LAFHA tax-free for FIFO workers?",
    a: `A LAFHA is a fringe benefit, so it is taxed to the employer under FBT rather than included in your assessable income. For eligible FIFO workers who keep a home elsewhere and give the employer the required declaration, the exempt accommodation and food components reduce the taxable value, often to nil (food above a statutory $${LAFHA_STATUTORY_FOOD.adultWeekly} a week per adult is exempt). An allowance paid for travelling for work is different: it is a travel allowance and is assessable to you. Check with your employer's payroll team for your specific arrangement.`,
  },
  {
    q: "What is the best FIFO roster for earning?",
    a: `On the same hourly rate, the roster with the most days on site pays the most. A 4/1 roster (28 on, 7 off) puts you on site about ${daysOnSite(28, 7)} days a year, a 3/1 (21 on, 7 off) about ${daysOnSite(21, 7)} and a 2/1 (14 on, 7 off) about ${daysOnSite(14, 7)}. An 8/6 roster gives about ${daysOnSite(8, 6)} days and a 4/3 about ${daysOnSite(4, 3)}, so you earn less but spend more days at home.`,
  },
  {
    q: "Can FIFO workers claim travel to the airport as a deduction?",
    a: "Generally no. The ATO treats travel from home to the airport as ordinary commuting, which is not deductible. However, if you carry bulky tools or equipment that cannot be stored at the workplace, you may be able to claim vehicle expenses for the home-to-airport portion of the journey.",
  },
  {
    q: "How does overtime work in mining?",
    a: `Under the ${MINING_AWARD.meta.name} (${MINING_AWARD.meta.code}), overtime is work in addition to your ordinary hours, which for a full-time employee average ${MINING_AWARD.meta.standardWeeklyHours} hours a week (cl 12.1). Overtime is paid as a percentage of your ordinary hourly rate (cl 20.1 and 20.2):${MINING_OVERTIME}. If an enterprise agreement covers you, its overtime terms apply instead, so check your agreement.`,
  },
];
