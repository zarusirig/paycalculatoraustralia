// Public hospital staff specialist salary scales, for the radiologist,
// anaesthetist and surgeon pages. A staff specialist is paid on the same scale
// whatever the specialty, so one table per state serves all three. Only states
// whose schedule we read in full from an official source are here.
//
// NSW — NSW Health Information Bulletin IB2026_006, "Interim Salary Increases
// for Staff Specialists – 2024 and 2025", published 20 January 2026, read
// 9 October 2026 (Firecrawl PDF parse). Column "Rates from first full pay
// period on or after 1 July 2025"; the "with special allowance" figures are
// Attachment B, column "Award Rate + 17.4% Special Allowance". Interim rates:
// the Staff Specialists (State) Award is before the NSW IRC.
//
// VIC — Medical Specialists (Victorian Public Health Sector) (AMA
// Victoria/ASMOF) (Single Interest Employers) Enterprise Agreement 2022–2026
// (AE517968, approved by the FWC 27 October 2022), Appendix 2 Table 1.1
// "Full-time Doctors (who don't receive additional Private Practice Income)",
// column "Weekly Pay Rates FFPPOA 1 March 2025", as published by Western
// Health (a party employer), read 9 October 2026. Nominal expiry 28 February
// 2026; it continues in force until replaced (cl 5.4). The agreement prints
// WEEKLY rates; the annual figure here is weekly x 52, rounded to the dollar.
//
// QLD — Medical Officers' (Queensland Health) Certified Agreement (No. 7)
// 2025, QIRC CB/2025/128, Schedule 1 Table 1.1, column "Wage Rates payable
// from 01/07/26", read 9 October 2026 (Firecrawl PDF parse, then OCR). Staff
// Specialist is L18–L24 (cl 3.7), but the published Table 1.1 prints levels
// only up to L21 in both reads, so L22–L24 and the senior levels L25–L29 are
// not shown. health.qld.gov.au could not be read (Firecrawl refuses the site).

import type { StaffSpecialistScale } from "./types";

export const NSW_IB2026_006_URL = "https://www1.health.nsw.gov.au/pds/ActivePDSDocuments/IB2026_006.pdf";
export const VIC_SPECIALISTS_EA_URL =
  "https://westernhealth.org.au/sites/default/files/2025-08/Medical-Specialists-VPS-Health-Sector-AMA-Victoria-ASMOF-Single-Interest-Employers-Enterprise-Agreement-2022-2026.pdf";
export const QLD_MOCA7_URL = "https://www.qirc.qld.gov.au/sites/default/files/2025-11/2025_cb128.pdf";

/** Victorian weekly rates exactly as Appendix 2 Table 1.1 prints them (FFPPOA 1 March 2025). */
export const VIC_WEEKLY = [
  ["Specialist Year 1", 5_040.37],
  ["Specialist Year 2", 5_377.83],
  ["Specialist Year 3", 5_586.72],
  ["Specialist Year 4", 5_805.54],
  ["Specialist Year 5", 6_031.48],
  ["Specialist Year 6", 6_266.71],
  ["Specialist Year 7", 6_389.99],
  ["Specialist Year 8", 6_767.82],
  ["Specialist Year 9", 6_930.61],
] as const;

export const STAFF_SPECIALIST_SCALES: StaffSpecialistScale[] = [
  {
    state: "NSW",
    instrument: "Staff Specialists (State) Award, interim rates (NSW Health IB2026_006)",
    url: NSW_IB2026_006_URL,
    publisher: "NSW Health, Information Bulletin IB2026_006 (20 January 2026)",
    effectiveFrom: "From the first full pay period on or after 1 July 2025",
    allowanceColumn: "With 17.4% special allowance",
    steps: [
      { label: "Staff specialist, year 1", annual: 197_583, withAllowance: 231_962 },
      { label: "Staff specialist, year 2", annual: 209_137, withAllowance: 245_527 },
      { label: "Staff specialist, year 3", annual: 220_686, withAllowance: 259_085 },
      { label: "Staff specialist, year 4", annual: 232_267, withAllowance: 272_681 },
      { label: "Staff specialist, year 5", annual: 243_822, withAllowance: 286_247 },
      { label: "Senior staff specialist", annual: 266_942, withAllowance: 313_390 },
    ],
    note:
      "These are interim rates: the award is before the NSW Industrial Relations Commission, and NSW Health says further increases will follow its decision. Staff specialists on private practice Levels 1 to 4 also get the 17.4% special allowance, and Levels 1 to 3 a private practice allowance of 20%, 14% or 8% of salary.",
  },
  {
    state: "VIC",
    instrument: "Medical Specialists (Victorian Public Health Sector) Enterprise Agreement 2022–2026",
    url: VIC_SPECIALISTS_EA_URL,
    publisher: "Fair Work Commission approved agreement AE517968, as published by Western Health",
    effectiveFrom: "From the first full pay period on or after 1 March 2025",
    steps: VIC_WEEKLY.map(([label, weekly]) => ({ label, annual: Math.round(weekly * 52) })),
    note:
      "The agreement sets weekly rates (Year 1 is $5,040.37 a week); the annual figures are the weekly rate × 52. These are the rates for a full-time specialist who doesn't receive private practice income; the agreement sets a lower base for those who do. Its nominal expiry date was 28 February 2026, and it stays in force until a new agreement replaces it.",
  },
  {
    state: "QLD",
    instrument: "Medical Officers' (Queensland Health) Certified Agreement (No. 7) 2025",
    url: QLD_MOCA7_URL,
    publisher: "Queensland Industrial Relations Commission, CB/2025/128",
    effectiveFrom: "Wage rates payable from 1 July 2026",
    steps: [
      { label: "L18 (staff specialist entry level)", annual: 222_059 },
      { label: "L19", annual: 228_007 },
      { label: "L20", annual: 234_835 },
      { label: "L21", annual: 239_901 },
    ],
    note:
      "Staff specialists are paid from L18 to L24, but the agreement's published wage table stops at L21, so the higher steps are not shown. On top of base salary, specialists other than specialist GPs get a general attraction and retention allowance of 50% of base salary, reduced by 25% of base salary for those who opt into the private practice revenue retention arrangement (cl 11.24).",
  },
];
