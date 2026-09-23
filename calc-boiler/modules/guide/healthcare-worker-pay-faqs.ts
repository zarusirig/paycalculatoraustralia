// Shared figures and FAQ copy for the /healthcare-worker-pay/ hub. The page's
// accordion and the FAQPage JSON-LD in app/healthcare-worker-pay/page.tsx both
// read HEALTHCARE_FAQS, so the structured data cannot drift from the page. The
// hub's derived figures live here (not in the "use client" module) so the
// server page file reads real values. Nurse figures come from the verified
// state scales in lib/data/nursing-pay; award and FBT figures from lib/data and
// lib/constants.

import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { FBT_CAPS, capFaceValue, salaryPackagingBenefit } from "@/lib/constants/novated-lease";
import type { FaqItem } from "@/lib/faq";
import { annualFromWeekly, headlineRow, rowAnnual, type Occupation } from "@/lib/data/job-pay-rates";
import { DISABILITY_SUPPORT_WORKER } from "@/lib/data/job-pay-rates/disability-support-worker";
import { DOCTOR } from "@/lib/data/job-pay-rates/doctor";
import { PHARMACIST } from "@/lib/data/job-pay-rates/pharmacist";
import { PHYSIOTHERAPIST } from "@/lib/data/job-pay-rates/physiotherapist";
import { NURSING_PAY_BY_STATE, NURSING_PAY_STATES, annualFor, registeredNurseRange } from "@/lib/data/nursing-pay";
import { NURSES_AWARD, NURSES_AWARD_AGED_CARE, NURSES_AWARD_GENERAL } from "@/lib/data/nursing-pay/nurses-award-2020";
import type { ScaleFamily } from "@/lib/data/nursing-pay/types";

export const STATES = NURSING_PAY_STATES.map((slug) => NURSING_PAY_BY_STATE[slug]).filter(
  (s): s is NonNullable<typeof s> => Boolean(s),
);

/**
 * Nurse figures on this hub are derived from the eight verified state and territory pay scales
 * in lib/data/nursing-pay, not from survey averages. `spread` returns the
 * lowest and highest published entry (or top) rate across those states, so the
 * hub can never disagree with a spoke.
 */
export function spread(pick: "entry" | "top"): { low: number; high: number; lowState: string; highState: string } {
  const rows = STATES.map((s) => ({ state: s.shortName, value: registeredNurseRange(s)![pick] }));
  const sorted = [...rows].sort((a, b) => a.value - b.value);
  return {
    low: sorted[0].value,
    high: sorted[sorted.length - 1].value,
    lowState: sorted[0].state,
    highState: sorted[sorted.length - 1].state,
  };
}

/** Lowest and highest published entry rate for a family, across the eight states and territories. */
export function familySpread(family: ScaleFamily): { low: number; high: number } | null {
  const values: number[] = [];
  for (const state of STATES) {
    for (const scale of state.scales.filter((s) => s.family === family)) {
      for (const point of scale.points) {
        const annual = annualFor(point);
        if (annual !== null) values.push(annual);
      }
    }
  }
  if (values.length === 0) return null;
  return { low: Math.min(...values), high: Math.max(...values) };
}

// Aged Care Award 2010 [MA000018] cl 14.3 — aged care employee, direct care
// stream, weekly minimums from the first full pay period on or after 1 July
// 2026 (PR799299). Read 23 September 2026 at awards.fairwork.gov.au, award
// "consolidated ... up to and including 1 September 2026 (PR813673)".
// Annual figures are weekly x 52, the same convention as /job-pay-rates/.
export const AGED_CARE_DIRECT_CARE = [
  { level: "Level 1 — Introductory", note: "Under 3 months' aged care experience", weekly: 1_239.0 },
  { level: "Level 2 — Direct Carer", note: "3 months' or more experience", weekly: 1_307.8 },
  { level: "Level 3 — Qualified", note: "Required Certificate III", weekly: 1_376.7 },
  { level: "Level 6 — Team Leader", note: "Top of the direct care stream", weekly: 1_541.9 },
] as const;
export const AGED_CARE_QUALIFIED = AGED_CARE_DIRECT_CARE[2];
export const AGED_CARE_LOW = AGED_CARE_DIRECT_CARE[0];
export const AGED_CARE_HIGH = AGED_CARE_DIRECT_CARE[AGED_CARE_DIRECT_CARE.length - 1];

// FBT-exempt caps are GROSSED-UP values (FBT_CAPS, sourced in
// lib/constants/novated-lease.ts). capFaceValue divides by the type 2 gross-up
// rate to give the GST-free expenses (rent, mortgage) each cap covers.
export const CAP_HOSPITAL_GROSSED_UP = FBT_CAPS.hospitalAndAmbulance;
export const CAP_PBI_GROSSED_UP = FBT_CAPS.pbiAndHealthPromotionCharity;
export const CAP_ENTERTAINMENT_GROSSED_UP = FBT_CAPS.salaryPackagedEntertainment;
export const CAP_HOSPITAL = capFaceValue(CAP_HOSPITAL_GROSSED_UP);
export const CAP_PBI = capFaceValue(CAP_PBI_GROSSED_UP);
export const CAP_ENTERTAINMENT = capFaceValue(CAP_ENTERTAINMENT_GROSSED_UP);
export const PACKAGE_SALARY = 85_000;
export const PACKAGED = CAP_HOSPITAL + CAP_ENTERTAINMENT;

/** Award minimum annual for a named row of an occupation's table. Throws if the row is missing. */
export function awardAnnual(occ: Occupation, tableId: string, label: string): number {
  const row = occ.tables.find((t) => t.id === tableId)?.rows.find((r) => r.label === label);
  if (!row) throw new Error(`healthcare hub: ${occ.slug} ${tableId}/${label} not found`);
  return rowAnnual(row);
}

export const DR_INTERN = awardAnnual(DOCTOR, "doctors-in-training", "Intern");
export const DR_RESIDENT = awardAnnual(DOCTOR, "doctors-in-training", "Resident medical practitioner pay point 1");
export const DR_REGISTRAR_LOW = awardAnnual(DOCTOR, "doctors-in-training", "Registrar pay point 1");
export const DR_REGISTRAR_HIGH = awardAnnual(DOCTOR, "doctors-in-training", "Senior registrar pay point 2");
export const DR_SPECIALIST_LOW = awardAnnual(DOCTOR, "specialists", "Specialist");
export const DR_SPECIALIST_HIGH = awardAnnual(DOCTOR, "specialists", "Senior principal specialist");
export const PHYSIO_GRAD = rowAnnual(headlineRow(PHYSIOTHERAPIST)!);
export const PHARMACIST_ENTRY = rowAnnual(headlineRow(PHARMACIST)!);
export const medianAnnual = (occ: Occupation) => annualFromWeekly(occ.median!.medianWeekly);

export const RN_ENTRY = spread("entry");
export const RN_TOP = spread("top");
export const NP_SPREAD = familySpread("practitioner");
export const EN_SPREAD = familySpread("enrolled");

export const AWARD_RN1 = NURSES_AWARD_GENERAL.find((s) => s.classification === "Registered nurse — level 1")!;
export const AWARD_AGED_RN1 = NURSES_AWARD_AGED_CARE.find((s) => s.classification === "Registered nurse — aged care level 1")!;


/** Extra spendable income from packaging: packaged expenses are paid pre-tax. */
export const PACKAGING_BENEFIT = salaryPackagingBenefit(PACKAGE_SALARY, PACKAGED);

export const HEALTHCARE_FAQS: readonly FaqItem[] = [
  {
    q: "How much do registered nurses earn in Australia?",
    a: `It depends on the state, because each state public health system has its own agreement and its own classification ladder. Across the eight state and territory pay scales published on this site, the entry step for a registered nurse or midwife runs from ${formatAUD(RN_ENTRY.low)} in ${RN_ENTRY.lowState} to ${formatAUD(RN_ENTRY.high)} in ${RN_ENTRY.highState}, and the top of the base registered nurse scale runs from ${formatAUD(RN_TOP.low)} to ${formatAUD(RN_TOP.high)}. Those are base rates before shift penalties, which for a nurse on a rotating roster add a substantial amount on top. Pick your state above for the full published scale.`,
  },
  {
    q: "What is the Nurses Award 2020 and does it apply to me?",
    a: `The Nurses Award 2020 (MA000034) is the federal modern award for nurses — a legal minimum, not a pay scale. Its registered nurse level 1 pay point 1 rate is ${formatAUD(AWARD_RN1.points[0].weekly, 2)} a week, or ${formatAUD(AWARD_RN1.points[0].hourly, 2)} an hour, from ${NURSES_AWARD.generalRatesFrom}. If you work in a state public hospital you are almost certainly paid under an enterprise or state agreement that pays well above that. The award is what governs private hospital, GP clinic, aged care and some agency work. Note it now has two rate streams: aged care employees are on materially higher minimums than the general stream.`,
  },
  {
    q: "Who is eligible for salary packaging in healthcare?",
    a: `Employees of public and not-for-profit hospitals and public ambulance services can receive fringe benefits FBT-free up to a ${formatAUD(CAP_HOSPITAL_GROSSED_UP)} grossed-up cap per FBT year (about ${formatAUD(CAP_HOSPITAL)} of rent or mortgage), plus a separate ${formatAUD(CAP_ENTERTAINMENT_GROSSED_UP)} grossed-up cap (about ${formatAUD(CAP_ENTERTAINMENT)}) for meal entertainment. Public benevolent institutions and health promotion charities have a ${formatAUD(CAP_PBI_GROSSED_UP)} grossed-up cap (about ${formatAUD(CAP_PBI)}). Packaging does not change your gross pay or classification; it changes how much of your pay is taxed. For-profit private hospital employees cannot use these exemptions.`,
  },
  {
    q: "What penalty rates do nurses receive?",
    a: "There is no single national answer, and treating one state's numbers as typical is how payslip checks go wrong. Weekday night shift is +20% in NSW and Queensland, +20.5% in South Australia, +35% in Western Australia, and a flat dollar allowance per shift in Victoria. Weekend ordinary hours are time and a half on Saturday in NSW, Victoria and Queensland, +50% in WA; Sunday is time and three quarters in NSW and Queensland, +75% in WA and time and a half in Victoria. Weekend rates normally replace the shift loading rather than adding to it. The state pages carry the clause references.",
  },
  {
    q: "How much do aged care workers earn?",
    a: `Under the Aged Care Award 2010, direct care minimums from 1 July 2026 run from ${formatAUD(AGED_CARE_LOW.weekly, 2)} a week (${AGED_CARE_LOW.level}) to ${formatAUD(AGED_CARE_HIGH.weekly, 2)} (${AGED_CARE_HIGH.level}); a Certificate III-qualified carer (${AGED_CARE_QUALIFIED.level}) gets at least ${formatAUD(AGED_CARE_QUALIFIED.weekly, 2)} a week, about ${formatAUD(annualFromWeekly(AGED_CARE_QUALIFIED.weekly))} a year full-time. Jobs and Skills Australia reports median full-time earnings of ${formatAUD(DISABILITY_SUPPORT_WORKER.median!.medianWeekly)} a week for aged and disabled carers. These rates reflect the Fair Work Commission's aged care work value decisions.`,
  },
  {
    q: "How much do doctors earn in Australia?",
    a: `The federal Medical Practitioners Award sets minimums of ${formatAUD(DR_INTERN)} a year for an intern, ${formatAUD(DR_REGISTRAR_LOW)} for a first-year registrar and ${formatAUD(DR_SPECIALIST_LOW)} for a specialist. Those apply to private hospitals and other national-system employers; most junior doctors work in state public hospitals, where state medical officer agreements pay considerably more. Jobs and Skills Australia reports median full-time earnings of ${formatAUD(DOCTOR.median!.medianWeekly)} a week for general practitioners and resident medical officers. Contractor GPs and specialists in private practice have no award minimum. See doctor pay rates for every classification.`,
    links: { "doctor pay rates": "/job-pay-rates/doctor/" },
  },
  {
    q: "Is public or private healthcare better paid?",
    a: `It depends on the agreement, so compare the actual scales. What the private sector cannot match is the public hospital salary packaging exemption: on a ${formatAUD(PACKAGE_SALARY)} salary, packaging the full hospital and meal entertainment caps is worth about ${formatAUD(PACKAGING_BENEFIT)} a year in extra take-home pay at FY${SITE_CONFIG.financialYear} rates, before provider fees.`,
  },
];
