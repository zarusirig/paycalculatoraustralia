import { formatAUD } from "@/lib/constants";
import { allowanceRows, type AllowanceKind, type AllowanceRow } from "@/lib/constants/allowances-guide";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Definitions are from the
// Fair Work Ombudsman "Allowances" page (read 5 October 2026); amounts live in
// the award tables on the page, which come from lib/data/job-pay-rates/. The
// amounts quoted in the answers below are read from the same rows, so the FAQ
// and its JSON-LD move with the tables at each award variation.

/** The first dollar figure in a row's amount, e.g. "$16.79 per week" gives 16.79. */
export function firstDollar(r: AllowanceRow | undefined): number {
  const m = r?.amount.match(/\$([\d,]+(?:\.\d+)?)/);
  return m ? Number(m[1].replace(/,/g, "")) : 0;
}

function row(kind: AllowanceKind, awardCode: string, allowance: string): AllowanceRow | undefined {
  return allowanceRows(kind).find((r) => r.awardCode === awardCode && r.allowance === allowance);
}

const amt = (r: AllowanceRow | undefined) => formatAUD(firstDollar(r), 2);

const FIRST_AID_HOSPITALITY = row("first-aid", "MA000009", "First aid allowance");
const FIRST_AID_RETAIL = row("first-aid", "MA000004", "First aid allowance");
const FIRST_AID_CLERKS = row("first-aid", "MA000002", "First aid allowance");
const SPLIT_HOSPITALITY = row("split-shift", "MA000009", "Split shift allowance");
// The Hospitality Award's rate for a break of more than 3 hours sits in the same row's note.
const SPLIT_HOSPITALITY_LONG = Number(SPLIT_HOSPITALITY?.note.match(/\$([\d.]+) for more than 3 hours/)?.[1] ?? 0);
const BROKEN_CHILDRENS = row("split-shift", "MA000120", "Broken shift allowance");

export const ALLOWANCES_GUIDE_FAQS: Faq[] = [
  {
    q: "What is an allowance on a payslip?",
    a: "An allowance is an extra payment on top of your base pay for doing certain tasks, using a particular skill, using your own tools, working in unpleasant or hazardous conditions, or covering an expense you incur for the job. Common allowances include uniforms and special clothing, tools and equipment, first aid, travel, car and phone, leading hand and industry allowances.",
  },
  {
    q: "How do I know which allowances I am owed?",
    a: "Your award or enterprise agreement sets which allowances you are owed. The Fair Work Ombudsman's Pay and Conditions Tool and its downloadable pay guides list the allowances for your industry. If an enterprise agreement covers you, the allowances are in the agreement, which you can find on the Fair Work Commission website.",
  },
  {
    q: "How much is the first aid allowance?",
    a: `The first aid allowance varies by award: for example ${amt(FIRST_AID_HOSPITALITY)} a week for full-time hospitality staff, ${amt(FIRST_AID_RETAIL)} a week under the General Retail Industry Award and ${amt(FIRST_AID_CLERKS)} a week under the Clerks Award. You are paid it if you hold a current first aid qualification and your employer appoints you to perform first aid duty. See the table on this page for each award.`,
  },
  {
    q: "Is a tool allowance paid if my employer supplies the tools?",
    a: "No. Awards pay a tool allowance when the employer requires you to provide and use your own tools. If the employer supplies all the tools you need, the allowance generally does not apply. Check the clause in your award, because some tie the payment to specific trades.",
  },
  {
    q: "What is a split shift or broken shift allowance?",
    a: `A split shift or broken shift allowance is an extra payment made when your shift is split into two or more periods with an unpaid break between them. For example, the Hospitality Industry (General) Award pays ${amt(SPLIT_HOSPITALITY)} a day for a break of 2 to 3 hours and ${formatAUD(SPLIT_HOSPITALITY_LONG, 2)} for a longer break, while the Children's Services Award pays ${amt(BROKEN_CHILDRENS)} for each day you work two separate shifts.`,
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
