import { MEDICARE_LEVY, formatAUD, formatPercent } from "@/lib/constants";
import {
  MLS_APPROPRIATE_COVER_MAX_EXCESS,
  MLS_INCOME_YEAR,
  estimateMls,
  familyBaseThreshold,
} from "@/lib/constants/medicare-levy-surcharge";
import { MLS_CHILD_INCREMENT } from "@/lib/constants/medicare-levy-extra";

// Shared by the page body and the FAQPage JSON-LD. Figures derive from
// lib/constants; ATO sources are cited in medicare-levy-surcharge.ts.

const S = MEDICARE_LEVY.surcharge;
const SINGLE_BASE = formatAUD(S.tier1.min - 1);
const FAMILY_BASE = formatAUD(familyBaseThreshold(0));
const RATE = formatPercent(MEDICARE_LEVY.rate, 0);
const eg = estimateMls({
  own: { taxableIncome: 102_000, reportableFringeBenefits: 0, netInvestmentLosses: 0, reportableSuperContributions: 8_000 },
  hasSpouse: false,
  spouseMlsIncome: 0,
  dependentChildren: 0,
  daysWithoutCover: 365,
});

export const MLS_FAQS: readonly { q: string; a: string }[] = [
  {
    q: `What is the Medicare levy surcharge threshold for ${MLS_INCOME_YEAR}?`,
    a: `${SINGLE_BASE} for singles and ${FAMILY_BASE} for families, with the family threshold rising ${formatAUD(MLS_CHILD_INCREMENT)} for each dependent child after the first. At or under the threshold no surcharge applies. Above it, the rate is 1% (singles to ${formatAUD(S.tier1.max)}), 1.25% (to ${formatAUD(S.tier2.max)}) or 1.5% (${formatAUD(S.tier3.min)} and over) if you don't hold private patient hospital cover.`,
  },
  {
    q: "How is the Medicare levy surcharge calculated?",
    a: `Add up your income for MLS purposes (taxable income, reportable fringe benefits, net investment losses and reportable super contributions) to find your tier. Then multiply your taxable income plus reportable fringe benefits by the tier's rate. It's charged on the whole amount, not just the part over the threshold, and only for the days you had no appropriate hospital cover.`,
  },
  {
    q: "Does salary sacrifice get me under the Medicare levy surcharge threshold?",
    a: `No. Salary sacrifice is a reportable super contribution, and it's added back into income for MLS purposes. Someone on ${formatAUD(110_000)} who sacrifices ${formatAUD(8_000)} has taxable income of ${formatAUD(102_000)} but income for MLS purposes of ${formatAUD(eg.ownMlsIncome)}, so they're still in Tier ${eg.tier}. Because the rate is charged only on taxable income plus fringe benefits, the surcharge is ${formatAUD(eg.fullYearSurcharge)} rather than ${formatAUD(110_000 * S.tier1.rate)}.`,
  },
  {
    q: "Is the Medicare levy surcharge the same as the Medicare levy?",
    a: `No. The Medicare levy is ${RATE} of taxable income and almost every resident pays it, cover or not. The surcharge is an extra 1% to 1.5% that applies only above the threshold and only without private patient hospital cover. You can pay both at once.`,
  },
  {
    q: "What hospital cover avoids the Medicare levy surcharge?",
    a: `Private patient hospital cover from a registered Australian health insurer, with an excess of ${formatAUD(MLS_APPROPRIATE_COVER_MAX_EXCESS.single)} or less for singles or ${formatAUD(MLS_APPROPRIATE_COVER_MAX_EXCESS.family)} or less for couples and families. Extras-only cover, travel insurance and cover from an overseas fund don't count. Families need everyone covered: you, your spouse and your dependent children.`,
  },
  {
    q: "Is it cheaper to get private health insurance or pay the surcharge?",
    a: "It depends on your income and the premium you're quoted. The surcharge is charged on your whole taxable income, so it grows as you earn more, while the government rebate on your premium shrinks as you move up the same tiers. Use the calculator to compare your quote after the rebate against the surcharge you'd pay.",
  },
  {
    q: "Do I pay the surcharge if I had cover for only part of the year?",
    a: "Only for the days without appropriate cover. If you took out a policy in October, you pay the surcharge for July to September. The surcharge is worked out when you lodge your return.",
  },
  {
    q: "Is the Medicare levy surcharge taken out of my pay?",
    a: "No. The ATO says the surcharge isn't covered by tax your employer withholds. It's added to your assessment when you lodge, so it reduces your refund or becomes a bill. It shows on your notice of assessment combined with the levy as 'Medicare levy and surcharge'.",
  },
];
