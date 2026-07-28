// Shared FAQ copy for /zone-tax-offset/.
//
// Deliberately NOT inside the "use client" guide module: both the rendered
// accordion and the FAQPage JSON-LD in app/zone-tax-offset/page.tsx read from
// here, so the structured data cannot drift from the visible page. Divergence
// between the two is what put stale figures into Google's index on /tax-on/.

import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { ZONE_AREA_RATES, ZONE_OFFSET_INCOME_YEAR, ZONE_QUALIFYING_DAYS } from "@/lib/constants/zone-tax-offset";

const A = ZONE_AREA_RATES.zoneA.fixedAmount;
const B = ZONE_AREA_RATES.zoneB.fixedAmount;
const SPECIAL = ZONE_AREA_RATES.specialArea.fixedAmount;
const OVERSEAS = ZONE_AREA_RATES.overseasForces.fixedAmount;

export interface ZoneFaq {
  q: string;
  a: string;
}

export const ZONE_FAQS: readonly ZoneFaq[] = [
  {
    q: "How much is the zone tax offset?",
    a: `The fixed amount is ${formatAUD(A)} for Zone A, ${formatAUD(B)} for Zone B and ${formatAUD(SPECIAL)} for a special area within either zone, for the ${ZONE_OFFSET_INCOME_YEAR} income year. A special area replaces the zone amount rather than adding to it, so ${formatAUD(SPECIAL)} is the maximum without dependants. If you maintained dependants you also add 50% of your base amount in Zone A or a special area, or 20% in Zone B.`,
  },
  {
    q: "Is Darwin in Zone A or Zone B?",
    a: "Darwin is Zone A. So are Palmerston, Humpty Doo, Alice Springs, Katherine and Jabiru. Tennant Creek and Nhulunbuy are Zone A special areas. The ATO's Australian zone list was last updated on 1 July 2026 — older summaries that place Darwin in Zone B are out of date.",
  },
  {
    q: "Can FIFO workers claim the zone tax offset?",
    a: "No, unless their usual place of residence is itself in a zone. Working at a remote site on a fly-in fly-out roster does not qualify. The ATO looks at where your family lives, where you vote, where your belongings are and where you return after a roster — not where the work is.",
  },
  {
    q: "Do the 183 days need to be consecutive?",
    a: `No. The ATO counts the total number of days your usual place of residence was in the zone during the income year, and the test is ${ZONE_QUALIFYING_DAYS} days or more. Temporary absences for holidays, medical trips or work travel do not break zone residency provided you keep your home there.`,
  },
  {
    q: "Is the zone tax offset pro-rated?",
    a: `Yes, in some cases. If your usual place of residence was in a single zone for ${ZONE_QUALIFYING_DAYS} days or more, you claim the full amount. If you lived in more than one zone and none reached ${ZONE_QUALIFYING_DAYS} days, you claim each as a fraction of ${ZONE_QUALIFYING_DAYS} days, capped at ${ZONE_QUALIFYING_DAYS} days in total.`,
  },
  {
    q: "What if I lived in two different zones during the year?",
    a: `You can combine them. If one zone accounted for ${ZONE_QUALIFYING_DAYS} days or more and pays the highest fixed amount, claim that zone in full and ignore the other. Otherwise claim each location as days divided by ${ZONE_QUALIFYING_DAYS}, starting with the zone that pays most and stopping once you reach ${ZONE_QUALIFYING_DAYS} days.`,
  },
  {
    q: "Is the zone tax offset refundable?",
    a: "No. It is non-refundable, so it reduces your tax payable to a minimum of zero but does not generate a cash refund on its own. Any excess is lost and cannot be carried forward.",
  },
  {
    q: "Does my employer apply the zone tax offset to my pay?",
    a: "No. Your employer does not factor it into PAYG withholding. You claim it at question T4 in your tax return, so it arrives as a reduced assessment or a larger refund when you lodge.",
  },
  {
    q: "What if I moved to a zone part-way through the year?",
    a: `If you reach ${ZONE_QUALIFYING_DAYS} days or more you claim in full. If you fall short, you may still qualify by carrying forward unused days from your first year in the zone, provided the stay is a continuous period of under 5 years, you could not claim in that first year, the two years together total ${ZONE_QUALIFYING_DAYS} days or more, and the current-year period includes 1 July.`,
  },
  {
    q: "Does a remote area allowance affect the offset?",
    a: "Yes. Any remote area allowance you receive from Centrelink or the Department of Veterans' Affairs reduces your zone tax offset dollar for dollar. The offset itself is not assessable income for Centrelink purposes, so claiming it does not reduce your payments.",
  },
  {
    q: "Is the zone tax offset different from the overseas forces tax offset?",
    a: `Yes, though both are claimed at question T4. The overseas forces tax offset applies to Australian Defence Force or United Nations armed force service in a specified overseas locality, and its fixed amount is ${formatAUD(OVERSEAS)}. If you qualify for both, you can claim only one — take whichever is greater.`,
  },
  {
    q: "Which financial year do these amounts apply to?",
    a: `The ${ZONE_OFFSET_INCOME_YEAR} income year — the return being lodged now, due 31 October 2026. The ATO publishes zone amounts with each year's tax return instructions and has not yet released figures for FY${SITE_CONFIG.financialYear}.`,
  },
] as const;
