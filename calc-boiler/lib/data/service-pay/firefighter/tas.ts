// Tasmania — Tasmania Fire Service (TFS) career firefighter pay.
//
// Source of every figure: Firefighting Industrial Agreement of 2025, between
// the Minister administering the State Service Act 2000 and the United
// Firefighters Union of Australia Tasmania Branch, filed with the Tasmanian
// Industrial Commission as T15342 of 2026 ([2026] TASIC 25). Read in full on
// 24 September 2026.
//
// Schedule 1 (clause 16.1.1) prints ANNUAL salaries: the 1 December 2024 rate,
// then a 1% structural adjustment and a 3% increase, both from the first full
// pay period commencing on or after 1 December 2025 (clause 4.1.1). On
// 24 September 2026 the column IN FORCE is the 1 December 2025 (3% increase)
// column, which is what this file publishes.
//
// Cross-check: TFS's own recruitment "Salary" page prints the same figures
// (Firefighter Year 1 $74,169 … Station Officer $117,031–$119,361).

import type { ServicePayJurisdiction } from "../types";

export const TAS_FIREFIGHTER_PAY: ServicePayJurisdiction = {
  occupation: "firefighter",
  slug: "tas",
  code: "TAS",
  name: "Tasmania",
  nameInSentence: "Tasmania",
  employer: "Tasmania Fire Service",
  agreementName: "Firefighting Industrial Agreement of 2025",
  agreementUrl:
    "https://www.tic.tas.gov.au/__data/assets/pdf_file/0007/900637/Firefighting-Industrial-Agreement-of-2025.pdf",
  ratesEffectiveFrom: "1 December 2025",
  nextIncrease: null,
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "firefighters",
      title: "Firefighters (Schedule 1, clause 16.1.1)",
      intro:
        "Career firefighters from entry-level Firefighter Year 1 to Senior Firefighter (Advanced). Each Firefighter year needs 12 months' satisfactory service plus the required units; First Class (Year 4) follows 3 years' service.",
      stepHeading: "Classification",
      steps: [
        { label: "Firefighter Yr 1", salary: 74_169 },
        { label: "Firefighter Yr 2", salary: 83_821 },
        { label: "Firefighter Yr 3", salary: 88_066 },
        { label: "Firefighter Yr 4 (First Class)", salary: 97_721 },
        { label: "Senior Firefighter 1", salary: 102_550 },
        { label: "Senior Firefighter 2", salary: 103_564 },
        { label: "Senior Firefighter (Advanced)", salary: 105_801 },
      ],
    },
    {
      id: "leading-firefighters-and-officers",
      title: "Leading Firefighters and officers (Schedule 1, clause 16.1.1)",
      intro:
        "Leading Firefighter and Station Officer are reached by promotion; the Year 2 and 3 points within each rank are advancement points based on competencies.",
      stepHeading: "Classification",
      steps: [
        { label: "Leading Firefighter 1", salary: 108_076 },
        { label: "Leading Firefighter 2", salary: 109_145 },
        { label: "Leading Firefighter 3", salary: 110_225 },
        { label: "Station Officer 1", salary: 117_031 },
        { label: "Station Officer 2", salary: 118_191 },
        { label: "Station Officer 3", salary: 119_361 },
        { label: "Senior Station Officer 1", salary: 121_859 },
        { label: "Senior Station Officer 2", salary: 123_066 },
        { label: "Senior Station Officer 3", salary: 124_285 },
        { label: "District Officer", salary: 140_927 },
      ],
    },
  ],
  entryStep: "Firefighter Yr 1",
  topStep: "Senior Firefighter (Advanced)",

  traineePay: [
    "The agreement does not set a separate recruit or trainee rate. Firefighter Year 1 — described as entry-level firefighters — is $74,169 a year from 1 December 2025.",
  ],
  penalties: [
    "Career brigades work the 2 days on / 2 nights on / 4 days off 10/14 shift roster within an average 42-hour week (clause 5.5).",
    "The agreement sets salaries as annual amounts; the weekly wage rate is the agreement salary ÷ 365.25 × 7 (clause 4.3).",
  ],
  notices: [
    "The Firefighting Industrial Agreement of 2025 applied from 1 July 2025 and was in force until 30 June 2026 (clause 1.3.2). The parties agreed to start negotiating a replacement from December 2025.",
    "No replacement agreement was listed by the Tasmanian Industrial Commission when we checked on 24 September 2026, so the 1 December 2025 salaries remain the latest published rates. A new agreement may bring a back-dated increase.",
  ],
  unverified: [
    "No recruit-course (trainee) rate is published separately; the entry row is Firefighter Year 1.",
    "Communications, Community Fire Safety and Fire Equipment classifications and Senior District Officer rates are printed in Schedule 1 but not shown here.",
    "Volunteer brigade members are not paid under this agreement.",
  ],
  sources: [
    {
      title: "Firefighting Industrial Agreement of 2025 (T15342 of 2026)",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0007/900637/Firefighting-Industrial-Agreement-of-2025.pdf",
    },
    {
      title: "Public Sector Agreements — current agreements list",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/public_sector_agreements",
    },
    {
      title: "Salary — Tasmania Fire Service Recruitment",
      publisher: "Tasmania Fire Service",
      url: "https://recruitment.fire.tas.gov.au/lifestyle/salary/",
    },
  ],
  faqs: [
    {
      q: "How much does a firefighter earn in Tasmania?",
      a: "Under the Firefighting Industrial Agreement of 2025, a Tasmania Fire Service First Class Firefighter (Year 4) earns $97,721 a year and a Senior Firefighter (Advanced) $105,801 a year, from 1 December 2025.",
    },
    {
      q: "What is a new firefighter's salary in Tasmania?",
      a: "Entry-level firefighters start at Firefighter Year 1 on $74,169 a year, rising to $83,821 in Year 2 and $88,066 in Year 3. The agreement has no separate recruit rate.",
    },
    {
      q: "How much does a station officer earn in Tasmania?",
      a: "Station Officers earn $117,031 (Station Officer 1) to $119,361 (Station Officer 3) a year from 1 December 2025. Senior Station Officers earn $121,859 to $124,285.",
    },
    {
      q: "Is a new Tasmanian firefighter agreement coming?",
      a: "The 2025 agreement was in force until 30 June 2026 and negotiations for a replacement were due to begin from December 2025. No new agreement had been registered when we checked on 24 September 2026.",
    },
  ],
};
