// Shared FAQ copy for /pay-calculator-wa/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/pay-calculator-wa/page.tsx.

import { STATE_PROFILES } from "@/lib/data/state-employee";
import type { FaqItem } from "@/lib/faq";
import { ABS_PERIOD, awoteLine } from "./state-faqs-shared";

const PROFILE = STATE_PROFILES.WA;

export const WA_FAQS: readonly FaqItem[] = [
  {
    q: "Is income tax different in WA compared to other states?",
    a: "No. Personal income tax in Australia is levied by the federal government through the ATO. The income tax brackets, Medicare levy, and HECS-HELP repayment thresholds are identical in Western Australia, New South Wales, Victoria, Queensland, and every other state and territory. Our tax brackets guide lists the current rates.",
    links: { "tax brackets guide": "/tax-brackets/" },
  },
  {
    q: "What is the take-home pay on the average WA salary?",
    a: `Full-time adults in WA earn ${awoteLine(PROFILE)} — the highest of any state (ABS, ${ABS_PERIOD}). The worked example above shows what is left after tax.`,
  },
  {
    q: "Am I covered by WA state awards or federal awards?",
    a: "It depends on your employer's legal structure, not on where you live. Employees of incorporated companies are in the national system and covered by federal modern awards. Employees of sole traders, unincorporated partnerships and other non-constitutional employers in WA are covered by the WA state system, with its own awards and its own state minimum wage.",
  },
  {
    q: "Why is the King's Birthday in September in WA?",
    a: "Western Australia sets its own public holiday dates. It observes the King's Birthday in late September rather than the June date used in NSW, Victoria, SA, Tasmania and the NT, and it holds Labour Day in early March. Some regional areas in WA hold the King's Birthday on a different date again.",
  },
  {
    q: "When do I get long service leave in WA?",
    a: "Leave can be taken after 10 years of continuous employment, when 8.667 weeks has accrued under the Long Service Leave Act 1958, then a further 4.333 weeks every 5 years. Separately, after 7 years of continuous employment a payment may be owed when employment ends by resignation, dismissal, redundancy or death.",
  },
  {
    q: "Do WA employees pay for WorkCover?",
    a: "No. WorkCover WA insurance premiums are entirely an employer expense. Premiums vary by industry risk classification, ranging from 0.5% of wages in low-risk office roles to over 7% in underground mining. These costs do not reduce your gross salary or take-home pay.",
  },
  {
    q: "Does the zone tax offset show in my WA pay calculation?",
    a: "Not in the calculator above. The zone tax offset depends on the specific locality you live in for more than half the income year, so it is claimed in your tax return rather than through withholding. See the zone tax offset guide for the qualifying WA areas.",
    links: { "zone tax offset guide": "/zone-tax-offset/" },
  },
];
