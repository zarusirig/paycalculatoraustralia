// Shared FAQ copy for /backpay-calculator/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/backpay-calculator/page.tsx, so the
// structured data cannot drift from the page.

import { formatPercent, SUPER_GUARANTEE } from "@/lib/constants";
import type { FaqItem } from "@/lib/faq";

const SG = formatPercent(SUPER_GUARANTEE.rate, 0);

export const BACKPAY_FAQS: readonly FaqItem[] = [
  {
    q: "How far back can I claim backpay in Australia?",
    a: "Under the Fair Work Act, you can generally recover underpayments for up to 6 years: a court claim must be started within 6 years of each underpayment. This applies to wages, overtime, penalty rates, allowances, and superannuation contributions, so it pays to act quickly once you notice a shortfall.",
  },
  {
    q: "Is backpay taxed differently to normal wages?",
    a: "Backpay received as a lump sum may be withheld at a higher rate under ATO Schedule 5 (back payments). However, you can request the ATO to spread the amount over the financial years it relates to, potentially reducing your tax liability at assessment time.",
  },
  {
    q: "Does my employer owe super on backpay?",
    a: `Yes. The ${SG} superannuation guarantee applies to underpaid wages just as it does to your normal pay. Your employer must make additional super contributions on the wage difference and may face a Super Guarantee Charge (SGC) for late payments.`,
  },
  {
    q: "How do I report underpayment to the Fair Work Ombudsman?",
    a: "Lodge a complaint online at fairwork.gov.au or call 13 13 94. The Fair Work Ombudsman can investigate, mediate, and in serious cases take legal action. Gather payslips, rosters, and bank statements as evidence before filing.",
  },
  {
    q: "Is wage theft a criminal offence in Australia?",
    a: "Yes. Since 1 January 2025, intentionally underpaying wages or other entitlements is a criminal offence under the federal Fair Work Act, with penalties including large fines and imprisonment. Victoria and Queensland had earlier state wage theft laws; for national-system employers the federal offence now applies.",
  },
  {
    q: "Do I get interest on underpaid wages?",
    a: "Interest is not automatically included in Fair Work claims, but courts may award interest on underpaid wages in legal proceedings. The ATO also charges a Super Guarantee Charge (SGC) on late super payments, which includes an interest component and administrative charges.",
  },
];
