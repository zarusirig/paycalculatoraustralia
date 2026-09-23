// Truck driver — Road Transport and Distribution Award 2020 [MA000038].
//
// Source: FWC consolidated award text, awards.fairwork.gov.au/MA000038.html,
// "incorporates all amendments up to and including 1 July 2026 (PR799280,
// PR799318 and PR799475)". Read 23 September 2026.
//   - Weekly and hourly: cl 17.1(a) Transport employees (varied by PR799318
//     ppc 01Jul26). NOT cl 17.2, which is oil distribution workers on a
//     35-hour basis with higher hourly figures for the same weekly rate.
//   - Casual: Schedule C.4.1 "Ordinary hours" (125%).
//   - Vehicle-to-grade mapping: Schedule B — Classification Structure.
//   - Penalties: Schedule C.2.1 and C.4.1. Overtime: Schedule C.3.1.
//
// Long-distance drivers (interstate, or a return journey over 500 km) are
// covered by the Road Transport (Long Distance Operations) Award 2020
// [MA000039], which uses grades 3–10 at the same weekly rates but pays by
// cents-per-km or hourly driving rates. That award's trip rates are NOT here.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  ANNUAL_WAGE_REVIEW_2026,
  CONSOLIDATED_TO,
  FWO_PAY_GUIDES,
  JOB_PAY_VERIFIED_ON,
  awardTextUrl,
  jsaSource,
  jsaUrl,
} from "./common";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "7331",
  anzscoTitle: "Truck Drivers",
  medianWeekly: 1_960,
  medianHourly: 42,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("7331-truck-drivers"),
};

export const TRUCK_DRIVER: Occupation = {
  slug: "truck-driver",
  name: "Truck Driver",
  plural: "truck drivers",
  award: {
    name: "Road Transport and Distribution Award 2020",
    code: "MA000038",
    url: awardTextUrl("MA000038"),
    consolidatedTo: CONSOLIDATED_TO,
  },
  headline: {
    tableId: "transport-workers",
    label: "Transport Worker Grade 6",
    why: "a semi-trailer driver (an articulated vehicle with more than three axles and a GCM over 22.4 tonnes)",
  },
  coverage: [
    "Truck drivers doing local and regional work are covered by the Road Transport and Distribution Award 2020 [MA000038]. Your grade depends on the vehicle you drive, not on how long you have been driving: the award's Schedule B lists each vehicle type against a Transport Worker grade from 1 to 10.",
    "Drivers on long-distance work — interstate runs, or return journeys of more than 500 km — are covered by a different award, the Road Transport (Long Distance Operations) Award 2020 [MA000039]. It uses the same weekly rates for grades 3 to 10 but pays drivers by the kilometre or by an hourly driving rate.",
    "If you drive more than one class of vehicle in a day, you are paid the highest grade for the whole day (cl 17.4).",
  ],
  tables: [
    {
      id: "transport-workers",
      title: "Truck driver pay rates by grade, 2026–27",
      intro:
        "Clause 17.1(a) of the award, for transport employees. Casual rates from the award's Schedule C.4.1. The vehicle each grade covers is from Schedule B.",
      rows: [
        { label: "Transport Worker Grade 1", weekly: 1021.0, hourly: 26.87, casualHourly: 33.59, note: "Yardperson, driver's assistant, loader" },
        { label: "Transport Worker Grade 2", weekly: 1045.5, hourly: 27.51, casualHourly: 34.39, note: "Rigid vehicle up to 4.5 t GVM" },
        { label: "Transport Worker Grade 3", weekly: 1057.6, hourly: 27.83, casualHourly: 34.79, note: "Two-axle rigid over 4.5 t up to 13.9 t GVM; forklift up to 5 t" },
        { label: "Transport Worker Grade 4", weekly: 1076.2, hourly: 28.32, casualHourly: 35.4, note: "Three-axle rigid over 13.9 t GVM" },
        { label: "Transport Worker Grade 5", weekly: 1089.6, hourly: 28.67, casualHourly: 35.84, note: "Rigid with 4+ axles over 13.9 t; 3-axle articulated up to 22.4 t GCM" },
        { label: "Transport Worker Grade 6", weekly: 1102.0, hourly: 29.0, casualHourly: 36.25, note: "Articulated (semi) with 4+ axles over 22.4 t GCM" },
        { label: "Transport Worker Grade 7", weekly: 1118.0, hourly: 29.42, casualHourly: 36.78, note: "B-double up to 53.4 t GCM; low loader over 43 t" },
        { label: "Transport Worker Grade 8", weekly: 1150.5, hourly: 30.28, casualHourly: 37.85, note: "B-double or rigid-and-trailer over 53.4 t GCM" },
        { label: "Transport Worker Grade 9", weekly: 1169.7, hourly: 30.78, casualHourly: 38.48, note: "Trailer combinations over 94 t GCM; mobile crane over 50 t" },
        { label: "Transport Worker Grade 10", weekly: 1198.8, hourly: 31.55, casualHourly: 39.44, note: "Multi-axle platform over 70 t capacity" },
      ],
    },
  ],
  penalties: [
    { when: "Saturday", permanent: "150%", casual: "175%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Good Friday and Christmas Day", permanent: "200%*", casual: "325%" },
    { when: "Any other public holiday", permanent: "150%*", casual: "275%" },
  ],
  penaltiesNote:
    "Percentages of the minimum hourly rate (Schedule C.2.1 and C.4.1). *For full-time and part-time employees, public holiday payment is in addition to the amount payable for the weekly wage (cl 23.2(b)). Casual percentages include the 25% loading.",
  overtime: [
    "150% for the first 2 hours, then 200% (Schedule C.3.1).",
    "Public holiday overtime: 250%. Good Friday and Christmas Day overtime: 300%.",
    "A casual working overtime does not receive the 25% casual loading, but is paid an extra 10% of the minimum hourly rate on top of the overtime rate (cl 11).",
  ],
  allowances: [],
  median: MEDIAN,
  notices: [
    "Junior drivers aged 18 or over who drive a vehicle in sole charge must be paid the adult rate for that class of driving (cl 17.3(b)).",
  ],
  notShown: [
    "Long-distance (MA000039) cents-per-kilometre and hourly driving rates.",
    "Oil distribution worker rates (cl 17.2), which use a 35-hour week.",
    "Allowances such as meal, first aid and dangerous goods, which depend on the job.",
  ],
  faqs: [
    {
      q: "What is the award rate for a truck driver in 2026?",
      a: "It depends on the vehicle. A semi-trailer driver (Transport Worker Grade 6) must be paid at least $29.00 an hour, or $1,102.00 a week, under the Road Transport and Distribution Award from the first full pay period on or after 1 July 2026 — $57,304 a year before tax. A B-double driver (Grade 7) gets at least $29.42 an hour.",
    },
    {
      q: "What grade is a truck driver on?",
      a: "Your grade comes from the vehicle. A rigid truck up to 4.5 tonnes GVM is Grade 2, a two-axle rigid up to 13.9 tonnes is Grade 3, a three-axle rigid over 13.9 tonnes is Grade 4, a semi with more than three axles is Grade 6, a B-double up to 53.4 tonnes is Grade 7, and trailer combinations over 94 tonnes GCM are Grade 9.",
    },
    {
      q: "What is the casual rate for a truck driver?",
      a: "A casual Grade 6 driver earns at least $36.25 an hour, which is the $29.00 minimum plus the 25% casual loading. Saturdays are 175% and Sundays 225% of the minimum hourly rate for casuals.",
    },
    {
      q: "Are long-distance truck drivers paid differently?",
      a: "Yes. Interstate work and return trips over 500 km fall under the Road Transport (Long Distance Operations) Award 2020, which pays by the kilometre or by an hourly driving rate rather than the local-work rates on this page.",
    },
    {
      q: "What do truck drivers actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $1,960 a week for truck drivers (ABS Survey of Employee Earnings and Hours, May 2025), well above the award minimum. The median covers all truck drivers, including long-distance drivers and those on enterprise agreements.",
    },
  ],
  sources: [
    { title: "Road Transport and Distribution Award 2020 [MA000038] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000038") },
    { title: "Road Transport (Long Distance Operations) Award 2020 [MA000039] — consolidated to 1 July 2026", publisher: "Fair Work Commission", url: awardTextUrl("MA000039") },
    FWO_PAY_GUIDES,
    ANNUAL_WAGE_REVIEW_2026,
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/job-pay-rates/bus-driver/", label: "Bus Driver Pay Rates" },
    { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
    { href: "/mining-fifo-pay-guide/", label: "Mining & FIFO Pay" },
  ],
};
