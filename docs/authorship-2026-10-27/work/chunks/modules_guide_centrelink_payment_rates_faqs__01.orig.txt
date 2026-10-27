// FAQs for /centrelink-payment-rates/ (J6, wave 4). One array feeds the
// visible accordion and the FAQPage JSON-LD. Every figure is read from the
// existing Centrelink constants, so the answers move when those do.
import { formatAUD } from "@/lib/constants/australian-tax";
import {
  AGE_PENSION_RATES,
  AUSTUDY,
  JOBSEEKER_RATES,
  SEPTEMBER_2026,
  YOUTH_ALLOWANCE_STUDENT,
} from "@/lib/constants/centrelink-income-test";
import { DEEMING, DSP } from "@/lib/constants/centrelink-means-test";
import { CARER_ALLOWANCE } from "@/lib/constants/centrelink-carer-and-support";
import { FTB_A, FTB_B, PARENTING_PAYMENT, RENT_ASSISTANCE } from "@/lib/constants/centrelink-family-payments";
import type { Faq } from "./t3-shared";

const JS = JOBSEEKER_RATES[SEPTEMBER_2026];
const AP = AGE_PENSION_RATES[SEPTEMBER_2026];
const f2 = (n: number) => formatAUD(n, 2);
const pct = (r: number) => `${(r * 100).toFixed(2)}%`;

export const CENTRELINK_PAYMENT_RATES_FAQS: Faq[] = [
  {
    q: "How much is JobSeeker Payment a fortnight?",
    a: `From ${JS.ratesFrom}, the maximum JobSeeker Payment is ${f2(JS.maxFortnightly.single)} a fortnight for a single person with no children, ${f2(JS.maxFortnightly.singleWithChildren)} for a single person with a dependent child (and for people 55 or older on the payment for 9 months or more, or with a partial capacity to work), and ${f2(JS.maxFortnightly.partnered)} each for a member of a couple. Energy Supplement is paid on top. The payment reduces once your income goes over $150 a fortnight.`,
  },
  {
    q: "What are the Centrelink payment rates from 20 September 2026?",
    a: `JobSeeker single ${f2(JS.maxFortnightly.single)}, Age Pension single ${f2(AP.maxFortnightly.single.total)} and couple ${f2(AP.maxFortnightly.coupleEach.total)} each (including the Pension Supplement and Energy Supplement), Disability Support Pension and Carer Payment at the same pension rate for people 21 and over, Parenting Payment Single ${f2(PARENTING_PAYMENT.single.maxFortnightly)} including the Pension Supplement, and Parenting Payment Partnered ${f2(PARENTING_PAYMENT.partnered.maxFortnightly)}. Maximum Rent Assistance for a single person with no children is ${f2(RENT_ASSISTANCE.rows.single.max)}. These are the fortnightly maximums before the income and assets tests.`,
  },
  {
    q: "How much is the Age Pension a fortnight?",
    a: `From ${AP.ratesFrom}, the maximum Age Pension is ${f2(AP.maxFortnightly.single.total)} a fortnight for a single person and ${f2(AP.maxFortnightly.coupleEach.total)} each (${f2(AP.maxFortnightly.coupleCombined.total)} combined) for a couple. Those totals include the Pension Supplement and Energy Supplement; the basic rate alone is ${f2(AP.maxFortnightly.single.basic)} single and ${f2(AP.maxFortnightly.coupleEach.basic)} each for a couple.`,
  },
  {
    q: "When do Centrelink payments go up next?",
    a: `Pensions, JobSeeker, Parenting Payment and Rent Assistance are indexed on 20 March and 20 September, so the next change is 20 March 2027. Austudy, Youth Allowance for students and Carer Allowance are indexed on 1 January, and Family Tax Benefit rates and income limits on 1 July. The amount of each rise depends on inflation figures that are not yet published.`,
  },
  {
    q: "Did Youth Allowance and Austudy go up on 20 September 2026?",
    a: `No. Student payments are indexed on 1 January, so the rates from ${YOUTH_ALLOWANCE_STUDENT.ratesFrom} still apply: Austudy is ${f2(AUSTUDY.maxFortnightly.singleNoChildren)} a fortnight for a single student with no children, and Youth Allowance ranges from ${f2(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.under18AtHome)} (under 18, living at home) to ${f2(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.awayFromHome)} (living away from home). The only Youth Allowance rate that moved in September is the single principal carer rate.`,
  },
  {
    q: "How much is Family Tax Benefit in 2026–27?",
    a: `For ${FTB_A.financialYear}, the maximum Family Tax Benefit Part A is ${f2(FTB_A.maxFortnightly.age0to12)} a fortnight for each child aged 0 to 12 and ${f2(FTB_A.maxFortnightly.age13to19)} for each child aged 13 to 19, with a base rate of ${f2(FTB_A.baseFortnightly)} per child. Part B is up to ${f2(FTB_B.maxFortnightly.youngestUnder5)} a fortnight per family when the youngest child is under 5 and ${f2(FTB_B.maxFortnightly.youngest5to18)} when the youngest is 5 to 18. Both are reduced by family income.`,
  },
  {
    q: "What is the Disability Support Pension rate?",
    a: `If you are 21 or older, or under 21 with a child, the Disability Support Pension is paid at the pension rate: up to ${f2(DSP.rates21Plus.maxFortnightly.single.total)} a fortnight single and ${f2(DSP.rates21Plus.maxFortnightly.coupleEach.total)} each for a couple from ${DSP.ratesFrom}. Under-21 rates without children are lower, from ${f2(DSP.under21.under18Dependent)} (under 18, at home) to ${f2(DSP.under21.age18to20Independent)} (independent).`,
  },
  {
    q: "What are the deeming rates now?",
    a: `From ${DEEMING.ratesFrom}, financial assets are deemed to earn ${pct(DEEMING.lowerRate)} up to ${formatAUD(DEEMING.thresholds.single)} for a single person (${formatAUD(DEEMING.thresholds.pensionerCouple)} combined for a pensioner couple) and ${pct(DEEMING.upperRate)} above that. The deemed income counts in the income test for pensions and allowances.`,
  },
  {
    q: "How much is Carer Allowance?",
    a: `Carer Allowance is ${f2(CARER_ALLOWANCE.fortnightly)} a fortnight. It is a set rate, indexed on 1 January: your work income doesn't change it as long as you and your partner have a combined adjusted taxable income under ${formatAUD(CARER_ALLOWANCE.incomeLimit)} a year.`,
  },
];
