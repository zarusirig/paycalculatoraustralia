// =============================================================================
// The six health salary pages. Every dollar figure is either a verbatim
// transcription (ATO Table 15 in ato-2023-24.ts, Jobs and Skills Australia
// profiles below, award and state schedules) or the site's tax engine run on
// one of those figures (tax.ts). Prose that quotes a figure builds it from the
// data, so the page, its FAQ markup and the tests cannot disagree.
//
// Jobs and Skills Australia occupation profiles (ANZSCO basis), "Earnings and
// Hours" table, read 9 October 2026 via Firecrawl. Median full-time earnings
// per week and median hourly earnings: ABS Survey of Employee Earnings and
// Hours, May 2025, customised report. Full-time share: ABS Labour Force
// Survey 2025, four-quarter average. Average full-time hours: ABS 2021 Census.
//   2523 Dental Practitioners ............ $3,232 / $85, 60%, 42 hours
//   2514 Optometrists and Orthoptists .... N/A / N/A (not published), 59%, 40 hours
//   2531 GPs and Resident Medical Officers $2,446 / $60, 77%, 45 hours
//   2532 Anaesthetists ................... $8,293 / $218, 90%, 46 hours
//   2535 Surgeons ........................ $3,905 / $80, 93%, 54 hours
//   2539 Other Medical Practitioners ..... $5,013 / $101, 77%, 46 hours
//
// Medical Practitioners Award 2020 [MA000031], awards.fairwork.gov.au,
// consolidated to 1 July 2026 (PR799312), read 9 October 2026: cl 4.2
// (settings covered), cl 12.3 (registrar includes general practice and rural
// and remote medicine training), cl 12.7 (community medical practitioner),
// cl 16.1(c) registrar pay points, cl 16.1(g) community medical practitioner
// pay points, cl 16.1(h) specialist $121,535.
//
// Health Professionals and Support Services Award 2020 [MA000027],
// consolidated to 1 October 2026 (PR814029), read 9 October 2026: Schedule B.3
// lists dental hygienist, dental prosthetist, dental therapist, oral health
// therapist and orthoptist (AQF 8 or 9) — not dentist, not optometrist; cl
// B.2(c) provides for professions not on the list; cl 4.6(d) excludes medical
// practitioners. Fair Work Ombudsman "Health Services Award [MA000027]"
// summary, read 9 October 2026: its examples of covered health professionals
// do not include dentists or optometrists; "doctors, GPs and surgeons" are
// listed as not covered.
// =============================================================================

import { formatAUD } from "../../constants/australian-tax";
import { awardTextUrl, jsaUrl } from "../job-pay-rates/common";
import {
  ATO_15A,
  ATO_15B,
  ATO_15D,
  ATO_INDIVIDUALS_SOURCE,
  ATO_RELEASE_URL,
  ATO_TABLE_15_SOURCE,
} from "./ato-2023-24";
import { NSW_IB2026_006_URL, QLD_MOCA7_URL, STAFF_SPECIALIST_SCALES, VIC_SPECIALISTS_EA_URL, VIC_WEEKLY } from "./staff-specialists";
import { DIVISION_293_THRESHOLD, HOSPITAL_PACKAGING, hospitalPackagingBenefit, takeHome } from "./tax";
import type { HealthSalaryPage, HealthSalarySlug, HealthSalarySource, JsaFigures } from "./types";

export const HEALTH_SALARY_VERIFIED_ON = "9 October 2026";
const MODIFIED = "2026-10-09";

const $ = (x: number) => formatAUD(x);

/** The take-home figures a FAQ answer quotes, from the site's tax engine. */
function th(gross: number) {
  const t = takeHome(gross);
  return { net: $(t.net), fortnight: formatAUD(t.fortnightly, 0), tax: $(t.tax), medicare: $(t.medicare), help: $(t.help) };
}

function jsa(code: string, title: string, slug: string, weekly: number, hourly: number, ft: number, hours: number, caveat?: string): JsaFigures {
  return {
    anzscoCode: code,
    anzscoTitle: title,
    medianWeekly: weekly,
    medianHourly: hourly,
    fullTimeShare: ft,
    averageFullTimeHours: hours,
    url: jsaUrl(`${code}-${slug}`),
    ...(caveat ? { caveat } : {}),
  };
}

function jsaSource(j: { anzscoCode: string; anzscoTitle: string; url: string }): HealthSalarySource {
  return {
    title: `${j.anzscoTitle} (ANZSCO ${j.anzscoCode}) occupation profile — ABS Survey of Employee Earnings and Hours, May 2025`,
    publisher: "Jobs and Skills Australia",
    url: j.url,
  };
}

const MA000031_SOURCE: HealthSalarySource = {
  title: "Medical Practitioners Award 2020 [MA000031] — consolidated to 1 July 2026",
  publisher: "Fair Work Commission",
  url: awardTextUrl("MA000031"),
};

const MA000027_SOURCE: HealthSalarySource = {
  title: "Health Professionals and Support Services Award 2020 [MA000027] — consolidated to 1 October 2026",
  publisher: "Fair Work Commission",
  url: awardTextUrl("MA000027"),
};

const FWO_MA000027_SUMMARY: HealthSalarySource = {
  title: "Health Services Award [MA000027] — who the award covers",
  publisher: "Fair Work Ombudsman",
  url: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000027-summary",
};

const ATO_RELEASE_SOURCE: HealthSalarySource = {
  title: "2023–24 Taxation Statistics released (17 June 2026)",
  publisher: "Australian Taxation Office",
  url: ATO_RELEASE_URL,
};

const STAFF_SPECIALIST_SOURCES: HealthSalarySource[] = [
  { title: "Interim Salary Increases for Staff Specialists – 2024 and 2025 (IB2026_006)", publisher: "NSW Health", url: NSW_IB2026_006_URL },
  {
    title: "Medical Specialists (Victorian Public Health Sector) (AMA Victoria/ASMOF) (Single Interest Employers) Enterprise Agreement 2022–2026 (AE517968)",
    publisher: "Fair Work Commission, published by Western Health",
    url: VIC_SPECIALISTS_EA_URL,
  },
  { title: "Medical Officers' (Queensland Health) Certified Agreement (No. 7) 2025 (CB/2025/128)", publisher: "Queensland Industrial Relations Commission", url: QLD_MOCA7_URL },
];

/** Medical Practitioners Award cl 16.1(h): the specialist minimum. */
export const AWARD_SPECIALIST_MINIMUM = 121_535;

/** Medical Practitioners Award cl 16.1(c): registrar pay points 1 and 4 (annual). */
export const AWARD_REGISTRAR_RANGE = { low: 80_248, high: 90_018 } as const;

/** Medical Practitioners Award cl 16.1(g), exactly as printed. */
export const COMMUNITY_MEDICAL_PRACTITIONER = [
  { label: "Community medical practitioner, pay point 1", annual: 105_932, weekly: 2_037.15, hourly: 53.61 },
  { label: "Pay point 2", annual: 109_803, weekly: 2_111.6, hourly: 55.57 },
  { label: "Pay point 3", annual: 113_348, weekly: 2_179.77, hourly: 57.36 },
  { label: "Pay point 4", annual: 116_183, weekly: 2_234.29, hourly: 58.8 },
  { label: "Pay point 5", annual: 119_833, weekly: 2_304.48, hourly: 60.64 },
  { label: "Pay point 6", annual: 123_617, weekly: 2_377.25, hourly: 62.56 },
  { label: "Pay point 7", annual: 127_752, weekly: 2_456.77, hourly: 64.65 },
  { label: "Pay point 8", annual: 131_623, weekly: 2_531.21, hourly: 66.61 },
] as const;

const NSW = STAFF_SPECIALIST_SCALES.find((s) => s.state === "NSW")!;
const VIC = STAFF_SPECIALIST_SCALES.find((s) => s.state === "VIC")!;
const QLD = STAFF_SPECIALIST_SCALES.find((s) => s.state === "QLD")!;
const NSW_Y1 = NSW.steps[0];
const NSW_Y1_WITH_ALLOWANCE = NSW_Y1.withAllowance!;

/** One-line entry points of the three state scales, used in FAQ answers. */
const STAFF_SPECIALIST_ENTRY =
  `In NSW a first-year staff specialist's base salary is ${$(NSW_Y1.annual)} (${$(NSW_Y1_WITH_ALLOWANCE)} with the 17.4% special allowance) from July 2025; ` +
  `in Victoria it is ${$(VIC.steps[0].annual)} a year (Year 1, ${formatAUD(VIC_WEEKLY[0][1], 2)} a week) from March 2025; ` +
  `and in Queensland the L18 entry level is ${$(QLD.steps[0].annual)} from 1 July 2026, before a 50% attraction and retention allowance.`;

const STAFF_SPECIALIST_SCENARIO = {
  label: "NSW staff specialist, year 1",
  gross: NSW_Y1_WITH_ALLOWANCE,
  source: "base salary plus 17.4% special allowance, NSW Health",
};

const STAFF_SPECIALIST_NOT_SHOWN =
  "Staff specialist scales for WA, SA, Tasmania, the ACT and the NT, and Queensland's L22 to L29, which we have not read from an official source.";

// ---------------------------------------------------------------------------
// Dentist
// ---------------------------------------------------------------------------

const [DENTIST, DENTIST_F, DENTIST_M] = ATO_15A.dentist;
const DENTAL_JSA = jsa("2523", "Dental Practitioners", "dental-practitioners", 3_232, 85, 0.6, 42,
  "The group counts dental specialists as well as dentists, and covers employees only — practice owners and contractors are not in it.");
const DENTAL_STATES = ATO_15D.dentalPractitioner;

const dentist: HealthSalaryPage = {
  slug: "dentist",
  name: "Dentist",
  plural: "dentists",
  metaTitle: `Dentist Salary Australia 2026 — ${$(DENTIST.averageTaxableIncome)} Average (ATO Data)`,
  metaDescription: `Dentists averaged ${$(DENTIST.averageTaxableIncome)} taxable income in 2023–24 (median ${$(DENTIST.medianTaxableIncome)}), ATO data. Full-time employee median ${$(DENTAL_JSA.medianWeekly)} a week, plus take-home pay.`,
  heading: "Dentist Salary Australia 2026 — What Dentists Earn and Take Home",
  atoOccupation: "occupation code 252312, Dentist",
  ato: DENTIST,
  atoBySex: [DENTIST_F, DENTIST_M],
  atoTables: [
    {
      id: "dentists-and-specialists",
      title: "Dentists and dental specialists",
      part: "Tables 15A and 15B",
      intro:
        "Dental specialists (occupation 252311) are counted separately from general dentists. The last row is the whole unit group, 2523 Dental practitioner, which is the level the ATO's state figures use.",
      rowHeading: "Occupation",
      rows: [
        { ...DENTIST, label: "252312 Dentist" },
        ATO_15A.dentalSpecialist,
        ATO_15B.dentalPractitioner,
      ],
    },
    {
      id: "by-state",
      title: "Dental practitioner income by state, 2023–24",
      part: "Table 15D",
      intro:
        "State figures are only published for the whole unit group, so these rows count dental specialists with dentists. The 23 people who lodged from overseas are left out.",
      rowHeading: "State or territory",
      rows: [...DENTAL_STATES],
    },
  ],
  jsa: DENTAL_JSA,
  coverageHeading: "Is there an award for dentists?",
  coverage: [
    "No modern award names dentists. The Health Professionals and Support Services Award [MA000027] covers employers that deliver dental services, but its list of health professions (Schedule B, which the award calls an indicative list) names dental hygienists, dental therapists, oral health therapists and dental prosthetists — not dentists — and the Fair Work Ombudsman's summary of the award doesn't list dentists among its examples either.",
    "So this page publishes no award minimum for dentists. If you are an employed dentist and want to know whether an award applies to you, ask the Fair Work Ombudsman; an award-free adult employee is still owed at least the National Minimum Wage and the National Employment Standards.",
    "A dentist who owns a practice, or contracts to one rather than being employed by it, is not an employee: no award, minimum wage or payslip applies. Dentists in public dental services are paid under state awards and agreements, which this page doesn't reproduce.",
  ],
  upLink: {
    before: "The dental team around a dentist does have award minimums: see ",
    anchor: "dental hygienist pay rates",
    href: "/job-pay-rates/dental-hygienist/",
    after: " — and dental assistants are covered by the same award.",
  },
  staffSpecialist: false,
  scenarios: [
    { label: "Median salary or wages", gross: DENTIST.medianSalaryOrWages, source: "ATO 2023–24, dentists paid a salary or wage" },
    { label: "Median taxable income", gross: DENTIST.medianTaxableIncome, source: "ATO 2023–24" },
    { label: "Average taxable income", gross: DENTIST.averageTaxableIncome, source: "ATO 2023–24" },
    { label: "Full-time employee median", gross: DENTAL_JSA.medianWeekly * 52, source: `${$(DENTAL_JSA.medianWeekly)} a week × 52, Jobs and Skills Australia` },
  ],
  payslip: [
    `At the ${$(DENTIST.medianSalaryOrWages)} median salary or wage, an employed dentist takes home about ${formatAUD(takeHome(DENTIST.medianSalaryOrWages).fortnightly, 0)} a fortnight after tax and the Medicare levy, with no HELP debt.`,
    "A dentist contracting to a practice is not paid through payroll. No tax is withheld unless the dentist and the practice have a voluntary PAYG withholding agreement, so tax and the Medicare levy are paid through PAYG instalments or at tax time instead.",
  ],
  notices: [
    "These are tax-return figures for the 2023–24 income year, the latest the ATO has published. They count part-time dentists and practice owners as well as full-time employees, so they are not a salary rate.",
  ],
  notShown: [
    "An award minimum for dentists: no modern award names them.",
    "Public dental service salaries, which are set by state awards and agreements.",
    "Practice owners' profits and contractors' billings, which are business income rather than wages.",
    "A salary ladder by years of experience: no primary source publishes one, and we do not estimate salaries.",
  ],
  faqs: [
    {
      q: "How much does a dentist earn in Australia?",
      a: `The ATO's latest tax statistics put dentists' average taxable income at ${$(DENTIST.averageTaxableIncome)} in 2023–24, across ${DENTIST.individuals.toLocaleString("en-AU")} people, with a median of ${$(DENTIST.medianTaxableIncome)}. Jobs and Skills Australia reports median earnings of ${$(DENTAL_JSA.medianWeekly)} a week for full-time employed dental practitioners (ABS, May 2025), about ${$(DENTAL_JSA.medianWeekly * 52)} a year.`,
    },
    {
      q: "What is a dentist's take-home pay?",
      a: (() => {
        const t = th(DENTIST.medianTaxableIncome);
        return `On the ${$(DENTIST.medianTaxableIncome)} median taxable income, a dentist keeps about ${t.net} a year — ${t.fortnight} a fortnight — at 2026–27 rates, after ${t.tax} of income tax and a ${t.medicare} Medicare levy, with no HELP debt. A HELP debt adds a compulsory repayment of about ${t.help} a year at that income.`;
      })(),
    },
    {
      q: "Is there an award rate for dentists?",
      a: "No modern award names dentists. The Health Professionals and Support Services Award covers dental practices, but its list of health professions names dental hygienists, dental therapists, oral health therapists and dental prosthetists, not dentists, so this page publishes no award minimum. Award-free employees are still owed at least the National Minimum Wage.",
    },
    {
      q: "Which state pays dentists the most?",
      a: `In the ATO's 2023–24 figures for dental practitioners — dentists and dental specialists counted together — average taxable income was highest in the ACT (${$(DENTAL_STATES.find((r) => r.label === "ACT")!.averageTaxableIncome)}) and lowest in Victoria (${$(DENTAL_STATES.find((r) => r.label === "VIC")!.averageTaxableIncome)}). These are averages of what people reported, not salary rates, and they include part-time work.`,
    },
    {
      q: "How much does a dental specialist earn?",
      a: `The ${ATO_15A.dentalSpecialist.individuals.toLocaleString("en-AU")} people who gave dental specialist as their occupation reported an average taxable income of ${$(ATO_15A.dentalSpecialist.averageTaxableIncome)} in 2023–24 and a median of ${$(ATO_15A.dentalSpecialist.medianTaxableIncome)}, according to the ATO. Those paid a salary or wage had a median of ${$(ATO_15A.dentalSpecialist.medianSalaryOrWages)} from it.`,
    },
    {
      q: "Do the ATO figures include part-time dentists?",
      a: `Yes. The ATO counts everyone who listed dentist as their occupation, whatever hours they worked. The Jobs and Skills Australia median covers full-time employees only, and JSA reports that ${Math.round(DENTAL_JSA.fullTimeShare * 100)}% of dental practitioners work full-time hours.`,
    },
  ],
  sources: [ATO_TABLE_15_SOURCE, ATO_INDIVIDUALS_SOURCE, jsaSource(DENTAL_JSA), MA000027_SOURCE, FWO_MA000027_SUMMARY],
  related: [
    { href: "/job-pay-rates/dental-hygienist/", label: "Dental Hygienist Pay Rates" },
    { href: "/job-pay-rates/dental-assistant/", label: "Dental Assistant Pay Rates" },
    { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator" },
    { href: "/highest-paying-jobs-australia/", label: "Highest Paying Jobs" },
  ],
  verifiedOn: HEALTH_SALARY_VERIFIED_ON,
  dateModified: MODIFIED,
};

// ---------------------------------------------------------------------------
// Radiologist
// ---------------------------------------------------------------------------

const [RADIOLOGIST, RADIOLOGIST_F, RADIOLOGIST_M] = ATO_15A.radiologist;
const OTHER_MP_JSA = jsa("2539", "Other Medical Practitioners", "other-medical-practitioners", 5_013, 101, 0.77, 46,
  "This is the median for the whole ANZSCO group radiologists belong to, which also counts dermatologists, emergency medicine specialists, ophthalmologists, pathologists and other specialists — so it is not a radiologist figure, and it covers employees only.");

const radiologist: HealthSalaryPage = {
  slug: "radiologist",
  name: "Radiologist",
  plural: "radiologists",
  metaTitle: `Radiologist Salary Australia 2026 — ${$(RADIOLOGIST.averageTaxableIncome)} Average (ATO)`,
  metaDescription: `Radiologists averaged ${$(RADIOLOGIST.averageTaxableIncome)} taxable income in 2023–24 (ATO). Public hospital staff specialist scales for NSW, VIC and QLD, and take-home pay after tax.`,
  heading: "Radiologist Salary Australia 2026 — Earnings, Staff Specialist Pay and Take-Home",
  atoOccupation: "occupation code 253917, Diagnostic and interventional radiologist",
  ato: RADIOLOGIST,
  atoBySex: [RADIOLOGIST_F, RADIOLOGIST_M],
  atoTables: [
    {
      id: "radiologists-in-context",
      title: "Radiologists against their ATO group",
      part: "Tables 15A and 15B",
      intro:
        "The ATO counts radiologists in unit group 2539, Other medical practitioners, alongside a dozen other specialties — which is why there is no state breakdown for radiologists alone. Radiation oncologists are a separate occupation in the same group.",
      rowHeading: "Occupation",
      rows: [
        { ...RADIOLOGIST, label: "253917 Diagnostic and interventional radiologist" },
        ATO_15A.radiationOncologist,
        { ...ATO_15B.otherMedicalPractitioners, label: "2539 Other medical practitioners (all)" },
      ],
    },
  ],
  jsa: OTHER_MP_JSA,
  coverageHeading: "Which award or agreement sets a radiologist's pay?",
  coverage: [
    "Radiologists employed by state public hospitals are staff specialists, paid under their state's specialist award or agreement. The NSW, Victorian and Queensland scales are further down this page.",
    `A radiologist employed by a private hospital, or by another employer in the settings the Medical Practitioners Award lists in clause 4.2, is a specialist under that award, with a minimum of ${$(AWARD_SPECIALIST_MINIMUM)} a year from the first full pay period on or after 1 July 2026 (cl 16.1(h)).`,
    "Private medical imaging practices are not among the settings clause 4.2 lists, and a radiologist who owns part of a practice or contracts to one is not an employee, so no award minimum applies to them.",
  ],
  upLink: {
    before: "Every Medical Practitioners Award level, from intern to senior principal specialist, is on our ",
    anchor: "doctor pay rates",
    href: "/job-pay-rates/doctor/",
    after: " page.",
  },
  staffSpecialist: true,
  scenarios: [
    STAFF_SPECIALIST_SCENARIO,
    { label: "Median salary or wages", gross: RADIOLOGIST.medianSalaryOrWages, source: "ATO 2023–24, radiologists paid a salary or wage" },
    { label: "Median taxable income", gross: RADIOLOGIST.medianTaxableIncome, source: "ATO 2023–24" },
    { label: "Average taxable income", gross: RADIOLOGIST.averageTaxableIncome, source: "ATO 2023–24" },
  ],
  payslip: [
    "In NSW, the private practice level a staff specialist chooses decides which allowances are paid on top of base salary: the 17.4% special allowance at Levels 1 to 4, and a private practice allowance of 20%, 14% or 8% at Levels 1 to 3. Each is pay, taxed through PAYG withholding with the salary.",
    "A radiologist who reports for a private practice as a contractor, or takes a share of a practice's profit as an owner, is not paid through payroll: tax on that income is paid through PAYG instalments or at tax time.",
  ],
  notices: [
    "These are tax-return figures for the 2023–24 income year, the latest the ATO has published. They count part-time radiologists and practice owners as well as employees, so they are not a salary rate.",
  ],
  notShown: [
    "State figures for radiologists alone: the ATO's state table groups them with other specialists.",
    STAFF_SPECIALIST_NOT_SHOWN,
    "Private radiology practice salaries and contractor rates: no primary source publishes them.",
    "Rights of private practice earnings and visiting medical officer arrangements, which depend on the individual arrangement.",
  ],
  faqs: [
    {
      q: "How much does a radiologist earn in Australia?",
      a: `The ATO's 2023–24 tax statistics put radiologists' average taxable income at ${$(RADIOLOGIST.averageTaxableIncome)}, across ${RADIOLOGIST.individuals.toLocaleString("en-AU")} people, with a median of ${$(RADIOLOGIST.medianTaxableIncome)}. Radiologists who were paid a salary or wage had an average of ${$(RADIOLOGIST.averageSalaryOrWages)} and a median of ${$(RADIOLOGIST.medianSalaryOrWages)} from it.`,
    },
    {
      q: "What is a radiologist's take-home pay?",
      a: (() => {
        const t = th(RADIOLOGIST.medianTaxableIncome);
        return `On the ${$(RADIOLOGIST.medianTaxableIncome)} median taxable income, a radiologist keeps about ${t.net} a year — ${t.fortnight} a fortnight — at 2026–27 rates, after ${t.tax} of income tax and a ${t.medicare} Medicare levy. A HELP debt would add a compulsory repayment of about ${t.help}, 10% of repayment income at this level.`;
      })(),
    },
    {
      q: "How much does a public hospital radiologist earn?",
      a: `A radiologist in a public hospital is a staff specialist on the same scale as other specialties. ${STAFF_SPECIALIST_ENTRY}`,
    },
    {
      q: "Is there an award rate for radiologists?",
      a: `Only where the Medical Practitioners Award applies — private hospitals and the other settings in its clause 4.2. There a radiologist is a specialist, with a minimum of ${$(AWARD_SPECIALIST_MINIMUM)} a year from the first full pay period on or after 1 July 2026. Private imaging practices are not on the award's list of settings.`,
    },
    {
      q: "Does Division 293 tax apply to radiologists?",
      a: `It applies to anyone whose income plus concessional super contributions passes ${$(DIVISION_293_THRESHOLD)}, and both the ATO's average (${$(RADIOLOGIST.averageTaxableIncome)}) and median (${$(RADIOLOGIST.medianTaxableIncome)}) taxable income for radiologists are above that. It is an extra 15% on super contributions that the ATO assesses after your tax return, so it never appears on a payslip.`,
    },
  ],
  sources: [ATO_TABLE_15_SOURCE, ATO_INDIVIDUALS_SOURCE, jsaSource(OTHER_MP_JSA), MA000031_SOURCE, ...STAFF_SPECIALIST_SOURCES],
  related: [
    { href: "/job-pay-rates/doctor/", label: "Doctor Pay Rates" },
    { href: "/job-pay-rates/radiographer/", label: "Radiographer Pay Rates" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
    { href: "/division-293-tax/", label: "Division 293 Tax" },
  ],
  verifiedOn: HEALTH_SALARY_VERIFIED_ON,
  dateModified: MODIFIED,
};

// ---------------------------------------------------------------------------
// Anaesthetist
// ---------------------------------------------------------------------------

const [ANAESTHETIST, ANAESTHETIST_F, ANAESTHETIST_M] = ATO_15A.anaesthetist;
const ANAESTHETIST_JSA = jsa("2532", "Anaesthetists", "anaesthetists", 8_293, 218, 0.9, 46);
const ANAESTHETIST_STATES = ATO_15D.anaesthetist;

const anaesthetist: HealthSalaryPage = {
  slug: "anaesthetist",
  name: "Anaesthetist",
  plural: "anaesthetists",
  metaTitle: `Anaesthetist Salary Australia 2026 — ${$(ANAESTHETIST.averageTaxableIncome)} Average (ATO)`,
  metaDescription: `Anaesthetists averaged ${$(ANAESTHETIST.averageTaxableIncome)} taxable income in 2023–24 (ATO), with figures for every state, public hospital staff specialist pay and take-home pay.`,
  heading: "Anaesthetist Salary Australia 2026 — Earnings by State and Take-Home Pay",
  atoOccupation: "occupation code 253211, Anaesthetist",
  ato: ANAESTHETIST,
  atoBySex: [ANAESTHETIST_F, ANAESTHETIST_M],
  atoTables: [
    {
      id: "by-state",
      title: "Anaesthetist income by state, 2023–24",
      part: "Table 15D",
      intro:
        "Unit group 2532 is anaesthetists alone, so these state figures are for anaesthetists only. The 37 people who lodged from overseas are left out.",
      rowHeading: "State or territory",
      rows: [...ANAESTHETIST_STATES],
    },
  ],
  jsa: ANAESTHETIST_JSA,
  coverageHeading: "Which award or agreement sets an anaesthetist's pay?",
  coverage: [
    "In a state public hospital an anaesthetist is employed as a staff specialist and paid on the state's specialist scale — the same scale as other specialties. The NSW, Victorian and Queensland scales are below.",
    `Private hospitals and the other employers in the settings the Medical Practitioners Award lists (cl 4.2) must pay an employed specialist at least ${$(AWARD_SPECIALIST_MINIMUM)} a year from the first full pay period on or after 1 July 2026 (cl 16.1(h)).`,
    "An anaesthetist in private practice on their own account is not an employee, so neither the award nor a payslip applies to that work.",
  ],
  upLink: {
    before: "Senior, principal and senior principal specialist minimums under the award are on our ",
    anchor: "doctor pay rates",
    href: "/job-pay-rates/doctor/",
    after: " page.",
  },
  staffSpecialist: true,
  scenarios: [
    STAFF_SPECIALIST_SCENARIO,
    { label: "Median salary or wages", gross: ANAESTHETIST.medianSalaryOrWages, source: "ATO 2023–24, anaesthetists paid a salary or wage" },
    { label: "Full-time employee median", gross: ANAESTHETIST_JSA.medianWeekly * 52, source: `${$(ANAESTHETIST_JSA.medianWeekly)} a week × 52, Jobs and Skills Australia` },
    { label: "Median taxable income", gross: ANAESTHETIST.medianTaxableIncome, source: "ATO 2023–24" },
    { label: "Average taxable income", gross: ANAESTHETIST.averageTaxableIncome, source: "ATO 2023–24" },
  ],
  payslip: [
    `At the Jobs and Skills Australia employee median of ${$(ANAESTHETIST_JSA.medianWeekly)} a week, take-home comes to about ${formatAUD(takeHome(ANAESTHETIST_JSA.medianWeekly * 52).fortnightly, 0)} a fortnight after tax and the Medicare levy, with no HELP debt or salary packaging.`,
    "Private work done outside hospital employment is paid separately and is not on the hospital payslip; tax on it is paid through PAYG instalments or at tax time.",
  ],
  notices: [
    "These are tax-return figures for the 2023–24 income year, the latest the ATO has published. They count part-time anaesthetists and those in private practice as well as employees, so they are not a salary rate.",
  ],
  notShown: [
    STAFF_SPECIALIST_NOT_SHOWN,
    "Private practice and visiting medical officer income, which depends on the individual arrangement.",
    "On-call and recall payments, which depend on the roster and the agreement that applies.",
  ],
  faqs: [
    {
      q: "How much does an anaesthetist earn in Australia?",
      a: `The ATO's 2023–24 tax statistics put anaesthetists' average taxable income at ${$(ANAESTHETIST.averageTaxableIncome)}, across ${ANAESTHETIST.individuals.toLocaleString("en-AU")} people, with a median of ${$(ANAESTHETIST.medianTaxableIncome)}. Jobs and Skills Australia reports median earnings of ${$(ANAESTHETIST_JSA.medianWeekly)} a week for full-time employed anaesthetists (ABS, May 2025).`,
    },
    {
      q: "What is an anaesthetist's take-home pay?",
      a: (() => {
        const t = th(ANAESTHETIST.medianTaxableIncome);
        return `On the ${$(ANAESTHETIST.medianTaxableIncome)} median taxable income, an anaesthetist keeps about ${t.net} a year — ${t.fortnight} a fortnight — at 2026–27 rates, after ${t.tax} of income tax and a ${t.medicare} Medicare levy, with no HELP debt.`;
      })(),
    },
    {
      q: "Which state pays anaesthetists the most?",
      a: `In the ATO's 2023–24 figures, anaesthetists' average taxable income was highest in Victoria (${$(ANAESTHETIST_STATES.find((r) => r.label === "VIC")!.averageTaxableIncome)}) and Queensland (${$(ANAESTHETIST_STATES.find((r) => r.label === "QLD")!.averageTaxableIncome)}), and lowest in NSW (${$(ANAESTHETIST_STATES.find((r) => r.label === "NSW")!.averageTaxableIncome)}). These are averages of what people reported, not salary rates.`,
    },
    {
      q: "How much does a public hospital anaesthetist earn?",
      a: `A public hospital anaesthetist is a staff specialist on the same scale as other specialties. ${STAFF_SPECIALIST_ENTRY}`,
    },
    {
      q: "Can a public hospital anaesthetist salary package?",
      a: `Yes. Public hospital employees can package about ${$(HOSPITAL_PACKAGING.faceValue)} a year of everyday expenses under a ${$(HOSPITAL_PACKAGING.grossedUpCap)} grossed-up fringe benefits tax cap. On a ${$(NSW_Y1.annual)} salary that leaves about ${$(hospitalPackagingBenefit(NSW_Y1.annual))} more to spend each year, before the packaging provider's fees.`,
    },
  ],
  sources: [ATO_TABLE_15_SOURCE, ATO_INDIVIDUALS_SOURCE, jsaSource(ANAESTHETIST_JSA), MA000031_SOURCE, ...STAFF_SPECIALIST_SOURCES],
  related: [
    { href: "/job-pay-rates/doctor/", label: "Doctor Pay Rates" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
    { href: "/division-293-tax/", label: "Division 293 Tax" },
    { href: "/medicare-levy-surcharge-calculator/", label: "Medicare Levy Surcharge Calculator" },
  ],
  verifiedOn: HEALTH_SALARY_VERIFIED_ON,
  dateModified: MODIFIED,
};

// ---------------------------------------------------------------------------
// Optometrist
// ---------------------------------------------------------------------------

const [OPTOMETRIST, OPTOMETRIST_F, OPTOMETRIST_M] = ATO_15A.optometrist;
const OPTOMETRY_STATES = ATO_15D.optometristOrOrthoptist;
const OPTOMETRY_JSA_URL = jsaUrl("2514-optometrists-and-orthoptists");

const optometrist: HealthSalaryPage = {
  slug: "optometrist",
  name: "Optometrist",
  plural: "optometrists",
  metaTitle: `Optometrist Salary Australia 2026 — ${$(OPTOMETRIST.averageTaxableIncome)} Average (ATO)`,
  metaDescription: `Optometrists averaged ${$(OPTOMETRIST.averageTaxableIncome)} taxable income in 2023–24 (median ${$(OPTOMETRIST.medianTaxableIncome)}), ATO data. State figures, award coverage and take-home pay.`,
  heading: "Optometrist Salary Australia 2026 — What Optometrists Earn and Take Home",
  atoOccupation: "occupation code 251411, Optometrist",
  ato: OPTOMETRIST,
  atoBySex: [OPTOMETRIST_F, OPTOMETRIST_M],
  atoTables: [
    {
      id: "optometrists-and-orthoptists",
      title: "Optometrists and orthoptists",
      part: "Tables 15A and 15B",
      intro:
        "The ATO groups optometrists with orthoptists in unit group 2514. The rows show each occupation and then the whole group.",
      rowHeading: "Occupation",
      rows: [{ ...OPTOMETRIST, label: "251411 Optometrist" }, ATO_15A.orthoptist, ATO_15B.optometristOrOrthoptist],
    },
    {
      id: "by-state",
      title: "Optometrist and orthoptist income by state, 2023–24",
      part: "Table 15D",
      intro: `State figures are only published for the whole unit group, so they include the ${ATO_15A.orthoptist.individuals.toLocaleString("en-AU")} orthoptists counted with the ${OPTOMETRIST.individuals.toLocaleString("en-AU")} optometrists. The 13 people who lodged from overseas are left out.`,
      rowHeading: "State or territory",
      rows: [...OPTOMETRY_STATES],
    },
  ],
  jsa: null,
  coverageHeading: "Is there an award for optometrists?",
  coverage: [
    "No modern award names optometrists. The Health Professionals and Support Services Award [MA000027] covers employers in health care, and its list of common health professions (Schedule B) names orthoptists but not optometrists; the Fair Work Ombudsman's summary of who the award covers doesn't list optometrists either.",
    "The award does provide for health professions that are not on its list (clause B.2(c)), so it may still cover an employed optometrist. Neither the award nor the Fair Work Ombudsman's summary settles that, so this page publishes no award minimum — ask the Fair Work Ombudsman about your own job.",
    "An optometrist who owns a practice, or contracts to one, is not an employee, so no award, minimum wage or payslip applies to that work.",
  ],
  upLink: {
    before: "Orthoptists are on the award's list, at AQF level 8 or 9. For how the award's health professional rates work, see our ",
    anchor: "Health Professionals Award rates",
    href: "/health-professionals-award-rates/",
    after: " page.",
  },
  staffSpecialist: false,
  scenarios: [
    { label: "Median salary or wages", gross: OPTOMETRIST.medianSalaryOrWages, source: "ATO 2023–24, optometrists paid a salary or wage" },
    { label: "Median taxable income", gross: OPTOMETRIST.medianTaxableIncome, source: "ATO 2023–24" },
    { label: "Average taxable income", gross: OPTOMETRIST.averageTaxableIncome, source: "ATO 2023–24" },
  ],
  payslip: [
    `At the ${$(OPTOMETRIST.medianSalaryOrWages)} median salary or wage, an employed optometrist takes home about ${formatAUD(takeHome(OPTOMETRIST.medianSalaryOrWages).fortnightly, 0)} a fortnight after tax and the Medicare levy with no HELP debt — or about ${formatAUD((takeHome(OPTOMETRIST.medianSalaryOrWages).net - takeHome(OPTOMETRIST.medianSalaryOrWages).help) / 26, 0)} with one, once the compulsory HELP repayment is withheld as well.`,
  ],
  notices: [
    "These are tax-return figures for the 2023–24 income year, the latest the ATO has published. They count part-time optometrists and practice owners as well as full-time employees, so they are not a salary rate.",
  ],
  notShown: [
    "An award minimum for optometrists: neither the Health Professionals Award nor the Fair Work Ombudsman's summary confirms that one applies.",
    "A Jobs and Skills Australia employee median: JSA publishes \"N/A\" for optometrists and orthoptists, as it does wherever the survey estimate has a high standard error.",
    "A salary ladder by years of experience: no primary source publishes one, and we do not estimate salaries.",
  ],
  faqs: [
    {
      q: "How much does an optometrist earn in Australia?",
      a: `The ATO's 2023–24 tax statistics put optometrists' average taxable income at ${$(OPTOMETRIST.averageTaxableIncome)}, across ${OPTOMETRIST.individuals.toLocaleString("en-AU")} people, with a median of ${$(OPTOMETRIST.medianTaxableIncome)}. Optometrists paid a salary or wage had a median of ${$(OPTOMETRIST.medianSalaryOrWages)} from it.`,
    },
    {
      q: "What is an optometrist's take-home pay?",
      a: (() => {
        const t = th(OPTOMETRIST.medianTaxableIncome);
        return `On the ${$(OPTOMETRIST.medianTaxableIncome)} median taxable income, an optometrist keeps about ${t.net} a year — ${t.fortnight} a fortnight — at 2026–27 rates, after ${t.tax} of income tax and a ${t.medicare} Medicare levy. With a HELP debt, a compulsory repayment of about ${t.help} a year comes out as well.`;
      })(),
    },
    {
      q: "Is there an award for optometrists?",
      a: "No modern award names optometrists. The Health Professionals and Support Services Award lists orthoptists but not optometrists, and the Fair Work Ombudsman's summary of the award doesn't name them; the award does allow for unlisted professions, so whether it covers an employed optometrist is a question for the Fair Work Ombudsman.",
    },
    {
      q: "Which state pays optometrists the most?",
      a: `In the ATO's 2023–24 figures for optometrists and orthoptists together, average taxable income was highest in the Northern Territory (${$(OPTOMETRY_STATES.find((r) => r.label === "NT")!.averageTaxableIncome)}, ${OPTOMETRY_STATES.find((r) => r.label === "NT")!.individuals} people) and the ACT (${$(OPTOMETRY_STATES.find((r) => r.label === "ACT")!.averageTaxableIncome)}), and lowest in Victoria (${$(OPTOMETRY_STATES.find((r) => r.label === "VIC")!.averageTaxableIncome)}).`,
    },
    {
      q: "How do optometrists' earnings compare with orthoptists'?",
      a: `Orthoptists reported an average taxable income of ${$(ATO_15A.orthoptist.averageTaxableIncome)} in 2023–24 and a median of ${$(ATO_15A.orthoptist.medianTaxableIncome)}, against ${$(OPTOMETRIST.averageTaxableIncome)} and ${$(OPTOMETRIST.medianTaxableIncome)} for optometrists (ATO). Unlike optometrists, orthoptists are named in the Health Professionals Award.`,
    },
  ],
  sources: [ATO_TABLE_15_SOURCE, ATO_INDIVIDUALS_SOURCE, MA000027_SOURCE, FWO_MA000027_SUMMARY, {
    title: "Optometrists and Orthoptists (ANZSCO 2514) occupation profile — median earnings published as N/A",
    publisher: "Jobs and Skills Australia",
    url: OPTOMETRY_JSA_URL,
  }],
  related: [
    { href: "/health-professionals-award-rates/", label: "Health Professionals Award Rates" },
    { href: "/job-pay-rates/audiologist/", label: "Audiologist Pay Rates" },
    { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator" },
    { href: "/average-salary-australia/", label: "Average Salary Australia" },
  ],
  verifiedOn: HEALTH_SALARY_VERIFIED_ON,
  dateModified: MODIFIED,
};

// ---------------------------------------------------------------------------
// GP
// ---------------------------------------------------------------------------

const [GP, GP_F, GP_M] = ATO_15A.gp;
const GP_JSA = jsa("2531", "General Practitioners and Resident Medical Officers", "general-practitioners-and-resident-medical-officers", 2_446, 60, 0.77, 45,
  "This group counts hospital resident medical officers as well as GPs, and covers employees only — GPs who own or contract to a practice are not in it. The same median appears on our doctor pay rates page.");
const CMP1 = COMMUNITY_MEDICAL_PRACTITIONER[0];
const CMP8 = COMMUNITY_MEDICAL_PRACTITIONER[COMMUNITY_MEDICAL_PRACTITIONER.length - 1];

const gp: HealthSalaryPage = {
  slug: "gp",
  name: "GP",
  plural: "GPs",
  metaTitle: `GP Salary Australia 2026 — ${$(GP.averageTaxableIncome)} Average (ATO Data)`,
  metaDescription: `GPs averaged ${$(GP.averageTaxableIncome)} taxable income in 2023–24 (median ${$(GP.medianTaxableIncome)}), ATO data. The award minimum for employed GPs and take-home pay after tax.`,
  heading: "GP Salary Australia 2026 — What General Practitioners Earn and Take Home",
  atoOccupation: "occupation code 253111, Medical practitioner – general practice",
  ato: GP,
  atoBySex: [GP_F, GP_M],
  atoTables: [
    {
      id: "gps-and-residents",
      title: "GPs and hospital resident medical officers",
      part: "Tables 15A and 15B",
      intro:
        "The ATO counts GPs and resident medical officers in one unit group, 2531 General medical practitioner. That is why this page shows no state breakdown: the ATO's state figures mix the two.",
      rowHeading: "Occupation",
      rows: [{ ...GP, label: "253111 General practice" }, ATO_15A.residentMedicalOfficer, ATO_15B.generalMedicalPractitioner],
    },
  ],
  jsa: GP_JSA,
  coverageHeading: "Is there an award for GPs?",
  coverage: [
    "The Medical Practitioners Award 2020 [MA000031] covers doctors employed in the settings its clause 4.2 lists: hospitals, hospices, benevolent homes, day procedure centres, Aboriginal health services, community health centres and a few named bodies such as the Red Cross Blood Service.",
    "Its community medical practitioner classification (cl 12.7) is for a doctor with at least 4 years' post-graduate experience employed to practise in community health centres or in general medical practice. The minimums are in the table below.",
    "GP registrars — doctors in an accredited training program leading to fellowship, including the general practice and rural and remote medicine colleges — are registrars under the award (cl 12.3).",
    "A GP who owns a practice, or contracts to one rather than being employed by it, is not an employee. No award minimum applies and there is no payslip.",
  ],
  upLink: {
    before: "Registrar minimums, and every other classification in the award, are on our ",
    anchor: "doctor pay rates",
    href: "/job-pay-rates/doctor/",
    after: " page.",
  },
  awardTable: {
    title: "Award minimum for an employed GP, 2026–27",
    intro:
      "Medical Practitioners Award clause 16.1(g), community medical practitioner, from the first full pay period on or after 1 July 2026 — for a GP employed where the award applies. Annual, weekly and hourly figures exactly as the award prints them.",
    rows: COMMUNITY_MEDICAL_PRACTITIONER.map((r) => ({ ...r })),
    footnote: "Medical Practitioners Award 2020 [MA000031], consolidated to 1 July 2026. Full-time, 38 ordinary hours a week, before tax and super.",
  },
  staffSpecialist: false,
  scenarios: [
    { label: "Award minimum", gross: CMP1.annual, source: "community medical practitioner pay point 1" },
    { label: "Median salary or wages", gross: GP.medianSalaryOrWages, source: "ATO 2023–24, GPs paid a salary or wage" },
    { label: "Median taxable income", gross: GP.medianTaxableIncome, source: "ATO 2023–24" },
    { label: "Average taxable income", gross: GP.averageTaxableIncome, source: "ATO 2023–24" },
  ],
  payslip: [
    "That is the payslip a GP gets from a community health centre, an Aboriginal health service or a practice that puts its doctors on payroll.",
    "A GP who contracts to a practice is not paid through payroll, so no PAYG tax is withheld unless the GP and the practice have a voluntary withholding agreement. Tax and the Medicare levy are then paid through PAYG instalments or at tax time.",
  ],
  notices: [
    "These are tax-return figures for the 2023–24 income year, the latest the ATO has published. They count part-time GPs and practice owners as well as employees, so they are not a salary rate.",
  ],
  notShown: [
    "State figures for GPs alone: the ATO's state table counts GPs and resident medical officers together.",
    "Contractor and practice-owner arrangements, which produce business income rather than wages.",
    "A salary ladder by years of experience: no primary source publishes one, and we do not estimate salaries.",
  ],
  faqs: [
    {
      q: "How much does a GP earn in Australia?",
      a: `The ATO's 2023–24 tax statistics put GPs' average taxable income at ${$(GP.averageTaxableIncome)}, across ${GP.individuals.toLocaleString("en-AU")} people, with a median of ${$(GP.medianTaxableIncome)}. GPs paid a salary or wage had a median of ${$(GP.medianSalaryOrWages)} from it.`,
    },
    {
      q: "What is a GP's take-home pay?",
      a: (() => {
        const t = th(GP.medianTaxableIncome);
        return `On the ${$(GP.medianTaxableIncome)} median taxable income, a GP keeps about ${t.net} a year — ${t.fortnight} a fortnight — at 2026–27 rates, after ${t.tax} of income tax and a ${t.medicare} Medicare levy, with no HELP debt. A HELP debt adds a compulsory repayment of about ${t.help} a year at that income.`;
      })(),
    },
    {
      q: "Is there an award rate for GPs?",
      a: `Where the Medical Practitioners Award applies, an employed GP with at least 4 years' post-graduate experience can be classified as a community medical practitioner, with a minimum of ${$(CMP1.annual)} a year (${formatAUD(CMP1.hourly, 2)} an hour) at pay point 1, rising to ${$(CMP8.annual)} at pay point 8, from the first full pay period on or after 1 July 2026. GPs who contract to or own a practice have no award minimum.`,
    },
    {
      q: "How much do GP registrars earn?",
      a: `GP registrars in an accredited training program are registrars under the Medical Practitioners Award. Where the award applies, registrar minimums run from ${$(AWARD_REGISTRAR_RANGE.low)} a year at pay point 1 to ${$(AWARD_REGISTRAR_RANGE.high)} at pay point 4, from the first full pay period on or after 1 July 2026.`,
    },
    {
      q: "Do GPs earn more than hospital resident doctors?",
      a: `In the ATO's 2023–24 figures, GPs' average taxable income was ${$(GP.averageTaxableIncome)} against ${$(ATO_15A.residentMedicalOfficer.averageTaxableIncome)} for the ${ATO_15A.residentMedicalOfficer.individuals.toLocaleString("en-AU")} resident medical officers; the medians were ${$(GP.medianTaxableIncome)} and ${$(ATO_15A.residentMedicalOfficer.medianTaxableIncome)}.`,
    },
  ],
  sources: [ATO_TABLE_15_SOURCE, ATO_INDIVIDUALS_SOURCE, MA000031_SOURCE, jsaSource(GP_JSA)],
  related: [
    { href: "/job-pay-rates/doctor/", label: "Doctor Pay Rates" },
    { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee Calculator" },
    { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
  ],
  verifiedOn: HEALTH_SALARY_VERIFIED_ON,
  dateModified: MODIFIED,
};

// ---------------------------------------------------------------------------
// Surgeon
// ---------------------------------------------------------------------------

const [SURGEON, SURGEON_F, SURGEON_M] = ATO_15B.surgeon;
const SURGEON_JSA = jsa("2535", "Surgeons", "surgeons", 3_905, 80, 0.93, 54,
  "It covers employees only. Surgeons in private practice on their own account are not in it, while the ATO figures above count everyone who gave surgeon as their occupation.");
const SURGEON_STATES = ATO_15D.surgeon;
const SPECIALTIES = ATO_15A.surgicalSpecialties;

function byAverage(label: string) {
  return SPECIALTIES.find((r) => r.label === label)!;
}

const surgeon: HealthSalaryPage = {
  slug: "surgeon",
  name: "Surgeon",
  plural: "surgeons",
  metaTitle: `Surgeon Salary Australia 2026 — ${$(SURGEON.averageTaxableIncome)} Average (ATO Data)`,
  metaDescription: `Surgeons averaged ${$(SURGEON.averageTaxableIncome)} taxable income in 2023–24, the top occupation in ATO data. Figures by specialty and state, hospital pay and take-home.`,
  heading: "Surgeon Salary Australia 2026 — Earnings by Specialty and Take-Home Pay",
  atoOccupation: "unit group 2535, Surgeon (all nine surgical occupations)",
  ato: SURGEON,
  atoBySex: [SURGEON_F, SURGEON_M],
  atoTables: [
    {
      id: "by-specialty",
      title: "Surgeon income by specialty, 2023–24",
      part: "Table 15A",
      intro:
        "Each surgical occupation the ATO codes within unit group 2535. Some groups are small — 143 cardiothoracic surgeons, 109 paediatric surgeons — so treat their averages with care.",
      rowHeading: "Specialty",
      rows: [...SPECIALTIES],
    },
    {
      id: "by-state",
      title: "Surgeon income by state, 2023–24",
      part: "Table 15D",
      intro: "All surgical specialties together. The 37 people who lodged from overseas are left out.",
      rowHeading: "State or territory",
      rows: [...SURGEON_STATES],
    },
  ],
  jsa: SURGEON_JSA,
  coverageHeading: "Which award or agreement sets a surgeon's pay?",
  coverage: [
    "Surgeons employed by state public hospitals are staff specialists on their state's specialist scale, which is the same for every specialty. The NSW, Victorian and Queensland scales are below.",
    `Surgeons employed by private hospitals and the other employers the Medical Practitioners Award covers (cl 4.2) have a specialist minimum of ${$(AWARD_SPECIALIST_MINIMUM)} a year from the first full pay period on or after 1 July 2026 (cl 16.1(h)); surgical registrars in training are registrars under the same award.`,
    "Surgeons in private practice on their own account are not employees. Visiting medical officer arrangements with public hospitals are separate from the staff specialist scales and are not reproduced here.",
  ],
  upLink: {
    before: "Registrar and specialist minimums under the award are on our ",
    anchor: "doctor pay rates",
    href: "/job-pay-rates/doctor/",
    after: " page.",
  },
  staffSpecialist: true,
  scenarios: [
    { label: "Median salary or wages", gross: SURGEON.medianSalaryOrWages, source: "ATO 2023–24, surgeons paid a salary or wage" },
    { label: "Full-time employee median", gross: SURGEON_JSA.medianWeekly * 52, source: `${$(SURGEON_JSA.medianWeekly)} a week × 52, Jobs and Skills Australia` },
    STAFF_SPECIALIST_SCENARIO,
    { label: "Median taxable income", gross: SURGEON.medianTaxableIncome, source: "ATO 2023–24" },
    { label: "Average taxable income", gross: SURGEON.averageTaxableIncome, source: "ATO 2023–24" },
  ],
  payslip: [
    `The ATO's median salary or wage for surgeons, ${$(SURGEON.medianSalaryOrWages)}, works out to about ${formatAUD(takeHome(SURGEON.medianSalaryOrWages).fortnightly, 0)} a fortnight after tax and the Medicare levy. Income from private practice is not on that payslip; tax on it is paid through PAYG instalments or at tax time.`,
  ],
  notices: [
    "These are tax-return figures for the 2023–24 income year, the latest the ATO has published. They count part-time surgeons and those in private practice as well as employees, so they are not a salary rate.",
  ],
  notShown: [
    STAFF_SPECIALIST_NOT_SHOWN,
    "Visiting medical officer arrangements and private practice fees, which depend on the individual arrangement.",
    "Specialty figures by state: the ATO publishes states only for surgeons as a whole.",
  ],
  faqs: [
    {
      q: "How much does a surgeon earn in Australia?",
      a: `The ATO's 2023–24 tax statistics put surgeons' average taxable income at ${$(SURGEON.averageTaxableIncome)}, across ${SURGEON.individuals.toLocaleString("en-AU")} people, with a median of ${$(SURGEON.medianTaxableIncome)}. Surgeons paid a salary or wage had a median of ${$(SURGEON.medianSalaryOrWages)} from it.`,
    },
    {
      q: "What is a surgeon's take-home pay?",
      a: (() => {
        const t = th(SURGEON.medianTaxableIncome);
        return `On the ${$(SURGEON.medianTaxableIncome)} median taxable income, a surgeon keeps about ${t.net} a year — ${t.fortnight} a fortnight — at 2026–27 rates, after ${t.tax} of income tax and a ${t.medicare} Medicare levy, with no HELP debt.`;
      })(),
    },
    {
      q: "Which type of surgeon earns the most?",
      a: `In the ATO's 2023–24 figures, neurosurgeons had the highest average taxable income (${$(byAverage("Neurosurgeon").averageTaxableIncome)}, ${byAverage("Neurosurgeon").individuals} people), followed by plastic and reconstructive surgeons (${$(byAverage("Plastic and reconstructive surgeon").averageTaxableIncome)}). General surgeons, the largest group at ${byAverage("Surgeon (general)").individuals.toLocaleString("en-AU")}, averaged ${$(byAverage("Surgeon (general)").averageTaxableIncome)}, and paediatric surgeons ${$(byAverage("Paediatric surgeon").averageTaxableIncome)}.`,
    },
    {
      q: "Are surgeons the highest-paid job in Australia?",
      a: `In the ATO's figures, yes: its release of the 2023–24 statistics says surgeons have been the highest-paid occupation for the last 15 years, with ${SURGEON.individuals.toLocaleString("en-AU")} people reporting an average taxable income of ${$(SURGEON.averageTaxableIncome)}.`,
    },
    {
      q: "Which state pays surgeons the most?",
      a: `Surgeons' average taxable income in 2023–24 was highest in Tasmania (${$(SURGEON_STATES.find((r) => r.label === "TAS")!.averageTaxableIncome)}, ${SURGEON_STATES.find((r) => r.label === "TAS")!.individuals} people) and Western Australia (${$(SURGEON_STATES.find((r) => r.label === "WA")!.averageTaxableIncome)}), and lowest in NSW (${$(SURGEON_STATES.find((r) => r.label === "NSW")!.averageTaxableIncome)}), according to the ATO.`,
    },
  ],
  sources: [ATO_TABLE_15_SOURCE, ATO_RELEASE_SOURCE, ATO_INDIVIDUALS_SOURCE, jsaSource(SURGEON_JSA), MA000031_SOURCE, ...STAFF_SPECIALIST_SOURCES],
  related: [
    { href: "/job-pay-rates/doctor/", label: "Doctor Pay Rates" },
    { href: "/salary-packaging-guide/", label: "Salary Packaging Guide" },
    { href: "/division-293-tax/", label: "Division 293 Tax" },
    { href: "/highest-paying-jobs-australia/", label: "Highest Paying Jobs" },
  ],
  verifiedOn: HEALTH_SALARY_VERIFIED_ON,
  dateModified: MODIFIED,
};

export const HEALTH_SALARY_PAGES_BY_SLUG: Readonly<Record<HealthSalarySlug, HealthSalaryPage>> = {
  dentist,
  radiologist,
  anaesthetist,
  optometrist,
  gp,
  surgeon,
};
