// Hub copy and FAQs for /paramedic-pay/, /police-pay/ and /firefighter-pay/.
// Every dollar figure is computed from the verified state files, so the hub
// cannot quote a number the state pages do not show.

import { formatAUD } from "../../constants/australian-tax";
import { SERVICE_OCCUPATION_CONFIG } from "./occupations";
import { occupationSummary, serviceJurisdictions, verifiedJurisdictions } from "./index";
import type { ServiceOccupation, ServicePayFaq } from "./types";

/** Why there is no award rate, per occupation — the paragraph under "How pay is set". */
export const HOW_PAY_IS_SET: Readonly<Record<ServiceOccupation, string[]>> = {
  paramedic: [
    "Paramedics are not paid under a national modern award minimum the way retail or hospitality workers are. Each state and territory ambulance service pays against its own enterprise agreement, state award or determination, so a paramedic's salary depends first on which service employs them.",
    "Most services are government agencies. Western Australia and the Northern Territory are different: their road ambulance services are run by St John, a not-for-profit, and St John paramedics are paid under enterprise agreements approved by the Fair Work Commission.",
    "Within a service, pay rises by year of service through the qualified paramedic scale, then by role: intensive care, critical care, extended care and team-leader roles sit on higher tables.",
  ],
  police: [
    "Police officers are not covered by a national modern award. Each state and territory police force sets pay in its own award, enterprise agreement or determination, and the Australian Federal Police — which provides ACT Policing — has its own enterprise agreement.",
    "Sworn pay is organised by rank and then by years at that rank: a probationary or first-year constable starts at the bottom of the constable scale, moves up yearly, and senior constable, sergeant and senior sergeant have their own increments.",
    "Recruits are paid differently while they train at the academy — how, and how much, varies by state, and each state page says what its instrument or recruiting authority sets.",
  ],
  firefighter: [
    "Career firefighters are paid under state and territory industrial instruments, not a national modern award. Volunteer firefighters in the rural and country fire services are unpaid and are not covered by these tables.",
    "A career firefighter starts on a recruit rate during training, moves through firefighter classes or levels as they qualify, and reaches senior or qualified firefighter after several years. Station officers and other officer ranks sit on separate, higher rates.",
    "Most career firefighters work a rotating roster of day and night shifts. Several states build a shift or roster allowance into pay on top of base salary — each state page lists what its instrument sets.",
  ],
};

/** Hub FAQs, built from the verified state files. */
export function serviceHubFaqs(occupation: ServiceOccupation): ServicePayFaq[] {
  const cfg = SERVICE_OCCUPATION_CONFIG[occupation];
  const summary = occupationSummary(occupation);
  const verified = verifiedJurisdictions(occupation);
  const unverified = serviceJurisdictions(occupation).filter((j) => !verified.includes(j));
  const faqs: ServicePayFaq[] = [];

  if (summary) {
    faqs.push({
      q: `How much do ${cfg.plural} earn in Australia?`,
      a: `It depends on the state. Across the ${summary.count} states and territories whose ${cfg.plural.replace(/s$/, "")} pay tables we have verified, the entry rate runs from ${formatAUD(summary.lowestEntry.entry)} (${summary.lowestEntry.j.code}) to ${formatAUD(summary.highestEntry.entry)} (${summary.highestEntry.j.code}) a year, and the top of the ${cfg.singular.toLowerCase()} scale from ${formatAUD(summary.lowestTop.top)} (${summary.lowestTop.j.code}) to ${formatAUD(summary.highestTop.top)} (${summary.highestTop.j.code}). These are base salaries before tax, shift penalties and super.`,
    });
    faqs.push({
      q: `Which state pays ${cfg.plural} the most?`,
      a: `Of the states we have verified, ${summary.highestTop.j.name} has the highest top-of-scale base salary at ${formatAUD(summary.highestTop.top)}, and ${summary.highestEntry.j.name} the highest entry rate at ${formatAUD(summary.highestEntry.entry)}. Base salary is only part of the picture: shift penalties, allowances and how quickly you progress differ by state, so compare the state pages rather than one figure.`,
    });
  }
  faqs.push({
    q: `Is there an award minimum wage for ${cfg.plural}?`,
    a: `No national modern award sets ${cfg.singular.toLowerCase()} pay. Each ${cfg.employerKind} pays under its own state or territory instrument (an enterprise agreement, state award or determination), which is why pay differs between states and why this site publishes each state's table separately.`,
  });
  faqs.push({
    q: `Do ${cfg.plural} pay tax on shift penalties and allowances?`,
    a: `Yes. Shift penalties, overtime and most allowances are ordinary taxable income and are taxed through PAYG withholding with your salary. Use the take-home pay calculator with your total expected pay, not just base salary, to see what lands in your account.`,
  });
  if (unverified.length > 0) {
    faqs.push({
      q: `Why are some states missing figures?`,
      a: `We publish a state's table only after reading it from the official instrument or the employer's own published pay table. For ${unverified
        .map((j) => j.code)
        .join(", ")} we could not verify the current table from a primary source, so the hub links to the official source instead of showing an estimate.`,
    });
  }
  return faqs;
}
