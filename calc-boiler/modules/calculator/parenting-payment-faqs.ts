// FAQ copy for /parenting-payment-calculator/. Every figure is read from
// lib/constants/centrelink-family-payments.ts (verified at Services Australia,
// 23 September 2026). These strings are also the page's FAQPage JSON-LD.
import { formatAUD } from "@/lib/constants";
import {
  PARENTING_PAYMENT,
  ppsCutOff,
  ppsFortnightly,
  ppsFreeArea,
  pppFortnightly,
} from "@/lib/constants/centrelink-family-payments";

const PP = PARENTING_PAYMENT;
const S = PP.single;
const PT = PP.partnered;

export interface ParentingFaq { q: string; a: string }

export const PARENTING_FAQS: readonly ParentingFaq[] = [
  {
    q: "How much is Parenting Payment Single?",
    a: `From ${PP.ratesFrom} the maximum Parenting Payment Single is ${formatAUD(S.basic, 2)} a fortnight plus a Pension Supplement of ${formatAUD(S.pensionSupplement, 2)} — ${formatAUD(S.maxFortnightly, 2)} in total, before any reduction for income. Energy Supplement is paid on top, and you may also get Rent Assistance and Family Tax Benefit.`,
  },
  {
    q: "How much is Parenting Payment Partnered?",
    a: `${formatAUD(PT.maxFortnightly, 2)} a fortnight from ${PP.ratesFrom}, the same as JobSeeker for a member of a couple. It reduces with your own income over ${formatAUD(PT.freeArea)} a fortnight and with your partner's income over ${formatAUD(PT.partnerIncomeFreeArea, 2)} (if they don't get a pension).`,
  },
  {
    q: "How much can I earn on Parenting Payment Single?",
    a: `With one child you can earn ${formatAUD(ppsFreeArea(1), 2)} a fortnight before your payment reduces, plus ${formatAUD(S.freeAreaPerExtraChild, 2)} for each extra child (${formatAUD(ppsFreeArea(2), 2)} with two, ${formatAUD(ppsFreeArea(3), 2)} with three). Above that it reduces by 40 cents for each dollar. The cut-off is ${formatAUD(S.publishedCutOffOneChild, 2)} a fortnight with one child, and ${formatAUD(ppsCutOff(2), 2)} with two.`,
  },
  {
    q: "If I earn $1,000 a fortnight, how much Parenting Payment Single do I keep?",
    a: `With one child: ${formatAUD(1_000 - ppsFreeArea(1), 2)} is over the free area, so the payment reduces by ${formatAUD((1_000 - ppsFreeArea(1)) * S.taper, 2)} to ${formatAUD(ppsFortnightly(1_000, 1), 2)}. Your wages are on top, so you have ${formatAUD(ppsFortnightly(1_000, 1) + 1_000, 2)} before tax. Every extra dollar you earn over the free area leaves you 60 cents better off.`,
  },
  {
    q: "How does my partner's income affect Parenting Payment Partnered?",
    a: `If your partner doesn't get a pension, your payment reduces by 60 cents for each dollar they earn over ${formatAUD(PT.partnerIncomeFreeArea, 2)} a fortnight. For example, if your partner earns ${formatAUD(1_800)} and you earn nothing, you would get ${formatAUD(pppFortnightly(0, 1_800), 2)}. If your partner gets a pension, your incomes are combined instead: 25 cents per dollar over ${formatAUD(PT.combined.freeArea)}, then ${formatAUD(53)} plus 30 cents per dollar over ${formatAUD(PT.combined.band1End)}.`,
  },
  {
    q: "Who can get Parenting Payment?",
    a: `Single parents who are the principal carer of a child under ${PP.singleYoungestChildUnder}, and partnered parents who are the principal carer of a child under ${PP.partneredYoungestChildUnder}. You also need to meet the residence rules and the income and assets tests. Single parents have mutual obligation requirements once their youngest child turns ${PP.singleMutualObligationFromAge}.`,
  },
  {
    q: "What happens when my youngest child turns 14?",
    a: `Parenting Payment Single stops when your youngest child turns ${PP.singleYoungestChildUnder} (${PP.partneredYoungestChildUnder} if you're partnered). Most parents then move to JobSeeker Payment, which has a lower maximum rate but, for a single principal carer of a child under 16, the same 40-cent taper over ${formatAUD(150)} a fortnight.`,
  },
  {
    q: "Is Parenting Payment taxable?",
    a: "Yes. Parenting Payment is a taxable Centrelink payment, so it counts with your wages at tax time. You can ask Services Australia to withhold tax from it. Family Tax Benefit is not taxable.",
  },
  {
    q: "What is the Parenting Payment assets limit?",
    a: `Your payment stops when assets exceed ${formatAUD(PP.assetLimits.singleHomeowner)} for a single homeowner or ${formatAUD(PP.assetLimits.singleNonHomeowner)} for a single non-homeowner (${formatAUD(PP.assetLimits.coupleHomeowner)} and ${formatAUD(PP.assetLimits.coupleNonHomeowner)} for a couple, combined). Your home is not counted.`,
  },
];
