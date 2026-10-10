import Link from "next/link";
import WhatsNextInline from "@/components/common/whats-next-inline";
import { ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { AUTHORS, getGuideAuthorship } from "@/lib/authors";
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
import { LSL_HUB_FAQS, spokeFaqs } from "./long-service-leave-faqs";
import { LSL_DETAIL_VERIFIED_ON, LSL_STATE_DETAIL } from "./long-service-leave-state-detail";
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

// Opening paragraph, derived from the jurisdiction table so it cannot drift.
const LSL_ALL = JURISDICTION_CODES.map((code) => LSL_JURISDICTIONS[code]);
const rateLabel = (weeksPerYear: number) => String(parseFloat(weeksPerYear.toFixed(4)));
const modeOf = (xs: number[]) =>
  [...new Set(xs)].sort((a, b) => xs.filter((x) => x === b).length - xs.filter((x) => x === a).length)[0];
const LSL_COMMON_RATE = rateLabel(modeOf(LSL_ALL.map((j) => parseFloat(rateLabel(j.weeksPerYear)))));
const LSL_COMMON_RATE_COUNT = LSL_ALL.filter((j) => rateLabel(j.weeksPerYear) === LSL_COMMON_RATE).length;
const LSL_OTHER_RATE = LSL_ALL.filter((j) => rateLabel(j.weeksPerYear) !== LSL_COMMON_RATE);
const LSL_COMMON_YEARS = modeOf(LSL_ALL.map((j) => j.takeAfterYears));
const LSL_OTHER_YEARS = LSL_ALL.filter((j) => j.takeAfterYears !== LSL_COMMON_YEARS);
const joinNames = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

function authorship(slug: string) {
  return (
    getGuideAuthorship(slug) ?? {
      author: AUTHORS["anita-bell"],
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
            Long Service Leave Calculator Australia — All 8 States and Territories
          </h1>
          <p className="text-lg text-warmgray">
            A long service leave calculator works out accrued weeks from a start date and ordinary weekly pay under
            the state or territory Act that covers the job. The rate is {LSL_COMMON_RATE} weeks a year in{" "}
            {LSL_COMMON_RATE_COUNT} jurisdictions
            {LSL_OTHER_RATE.length
              ? ` and ${rateLabel(LSL_OTHER_RATE[0].weeksPerYear)} weeks a year in ${joinNames(LSL_OTHER_RATE.map((j) => j.abbr))}`
              : ""}
            ; the qualifying period is {LSL_COMMON_YEARS} years everywhere
            {LSL_OTHER_YEARS.length
              ? ` except ${joinNames(LSL_OTHER_YEARS.map((j) => j.inName.replace(/^in /, "")))}, where it is ${LSL_OTHER_YEARS[0].takeAfterYears} years`
              : ""}
            . Rules were verified against each Act on {LSL_SOURCES.verifiedOn}; enter your details to see what has
            accrued, what could be taken now, what would be paid out today, and the tax on it.
          </p>
          <TrustBar className="mt-4" />
          {/* State spokes, linked with descriptive anchors above the fold. Until
              23 Sep 2026 the hub linked them only as bare "QLD"/"NSW" table cells. */}
          <nav aria-label="Long service leave calculator by state" className="mt-6">
            <p className="text-sm font-semibold text-navy mb-2">Choose your state for its own rules and calculator:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {JURISDICTION_CODES.map((code) => {
                const j = LSL_JURISDICTIONS[code];
                return (
                  <li key={code}>
                    <Link
                      href={`/long-service-leave-calculator/${code}/`}
                      className="flex items-center justify-between gap-2 rounded-lg border border-sandstone-dark/20 bg-white px-3 py-2 text-sm hover:border-eucalyptus"
                    >
                      <span className="font-medium text-eucalyptus-dark">{j.abbr} long service leave calculator</span>
                      <span className="text-xs text-warmgray-light whitespace-nowrap">
                        {Number(j.weeksAtQualifying.toFixed(2))} wks at {j.takeAfterYears} yrs
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </section>

        <section className="max-w-5xl mx-auto">
          <LongServiceLeaveCalculator heading="Long Service Leave Calculator" />
        </section>

        <WhatsNextInline route="/long-service-leave-calculator/" />

        <div className="max-w-4xl mx-auto space-y-10">
          <NotAnnualLeave />

          <section id="by-state">
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

          <section id="resignation">
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

          <section id="tax">
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
          <AuthorBox author={a.author} lastReviewed={a.lastReviewed} />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SPOKE — one state or territory
// =============================================================================
// Everything rendered here is either this jurisdiction's own data
// (LSL_JURISDICTIONS) or its own rules (LSL_STATE_DETAIL). What is the same in
// every state — the federal tax schedule and the eight-way comparison — is one
// line with a link to the hub, not a repeated table.

export function LongServiceLeaveSpoke({ code }: { code: JurisdictionCode }) {
  const j = LSL_JURISDICTIONS[code];
  const d = LSL_STATE_DETAIL[code];
  const a = authorship(`long-service-leave-calculator-${code}`);
  const faqs = spokeFaqs(code);
  const conditional = j.proRataUnconditionalFromYears > j.proRataFromYears;

  const exampleWeekly = 1_600;
  const qualifyingWeeks = accruedWeeks(code, serviceFromParts(j.takeAfterYears));
  const examplePayout = qualifyingWeeks * exampleWeekly;
  const exampleTarget = takeHomeSalaryStep(exampleWeekly * 52 + examplePayout);

  const basis =
    j.proRataBasis === "completed-years"
      ? "Only completed years are paid; a part year is dropped."
      : j.proRataBasis === "completed-years-and-months"
        ? "Completed years and months are counted; loose days are not."
        : code === "qld"
          ? "Part years count, using Queensland's years, months, weeks and days tables."
          : "Part years count, down to the day.";

  // Sources: the Act's authority first, then every page this jurisdiction's
  // detail was read from, then the portable schemes, de-duplicated by URL.
  const sourceList: SourceLink[] = [];
  const seen = new Set<string>();
  for (const s of [
    jurisdictionSource(code),
    ...d.sources,
    ...d.portable.map((p) => ({ title: p.name, url: p.url, publisher: p.name.split(" — ")[0] })),
    ATO_SOURCE,
    FWO_SOURCE,
  ]) {
    if (seen.has(s.url)) continue;
    seen.add(s.url);
    sourceList.push(s);
  }

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
            Long Service Leave Calculator {j.abbr}
            {j.abbr !== j.name ? ` (${j.name})` : ""}
            <span className="block text-xl md:text-2xl font-semibold text-warmgray mt-2">
              {Number(j.weeksAtQualifying.toFixed(2))} weeks after {j.takeAfterYears} years under the {j.act}
            </span>
          </h1>
          <p className="text-lg text-warmgray">{j.summary}</p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-5xl mx-auto">
          <LongServiceLeaveCalculator jurisdiction={code} heading={`Long Service Leave Calculator — ${j.name}`} />
        </section>

        <WhatsNextInline route={`/long-service-leave-calculator/${code}/`} />

        <div className="max-w-4xl mx-auto space-y-10">
          <p className="text-sm text-warmgray">
            Long service leave is not annual leave: annual leave is the federal four weeks a year in the{" "}
            <Link href="/leave-calculator/" className={LINK}>
              annual leave calculator
            </Link>
            .
          </p>

          <section id="entitlement">
            <h2 style={FONT} className={H2}>
              How Much Long Service Leave You Get {j.inName}
            </h2>
            <p className={P}>{d.actNote}</p>
            <p className={P}>
              The{" "}
              <a href={j.actUrl} target="_blank" rel="noreferrer noopener" className={LINK}>
                {j.act}
              </a>{" "}
              accrues <strong>{j.weeksPerYear.toFixed(4)} weeks for every year</strong> with one employer. At{" "}
              {j.takeAfterYears} years you can take <strong>{j.weeksAtQualifying} weeks</strong>; after that,{" "}
              {j.thereafter}. {basis}
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
                  {d.milestones.map((y, i) => {
                    const svc = serviceFromParts(y);
                    const acc = accruedWeeks(code, svc);
                    const take = takeableWeeks(code, svc);
                    return (
                      <tr key={y} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className={TD + " font-medium"}>{y} years</td>
                        <td className={TD + " text-right"}>{weeks(acc)}</td>
                        <td className={TD + " text-right font-semibold"}>{take === 0 ? "—" : weeks(take)}</td>
                        <td className={TD + " text-right"}>{formatAUD(acc * exampleWeekly)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">
              Accrued is what is paid out when the job ends and a pro-rata entitlement exists; a dash means the{" "}
              {j.takeAfterYears}-year qualifying period has not been reached.
            </p>
          </section>

          <section id="pro-rata">
            <h2 style={FONT} className={H2}>
              Pro-Rata Long Service Leave {j.inName}
            </h2>
            {conditional ? (
              <>
                <p className={P}>
                  Nothing is owed below <strong>{j.proRataFromYears} years</strong>. Between {j.proRataFromYears} and{" "}
                  {j.proRataUnconditionalFromYears} years the {j.adjective} Act pays a pro-rata amount only where:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-warmgray mb-4">
                  {j.proRataConditions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p className={P}>
                  From <strong>{j.proRataUnconditionalFromYears} years</strong> the balance is paid however the job ends,
                  resignation included.
                </p>
              </>
            ) : (
              <p className={P}>
                From <strong>{j.proRataFromYears} years</strong> the accrued balance is paid however the job ends.{" "}
                {code === "wa"
                  ? "The exception is dismissal for serious misconduct, which the employer must prove."
                  : code === "sa"
                    ? "Before 10 years it is withheld for serious and wilful misconduct, or where you end the contract unlawfully by not working your notice."
                    : "The Act names no exception: the unused balance is due in full on the last day of employment."}
              </p>
            )}
          </section>

          <section id="payout">
            <h2 style={FONT} className={H2}>
              How {j.adjective} Long Service Leave Pay Is Worked Out
            </h2>
            {d.payCalc.map((t) => (
              <p key={t} className={P}>
                {t}
              </p>
            ))}
          </section>

          <section id="taking-leave">
            <h2 style={FONT} className={H2}>
              Taking Long Service Leave {j.inName}
            </h2>
            {d.takingLeave.map((t) => (
              <p key={t} className={P}>
                {t}
              </p>
            ))}
          </section>

          <section id="casual">
            <h2 style={FONT} className={H2}>
              Casual, Part-Time and Continuous Service {j.inName}
            </h2>
            <p className={P}>{j.casualsNote}</p>
            {d.continuity.map((t) => (
              <p key={t} className={P}>
                {t}
              </p>
            ))}
          </section>

          <section id="cashing-out">
            <h2 style={FONT} className={H2}>
              Cashing Out Long Service Leave {j.inName}
            </h2>
            <p className={P}>{j.cashingOutNote}</p>
          </section>

          <section id="portable">
            <h2 style={FONT} className={H2}>
              Portable Long Service Schemes {j.inName}
            </h2>
            <p className={P}>{d.portableIntro}</p>
            <ul className="list-disc pl-6 space-y-1 text-warmgray mb-4">
              {d.portable.map((p) => (
                <li key={p.name}>
                  <a href={p.url} target="_blank" rel="noreferrer noopener" className={LINK}>
                    {p.name}
                  </a>{" "}
                  — {p.covers}
                </li>
              ))}
            </ul>
            <h3 style={FONT} className={H3}>
              Also outside the {j.abbr} Act
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-warmgray mb-4">
              {j.notCovered.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>

          <section id="tax">
            <h2 style={FONT} className={H2}>
              Tax, and How {j.abbr} Compares
            </h2>
            <p className={P}>
              Tax on a payout is federal, so it is the same {j.inName} as everywhere: the{" "}
              <Link href="/long-service-leave-calculator/#tax" className={LINK}>
                ATO unused-leave schedule is set out on the hub
              </Link>
              . A {j.takeAfterYears}-year {j.abbr} entitlement of {weeks(qualifyingWeeks)} weeks at{" "}
              {formatAUD(exampleWeekly)} a week is {formatAUD(examplePayout)} gross — see{" "}
              <Link href={`/take-home-pay-on/${exampleTarget}/`} className={LINK}>
                take-home pay on {formatAUD(exampleTarget)}
              </Link>{" "}
              for the year it lands in. For the other seven Acts side by side, see{" "}
              <Link href="/long-service-leave-calculator/#by-state" className={LINK}>
                long service leave in every state
              </Link>
              .
            </p>
          </section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                Weeks = years of continuous service × {j.weeksPerYear.toFixed(4)}, the rate {j.agency} publishes.{" "}
                {basis}
              </li>
              <li>
                Payout = weeks × the weekly pay you enter. The calculator does not apply the {j.abbr} averaging or
                ordinary-pay rules described above, so enter the figure those rules give you.
              </li>
              <li>
                {j.agency}&apos;s published worked example is reconciled to this formula in the test suite. Source:{" "}
                <span className="break-all">{j.sourceUrl}</span>, read {LSL_SOURCES.verifiedOn}.
              </li>
            </ul>
          </MethodologyDisclosure>

          <section id="faq">
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
          <SourceAttribution sources={sourceList} lastVerified={LSL_DETAIL_VERIFIED_ON} />
          <AuthorBox author={a.author} lastReviewed={a.lastReviewed} />
        </div>
      </div>
    </div>
  );
}
