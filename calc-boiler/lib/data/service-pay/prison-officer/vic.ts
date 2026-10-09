// Victoria — Corrections Victoria custodial officers (J8, 9 Oct 2026).
//
// Source: Victorian Public Service Enterprise Agreement 2024 ([2024] FWCA 2944,
// AE525755), Appendix 1 (Department of Justice and Community Safety), Table 46
// "Custodial Officer Structure (80 hour fortnight)". Read 9 October 2026 from
// the Department of Treasury and Finance PDF. Table 46 prints four columns:
// 1 May 2024, 1 May 2025, 1 May 2026 and 1 May 2027. On 9 October 2026 the
// column IN FORCE is 1 May 2026, published here; 1 May 2027 is the next
// scheduled increase (Table 14: 3%).
//   1 May 2026: Trainee COG-1 C1-E01 $63,331; Prison Officer COG2A C2aE01
//   $65,373 … C2aE15 $83,950; Senior Prison Officer / Industry Officer COG2B
//   C2bE01 $85,787 … C2bE08 $98,651; Prison Supervisor / Industry Supervisor
//   COG3 C3-E01 $100,490 … C3-E05 $108,590. 1 May 2027 COG2A E01: $67,334.
//
// Clause 43.1(c)–(d): custodial officers' ordinary hours may be up to 80 a
// fortnight (76 ordinary + 4 reasonable additional hours); the arrangement
// "provides additional remuneration to the total of 5.26%", and "The Salaries
// in clause 7.4 of Appendix 1 include the additional 5.26%". Table 20 rotating
// shift allowances: afternoon 15%, night 20%, Saturday 50%, Sunday 100%, public
// holiday 150% (or 50% plus a day's leave in lieu).
//
// Table 45 (the same structure on a 76-hour fortnight) was not transcribed.

import type { ServicePayJurisdiction } from "../types";

const VPSEA = "https://www.dtf.vic.gov.au/sites/default/files/2024-10/Victorian-Public-Service-Enterprise-Agreement-2024.pdf";

const cog2a: [string, number][] = [
  ["C2aE01", 65_373],
  ["C2aE02", 66_698],
  ["C2aE03", 68_027],
  ["C2aE04", 69_355],
  ["C2aE05", 70_678],
  ["C2aE06", 72_007],
  ["C2aE07", 73_335],
  ["C2aE08", 74_664],
  ["C2aE09", 75_984],
  ["C2aE10", 77_315],
  ["C2aE11", 78_642],
  ["C2aE12", 79_970],
  ["C2aE13", 81_295],
  ["C2aE14", 82_625],
  ["C2aE15", 83_950],
];

const cog2b: [string, number][] = [
  ["C2bE01", 85_787],
  ["C2bE02", 87_627],
  ["C2bE03", 89_464],
  ["C2bE04", 91_302],
  ["C2bE05", 93_136],
  ["C2bE06", 94_978],
  ["C2bE07", 96_811],
  ["C2bE08", 98_651],
];

const cog3: [string, number][] = [
  ["C3-E01", 100_490],
  ["C3-E02", 102_322],
  ["C3-E03", 104_164],
  ["C3-E04", 106_204],
  ["C3-E05", 108_590],
];

export const VIC_PRISON_OFFICER_PAY: ServicePayJurisdiction = {
  occupation: "prison-officer",
  slug: "vic",
  code: "VIC",
  name: "Victoria",
  nameInSentence: "Victoria",
  employer: "Corrections Victoria",
  agreementName: "Victorian Public Service Enterprise Agreement 2024",
  agreementUrl: VPSEA,
  ratesEffectiveFrom: "1 May 2026",
  nextIncrease: {
    date: "1 May 2027",
    detail: "A 3% rise is already in the agreement (Table 14). Table 46 prints $67,334 for a Prison Officer COG2A at C2aE01 from that date.",
  },
  verifiedOn: "9 October 2026",
  hubNote: "80-hour fortnight salaries, which include 5.26% for the 4 additional hours.",

  scales: [
    {
      id: "prison-officer-cog2a",
      title: "Prison Officer (COG2A)",
      intro: "Custodial Officer Structure on an 80-hour fortnight (Table 46), from 1 May 2026. The salaries include the 5.26% paid for the 4 additional hours a fortnight.",
      stepHeading: "Pay point",
      steps: cog2a.map(([p, salary]) => ({ label: `Prison Officer COG2A ${p}`, salary })),
    },
    {
      id: "senior-prison-officer-cog2b",
      title: "Senior Prison Officer / Industry Officer (COG2B)",
      intro: "Table 46, 80-hour fortnight, from 1 May 2026.",
      stepHeading: "Pay point",
      steps: cog2b.map(([p, salary]) => ({ label: `Senior Prison Officer COG2B ${p}`, salary })),
    },
    {
      id: "prison-supervisor-cog3",
      title: "Prison Supervisor / Industry Supervisor (COG3)",
      intro: "Table 46, 80-hour fortnight, from 1 May 2026.",
      stepHeading: "Pay point",
      steps: cog3.map(([p, salary]) => ({ label: `Prison Supervisor COG3 ${p}`, salary })),
    },
  ],
  entryStep: "Prison Officer COG2A C2aE01",
  topStep: "Prison Officer COG2A C2aE15",

  traineePay: [
    "A trainee custodial officer is classified COG-1 (pay point C1-E01) and paid $63,331 a year on the 80-hour fortnight structure from 1 May 2026 (Table 46).",
    "Progression through the structure is linked to completing the Certificate III and Certificate IV in Correctional Practice (Appendix 1).",
  ],
  penalties: [
    "Custodial officers can be rostered for up to 80 hours a fortnight — 76 ordinary hours plus 4 reasonable additional hours — and the agreement pays 5.26% more for that pattern, already included in the Table 46 salaries (clause 43.1(c)–(d)).",
    "Rotating shift allowances (Table 20): 15% for an afternoon shift, 20% for a night shift, 50% for Saturday, 100% for Sunday and 150% on a public holiday (or 50% plus a day's leave in lieu).",
  ],
  notices: [
    "These are the 80-hour fortnight salaries. A custodial officer rostered on a 76-hour fortnight is paid on Table 45, which is lower and is not reproduced here.",
  ],
  unverified: [
    "Table 45 (the same structure on a 76-hour fortnight) and the Operations Manager (COG4) rows.",
    "Allowances specific to Corrections Victoria beyond the roster loading and shift allowances summarised here.",
  ],
  sources: [
    {
      title: "Victorian Public Service Enterprise Agreement 2024 — Appendix 1, Table 46 Custodial Officer Structure (80 hour fortnight)",
      publisher: "Department of Treasury and Finance (Victoria)",
      url: VPSEA,
    },
  ],
  faqs: [
    {
      q: "How much does a prison officer earn in Victoria?",
      a: "From 1 May 2026 a Prison Officer (COG2A) on the 80-hour fortnight starts on $65,373 a year and reaches $83,950 at the top pay point, C2aE15. A Senior Prison Officer (COG2B) earns $85,787 to $98,651, and a Prison Supervisor (COG3) $100,490 to $108,590.",
    },
    {
      q: "What do trainee prison officers get paid in Victoria?",
      a: "A trainee is COG-1 and paid $63,331 a year from 1 May 2026 on the 80-hour fortnight structure.",
    },
    {
      q: "When is the next pay rise for Victorian prison officers?",
      a: "1 May 2027, when the agreement's next 3% increase applies. A Prison Officer COG2A at the first pay point goes to $67,334.",
    },
  ],
};
