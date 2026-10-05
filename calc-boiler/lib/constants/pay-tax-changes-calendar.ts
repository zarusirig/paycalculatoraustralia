// =============================================================================
// "What changes and when": dated pay, tax and super changes, 1 Jul 2026 to
// 1 Jul 2027. Powers /pay-and-tax-changes-calendar/ and its .ics download.
// Run tests with: npm test
//
// Defines NO rate of its own. Every figure is read from the files that already
// carry the verification notes:
//   australian-tax.ts     resident scales, NMW, HECS thresholds, penalty unit source
//   tax-rates-reference   the legislated 2027-28 scale
//   junior-rates.ts       the 1 Dec 2026 junior phase-in (determined 26 Aug 2026)
//   minimum-wage.ts       the Annual Wage Review 2026 decision and the 2027 date
//   capital-gains-tax.ts  CGT change law (assent 26 June 2026)
//   tax-calendar-2026-27  individual lodgment dates (key events only)
//
// ⚠️ 1 DECEMBER 2026 IS A PHASE-IN FOR 18-20 YEAR OLDS ON THREE AWARDS, not an
// adult-rate jump and not a change to the National Minimum Wage. Do not
// describe it any other way.
//
// ⚠️ NO NATIONAL RATE CHANGE DATED 1 JANUARY 2027 HAS BEEN FOUND in ATO, Fair
// Work or FWC sources (searched 5 Oct 2026). The page says that plainly rather
// than inventing one. If a source appears, add it here with its citation.
// =============================================================================

import { EMPLOYMENT, HECS_HELP, SITE_CONFIG, TAX_BRACKETS_2025_26, TAX_BRACKETS_2026_27 } from "./australian-tax";
import { LEGISLATED_CUT_2027_28, TAX_BRACKETS_2027_28 } from "./tax-rates-reference";
import { JUNIOR_TRANSITION_SCHEDULES, PENDING_JUNIOR_CHANGE } from "./junior-rates";
import { NMW_DECISION } from "./minimum-wage";
import { PENALTY_UNIT, TAX_CALENDAR_2026_27, formatIso } from "./tax-calendar-2026-27";

export type ChangeStatus = "in-force" | "upcoming" | "none-verified";

export interface ChangeItem {
  text: string;
  href?: string;
}

export interface ChangeDate {
  iso: string;
  /** Display date, e.g. "1 December 2026". */
  label: string;
  status: ChangeStatus;
  headline: string;
  items: readonly ChangeItem[];
}

const pct = (n: number) => `${Math.round(n * 100)}%`;
const aud = (n: number, dp = 2) => `$${n.toLocaleString("en-AU", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;

const retail = JUNIOR_TRANSITION_SCHEDULES.retail;
const fastFood = JUNIOR_TRANSITION_SCHEDULES.fastFood;
const pharmacy = JUNIOR_TRANSITION_SCHEDULES.pharmacy;

export const CHANGES_CALENDAR = {
  slug: "pay-and-tax-changes-calendar",
  path: "/pay-and-tax-changes-calendar/",
  url: `${SITE_CONFIG.baseUrl}/pay-and-tax-changes-calendar/`,
  title: "Pay and Tax Changes Calendar",
  version: "1.0",
  publishedIso: "2026-10-05",
  publishedOn: "5 October 2026",
  updatedIso: "2026-10-05",
  updatedOn: "5 October 2026",
  icsFile: "pay-and-tax-changes-2026-27.ics",
  icsPath: "/pay-and-tax-changes-calendar/pay-and-tax-changes-2026-27.ics",
} as const;

export const CHANGES_SOURCES = [
  { title: "Tax rates: Australian residents", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "Australian Taxation Office" },
  { title: "Personal income tax: new tax cuts for every Australian taxpayer", url: LEGISLATED_CUT_2027_28.atoUrl, publisher: "Australian Taxation Office" },
  { title: "Study and training loan repayment thresholds and rates", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: "Australian Taxation Office" },
  { title: "Payment deadlines for Payday Super", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-on-payday/payment-deadlines-for-payday-super", publisher: "Australian Taxation Office" },
  { title: "Penalty units", url: "https://www.ato.gov.au/individuals-and-families/paying-the-ato/interest-and-penalties/penalties/penalty-units", publisher: "Australian Taxation Office" },
  { title: "CGT discount", url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/cgt-discount", publisher: "Australian Taxation Office" },
  { title: `${NMW_DECISION.name} (${NMW_DECISION.citation})`, url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews", publisher: "Fair Work Commission" },
  { title: `General Retail, Fast Food and Pharmacy award junior determinations (${PENDING_JUNIOR_CHANGE.implementationDecision})`, url: "https://www.fwc.gov.au/documents/decisionssigned/pdf/2026fwcfb222.pdf", publisher: "Fair Work Commission" },
] as const;

export const CHANGE_DATES: readonly ChangeDate[] = [
  {
    iso: "2026-07-01",
    label: "1 July 2026",
    status: "in-force",
    headline: "The 2026-27 year started: lower tax rate, higher minimum wage, Payday Super",
    items: [
      { text: `The tax rate on income from $18,201 to $45,000 fell from ${pct(TAX_BRACKETS_2025_26[1].rate)} to ${pct(TAX_BRACKETS_2026_27[1].rate)}. Other rates and thresholds are unchanged.`, href: "/tax-changes-2026-27/" },
      { text: `The National Minimum Wage rose to ${aud(EMPLOYMENT.minimumWageHourly)} an hour, ${aud(EMPLOYMENT.minimumWageWeekly)} for a 38-hour week (from ${aud(EMPLOYMENT.minimumWageHourlyPrevious)} and ${aud(EMPLOYMENT.minimumWageWeeklyPrevious)}), from the first full pay period on or after this date.`, href: "/minimum-wage-australia/" },
      { text: "Payday Super began: super guarantee is owed on each payday and must reach the fund within 7 business days (20 for a new employee or a new fund).", href: "/payday-super/" },
      { text: `The Commonwealth penalty unit rose to $${PENALTY_UNIT.amount} (from $${PENALTY_UNIT.previousAmount}).`, href: "/tax-calendar/" },
    ],
  },
  {
    iso: "2026-12-01",
    label: "1 December 2026",
    status: "upcoming",
    headline: "Junior pay phase-in starts for 18 to 20 year olds on three awards",
    items: [
      { text: `Applies from the first full pay period on or after 1 December 2026, only to employees with more than ${PENDING_JUNIOR_CHANGE.serviceQualifier.replace("more than ", "")} with their employer, on the ${retail.award}, the ${fastFood.award} and the ${pharmacy.award} (pharmacy assistant levels 1 and 2).`, href: "/junior-pay-rates/" },
      { text: `Retail and fast food step the 18, 19 and 20 year old percentages of the adult rate in six-monthly stages: 18 year olds go from ${fastFood.present.age18}% to ${fastFood.rows[0].age18}%, 19 year olds from ${fastFood.present.age19}% to ${fastFood.rows[0].age19}%, and fast food 20 year olds from ${fastFood.present.age20}% to ${fastFood.rows[0].age20}%. Retail 20 year olds with over 6 months already receive 100%.`, href: "/retail-award-rates/" },
      { text: "This is a phase-in, not a jump to the adult rate: full adult rates arrive in stages through 2029. Under-18 rates are unchanged. It does not change the National Minimum Wage." },
    ],
  },
  {
    iso: "2027-01-01",
    label: "1 January 2027",
    status: "none-verified",
    headline: "No national tax, super or minimum wage rate change dated 1 January 2027 found",
    items: [
      { text: "The changes this page tracks (income tax rates, the National Minimum Wage, the junior award steps, CGT) take effect on 1 July or on a date set in a specific determination. None of them is dated 1 January." },
      { text: "1 January 2027 is a public holiday in every state and territory, which can move a pay day or a lodgment date.", href: "/public-holiday-pay/" },
      { text: "If you have seen a different claim, check it against the ATO, Fair Work Ombudsman or Fair Work Commission page it cites before acting on it." },
    ],
  },
  {
    iso: "2027-06-01",
    label: "1 June 2027",
    status: "upcoming",
    headline: "HELP debts are indexed again",
    items: [
      { text: `Study and training loan balances are indexed each year on 1 June (the last was ${HECS_HELP.indexationDate}, at ${(HECS_HELP.indexationRate * 100).toFixed(1)}%). The 2027 rate has not been published. A voluntary repayment made before that date is applied before indexation.`, href: "/hecs-help-calculator/" },
      { text: `Repayment thresholds for 2027-28 have not been announced; the 2026-27 minimum threshold is ${aud(HECS_HELP.minimumThreshold, 0)}.` },
    ],
  },
  {
    iso: "2027-06-30",
    label: "30 June 2027",
    status: "upcoming",
    headline: "The 2026-27 income year ends",
    items: [
      { text: "Last day for deductible spending, super contributions that count for this year, and donations.", href: "/tax-calendar/" },
    ],
  },
  {
    iso: "2027-07-01",
    label: "1 July 2027",
    status: "upcoming",
    headline: "Second tax rate cut, new minimum wage, junior step, CGT change",
    items: [
      { text: `The legislated cut takes the rate on $18,201 to $45,000 from ${pct(LEGISLATED_CUT_2027_28.fromRate)} to ${pct(LEGISLATED_CUT_2027_28.toRate)} (${LEGISLATED_CUT_2027_28.actNumber}). Thresholds are unchanged.`, href: "/stage-3-tax-cuts/" },
      { text: `The ${NMW_DECISION.nextReview} outcome operates from ${NMW_DECISION.nextReviewOperativeFrom}. The new rate is not known until the Fair Work Commission decides it (the 2026 decision was made on ${NMW_DECISION.decidedOn}).`, href: "/minimum-wage-history-australia/" },
      { text: `Next junior step: retail and fast food 18, 19 and 20 year olds move to ${fastFood.rows[1].age18}%, ${fastFood.rows[1].age19}% and ${fastFood.rows[1].age20}% (retail 20 year olds stay at 100%); pharmacy assistants to ${pharmacy.rows[1].age18}%, ${pharmacy.rows[1].age19}% and ${pharmacy.rows[1].age20}%.`, href: "/junior-pay-rates/" },
      { text: "The 50% CGT discount for individuals, trusts and partnerships is replaced with cost base indexation and a 30% minimum tax rate on gains that accrue on and after this date. Nothing changes for assets sold in 2026-27.", href: "/capital-gains-tax-calculator/" },
    ],
  },
];

/** Take-home pay effect of the two rate cuts at chosen salaries (tax and Medicare levy, LITO applied). */
export const CUT_SALARIES: readonly number[] = [30_000, 45_000, 60_000, 80_000, 100_000, 150_000];

export const CUT_SCALES = { from: TAX_BRACKETS_2025_26, now: TAX_BRACKETS_2026_27, next: TAX_BRACKETS_2027_28 } as const;

// ---------------------------------------------------------------------------
// .ics (RFC 5545) — all-day events, deterministic output
// ---------------------------------------------------------------------------

function icsEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Fold to 75 octets per line (RFC 5545 3.1), continuation lines start with a space. */
function fold(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const b = Buffer.byteLength(ch, "utf8");
    if (bytes + b > (out.length === 0 ? 75 : 74)) {
      out.push(cur);
      cur = "";
      bytes = 0;
    }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.map((l, i) => (i === 0 ? l : ` ${l}`));
}

function nextDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

const compact = (iso: string) => iso.replace(/-/g, "");

export interface IcsEvent {
  iso: string;
  title: string;
  description: string;
  url: string;
}

export function calendarEvents(): IcsEvent[] {
  const changes: IcsEvent[] = CHANGE_DATES.filter((c) => c.status !== "none-verified" && c.iso >= "2026-10-05").map((c) => ({
    iso: c.iso,
    title: c.headline,
    description: c.items.map((i) => i.text).join(" "),
    url: CHANGES_CALENDAR.url,
  }));
  // Individual deadlines flagged "key" in the tax calendar (the year start/end markers are already above).
  const deadlines: IcsEvent[] = TAX_CALENDAR_2026_27.filter(
    (e) => e.key && (e.who === "Individuals" || e.who === "Tax agent clients") && e.effectiveIso >= "2026-10-05",
  ).map((e) => ({
    iso: e.effectiveIso,
    title: e.title,
    description: `${e.title}. Due ${formatIso(e.effectiveIso, "long")} (next business day if the standard date falls on a weekend or whole-of-state public holiday). Check ato.gov.au.`,
    url: `${SITE_CONFIG.baseUrl}/tax-calendar/`,
  }));
  return [...changes, ...deadlines].sort((a, b) => a.iso.localeCompare(b.iso) || a.title.localeCompare(b.title));
}

export function icsCalendar(): string {
  const stamp = `${compact(CHANGES_CALENDAR.updatedIso)}T000000Z`;
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE_CONFIG.name}//Pay and Tax Changes Calendar//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${icsEscape("Australian pay and tax changes 2026-27")}`,
    "X-WR-TIMEZONE:Australia/Sydney",
  ];
  calendarEvents().forEach((e, i) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${compact(e.iso)}-${i}@${SITE_CONFIG.domain}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(e.iso)}`,
      `DTEND;VALUE=DATE:${compact(nextDay(e.iso))}`,
      `SUMMARY:${icsEscape(e.title)}`,
      `DESCRIPTION:${icsEscape(`${e.description} More: ${e.url}`)}`,
      `URL:${e.url}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");
  return lines.flatMap(fold).join("\r\n") + "\r\n";
}

export function changesCitation(accessed: string = CHANGES_CALENDAR.updatedOn): string {
  return `${SITE_CONFIG.name} (2026). ${CHANGES_CALENDAR.title}: what changes and when, 1 July 2026 to 1 July 2027 (version ${CHANGES_CALENDAR.version}). Retrieved ${accessed}, from ${CHANGES_CALENDAR.url}`;
}

export function changesCitationHtml(): string {
  return `<a href="${CHANGES_CALENDAR.url}">${CHANGES_CALENDAR.title}</a> (${SITE_CONFIG.name})`;
}
