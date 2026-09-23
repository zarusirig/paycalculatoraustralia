// FAQ copy for /rent-assistance-calculator/. Every figure is read from
// lib/constants/centrelink-family-payments.ts (verified at Services Australia,
// 23 September 2026). These strings are also the page's FAQPage JSON-LD.
import { formatAUD } from "@/lib/constants";
import { RENT_ASSISTANCE, rentAssistanceFortnightly } from "@/lib/constants/centrelink-family-payments";

const R = RENT_ASSISTANCE.rows;

export interface RentFaq { q: string; a: string }

export const RENT_FAQS: readonly RentFaq[] = [
  {
    q: "How much is Rent Assistance?",
    a: `From ${RENT_ASSISTANCE.ratesFrom}, the maximum is ${formatAUD(R.single.max, 2)} a fortnight for a single person with no children, ${formatAUD(R.singleSharer.max, 2)} for a single person in shared accommodation, ${formatAUD(R.couple.max, 2)} for a couple with no children, and ${formatAUD(R.singleFamily1or2.max, 2)} for a family with 1 or 2 children (${formatAUD(R.singleFamily3plus.max, 2)} with 3 or more).`,
  },
  {
    q: "How is Rent Assistance calculated?",
    a: `You get 75 cents for every dollar of fortnightly rent above a threshold, up to a maximum. For a single person with no children the threshold is ${formatAUD(R.single.threshold, 2)}, so rent of ${formatAUD(400)} a fortnight gives ${formatAUD(rentAssistanceFortnightly(400, "single"), 2)}; you reach the ${formatAUD(R.single.max, 2)} maximum at ${formatAUD(R.single.publishedMaxRent, 2)} of rent.`,
  },
  {
    q: "What is the minimum rent for Rent Assistance?",
    a: `Your fortnightly rent has to be more than ${formatAUD(R.single.threshold, 2)} if you're single with no children, ${formatAUD(R.couple.threshold, 2)} for a couple with no children, ${formatAUD(R.singleFamily1or2.threshold, 2)} for a single parent and ${formatAUD(R.coupleFamily1or2.threshold, 2)} for a couple with children.`,
  },
  {
    q: "Do I need to claim Rent Assistance separately?",
    a: "No. Services Australia checks whether you can get Rent Assistance when you claim an eligible payment — such as JobSeeker, Youth Allowance, Austudy, Parenting Payment, the Age Pension, Carer Payment, Disability Support Pension, or Family Tax Benefit Part A above the base rate — or update your address and accommodation details, and pays it with your regular payment.",
  },
  {
    q: "What is the single sharer rate of Rent Assistance?",
    a: `If you're single with no dependent children, live in shared private accommodation and get JobSeeker, Youth Allowance, Austudy, the Age Pension, ABSTUDY Living Allowance, Farm Household Allowance or Special Benefit, the maximum is ${formatAUD(R.singleSharer.max, 2)} a fortnight instead of ${formatAUD(R.single.max, 2)}.`,
  },
  {
    q: "Does working more reduce Rent Assistance?",
    a: "It can. Rent Assistance is part of the payment it's paid with, so the income test that reduces your JobSeeker, Youth Allowance or Parenting Payment can reduce it too — though getting Rent Assistance also lifts the income at which that payment cuts out. For families, Rent Assistance is paid with FTB Part A only while you get more than the base rate, so a rise in family income can end it.",
  },
  {
    q: "When do Rent Assistance rates change?",
    a: `On ${RENT_ASSISTANCE.indexedOn} each year, in line with the Consumer Price Index. The figures here apply from ${RENT_ASSISTANCE.ratesFrom}; the next change is on 20 March 2027.`,
  },
  {
    q: "What if I pay board and lodging?",
    a: "Services Australia counts only the lodging part as rent. If you can't say what you pay for lodging, they use two-thirds of the total board and lodging amount.",
  },
];
