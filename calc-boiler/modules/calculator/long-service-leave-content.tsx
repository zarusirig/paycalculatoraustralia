"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { AUTHORS, REVIEWERS, getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import {
  JURISDICTION_CODES,
  LSL_JURISDICTIONS,
  LSL_SOURCES,
  LSL_TAX,
  accruedWeeks,
  serviceFromParts,
  takeableWeeks,
  type JurisdictionCode,
} from "@/lib/constants/long-service-leave";
import LongServiceLeaveCalculator from "./long-service-leave-calculator";
import { LSL_HUB_FAQS, spokeFaqs, type Faq } from "./long-service-leave-faqs";
import {
  ATO_SOURCE,
  FONT,
  FWO_SOURCE,
  H2,
  H3,
  LINK,
  NotAnnualLeave,
  P,
  RelatedLinks,
  ScopeNote,
  TABLE_WRAP,
  TD,
  TH,
  jurisdictionSource,
  takeHomeSalaryStep,
  weeks,
} from "./long-service-leave-shared";


const REVIEWED_ON = "2026-08-28";

function authorship(slug: string) {
  return (
    getGuideAuthorship(slug) ?? {
      author: AUTHORS["penny-ward"],
      reviewer: REVIEWERS["garth-mcgregor"],
      lastReviewed: REVIEWED_ON,
    }
  );
}

const CASHING_LABEL: Record<string, string> = {
  prohibited: "No — an offence",
  "by-agreement": "Yes, by agreement",
  restricted: "Only in limited cases",
};

function cashingCell(code: JurisdictionCode) {
  const j = LSL_JURISDICTIONS[code];
  return j.cashingOut === null ? "Not stated — check with the authority" : CASHING_LABEL[j.cashingOut];
}


// =============================================================================
// HUB
// =============================================================================

export function LongServiceLeaveHub() {
  const a = authorship("long-service-leave-calculator");
  const sources = [
    ...JURISDICTION_CODES.map(jurisdictionSource),
    ATO_SOURCE,
    FWO_SOURCE,
  ];
  // A worked payout used to send the reader on to a take-home page.
  const exampleWeekly = 1_600;
  const exampleWeeks = accruedWeeks("nsw", serviceFromParts(10));
  const examplePayout = exampleWeeks * exampleWeekly;
  const exampleTarget = takeHomeSalaryStep(exampleWeekly * 52 + examplePayout);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li>
                <Link href="/" className="hover:text-eucalyptus-dark hover:underline">
                  Pay Calculator
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-3 w-3 text-warmgray-light" />
              </li>
              <li>
                <span className="font-medium text-navy" aria-current="page">
                  Long Service Leave Calculator
                </span>
              </li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Long Service Leave Calculator — All 8 States and Territories
          </h1>
          <p className="text-lg text-warmgray">
            Enter your start date and your ordinary weekly pay to see how many weeks of long service
            leave you have accrued, what you could take now, what would be paid out if the job ended
            today, and the tax on it. Every rule below comes from the state or territory&apos;s own
            Act, verified {LSL_SOURCES.verifiedOn}.
          </p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-5xl mx-auto">
          <LongServiceLeaveCalculator heading="Long Service Leave Calculator" />
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
          <NotAnnualLeave />

          <section>
            <h2 style={FONT} className={H2}>
              How Much Long Service Leave Do You Get in Each State?
            </h2>
            <p className={P}>
              Long service leave is the one major leave entitlement the National Employment Standards
              do not set. Each state and territory has its own Act, and they differ in three ways that
              actually change the number: how long you have to serve before you can take leave, how
              many weeks a year you accrue, and how early a payment is owed if you leave.
            </p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className={TH}>
                      State
                    </th>
                    <th scope="col" className={TH}>
                      Act
                    </th>
                    <th scope="col" className={TH + " text-right"}>
                      Can take leave at
                    </th>
                    <th scope="col" className={TH + " text-right"}>
                      Weeks then
                    </th>
                    <th scope="col" className={TH + " text-right"}>
                      Weeks per year
                    </th>
                    <th scope="col" className={TH + " text-right"}>
                      Pro-rata from
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {JURISDICTION_CODES.map((code, i) => {
                    const j = LSL_JURISDICTIONS[code];
                    return (
                      <tr key={code} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className={TD + " font-medium"}>
                          <Link href={`/long-service-leave-calculator/${code}/`} className={LINK}>
                            {j.abbr}
                          </Link>
                        </td>
                        <td className={TD}>{j.act.replace(/ \([A-Za-z]+\)$/, "")}</td>
                        <td className={TD + " text-right"}>{j.takeAfterYears} years</td>
                        <td className={TD + " text-right font-semibold"}>{j.weeksAtQualifying}</td>
                        <td className={TD + " text-right"}>{j.weeksPerYear.toFixed(4)}</td>
                        <td className={TD + " text-right"}>
                          {j.proRataFromYears} yr
                          {j.proRataUnconditionalFromYears > j.proRataFromYears
                            ? ` (${j.proRataUnconditionalFromYears} unconditional)`
                            : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">
              &ldquo;Pro-rata from&rdquo; is the completed service at which a payment can be owed when
              employment ends. Where a second figure is shown, the first is a conditional window — the
              payment is owed only on defined grounds, such as redundancy, illness or death — and the
              second is the point from which it is owed however the job ends.
            </p>

            <h3 style={FONT} className={H3}>
              South Australia and the NT pay half as much again
            </h3>
            <p className={P}>
              The single biggest difference is the rate. Six jurisdictions accrue{" "}
              <strong>0.8667 weeks a year</strong> — two months of leave for 10 years of service.
              South Australia and the Northern Territory accrue <strong>1.3 weeks a year</strong>, so
              the same 10 years earns 13 weeks. On {formatAUD(exampleWeekly)} a week that is{" "}
              {formatAUD(13 * exampleWeekly)} instead of {formatAUD(examplePayout)} — a gap of{" "}
              {formatAUD(13 * exampleWeekly - examplePayout)} for identical service.
            </p>
            <p className={P}>
              The catch is at the other end: SA and the NT pay on{" "}
              <strong>completed years only</strong>, so 8½ years is paid as 8. Everywhere except the
              ACT (completed years and months) the part year counts down to the day.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              How Long Service Leave Is Calculated
            </h2>
            <p className={P}>
              The arithmetic is the same shape everywhere: <strong>weeks of leave = years of
              continuous service × the weekly accrual rate</strong>, paid at your{" "}
              <strong>ordinary</strong> weekly rate — no overtime — at the time you take the leave or
              the job ends. What differs is how much of a part year counts, and whether you can take
              anything yet.
            </p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className={TH}>
                      Years of continuous service
                    </th>
                    {(["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"] as JurisdictionCode[]).map(
                      (c) => (
                        <th key={c} scope="col" className={TH + " text-right"}>
                          {LSL_JURISDICTIONS[c].abbr}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {[5, 7, 8, 10, 12, 15, 20, 25].map((y, i) => (
                    <tr key={y} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                      <td className={TD + " font-medium"}>{y} years</td>
                      {JURISDICTION_CODES.map((c) => (
                        <td key={c} className={TD + " text-right"}>
                          {weeks(accruedWeeks(c, serviceFromParts(y)), 2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">
              Weeks <em>accrued</em>, which is the figure paid out when employment ends and a pro-rata
              entitlement exists. It is not always the figure you can take as leave — see the next
              section.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              Accrued Is Not the Same as Takeable
            </h2>
            <p className={P}>
              In NSW, WA and Tasmania the leave arrives in blocks. Nothing is takeable until 10 years,
              then 8.667 weeks lands at once, then another 4.333 weeks every 5 years. Serving 14 years
              gets you no more <em>takeable</em> leave than serving 10 — although the extra four years
              still count if the job ends. Queensland steps at 10 and 15 and then runs continuously.
              Victoria, the ACT, South Australia and the Northern Territory hand over the accrued
              balance once you qualify.
            </p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className={TH}>
                      Service
                    </th>
                    {JURISDICTION_CODES.map((c) => (
                      <th key={c} scope="col" className={TH + " text-right"}>
                        {LSL_JURISDICTIONS[c].abbr}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {[7, 10, 14, 15, 20].map((y, i) => (
                    <tr key={y} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                      <td className={TD + " font-medium"}>{y} years</td>
                      {JURISDICTION_CODES.map((c) => {
                        const t = takeableWeeks(c, serviceFromParts(y));
                        return (
                          <td key={c} className={TD + " text-right"}>
                            {t === 0 ? "—" : weeks(t, 2)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">
              Weeks you can take as paid leave while still employed. A dash means the qualifying period
              has not been reached.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              Long Service Leave Payout on Resignation
            </h2>
            <p className={P}>
              This is where the states diverge most, and it is the question that costs people the most
              money. In <strong>Victoria, WA and South Australia</strong> a plain resignation past 7
              years pays out the accrued balance. In <strong>NSW, Queensland, Tasmania and the
              NT</strong> a plain resignation pays nothing until you reach 10 years — below that you
              have to fall inside a defined list.
            </p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className={TH}>
                      State
                    </th>
                    <th scope="col" className={TH}>
                      Resign at 8 years
                    </th>
                    <th scope="col" className={TH}>
                      Made redundant at 8 years
                    </th>
                    <th scope="col" className={TH}>
                      Cashing out
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {JURISDICTION_CODES.map((code, i) => {
                    const j = LSL_JURISDICTIONS[code];
                    const eight = serviceFromParts(8);
                    const resign =
                      8 >= j.proRataUnconditionalFromYears ? accruedWeeks(code, eight) : 0;
                    const redundant = 8 >= j.proRataFromYears ? accruedWeeks(code, eight) : 0;
                    return (
                      <tr key={code} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className={TD + " font-medium"}>
                          <Link href={`/long-service-leave-calculator/${code}/`} className={LINK}>
                            {j.abbr}
                          </Link>
                        </td>
                        <td className={TD}>{resign > 0 ? `${weeks(resign)} weeks` : "Nothing"}</td>
                        <td className={TD}>
                          {redundant > 0 ? `${weeks(redundant)} weeks` : "Nothing"}
                        </td>
                        <td className={TD}>{cashingCell(code)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>
              Whatever is owed lands in your{" "}
              <Link href="/final-pay-calculator/" className={LINK}>
                final pay
              </Link>{" "}
              alongside unused annual leave and any notice. If the job ended through redundancy, the{" "}
              <Link href="/redundancy-pay-calculator/" className={LINK}>
                redundancy pay calculator
              </Link>{" "}
              covers the separate NES scale — and, as the next section explains, redundancy also
              changes how the long service leave itself is taxed.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              Tax on a Long Service Leave Payout
            </h2>
            <p className={P}>
              Tax is federal, so it is identical in all eight jurisdictions. There are two quite
              different situations:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li>
                <strong>Leave you take as leave.</strong> Paid through normal payroll and withheld at
                your usual rates, exactly like a fortnight of ordinary pay.
              </li>
              <li>
                <strong>An unused balance paid out when the job ends.</strong> This follows the ATO&apos;s
                separate schedule for unused leave payments on termination, which splits the payment by
                when the leave accrued.
              </li>
            </ul>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className={TH}>
                      When the leave accrued
                    </th>
                    <th scope="col" className={TH}>
                      Resignation, retirement or dismissal
                    </th>
                    <th scope="col" className={TH}>
                      Genuine redundancy, invalidity or early retirement scheme
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr>
                    <td className={TD}>Before 16 August 1978</td>
                    <td className={TD}>5% of it taxed at your marginal rate</td>
                    <td className={TD}>5% of it taxed at your marginal rate</td>
                  </tr>
                  <tr className="bg-eucalyptus-light/30">
                    <td className={TD}>16 August 1978 to 17 August 1993</td>
                    <td className={TD}>Flat 32%</td>
                    <td className={TD}>Flat 32%</td>
                  </tr>
                  <tr>
                    <td className={TD}>After 17 August 1993</td>
                    <td className={TD}>
                      <strong>Your marginal rate</strong>
                    </td>
                    <td className={TD}>
                      <strong>Flat 32%</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>
              If you started your job after 17 August 1993 — which covers essentially every current
              employee — the whole payout sits in the bottom row. Resign and it is taxed at your
              marginal rate; be made redundant and it is withheld at a flat 32%, which is often
              <em> lower</em> than the marginal rate a large payout would otherwise attract. Where the
              post-1993 component plus unused annual leave comes to less than{" "}
              {formatAUD(LSL_TAX.smallPaymentThreshold)}, the ATO says withhold 32% instead of running
              the marginal calculation. No tax is withheld at all from unused leave paid after an
              employee&apos;s death.
            </p>
            <p className={P}>
              A payout is taxed in the year you receive it and can push you into a higher bracket for
              that year. On {formatAUD(exampleWeekly)} a week plus a {weeks(exampleWeeks)}-week NSW
              payout of {formatAUD(examplePayout)}, the year totals about{" "}
              {formatAUD(exampleWeekly * 52 + examplePayout)} — see{" "}
              <Link href={`/take-home-pay-on/${exampleTarget}/`} className={LINK}>
                take-home pay on {formatAUD(exampleTarget)}
              </Link>{" "}
              for what that leaves.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              Casual and Part-Time Long Service Leave
            </h2>
            <p className={P}>
              Casuals accrue long service leave in every state and territory, and part-timers accrue at
              the same rate as full-timers — the entitlement is measured in weeks, so a part-timer gets
              the same number of weeks at their own ordinary pay. What differs is what breaks
              continuity, and Queensland uses an entirely separate formula.
            </p>
            <div className="space-y-3">
              {JURISDICTION_CODES.map((code) => (
                <details
                  key={code}
                  className="rounded-xl border border-sandstone-dark/20 bg-sandstone/30 p-4"
                >
                  <summary className="cursor-pointer font-semibold text-navy text-sm">
                    {LSL_JURISDICTIONS[code].name}
                  </summary>
                  <p className="mt-2 text-sm text-warmgray">{LSL_JURISDICTIONS[code].casualsNote}</p>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              Where the Act Does Not Apply
            </h2>
            <p className={P}>
              Every jurisdiction carves out the same three groups: public sector employees, employees
              whose long service leave already comes from a federal enterprise agreement or a
              pre-reform federal award, and industries covered by a{" "}
              <strong>portable long service leave scheme</strong>. Portable schemes let you build
              service across employers in the same industry rather than with one employer — building
              and construction, contract cleaning, community services, security and black coal mining
              all have one. If any of those describes you, the figures on this page are not yours;
              contact the{" "}
              <a href={LSL_SOURCES.fwo} target="_blank" rel="noreferrer noopener" className={LINK}>
                Fair Work Ombudsman
              </a>{" "}
              on 13 13 94, or your scheme.
            </p>
          </section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                Weeks accrued = years of continuous service × the jurisdiction&apos;s published weekly
                rate. Six jurisdictions publish 8.6667 or 8.667 weeks per 10 years; SA and the NT
                publish 1.3 weeks a year. The part year is counted the way each authority counts it:
                SA and the NT drop it, the ACT keeps completed years and months, Queensland uses its
                own years/months/weeks/days table, and the rest count it down to the day.
              </li>
              <li>
                Payout = weeks × your ordinary weekly rate. Ordinary pay excludes overtime everywhere;
                Tasmania and Victoria include shift penalties and casual loading in it.
              </li>
              <li>
                Tax follows the ATO&apos;s unused-leave withholding schedule (last updated{" "}
                {LSL_TAX.atoLastUpdated}). The marginal rate is derived by running your salary and your
                salary-plus-payout through this site&apos;s FY2026-27 tax engine, not quoted from a
                bracket, because a payout can move you up one.
              </li>
              <li>
                Every jurisdiction&apos;s own published worked example is reconciled back to these
                formulas in the test suite, so a rate change fails a test before it can reach this
                page.
              </li>
              <li>
                Not modelled: absences that do not count as service, leave already taken, portable
                schemes, awards or agreements that displace the Act, and hours averaging for employees
                whose hours changed.
              </li>
            </ul>
          </MethodologyDisclosure>

          <section>
            <h2 style={FONT} className={H2}>
              Frequently Asked Questions
            </h2>
            <div className="sr-only">
              <h3>Long service leave questions and answers</h3>
              {LSL_HUB_FAQS.map((f) => (
                <div key={f.q}>
                  <h4>{f.q}</h4>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
            <Accordion type="multiple">
              {LSL_HUB_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>
                    <p>{f.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              Related Calculators
            </h2>
            <RelatedLinks current="hub" />
          </section>

          <ScopeNote authority="Fair Work Ombudsman" authorityUrl={LSL_SOURCES.fwo} />
          <SourceAttribution sources={sources} lastVerified={LSL_SOURCES.verifiedOn} />
          <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SPOKE — one state or territory
// =============================================================================

export function LongServiceLeaveSpoke({ code }: { code: JurisdictionCode }) {
  const j = LSL_JURISDICTIONS[code];
  const a = authorship(`long-service-leave-calculator-${code}`);
  const faqs = spokeFaqs(code);
  const conditional = j.proRataUnconditionalFromYears > j.proRataFromYears;

  const exampleWeekly = 1_600;
  const qualifyingWeeks = accruedWeeks(code, serviceFromParts(j.takeAfterYears));
  const examplePayout = qualifyingWeeks * exampleWeekly;
  const exampleTarget = takeHomeSalaryStep(exampleWeekly * 52 + examplePayout);

  const milestones = [5, 7, 8, 10, 12, 15, 20, 25];

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li>
                <Link href="/" className="hover:text-eucalyptus-dark hover:underline">
                  Pay Calculator
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-3 w-3 text-warmgray-light" />
              </li>
              <li>
                <Link
                  href="/long-service-leave-calculator/"
                  className="hover:text-eucalyptus-dark hover:underline"
                >
                  Long Service Leave
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-3 w-3 text-warmgray-light" />
              </li>
              <li>
                <span className="font-medium text-navy" aria-current="page">
                  {j.abbr}
                </span>
              </li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Long Service Leave Calculator {j.abbr} — {j.weeksAtQualifying} Weeks After{" "}
            {j.takeAfterYears} Years
          </h1>
          <p className="text-lg text-warmgray">
            {j.summary}
          </p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-5xl mx-auto">
          <LongServiceLeaveCalculator
            jurisdiction={code}
            heading={`Long Service Leave Calculator — ${j.name}`}
          />
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
          <NotAnnualLeave />

          <section>
            <h2 style={FONT} className={H2}>
              How Much Long Service Leave You Get {j.inName}
            </h2>
            <p className={P}>
              Long service leave {j.inName} comes from the{" "}
              <a href={j.actUrl} target="_blank" rel="noreferrer noopener" className={LINK}>
                {j.act}
              </a>
              , administered by{" "}
              <a href={j.agencyUrl} target="_blank" rel="noreferrer noopener" className={LINK}>
                {j.agency}
              </a>
              . It accrues at <strong>{j.weeksPerYear.toFixed(4)} weeks for every year</strong> of
              continuous service with one employer. At {j.takeAfterYears} years you can take{" "}
              <strong>{j.weeksAtQualifying} weeks</strong> of paid leave; after that, {j.thereafter}.
            </p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className={TH}>
                      Continuous service
                    </th>
                    <th scope="col" className={TH + " text-right"}>
                      Weeks accrued
                    </th>
                    <th scope="col" className={TH + " text-right"}>
                      Weeks you can take
                    </th>
                    <th scope="col" className={TH + " text-right"}>
                      Worth at {formatAUD(exampleWeekly)} a week
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {milestones.map((y, i) => {
                    const svc = serviceFromParts(y);
                    const acc = accruedWeeks(code, svc);
                    const take = takeableWeeks(code, svc);
                    return (
                      <tr key={y} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className={TD + " font-medium"}>{y} years</td>
                        <td className={TD + " text-right"}>{weeks(acc)}</td>
                        <td className={TD + " text-right font-semibold"}>
                          {take === 0 ? "—" : weeks(take)}
                        </td>
                        <td className={TD + " text-right"}>{formatAUD(acc * exampleWeekly)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">
              &ldquo;Accrued&rdquo; is what is paid out when employment ends and a pro-rata entitlement
              exists. &ldquo;Can take&rdquo; is what you can use as leave while still employed — a dash
              means the {j.takeAfterYears}-year qualifying period has not been reached.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              Pro-Rata Long Service Leave {j.inName} — Resignation, Termination and Death
            </h2>
            <p className={P}>
              A pro-rata payment first becomes possible at{" "}
              <strong>{j.proRataFromYears} years</strong> of continuous service{" "}
              {j.inName}. Below that, nothing is owed however the job ends.
            </p>
            {conditional ? (
              <>
                <p className={P}>
                  Between {j.proRataFromYears} and {j.proRataUnconditionalFromYears} years the payment
                  is owed only where one of these applies:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-warmgray mb-4">
                  {j.proRataConditions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p className={P}>
                  A plain resignation for a better job is not on that list. From{" "}
                  <strong>{j.proRataUnconditionalFromYears} years</strong> the accrued balance is paid
                  out however the employment ends, and it covers your whole period of continuous
                  service — not just the years past the milestone.
                </p>
              </>
            ) : (
              <p className={P}>
                From {j.proRataFromYears} years the accrued balance is paid out{" "}
                <strong>however the employment ends</strong> — resignation, dismissal, redundancy or
                death.{" "}
                {code === "wa"
                  ? "The only exception is dismissal for serious misconduct, and the onus is on the employer to prove it was warranted."
                  : code === "sa"
                    ? "SafeWork SA names two exceptions: dismissal for serious and wilful misconduct, and a worker who terminates the contract unlawfully, such as by not working the required notice."
                    : "Victoria's Act names no exception: after 7 years the unused balance must be paid in full on the final day of employment."}
              </p>
            )}
            <p className={P}>
              Whatever is owed is paid in your final pay, with unused annual leave and any notice. Work
              the whole thing out with the{" "}
              <Link href="/final-pay-calculator/" className={LINK}>
                final pay calculator
              </Link>
              , and remember that annual leave is a separate entitlement handled by the{" "}
              <Link href="/leave-calculator/" className={LINK}>
                annual leave calculator
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              Casual and Part-Time Long Service Leave {j.inName}
            </h2>
            <p className={P}>{j.casualsNote}</p>
            <p className={P}>
              Because the entitlement is measured in <strong>weeks</strong>, a part-timer earns the
              same number of weeks as a full-timer and is paid at their own ordinary weekly rate. Put
              your actual weekly pay into the calculator above rather than a full-time equivalent.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              Cashing Out Long Service Leave {j.inName}
            </h2>
            <p className={P}>{j.cashingOutNote}</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              Tax on a {j.abbr} Long Service Leave Payout
            </h2>
            <p className={P}>
              Tax on long service leave is federal, so it is the same {j.inName} as everywhere else.
              Leave you <em>take</em> is taxed like ordinary pay. An <strong>unused</strong> balance
              paid out at termination follows the ATO&apos;s unused-leave schedule:
            </p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className={TH}>
                      Leave accrued
                    </th>
                    <th scope="col" className={TH}>
                      Resignation, retirement or dismissal
                    </th>
                    <th scope="col" className={TH}>
                      Genuine redundancy or invalidity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr>
                    <td className={TD}>Before 16 August 1978</td>
                    <td className={TD}>5% taxed at marginal rates</td>
                    <td className={TD}>5% taxed at marginal rates</td>
                  </tr>
                  <tr className="bg-eucalyptus-light/30">
                    <td className={TD}>16 Aug 1978 – 17 Aug 1993</td>
                    <td className={TD}>Flat 32%</td>
                    <td className={TD}>Flat 32%</td>
                  </tr>
                  <tr>
                    <td className={TD}>After 17 August 1993</td>
                    <td className={TD}>
                      <strong>Marginal rate</strong>
                    </td>
                    <td className={TD}>
                      <strong>Flat 32%</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>
              For anyone who started work after 17 August 1993, only the last row applies. A{" "}
              {j.takeAfterYears}-year {j.abbr} entitlement of {weeks(qualifyingWeeks)} weeks on{" "}
              {formatAUD(exampleWeekly)} a week is {formatAUD(examplePayout)} gross, landing in a year
              worth about {formatAUD(exampleWeekly * 52 + examplePayout)} — see{" "}
              <Link href={`/take-home-pay-on/${exampleTarget}/`} className={LINK}>
                take-home pay on {formatAUD(exampleTarget)}
              </Link>{" "}
              for what that leaves after tax. The calculator above applies the same split to your own
              dates.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              Who Is Not Covered by the {j.abbr} Act
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-warmgray mb-4">
              {j.notCovered.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className={P}>
              If one of those describes you, the figures on this page are not yours. {j.agency} is the
              regulator for the Act itself; for a federal award or agreement, contact the{" "}
              <a href={LSL_SOURCES.fwo} target="_blank" rel="noreferrer noopener" className={LINK}>
                Fair Work Ombudsman
              </a>{" "}
              on 13 13 94.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              How {j.abbr} Compares
            </h2>
            <p className={P}>
              {j.abbr} is one of eight jurisdictions with its own Act. The qualifying period runs from
              7 years (Victoria and the ACT) to 10, and the rate from 0.8667 weeks a year to 1.3 (South
              Australia and the Northern Territory).
            </p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className={TH}>
                      State
                    </th>
                    <th scope="col" className={TH + " text-right"}>
                      Take leave at
                    </th>
                    <th scope="col" className={TH + " text-right"}>
                      Weeks then
                    </th>
                    <th scope="col" className={TH + " text-right"}>
                      Pro-rata from
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {JURISDICTION_CODES.map((c) => {
                    const other = LSL_JURISDICTIONS[c];
                    const isThis = c === code;
                    return (
                      <tr key={c} className={isThis ? "bg-eucalyptus-light/50 font-semibold" : undefined}>
                        <td className={TD}>
                          {isThis ? (
                            other.abbr
                          ) : (
                            <Link href={`/long-service-leave-calculator/${c}/`} className={LINK}>
                              {other.abbr}
                            </Link>
                          )}
                        </td>
                        <td className={TD + " text-right"}>{other.takeAfterYears} years</td>
                        <td className={TD + " text-right"}>{other.weeksAtQualifying}</td>
                        <td className={TD + " text-right"}>{other.proRataFromYears} years</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>
              The{" "}
              <Link href="/long-service-leave-calculator/" className={LINK}>
                long service leave hub
              </Link>{" "}
              sets all eight side by side, including what each pays if you resign at 8 years.
            </p>
          </section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                Weeks = years of continuous service × {j.weeksPerYear.toFixed(4)}, the rate{" "}
                {j.agency} publishes.{" "}
                {j.proRataBasis === "completed-years"
                  ? "Part years are dropped — the Act pays completed years only."
                  : j.proRataBasis === "completed-years-and-months"
                    ? "Completed years and months are counted; loose days are not."
                    : "Part years count, down to the day."}
              </li>
              <li>
                Payout = weeks × your ordinary weekly rate, which excludes overtime. The calculator
                treats a day as one fifth of a week.
              </li>
              <li>
                Tax follows the ATO&apos;s unused-leave withholding schedule; the marginal rate is
                derived from this site&apos;s FY2026-27 tax engine rather than quoted from a bracket.
              </li>
              <li>
                {j.agency}&apos;s own published worked example is reconciled back to this formula in the
                test suite. Source: <span className="break-all">{j.sourceUrl}</span>, read{" "}
                {LSL_SOURCES.verifiedOn}.
              </li>
              <li>
                Not modelled: absences that do not count as service, leave already taken, portable
                schemes, and awards or agreements that displace the Act.
              </li>
            </ul>
          </MethodologyDisclosure>

          <section>
            <h2 style={FONT} className={H2}>
              Frequently Asked Questions
            </h2>
            <div className="sr-only">
              <h3>{j.abbr} long service leave questions and answers</h3>
              {faqs.map((f) => (
                <div key={f.q}>
                  <h4>{f.q}</h4>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
            <Accordion type="multiple">
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>
                    <p>{f.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section>
            <h2 style={FONT} className={H2}>
              Related Calculators
            </h2>
            <RelatedLinks current={code} />
          </section>

          <ScopeNote authority={j.agency} authorityUrl={j.agencyUrl} />
          <SourceAttribution
            sources={[jurisdictionSource(code), ATO_SOURCE, FWO_SOURCE]}
            lastVerified={LSL_SOURCES.verifiedOn}
          />
          <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} />
        </div>
      </div>
    </div>
  );
}
