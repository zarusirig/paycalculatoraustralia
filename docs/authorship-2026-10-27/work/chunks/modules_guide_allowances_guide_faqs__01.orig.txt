import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Definitions are from the
// Fair Work Ombudsman "Allowances" page (read 5 October 2026); amounts live in
// the award tables on the page, which come from lib/data/job-pay-rates/.

export const ALLOWANCES_GUIDE_FAQS: Faq[] = [
  {
    q: "What is an allowance on a payslip?",
    a: "An allowance is an extra payment on top of your base pay for doing certain tasks, using a particular skill, using your own tools, working in unpleasant or hazardous conditions, or covering an expense you incur for the job. Common allowances include uniforms and special clothing, tools and equipment, first aid, travel, car and phone, leading hand and industry allowances.",
  },
  {
    q: "How do I know which allowances I am owed?",
    a: "It depends on your award or enterprise agreement. The Fair Work Ombudsman's Pay and Conditions Tool and its downloadable pay guides list the allowances for your industry. If an enterprise agreement covers you, the allowances are in the agreement, which you can find on the Fair Work Commission website.",
  },
  {
    q: "How much is the first aid allowance?",
    a: "It varies by award: for example $13.43 a week for full-time hospitality staff, $14.55 a week under the General Retail Industry Award and $16.79 a week under the Clerks Award. You are paid it if you hold a current first aid qualification and your employer appoints you to perform first aid duty. See the table on this page for each award.",
  },
  {
    q: "Is a tool allowance paid if my employer supplies the tools?",
    a: "No. Awards pay a tool allowance when the employer requires you to provide and use your own tools. If the employer supplies all the tools you need, the allowance generally does not apply. Check the clause in your award, because some tie the payment to specific trades.",
  },
  {
    q: "What is a split shift or broken shift allowance?",
    a: "It is an extra payment when your shift is split into two or more periods with an unpaid break between them. For example, the Hospitality Industry (General) Award pays $3.69 a day for a break of 2 to 3 hours and $5.60 for a longer break, while the Children's Services Award pays $21.38 for each day you work two separate shifts.",
  },
  {
    q: "Is an allowance taxed?",
    a: "Most allowances are part of your gross pay and are taxed like wages, so they come off at your marginal rate. Some, such as a travel allowance within the ATO's reasonable amount or a cents per kilometre car allowance, may be shown separately. Check your payslip, where each allowance should appear as its own line.",
  },
  {
    q: "Are allowances included in annual leave pay?",
    a: "Annual leave is paid at your base pay rate, which does not include extra payments such as allowances, overtime, penalty rates or bonuses, unless your award or agreement says otherwise. When employment ends, unused annual leave is paid at the same amount as if you had taken the leave.",
  },
  {
    q: "Do salaried employees still get allowances?",
    a: "They can. An annualised wage or salary must pay at least what you would have received under your award, including the allowances that apply. If your contract says allowances are included in your salary, your pay must still cover them.",
  },
];
