// Northern Territory — NT Correctional Services correctional officers (J8,
// 9 Oct 2026).
//
// Source: Correctional Officer (NTPS) 2021-2025 Enterprise Agreement
// (AE519759 PR761131), Schedule 1 Rates of Pay. Read in full on 9 October 2026
// from the Office of the Commissioner for Public Employment (OCPE) PDF. Nominal
// expiry 2 December 2025. The last column printed is "Salary commencing FPP on
// or after 02.12.24", published here.
//   02.12.24 column: TCO (block) Det 1070 of 2000 62,167; TCO (balance) 69,074;
//   CO (1) 69,074; CO (2) 70,610; CO (3) 72,143; CO (4) 73,661; CO (5) 75,784;
//   CO 1/C (1) 77,389; CO 1/C (2) 78,888 (eligibility: clause 76, Certificate
//   IV in Correctional Practice); SCO (1) 87,323; SCO (2) 89,540; SCO (3)
//   91,332.
// Clause 14.1: "a consolidated allowance equal to 40% of salary in lieu of"
// leave loading, penalty rates for shift work including Saturdays, Sundays and
// public holidays, and days off in lieu for rostered days falling on public
// holidays; 14.3(b) it does not apply to overtime; 14.4 trainees get it only
// for in-service orientation in a gazetted correctional centre.
// OCPE Bulletin 26 (23 September 2026): after the Fair Work Commission's
// intractable bargaining declaration of 4 September 2026, "the existing
// 2021-2025 Enterprise Agreement remains in place".

import type { ServicePayJurisdiction } from "../types";

const NT_EA =
  "https://ocpe.nt.gov.au/media/documents/nt-public-sector-employment-information-about-ntps-employment/information-about-ntps-employment/correctional-officer-ntps-2021-2025-enterprise-agreement.pdf";
const NT_BULLETIN =
  "https://ocpe.nt.gov.au/employment-terms-and-conditions/current-enterprise-agreements/enterprise-agreement-negotiations/correctional-officer-ntps-enterprise-agreement/bulletin-26";

export const NT_PRISON_OFFICER_PAY: ServicePayJurisdiction = {
  occupation: "prison-officer",
  slug: "nt",
  code: "NT",
  name: "Northern Territory",
  nameInSentence: "the Northern Territory",
  employer: "NT Correctional Services",
  agreementName: "Correctional Officer (NTPS) 2021-2025 Enterprise Agreement",
  agreementUrl: NT_EA,
  ratesEffectiveFrom: "2 December 2024",
  nextIncrease: null,
  verifiedOn: "9 October 2026",
  hubNote: "Base salary; a 40% consolidated allowance is paid on top in place of shift and weekend penalties.",

  scales: [
    {
      id: "correctional-officer",
      title: "Correctional Officer (CO) and First Class",
      intro: "Schedule 1, salary from the first pay period commencing on or after 2 December 2024 — the last increase in the agreement.",
      stepHeading: "Classification",
      steps: [
        { label: "CO (1)", salary: 69_074 },
        { label: "CO (2)", salary: 70_610 },
        { label: "CO (3)", salary: 72_143 },
        { label: "CO (4)", salary: 73_661 },
        { label: "CO (5)", salary: 75_784 },
        { label: "CO 1/C (1)", salary: 77_389, note: "Eligibility under clause 76 (Certificate IV in Correctional Practice)" },
        { label: "CO 1/C (2)", salary: 78_888, note: "Eligibility under clause 76" },
      ],
    },
    {
      id: "senior-correctional-officer",
      title: "Senior Correctional Officer (SCO)",
      intro: "Schedule 1, from the first pay period on or after 2 December 2024.",
      stepHeading: "Classification",
      steps: [
        { label: "SCO (1)", salary: 87_323 },
        { label: "SCO (2)", salary: 89_540 },
        { label: "SCO (3)", salary: 91_332, note: "Eligibility under clause 78" },
      ],
    },
  ],
  entryStep: "CO (1)",
  topStep: "CO 1/C (2)",

  traineePay: [
    "Schedule 1 prints two trainee rates from the first pay period on or after 2 December 2024: \"TCO (block)\" at $62,167 a year and \"TCO (balance)\" at $69,074, the same as CO (1).",
    "Trainees receive the 40% consolidated allowance only for duty performed in a gazetted correctional centre during in-service orientation (clause 14.4).",
  ],
  penalties: [
    "Correctional officers are paid a consolidated allowance of 40% of salary instead of leave loading, penalty rates for shift work (including Saturdays, Sundays and public holidays) and days off in lieu for rostered days falling on public holidays (clause 14.1). It counts for all forms of leave but not for overtime (clause 14.3).",
  ],
  notices: [
    "The agreement passed its nominal expiry date on 2 December 2025, and the 2 December 2024 rates are the last it prints. After the Fair Work Commission's intractable bargaining declaration of 4 September 2026, the Commissioner for Public Employment said on 23 September 2026 that the existing 2021–2025 agreement remains in place.",
  ],
  unverified: [
    "Senior Industry Officer and other non-custodial rows in Schedule 1, which are not reproduced here.",
    "Any outcome of the intractable bargaining process, which had not been decided when we checked.",
  ],
  sources: [
    {
      title: "Correctional Officer (NTPS) 2021-2025 Enterprise Agreement — Schedule 1, Rates of Pay",
      publisher: "Office of the Commissioner for Public Employment (NT)",
      url: NT_EA,
    },
    {
      title: "Bulletin 26 — Post-declaration negotiating conference (23 September 2026)",
      publisher: "Office of the Commissioner for Public Employment (NT)",
      url: NT_BULLETIN,
    },
  ],
  faqs: [
    {
      q: "How much does a correctional officer earn in the NT?",
      a: "Under the 2021-2025 enterprise agreement, a CO (1) earns a base salary of $69,074 a year, rising to $75,784 at CO (5) and $78,888 at CO 1/C (2). Senior Correctional Officers earn $87,323 to $91,332. A 40% consolidated allowance is paid on top in place of shift and weekend penalties.",
    },
    {
      q: "Has the NT correctional officer agreement expired?",
      a: "It passed its nominal expiry on 2 December 2025, but it still applies until it is replaced. Bargaining for a new agreement went to the Fair Work Commission's intractable bargaining process in September 2026, so the 2 December 2024 rates are still current.",
    },
  ],
};
