// Shared constants for the occupation pay-rate pages.

import type { MedianEarnings, OccupationSource } from "./types";

/** Date every figure in this directory was read from its primary source. */
export const JOB_PAY_VERIFIED_ON = "23 September 2026";

/**
 * Annual Wage Review 2026 ([2026] FWCFB 3500) rates operate from the first
 * full pay period starting on or after 1 July 2026 — not universally 1 July.
 */
export const JOB_PAY_RATES_FROM = "the first full pay period starting on or after 1 July 2026";

/** The FWC's consolidated awards all read "up to and including 1 July 2026" for this cycle. */
export const CONSOLIDATED_TO = "1 July 2026";

export function awardTextUrl(code: string): string {
  return `https://awards.fairwork.gov.au/${code}.html`;
}

export const FWO_PAY_GUIDES: OccupationSource = {
  title: "Pay guides for modern awards",
  publisher: "Fair Work Ombudsman",
  url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/pay-guides",
};

export const ANNUAL_WAGE_REVIEW_2026: OccupationSource = {
  title: "Annual Wage Review 2025–26 decision [2026] FWCFB 3500",
  publisher: "Fair Work Commission",
  url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews",
};

/** All-occupations median full-time weekly earnings, as JSA prints it beside every profile. */
export const ALL_OCCUPATIONS_MEDIAN_WEEKLY = 1_852;

export function jsaSource(median: MedianEarnings): OccupationSource {
  return {
    title: `${median.anzscoTitle} (ANZSCO ${median.anzscoCode}) occupation profile — ABS Survey of Employee Earnings and Hours, May 2025`,
    publisher: "Jobs and Skills Australia",
    url: median.url,
  };
}

export function jsaUrl(codeAndSlug: string): string {
  return `https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations-anzsco/${codeAndSlug}`;
}

/**
 * The note that has to travel with every JSA median. JSA's own definition:
 * "the median pay for full-time non-managerial employees paid at the adult rate
 * before tax and salary sacrificed amounts".
 */
export const MEDIAN_DEFINITION =
  "Median weekly pay of full-time, non-managerial adult employees before tax and salary sacrifice, from the ABS Survey of Employee Earnings and Hours (May 2025) as published by Jobs and Skills Australia. It reflects what employers actually pay, including people on enterprise agreements or above-award salaries, so it is a market figure, not a legal minimum.";
