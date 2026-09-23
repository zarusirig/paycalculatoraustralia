// Accountant — award-free.
//
// Fair Work Ombudsman, "Award coverage for accounts employees" (K600033):
// accountants working for an accounting firm are not covered by an award and
// are entitled to the national minimum wage and the National Employment
// Standards; accountants employed elsewhere are also award-free unless their
// employer's industry award has a classification matching their duties. The
// Miscellaneous Award does not cover professional employees including
// accountants, and the Banking, Finance and Insurance Award does not cover
// accountants employed by accountancy firms.
//
// So the only legal floor is the National Minimum Wage Order 2026 (PR799279):
// $1,004.90 a week / $26.44 an hour, casual loading 25% (cl 5.1). These are the
// same figures as EMPLOYMENT.minimumWage* in lib/constants/australian-tax.ts.
//
// The useful number for this search is the market median, from Jobs and Skills
// Australia (ANZSCO 2211 Accountants): $2,003 a week full-time, ABS Survey of
// Employee Earnings and Hours, May 2025.

import {
  ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  JOB_PAY_VERIFIED_ON,
  jsaSource,
  jsaUrl,
} from "./common";
import type { MedianEarnings, Occupation } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "2211",
  anzscoTitle: "Accountants",
  medianWeekly: 2_003,
  medianHourly: 53,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("2211-accountants"),
};

export const ACCOUNTANT: Occupation = {
  slug: "accountant",
  name: "Accountant",
  plural: "accountants",
  award: null,
  headline: null,
  coverage: [
    "Accountants are award-free. The Fair Work Ombudsman's guidance is that accountants working for an accounting firm are not covered by any modern award, and accountants working elsewhere are also award-free unless their employer's industry award has a classification that matches their duties.",
    "An award-free accountant is still protected by the National Minimum Wage and the National Employment Standards — annual leave, personal leave, notice, redundancy pay and the rest. Above that floor, pay is whatever the employment contract or an enterprise agreement says.",
    "Clerical and bookkeeping staff are different. Accounts clerks and other clerical employees in an accounting firm are generally covered by the Clerks—Private Sector Award, which has its own minimum rates.",
  ],
  tables: [
    {
      id: "minimum-wage",
      title: "The legal minimum for an award-free accountant",
      intro:
        "The National Minimum Wage Order 2026 (PR799279), from the first full pay period starting on or after 1 July 2026. It is the floor, not a typical accountant's salary.",
      rows: [
        { label: "National Minimum Wage (adult)", weekly: 1004.9, hourly: 26.44, casualHourly: 33.05, note: "Applies to award-free employees aged 21 and over" },
      ],
    },
  ],
  penalties: [],
  penaltiesNote:
    "Award-free employees have no award penalty rates or overtime rates. Any penalty, overtime or time-in-lieu arrangement comes from your contract or enterprise agreement, and the NES only requires that additional hours be reasonable.",
  overtime: [
    "There is no overtime rate for award-free employees. The NES allows an employer to require reasonable additional hours; whether extra hours are paid, banked as time in lieu or absorbed into your salary depends on your contract.",
    "Your pay still has to be at least the National Minimum Wage for your ordinary hours.",
  ],
  allowances: [],
  median: MEDIAN,
  notices: [
    "Accountants employed by the Australian Public Service or a state public service are paid under that service's enterprise agreement — see the public service pay scales.",
  ],
  notShown: [
    "A graduate-to-partner salary ladder: no primary source publishes one, and we do not estimate salaries.",
    "The high income threshold for unfair dismissal, which is set separately each 1 July.",
  ],
  faqs: [
    {
      q: "Is there an award for accountants in Australia?",
      a: "No. The Fair Work Ombudsman says accountants working for an accounting firm are not covered by an award, and accountants working in other industries are also award-free unless their employer's award has a classification matching their duties.",
    },
    {
      q: "What is the minimum wage for an accountant?",
      a: "Because accountants are award-free, the legal minimum is the National Minimum Wage: $26.44 an hour or $1,004.90 a week from the first full pay period on or after 1 July 2026. Real accountant salaries are far higher.",
    },
    {
      q: "How much do accountants earn in Australia?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,003 a week for accountants, about $104,156 a year, from the ABS Survey of Employee Earnings and Hours (May 2025). The all-occupation median on the same measure is $1,852 a week.",
    },
    {
      q: "Do accountants get paid overtime?",
      a: "Not automatically. Award-free employees have no award overtime rate, so overtime pay depends on your contract or enterprise agreement. Your employer can require reasonable additional hours under the National Employment Standards.",
    },
    {
      q: "Is an accounts clerk covered by an award?",
      a: "Usually, yes. Accounts clerks and other clerical staff are generally covered by the Clerks—Private Sector Award, which sets minimum rates by level. That award does not cover qualified accountants doing professional accounting work.",
    },
  ],
  sources: [
    {
      title: "Award coverage for accounts employees (K600033)",
      publisher: "Fair Work Ombudsman",
      url: "https://www.fairwork.gov.au/tools-and-resources/library/K600033_Award-coverage-for-accounts-employees",
    },
    {
      title: "Award coverage for clerical employees in an accounting firm (K600010)",
      publisher: "Fair Work Ombudsman",
      url: "https://www.fairwork.gov.au/tools-and-resources/library/K600010_Award-coverage-for-clerical-employees-in-an-accounting-firm",
    },
    {
      title: "National Minimum Wage Order 2026 (PR799279)",
      publisher: "Fair Work Commission",
      url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr799279.pdf",
    },
    jsaSource(MEDIAN),
  ],
  verifiedOn: JOB_PAY_VERIFIED_ON,
  related: [
    { href: "/clerks-award-rates/", label: "Clerks Award Pay Rates" },
    { href: "/minimum-wage-australia/", label: "Minimum Wage Australia" },
    { href: "/average-salary-australia/", label: "Average Salary Australia" },
    { href: "/public-service-pay-scales/", label: "Public Service Pay Scales" },
  ],
};
