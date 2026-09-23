import Link from "next/link";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, EMPLOYMENT, formatAUD } from "@/lib/constants";
import {
  ADULT_AGE,
  MINIMUM_WORKING_AGE,
  NMW_ORDER,
  PENDING_JUNIOR_CHANGE,
} from "@/lib/constants/junior-rates";
import {
  RETAIL_JUNIOR_LEVEL_RESTRICTION,
  RETAIL_RATES,
  HOSPITALITY_JUNIOR_ADULT_RATE_EXCEPTIONS,
} from "@/lib/constants/hospitality-award";
import { FAST_FOOD_LEVEL_1, awardJuniorHourly, weeklyPay, type MinWageAge } from "@/lib/constants/minimum-wage";
import {
  MIN_WAGE_AGES,
  aAge,
  SPOKE_HOURS,
  ageSummary,
  annualTaxOn,
  money,
  pctLabel,
  spokeFaqs,
  spokeTitle,
} from "@/modules/guide/minimum-wage-by-age-data";

const RETAIL_L1_WEEKLY = RETAIL_RATES.find((r) => r.level === "Level 1")!.weekly;
const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

const SOURCES_LIST: SourceLink[] = [
  { title: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`, url: NMW_ORDER.url, publisher: SOURCES.fwc.name },
  { title: "Junior pay rates", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/junior-pay-rates", publisher: SOURCES.fwo.name },
  { title: "General Retail Industry Award 2020 (MA000004)", url: "https://awards.fairwork.gov.au/MA000004.html", publisher: SOURCES.fwc.name },
  { title: `${FAST_FOOD_LEVEL_1.award} (${FAST_FOOD_LEVEL_1.code})`, url: FAST_FOOD_LEVEL_1.awardTextUrl, publisher: SOURCES.fwc.name },
  { title: "Hospitality Industry (General) Award 2020 (MA000009)", url: "https://awards.fairwork.gov.au/MA000009.html", publisher: SOURCES.fwc.name },
  { title: "Minimum working age", url: "https://www.fairwork.gov.au/find-help-for/young-workers-and-students/minimum-working-age", publisher: SOURCES.fwo.name },
];

function ageNote(age: MinWageAge): string {
  switch (age) {
    case 14:
      return "Fourteen-year-olds sit in the lowest band of every junior scale. Whether a 14-year-old can work at all, and for how many hours, is set by the state, not by Fair Work, so check the working-age table below before anything else.";
    case 15:
      return "Fifteen is still the under-16 band for the National Minimum Wage and the retail and fast food awards, and the under-17 band in hospitality. A 15-year-old is paid the same percentage as a 14-year-old; the rate only steps up on the 16th birthday.";
    case 16:
      return "Sixteen is the first step up on the National Minimum Wage and the retail and fast food scales. Hospitality is the exception: its junior table has no 16-year-old row, so a 16-year-old stays on the under-17 rate until turning 17.";
    case 17:
      return "At 17 every scale moves up again, and hospitality finally catches up with its own 17-year-old band. The Hair and Beauty award pays 75% at 17, higher than any of the three awards below.";
    case 18:
      return "Eighteen is an adult for most legal purposes but still a junior for pay. The National Minimum Wage pays 68.3% of the adult rate and the three awards below pay 70%. The Hair and Beauty award is the main exception: it pays the full adult rate from 18.";
    case 19:
      return "At 19 the awards diverge: hospitality pays 85% of the adult rate, while retail and fast food pay 80%. The National Minimum Wage pays 82.5%.";
    case 20:
      return "Twenty is where most awards reach the adult rate, but not all of them. Hospitality pays 100% at 20. Retail pays 90% in the first six months with the employer and 100% after that. Fast food pays 20-year-olds 90% for now, rising for those with more than six months' service from 1 December 2026 (see below), and the National Minimum Wage pays 97.7%.";
  }
}

export default function MinimumWageByAgePage({ age }: { age: MinWageAge }) {
  const s = ageSummary(age);
  const faqs = spokeFaqs(age);
  const weeksPerYear = EMPLOYMENT.weeksPerYear;
  const taxExampleGross = weeklyPay(s.topCasual.casualHourly, 20) * weeksPerYear;
  const taxExample = annualTaxOn(taxExampleGross);
  const others = MIN_WAGE_AGES.filter((a) => a !== age);
  const showWorkingAge = age <= 15;

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/junior-pay-rates/" className="hover:text-eucalyptus-dark hover:underline">Minimum Wage by Age</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">{age} Year Olds</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={H2}>
            {spokeTitle(age)}
          </h1>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> With no award, {aAge(age)}-year-old must be paid at least <strong>{money(s.nmw.hourly)} an hour</strong>, or <strong>{money(s.nmw.casualHourly)} as a casual</strong>, from {NMW_ORDER.operativeFrom}. Most {age}-year-olds are covered by an award instead, which sets its own junior rate: <strong>{money(s.retail.hourly)}</strong> in retail{age === 20 ? " for the first six months" : ""}, <strong>{money(s.fastFood.hourly)}</strong> in fast food and <strong>{money(s.hospitality.hourly)}</strong> in hospitality ({money(s.retail.casualHourly)}, {money(s.fastFood.casualHourly)} and {money(s.hospitality.casualHourly)} casual).
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="rates">
              <h2 style={H2}>Minimum Hourly Rate for {aAge(age)} Year Old</h2>
              <p>{ageNote(age)}</p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[34rem] text-left text-sm text-navy">
                    <caption className="sr-only">Minimum wage for {aAge(age)} year old from {NMW_ORDER.operativeFrom}</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">What covers the job</th>
                        <th scope="col" className="px-5 py-4">% of adult rate</th>
                        <th scope="col" className="px-5 py-4">Hourly</th>
                        <th scope="col" className="px-5 py-4">Casual hourly (+25%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {s.lines.map((l) => (
                        <tr key={l.key}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">
                            {l.href ? <Link href={l.href} className="text-eucalyptus-dark hover:underline">{l.label}</Link> : l.label}
                            <span className="block text-xs font-normal text-warmgray">{l.sublabel}</span>
                          </th>
                          <td className="px-5 py-3">{pctLabel(l.percentage)}</td>
                          <td className="px-5 py-3 font-medium">{money(l.hourly)}</td>
                          <td className="px-5 py-3">{money(l.casualHourly)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray-light">
                  Rates apply from the first full pay period starting on or after {NMW_ORDER.operativeFrom}. The National Minimum Wage figures match those published by the Fair Work Ombudsman. The fast food figures match the award&rsquo;s own Schedule A. Retail and hospitality junior figures are our calculation: the award percentage applied to the Level 1 weekly rate, divided by {EMPLOYMENT.standardWeeklyHours}.
                </p>
              </div>
              <p>
                <strong>Which line applies to you?</strong> The first row is only for jobs that no award or enterprise agreement covers, which is uncommon for young workers. Supermarkets, shops and department stores normally fall under the retail award. Burger chains, pizza shops and takeaway outlets normally fall under the fast food award. Cafes, restaurants, pubs and hotels normally fall under the hospitality award. Big employers often have their own enterprise agreement, which must leave you better off overall than the award.
              </p>
            </section>

            <section id="weekly-pay">
              <h2 style={H2}>Weekly Pay for {aAge(age)} Year Old at 10, 15 and 20 Hours</h2>
              <p>
                Most {age}-year-olds work casual shifts after school and on weekends. These are casual weekly amounts before tax, at ordinary Monday&ndash;Friday rates:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[34rem] text-left text-sm text-navy">
                    <caption className="sr-only">Casual weekly pay for {aAge(age)} year old</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Casual rate</th>
                        {SPOKE_HOURS.map((h) => (
                          <th key={h} scope="col" className="px-5 py-4">{h} hrs/week</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {s.lines.map((l) => (
                        <tr key={l.key}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">
                            {l.label}
                            <span className="block text-xs font-normal text-warmgray">{money(l.casualHourly)}/hr</span>
                          </th>
                          {SPOKE_HOURS.map((h) => (
                            <td key={h} className="px-5 py-3">{money(weeklyPay(l.casualHourly, h))}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray-light">
                  Hourly rate multiplied by hours. Saturday, Sunday, evening and public holiday work attracts penalty rates on top; see <Link href="/overtime-penalty-rates-guide/" className="text-eucalyptus-dark hover:underline">penalty rates</Link>.
                </p>
              </div>
              <p>
                <strong>Tax.</strong> If you claim the {formatAUD(18_200)} tax-free threshold with your employer, most junior earnings attract little or no income tax. Working 20 hours every week of the year at the highest casual rate above ({money(s.topCasual.casualHourly)}) comes to about {formatAUD(Math.round(taxExampleGross))} a year, with an estimated {formatAUD(taxExample)} of income tax and Medicare levy for the year. Use the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> or the <Link href="/weekly-pay-calculator/">weekly pay calculator</Link> for your own hours. Your employer must also pay super on top of your wages. To see what the 25% casual loading is worth against a permanent job, use the <Link href="/casual-loading-calculator/">casual loading calculator</Link>.
              </p>
            </section>

            <section id="award-rules">
              <h2 style={H2}>Rules That Change the Rate</h2>
              <ul>
                <li><strong>Retail:</strong> {RETAIL_JUNIOR_LEVEL_RESTRICTION}</li>
                <li><strong>Hospitality:</strong> {HOSPITALITY_JUNIOR_ADULT_RATE_EXCEPTIONS}</li>
                <li><strong>Fast food:</strong> the percentage applies to your classification. Level 2 and Level 3 pay more than the Level 1 figures shown here.</li>
                <li><strong>No junior rates at all:</strong> some awards have no junior scale. The <Link href="/schads-award-pay-rates/">SCHADS award</Link> pays juniors the full adult rate for their classification.</li>
              </ul>
            </section>

            {s.pending && s.pending.length > 0 && (
              <section id="pending-change">
                <h2 style={H2}>Pay Rise for {age} Year Olds from {PENDING_JUNIOR_CHANGE.earliestStart}</h2>
                <div className="not-prose my-6 rounded-xl border-l-4 border-ochre bg-sandstone p-5">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-ochre" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-navy">
                      The Fair Work Commission has decided ({PENDING_JUNIOR_CHANGE.implementationDecision}, {PENDING_JUNIOR_CHANGE.implementationDecidedOn}) to move 18 to 20-year-olds with <strong>{PENDING_JUNIOR_CHANGE.serviceQualifier}</strong> towards the adult rate under the retail, fast food and pharmacy awards. It happens in steps from the first full pay period on or after <strong>{PENDING_JUNIOR_CHANGE.earliestStart}</strong>, not all at once. Until then the rates above apply, and {age}-year-olds with 6 months or less stay on them.
                    </p>
                  </div>
                </div>
                <div className="not-prose my-6">
                  <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                    <table className="w-full min-w-[34rem] text-left text-sm text-navy">
                      <caption className="sr-only">Junior rate transition for {age} year olds with more than 6 months&rsquo; service</caption>
                      <thead className="bg-sandstone font-semibold text-navy">
                        <tr>
                          <th scope="col" className="px-5 py-4">Award (determination)</th>
                          <th scope="col" className="px-5 py-4">Now</th>
                          <th scope="col" className="px-5 py-4">From {PENDING_JUNIOR_CHANGE.earliestStart}</th>
                          <th scope="col" className="px-5 py-4">Adult rate from</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                        {s.pending.map((p) => {
                          const adultWeekly = p.key === "retail" ? RETAIL_L1_WEEKLY : p.key === "fastFood" ? FAST_FOOD_LEVEL_1.weekly : null;
                          return (
                            <tr key={p.key}>
                              <th scope="row" className="px-5 py-3 text-left font-medium">
                                {p.award} <span className="block text-xs font-normal text-warmgray">{p.determination}</span>
                              </th>
                              <td className="px-5 py-3">{p.present}%</td>
                              <td className="px-5 py-3 font-medium">
                                {p.firstStep}%
                                {adultWeekly ? <span className="block text-xs font-normal text-warmgray">{money(awardJuniorHourly(adultWeekly, p.firstStep / 100))}/hr on Level 1</span> : null}
                              </td>
                              <td className="px-5 py-3">{p.fullAdultFrom}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-xs text-warmgray-light">
                    Percentages from the determinations. Level 1 dollars are our calculation on today&rsquo;s adult Level 1 rate; the July 2027 wage review will change the base.{age === 20 ? " Retail is not listed: a 20-year-old with more than 6 months' service already gets the retail adult rate." : ""}
                  </p>
                </div>
                <p>
                  Every step for every age is on the <Link href="/junior-pay-rates/#pending-change">minimum wage by age</Link> page. The change does not affect the National Minimum Wage junior scale or the hospitality award.
                </p>
              </section>
            )}

            {showWorkingAge ? (
              <section id="minimum-working-age">
                <h2 style={H2}>Can {aAge(age).replace("a", "A")} Year Old Work? Minimum Working Age by State</h2>
                <p>
                  <strong>There is no national minimum working age.</strong> Each state and territory sets its own rules, and every one of them bars work during school hours for children of compulsory school age.
                </p>
                <div className="not-prose my-6">
                  <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                    <table className="w-full min-w-[30rem] text-left text-sm text-navy">
                      <caption className="sr-only">Minimum working age by state and territory</caption>
                      <thead className="bg-sandstone font-semibold text-navy">
                        <tr>
                          <th scope="col" className="px-5 py-4">State or territory</th>
                          <th scope="col" className="px-5 py-4">Minimum age</th>
                          <th scope="col" className="px-5 py-4">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                        {MINIMUM_WORKING_AGE.map((j) => (
                          <tr key={j.jurisdiction}>
                            <th scope="row" className="px-5 py-3 text-left font-medium">
                              <a href={j.url} target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">{j.jurisdiction}</a>
                            </th>
                            <td className="px-5 py-3 font-medium">{j.summary}</td>
                            <td className="px-5 py-3 text-warmgray">{j.detail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-xs text-warmgray-light">Each state name links to that jurisdiction&rsquo;s own government page.</p>
                </div>
              </section>
            ) : (
              <section id="minimum-working-age">
                <h2 style={H2}>Working Age Rules at {age}</h2>
                <p>
                  There is no national minimum working age; each state sets its own. Most state limits on job types and employer licences apply below 15. Some states also cap hours on school days, and every state bars work during school hours, while you are still of compulsory school age. The state-by-state table is on the <Link href="/junior-pay-rates/#minimum-working-age">minimum wage by age</Link> page.
                </p>
              </section>
            )}

            <section id="other-ages">
              <h2 style={H2}>Minimum Wage at Other Ages</h2>
              <ul>
                {others.map((a) => (
                  <li key={a}><Link href={`/minimum-wage-by-age/${a}/`}>Minimum wage for a {a} year old</Link></li>
                ))}
                <li><Link href="/minimum-wage-australia/">Adult minimum wage (21 and over)</Link>: {money(EMPLOYMENT.minimumWageHourly)} an hour</li>
                <li><Link href="/junior-pay-rates/">Minimum wage by age: every band in one table</Link></li>
              </ul>
            </section>

            <section id="faq">
              <h2 style={H2}>Frequently Asked Questions</h2>
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How these rates were worked out">
                <p>
                  National Minimum Wage junior rates come from the {NMW_ORDER.citation} ({NMW_ORDER.reference}) and are regression-tested against the Fair Work Ombudsman&rsquo;s published hourly and casual figures. Award junior rates apply the award&rsquo;s percentage to the Level 1 weekly rate and divide by {EMPLOYMENT.standardWeeklyHours}, the order the awards use; the fast food figures are tested against the award&rsquo;s own Schedule A. The adult National Minimum Wage applies from {ADULT_AGE}. Tax estimates use the {SITE_CONFIG.financialYear} resident rates with the tax-free threshold claimed.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {(() => { const a = getGuideAuthorship("minimum-wage-by-age"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">Minimum Wage by Age</h2>
                  <div className="space-y-2">
                    {MIN_WAGE_AGES.map((a) => (
                      <Link
                        key={a}
                        href={`/minimum-wage-by-age/${a}/`}
                        aria-current={a === age ? "page" : undefined}
                        className={`group flex items-center justify-between rounded-lg border p-3 transition-all hover:border-eucalyptus/40 hover:shadow-sm ${a === age ? "border-eucalyptus bg-eucalyptus/5" : "border-sandstone-dark/20 bg-white"}`}
                      >
                        <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{a} year olds</span>
                        <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h2 className="mb-2 text-lg font-bold">What will you take home?</h2>
                  <p className="mb-4 text-sm text-eucalyptus-light">
                    Enter your hourly rate and hours to see your pay after tax.
                  </p>
                  <Link href="/take-home-pay-calculator/" className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50">
                    Calculate Take-Home Pay
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
