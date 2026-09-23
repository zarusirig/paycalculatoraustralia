// Shared FAQ copy for /mining-fifo-pay-guide/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/mining-fifo-pay-guide/page.tsx,
// so the structured data cannot drift from the page. LAFHA and zone-offset
// treatment follows the ATO sources cited in lib/constants/fifo-pay.ts.

import { EMPLOYMENT } from "@/lib/constants";
import { LAFHA_STATUTORY_FOOD } from "@/lib/constants/fifo-pay";
import type { FaqItem } from "@/lib/faq";

const DAILY_HOURS = EMPLOYMENT.standardWeeklyHours / 5;

export const MINING_FIFO_FAQS: readonly FaqItem[] = [
  {
    q: "How much do FIFO miners earn in Australia?",
    a: "FIFO mining salaries typically range from $100,000 to $200,000+ depending on role, experience, and roster type. Entry-level labourers start around $80,000–$110,000, while experienced drillers, electricians, and site managers can earn $160,000–$220,000. The Pilbara in WA and the Bowen Basin in QLD offer the highest pay.",
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
    a: "The 2 weeks on / 1 week off (2/1) roster maximises earning potential because you work approximately 243 days per year. However, 8/6 and 4/3 rosters offer better work-life balance. The highest-paying rosters are typically those with longer swings (3/1 or 4/1), though these are less common and can impact wellbeing.",
  },
  {
    q: "Can FIFO workers claim travel to the airport as a deduction?",
    a: "Generally no. The ATO treats travel from home to the airport as ordinary commuting, which is not deductible. However, if you carry bulky tools or equipment that cannot be stored at the workplace, you may be able to claim vehicle expenses for the home-to-airport portion of the journey.",
  },
  {
    q: "How does overtime work in mining?",
    a: `Mining overtime depends on your employment agreement. Under the Mining Industry Award, overtime is generally paid at time-and-a-half for the first 2 hours and double time after that. Many mining enterprise agreements offer annualised salaries that include overtime, while others pay hourly rates with overtime loading for hours beyond ${DAILY_HOURS} per day or ${EMPLOYMENT.standardWeeklyHours} per week.`,
  },
];
