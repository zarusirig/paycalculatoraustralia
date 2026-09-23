// Property manager — Real Estate Industry Award 2020 [MA000106].
// Rates and sourcing notes: ./real-estate-common.ts.
//
// Schedule A: Level 1 indicative titles include "Property Management Assistant
// or Property Management Associate" and "Leasing Officer or Assistant";
// Level 2 (A.2.1) covers "managing rental or strata/community title
// properties" with indicative title "Property Management Representative or
// Property Manager"; Level 3 includes "Property Management Supervisor".
//
// Commission-only employment (cl 16.7) is limited to property SALES and
// commercial, industrial or retail LEASING. A residential property manager
// cannot be engaged commission-only.
//
// Stand-by and call-out for property management / strata roles: the employer
// and employee "must agree in writing on a method of payment for due
// compensation" (cl 19.3 — the award sets no dollar amount).

import { ANNUAL_WAGE_REVIEW_2026, FWO_PAY_GUIDES, JOB_PAY_VERIFIED_ON, jsaSource } from "./common";
import { REAL_ESTATE_MEDIAN } from "./real-estate-agent";
import {
  REAL_ESTATE_AWARD,
  REAL_ESTATE_OVERTIME,
  REAL_ESTATE_PENALTIES,
  REAL_ESTATE_PENALTIES_NOTE,
  REAL_ESTATE_ROWS,
} from "./real-estate-common";
import type { Occupation } from "./types";

export const PROPERTY_MANAGER: Occupation = {
  slug: "property-manager",
  name: "Property Manager",
  plural: "property managers",
  award: REAL_ESTATE_AWARD,
  headline: {
    tableId: "real-estate",
    label: "Level 2 (Representative)",
    why: "a property manager responsible for managing rental or strata properties",
  },
  coverage: [
    "Property managers employed by a real estate agency are covered by the Real Estate Industry Award 2020 [MA000106]. The award names \"Property Manager\" as an indicative Level 2 (Representative) title: Level 2 employees are responsible for managing rental or strata/community title properties, or for sourcing and securing new managements.",
    "A property management assistant or associate — collecting rent, answering tenant enquiries and helping with inspections under supervision — is Level 1. A Property Management Supervisor is Level 3.",
    "Unlike sales agents, residential property managers cannot be employed on a commission-only basis. The award limits commission-only employment to property sales and commercial, industrial or retail leasing (cl 16.7).",
  ],
  tables: [
    {
      id: "real-estate",
      title: "Property manager minimum pay rates 2026–27",
      intro: "Weekly rates from clause 14.1 of the Real Estate Industry Award. Hourly and casual rates from the award's Schedule B.",
      rows: REAL_ESTATE_ROWS,
    },
  ],
  penalties: REAL_ESTATE_PENALTIES,
  penaltiesNote: REAL_ESTATE_PENALTIES_NOTE,
  overtime: REAL_ESTATE_OVERTIME,
  allowances: [
    {
      name: "Stand-by and call-out",
      amount: "Agreed in writing",
      note: "If you are required to be on stand-by or called out outside ordinary hours in a property management or strata role, your employer must agree with you in writing how you will be compensated (cl 19.3). The award sets no fixed amount.",
    },
  ],
  median: REAL_ESTATE_MEDIAN,
  notices: [
    "The Jobs and Skills Australia median below is for the whole Real Estate Sales Agents group (ANZSCO 6121), which includes property managers, sales agents and business brokers. No separate property manager median is published.",
  ],
  notShown: [
    "Strata and community title management rates outside the real estate industry, which may fall under a different award.",
    "Junior rates for associates under 21.",
  ],
  faqs: [
    {
      q: "What is the award rate for a property manager in 2026?",
      a: "A property manager is Level 2 (Representative) under the Real Estate Industry Award 2020, with a minimum of $1,119.10 a week or $29.45 an hour from the first full pay period on or after 1 July 2026. That is $58,193 a year before tax.",
    },
    {
      q: "How much does a property management assistant earn?",
      a: "An assistant or associate is Level 1: at least $1,010.60 a week ($26.59 an hour) in the first 12 months at that level, then $1,063.90 a week ($28.00 an hour).",
    },
    {
      q: "Can a property manager be paid commission only?",
      a: "No. The award only allows commission-only employment for Level 2 and above employees in property sales or commercial, industrial or retail leasing. A residential property manager must be paid at least the minimum weekly rate.",
    },
    {
      q: "Do property managers get paid for being on call?",
      a: "The award requires your employer to agree with you in writing on how you are compensated for stand-by and call-outs outside ordinary hours in a property management role. It does not set a fixed dollar amount.",
    },
    {
      q: "Do property managers get weekend penalty rates?",
      a: "No. Ordinary hours under this award can be worked on any day of the week, so weekend hours are paid at the ordinary rate. Public holidays are paid at 200%.",
    },
  ],
  sources: [
    { title: "Real Estate Industry Award 2020 [MA000106] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: REAL_ESTATE_AWARD.url },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(REAL_ESTATE_MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/job-pay-rates/real-estate-agent/", label: "Real Estate Agent Pay Rates" },
    { href: "/award-rates/", label: "Award Rates" },
    { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
  ],
};
