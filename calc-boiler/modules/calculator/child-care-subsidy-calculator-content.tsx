// The static long-form content on /child-care-subsidy-calculator/. A server
// component, so it ships as HTML; the client module
// (child-care-subsidy-calculator.tsx) renders it via `children` below the
// calculator card.

import Link from "next/link";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import {
  CARE_TYPE_LABELS,
  CCS,
  CCS_SOURCES as SRC,
  ccsHigherPercent,
  ccsStandardPercent,
  type CareType,
} from "@/lib/constants/child-care-subsidy";
import { Note, W3Faqs, W3Footer, W3Related, W3Section } from "./centrelink-w3-shared";
import { CCS_FAQS } from "./centrelink-h3-faqs";

// Same values as the exports of centrelink-shared.tsx, which is a "use client"
// module and so cannot supply plain values to a server component.
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

const INCOME_TABLE = [80_000, 100_000, 120_000, 150_000, 180_000, 200_000, 250_000, 300_000, 350_000, 400_000, 500_000];

const SOURCES_LIST = [
  source("Your income can affect Child Care Subsidy", SRC.income),
  source("Your number of children in care can affect it (higher rate)", SRC.higherRate),
  source("The type of child care you use affects it (hourly rate caps)", SRC.careType),
  source("Recognised participation and activity test", SRC.hours),
  source("Examples to help you understand your Child Care Subsidy", SRC.examples),
  { title: "Child Care Subsidy (CCS rates 2026-27, hourly rate caps, 3 Day Guarantee)", url: SRC.education, publisher: "Department of Education" },
];

export default function ChildCareSubsidyCalculatorContent() {
  return (
    <>
      <W3Section title="CCS Rates 2026-27 by Family Income">
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Family income</th><th scope="col" className={TH}>Standard CCS (eldest child, and all children 6+)</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>$0 to {formatAUD(CCS.standard.lowerThreshold)}</td><td className={TD}>{CCS.standard.maxPercent}%</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>More than {formatAUD(CCS.standard.lowerThreshold)} to below {formatAUD(CCS.standard.cutOut)}</td><td className={TD}>Down 1% for every {formatAUD(CCS.standard.step)} above {formatAUD(CCS.standard.lowerThreshold)}</td></tr>
              <tr><td className={TD}>{formatAUD(CCS.standard.cutOut)} or more</td><td className={TD}>0%</td></tr>
            </tbody>
          </table>
        </div>
        <div className={TABLE_WRAP + " mt-6"}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Family income</th><th scope="col" className={TH}>Higher CCS (second and younger children aged 5 or under)</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>$0 to {formatAUD(CCS.higher.band1Start)}</td><td className={TD}>{CCS.higher.maxPercent}%</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>More than {formatAUD(CCS.higher.band1Start)} to below {formatAUD(CCS.higher.band1End)}</td><td className={TD}>Down 1% for every {formatAUD(CCS.higher.step)}, from {CCS.higher.maxPercent}% to {CCS.higher.plateauPercent}%</td></tr>
              <tr><td className={TD}>{formatAUD(CCS.higher.band1End)} to below {formatAUD(CCS.higher.band2Start)}</td><td className={TD}>{CCS.higher.plateauPercent}%</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>{formatAUD(CCS.higher.band2Start)} to below {formatAUD(CCS.higher.band2End)}</td><td className={TD}>Down 1% for every {formatAUD(CCS.higher.step)}, from {CCS.higher.plateauPercent}% to {CCS.higher.floorPercent}%</td></tr>
              <tr><td className={TD}>{formatAUD(CCS.higher.band2End)} to below {formatAUD(CCS.higher.incomeLimit)}</td><td className={TD}>{CCS.higher.floorPercent}%</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>{formatAUD(CCS.higher.incomeLimit)} or more</td><td className={TD}>No higher rate — every child gets the standard rate</td></tr>
            </tbody>
          </table>
        </div>
        <div className={TABLE_WRAP + " mt-6"}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Family income</th><th scope="col" className={TH + " text-right"}>Standard CCS</th><th scope="col" className={TH + " text-right"}>Higher-rate child</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {INCOME_TABLE.map((inc, i) => {
                const h = ccsHigherPercent(inc);
                return (
                  <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                    <td className={TD + " font-medium"}>{formatAUD(inc)}</td>
                    <td className={TD + " text-right"}>{ccsStandardPercent(inc).toFixed(2)}%</td>
                    <td className={TD + " text-right"}>{h === null ? "standard rate" : `${h.toFixed(2)}%`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </W3Section>

      <W3Section title="Hourly Rate Caps 2026-27">
        <p className={P}>Your CCS percentage applies to the lower of your hourly fee and the cap. If your centre charges a daily session, the hourly fee is the daily fee divided by the session length — not the hours your child actually attends.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Care type</th><th scope="col" className={TH + " text-right"}>Below school age</th><th scope="col" className={TH + " text-right"}>School age</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {(Object.keys(CARE_TYPE_LABELS) as CareType[]).map((k, i) => (
                <tr key={k} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className={TD}>{CARE_TYPE_LABELS[k]}</td>
                  <td className={TD + " text-right"}>{formatAUD(CCS.hourlyRateCap.belowSchool[k], 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(CCS.hourlyRateCap.schoolAge[k], 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </W3Section>

      <W3Section title="The 3 Day Guarantee: Hours of Subsidised Care">
        <p className={P}>The CCS activity test was replaced on {CCS.hours.guaranteeFrom}. Every eligible family now gets at least {CCS.hours.guaranteed} hours of subsidised care per child each fortnight — about three 12-hour days a week — however many hours the parents work.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your circumstances</th><th scope="col" className={TH + " text-right"}>Subsidised hours a fortnight, per child</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>{CCS.hours.participationThreshold} hours or less of recognised participation a fortnight</td><td className={TD + " text-right"}>{CCS.hours.guaranteed}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>More than {CCS.hours.participationThreshold} hours of recognised participation (both parents); a valid exemption; an Aboriginal or Torres Strait Islander child</td><td className={TD + " text-right"}>{CCS.hours.higher}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">For a couple, the parent with the lower participation sets the hours. If volunteering or looking for work is your only recognised participation, only the first 16 hours count. Hours above your entitlement are charged at the full fee.</p>
      </W3Section>

      <W3Section title="How Your Pay Changes Your CCS">
        <p className={P}>CCS is means-tested on your family&apos;s combined adjusted taxable income for the financial year — both parents&apos; wages, overtime and bonuses, plus reportable fringe benefits and reportable super contributions. Between {formatAUD(CCS.standard.lowerThreshold)} and {formatAUD(CCS.standard.cutOut)}, every extra {formatAUD(CCS.standard.step)} the family earns takes 1 percentage point off the standard subsidy. On {formatAUD(100)} of capped fees a day, that is about $1 a day per child for each {formatAUD(CCS.standard.step)} of extra income.</p>
        <p className={P}>Because CCS is paid on an estimate, a mid-year pay rise should go into your family income estimate straight away; otherwise the difference comes back as a debt when your CCS is balanced after the financial year. Check what a raise adds after tax on the <Link href="/pay-rise-calculator/" className={LINK}>pay rise calculator</Link>, and your household&apos;s take-home on the <Link href="/take-home-pay-calculator/" className={LINK}>take-home pay calculator</Link>.</p>
        <Note>Family Tax Benefit uses the same family income estimate. See the <Link href="/family-tax-benefit-calculator/" className={LINK}>Family Tax Benefit calculator</Link>.</Note>
      </W3Section>

      <W3Section title="Related Calculators and Guides">
        <W3Related current="ccs" />
      </W3Section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>Standard CCS % = {CCS.standard.maxPercent} − (family income − {formatAUD(CCS.standard.lowerThreshold)}) ÷ {formatAUD(CCS.standard.step)}, between {CCS.standard.maxPercent}% and 0%, shown to 2 decimal places. This reproduces all five of Services Australia&apos;s standard-rate worked examples exactly (our tests assert them).</li>
          <li>Higher CCS % follows the published {CCS.financialYear} table. One of Services Australia&apos;s worked examples (twins on $182,300) gives the younger twin 81.99%, which does not follow from that table (83.05%); we follow the table, which the Department of Education publishes too.</li>
          <li>Subsidy per hour = CCS % × the lower of the hourly fee (daily fee ÷ session hours) and the cap, rounded to the cent; paid for the session hours charged up to {CCS.hours.guaranteed} or {CCS.hours.higher} hours a fortnight; {CCS.defaultWithholding * 100}% withheld.</li>
          <li>Read at Services Australia and the Department of Education on {SRC.verifiedOn}. {SITE_CONFIG.name} is not Services Australia.</li>
        </ul>
      </MethodologyDisclosure>

      <W3Faqs faqs={CCS_FAQS} topic="Child Care Subsidy" />
      <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="child-care-subsidy-calculator" />
    </>
  );
}
