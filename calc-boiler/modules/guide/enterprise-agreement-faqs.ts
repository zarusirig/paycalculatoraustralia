import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources: Fair Work
// Commission "Find an enterprise agreement", "Nominal expiry date" and
// "Better off overall test"; Fair Work Ombudsman "About agreements" and
// "Finding an agreement" — all read 23 September 2026.

export const ENTERPRISE_AGREEMENT_FAQS: Faq[] = [
  {
    q: "What is an enterprise agreement?",
    a: "An enterprise agreement (EA, often called an EBA) is a set of pay rates and conditions bargained between an employer and its employees and approved by the Fair Work Commission. When one applies to you, it replaces the modern award, but the National Employment Standards still apply and its base pay rates can't be lower than the award's.",
  },
  {
    q: "How do I find my enterprise agreement (EBA search)?",
    a: "Check your payslip or contract for the agreement's name, or ask HR. Then search the Fair Work Commission's Document Search for the business's trading name, legal name or ABN in quotation marks. For a large employer add the location, and open the most recent agreement.",
  },
  {
    q: "Does an expired enterprise agreement still apply?",
    a: "Yes. An agreement keeps operating after its nominal expiry date until it is replaced by a new approved agreement or terminated by the Fair Work Commission. Its terms stay fully enforceable.",
  },
  {
    q: "Can an enterprise agreement pay less than the award?",
    a: "Not on base pay. The base rate in an agreement can't be less than the base rate in the award that covers the employee. Other terms can differ from the award, but the agreement had to leave award-covered employees better off overall to be approved.",
  },
  {
    q: "What is the better off overall test (BOOT)?",
    a: "It's the test the Fair Work Commission applies before approving an agreement: each award-covered employee, and each prospective one, must be better off overall under the agreement than under the relevant modern award. It's an overall assessment, not a line-by-line comparison.",
  },
  {
    q: "How long does an enterprise agreement last?",
    a: "Its nominal expiry date can be no more than 4 years after the Fair Work Commission approves it. After that it keeps applying until it is replaced or terminated. A replacement agreement starts 7 days after approval unless it names a later date.",
  },
  {
    q: "What are the AE and AG numbers on an agreement?",
    a: "The AE number is the agreement's ID in the Fair Work Commission's records and the AG number is the matter (case) number of the approval application. Either one finds the agreement in the Commission's lists and search.",
  },
];
