// Shared FAQ copy for /tax-file-number-declaration/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in
// app/tax-file-number-declaration/page.tsx, so the structured data cannot drift
// from the page. No-TFN rates come from NO_TFN_RATES (payg-withholding.ts).

import { TAX_FREE_THRESHOLD, formatAUD } from "@/lib/constants";
import { NO_TFN_RATES } from "@/lib/constants/payg-withholding";
import type { FaqItem } from "@/lib/faq";

const RES = `${Math.round(NO_TFN_RATES.resident * 100)}%`;
const FOREIGN = `${Math.round(NO_TFN_RATES.foreignResident * 100)}%`;

export const TFN_DECLARATION_FAQS: readonly FaqItem[] = [
  {
    q: "What happens if I don't provide my TFN?",
    a: `Your employer must withhold tax at ${RES} from every dollar you earn (${FOREIGN} if you are a foreign resident). The ${RES} is the 45% top tax rate plus the 2% Medicare levy. If you have told your employer on the declaration that you have applied for a TFN, you have 28 days to provide it before that rate applies. The over-withheld tax is recovered when you lodge your annual tax return, but you will have significantly reduced take-home pay in the meantime.`,
  },
  {
    q: "Should I claim the tax-free threshold on my TFN declaration?",
    a: `Claim it if you are an Australian resident for tax purposes and this is your only job, or your main (highest-paying) job. The threshold means the first ${formatAUD(TAX_FREE_THRESHOLD)} of your yearly income is not taxed, so your employer withholds less from each pay. Foreign residents for tax purposes cannot claim it. For every other job, answer no to the tax-free threshold question.`,
  },
  {
    q: "Can I claim the tax-free threshold at two jobs?",
    a: "You should only claim the tax-free threshold at one job — your main (highest-paying) employer. If you claim it at two jobs, both employers withhold less tax than they should, and you will likely owe money when you lodge your tax return. Use our Second Job Tax Calculator to see the impact.",
    links: { "Second Job Tax Calculator": "/second-job-tax-calculator/" },
  },
  {
    q: "What if I forget to declare my HECS debt?",
    a: "If you don't declare your HECS-HELP debt on your TFN declaration, your employer won't withhold any HECS repayments from your pay. The ATO will calculate your compulsory repayment when you lodge your tax return, and you'll owe the full amount as a lump sum. Submit a new TFN declaration (or a withholding declaration) to your employer as soon as possible to start having HECS withheld going forward.",
  },
  {
    q: "How do I find my TFN if I've lost it?",
    a: "You can find your TFN on previous tax returns, your myGov account (linked to the ATO), or correspondence from the ATO. You can also call the ATO on 13 28 61 to request your TFN. For security, the ATO will post your TFN to your registered address — they will not provide it over the phone or email.",
  },
  {
    q: "Do I need a new TFN declaration each financial year?",
    a: "No. Your TFN declaration remains in effect with your current employer until you submit a replacement or leave the job. You only need a new one if your circumstances change (e.g., new HECS debt, change in residency, want to move the tax-free threshold to a different employer).",
  },
  {
    q: "Do I need to submit a new TFN declaration if I change roles within the same company?",
    a: "Generally no, unless your circumstances change (e.g., you acquire a HECS debt, change residency status, or want to change your tax-free threshold claim). If you move to a different employing entity (a different ABN) within the same corporate group, that is a new payer and a new TFN declaration is required.",
  },
  {
    q: "Do contractors need to complete a TFN declaration?",
    a: `Independent contractors operating under their own ABN do not complete a TFN declaration. Instead, they quote their ABN on invoices. If a contractor does not quote an ABN, the payer must withhold ${RES} from the payment. Employees (including casuals) must always provide a TFN declaration. See our Contractor vs Employee Guide for help determining your status.`,
    links: { "Contractor vs Employee Guide": "/contractor-vs-employee-calculator/" },
  },
];
