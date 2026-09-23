// Shared FAQ copy for /notice-of-assessment/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/notice-of-assessment/page.tsx, so the
// structured data cannot drift from the page.

import type { FaqItem } from "@/lib/faq";

export const NOTICE_OF_ASSESSMENT_FAQS: readonly FaqItem[] = [
  {
    q: "What is a Notice of Assessment?",
    a: "A Notice of Assessment (NOA) is the ATO's official document showing the results of processing your tax return. It details your taxable income, tax calculated, offsets applied, Medicare levy, HECS repayment, PAYG credits, and the final result — either a refund or an amount you owe.",
  },
  {
    q: "How long does it take to receive my NOA?",
    a: "Electronic lodgements through myTax or a tax agent are typically processed within 2 weeks. Paper returns take 10–12 weeks. Complex returns that require manual review may take longer. You can check the status of your return through your myGov account.",
  },
  {
    q: "What can I do if I disagree with my NOA?",
    a: "You can request an amendment within 2 years of the assessment date (4 years for complex affairs). Amendments are lodged through myTax, your tax agent, or by paper. For formal disputes, you can lodge an objection with the ATO, and if that fails, apply to the Administrative Review Tribunal (which replaced the Administrative Appeals Tribunal in October 2024).",
  },
  {
    q: "When will I receive my tax refund?",
    a: "If you lodge electronically and your return is straightforward, refunds are typically paid within 2 weeks of lodgement. The ATO deposits refunds directly to the bank account you nominate in your tax return. During peak lodgement periods (July–October), processing may take slightly longer.",
  },
  {
    q: "What happens if I owe tax?",
    a: "If your NOA shows an amount owing, you must pay by the due date on the notice (typically 21 days from the issue date). You can pay via BPAY, credit/debit card, or direct debit. If you can't pay in full, contact the ATO to set up a payment plan. Interest charges (the General Interest Charge) apply to late payments.",
  },
  {
    q: "How long should I keep my Notice of Assessment?",
    a: "Keep your NOA for at least 5 years from the date you lodge your tax return. This aligns with the ATO's standard record-keeping requirements. If you have carry-forward losses, capital gains cost base records, or other ongoing tax matters, keep relevant records for longer. You can access past NOAs through your myGov account at any time.",
  },
  {
    q: "Can I use my NOA as proof of income?",
    a: "Yes. Many lenders, landlords, and government agencies accept the NOA as proof of income. It is an official ATO document showing your assessed taxable income for the financial year. Banks commonly request your last 2 NOAs when assessing home loan applications. You can download your NOA from your myGov account.",
  },
];
