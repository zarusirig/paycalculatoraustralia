import Link from "next/link";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SOURCES, EMPLOYMENT } from "@/lib/constants";
import { NMW_ORDER } from "@/lib/constants/junior-rates";
import { FAST_FOOD_LEVEL_1, weeklyPay, type MinWageAge } from "@/lib/constants/minimum-wage";
import {
  APPRENTICE_TRAINEE,
  CHILD_WORK_RULES,
  PHASE_IN,
  STATE_RULES_VERIFIED_ON,
} from "@/lib/constants/junior-age-facts";
import {
  MIN_WAGE_AGES,
  SPOKE_HOURS,
  aAge,
  adultRateBlock,
  ageNote,
  ageSummary,
  apprenticeText,
  awardPercentRows,
  awardSpreadText,
  scopeNotes,
  birthdayBlock,
  extraAwardSources,
  money,
  pctLabel,
  phaseInMeaning,
  phaseInTable,
  spokeFaqs,
  schoolRulesForAge,
  spokeTitle,
  workRulesForAge,
} from "@/modules/guide/minimum-wage-by-age-data";
import FeaturedImage from "@/components/common/featured-image";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3";

const FWO = SOURCES.fwo.name;
const FWC = SOURCES.fwc.name;

/** Sources shown on a spoke: the ones its age-specific sections actually rely on. */
function sourcesFor(age: MinWageAge): SourceLink[] {
  const list: SourceLink[] = [
    { title: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`, url: NMW_ORDER.url, publisher: FWC },
    { title: "Junior pay rates", url: APPRENTICE_TRAINEE.fwoJuniorUrl, publisher: FWO },
    { title: "General Retail Industry Award 2020 (MA000004)", url: "https://awards.fairwork.gov.au/MA000004.html", publisher: FWC },
    { title: `${FAST_FOOD_LEVEL_1.award} (${FAST_FOOD_LEVEL_1.code})`, url: FAST_FOOD_LEVEL_1.awardTextUrl, publisher: FWC },
    { title: "Hospitality Industry (General) Award 2020 (MA000009)", url: "https://awards.fairwork.gov.au/MA000009.html", publisher: FWC },
  ];
  if (age <= 15) {
    list.push({ title: "Minimum working age", url: "https://www.fairwork.gov.au/find-help-for/young-workers-and-students/minimum-working-age", publisher: FWO });
    for (const r of CHILD_WORK_RULES) list.push({ title: r.title, url: r.url, publisher: r.publisher });
  }
  if (age >= 16 && age <= 18) {
    for (const r of schoolRulesForAge(age as 16 | 17 | 18)) {
      const page = CHILD_WORK_RULES.find((c) => c.url === r.url)!;
      list.push({ title: page.title, url: page.url, publisher: page.publisher });
    }
  }
  if (age >= 17) {
    list.push({ title: `Junior rates implementation decision ${PHASE_IN.decision}`, url: PHASE_IN.decisionUrl, publisher: FWC });
    for (const [pr, award] of [["PR813655", "General Retail"], ["PR813654", "Fast Food"], ["PR813656", "Pharmacy"]] as const) {
      list.push({ title: `${pr}: ${award} Industry Award 2020 junior rates determination`, url: PHASE_IN.determinationUrl(pr), publisher: FWC });
    }
  }
  if (age >= 18) {
    for (const x of extraAwardSources(age as 18 | 19 | 20)) list.push({ ...x, publisher: FWC });
    list.push({ title: "Apprentice and trainee pay rates", url: APPRENTICE_TRAINEE.fwoApprenticeUrl, publisher: FWO });
  }
  return list;
}

export default function MinimumWageByAgePage({ age }: { age: MinWageAge }) {
  const s = ageSummary(age);
  const faqs = spokeFaqs(age);
  const percentRows = awardPercentRows(age);
  const birthday = birthdayBlock(age);
  const phase = age >= 18 ? phaseInTable(age as 18 | 19 | 20) : null;
  const adult = age >= 18 ? adultRateBlock(age as 18 | 19 | 20) : null;
  const rules = age <= 15 ? workRulesForAge(age as 14 | 15) : null;
  const prev = age > 14 ? age - 1 : null;
  const next = age < 20 ? age + 1 : null;

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
          <FeaturedImage className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="rates">
              <h2 style={H2}>Minimum Hourly Rate for {aAge(age)} Year Old</h2>
              <p>{ageNote(age)}</p>
              <div className="not-prose my-6">
                <div className={TABLE_WRAP}>
                  <table className="w-full min-w-[40rem] text-left text-sm text-navy">
                    <caption className="sr-only">Minimum wage for {aAge(age)} year old from {NMW_ORDER.operativeFrom}, hourly and casual weekly</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className={TH}>Pay floor</th>
                        <th scope="col" className={TH}>%</th>
                        <th scope="col" className={TH}>Hourly</th>
                        <th scope="col" className={TH}>Casual</th>
                        {SPOKE_HOURS.map((h) => (
                          <th key={h} scope="col" className={TH}>{h} hrs casual</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {s.lines.map((l) => (
                        <tr key={l.key}>
                          <th scope="row" className={`${TH} text-left font-medium`}>
                            {l.href ? <Link href={l.href} className="text-eucalyptus-dark hover:underline">{l.label}</Link> : l.label}
                            <span className="block text-xs font-normal text-warmgray">{l.sublabel}</span>
                          </th>
                          <td className={TH}>{pctLabel(l.percentage)}</td>
                          <td className={`${TH} font-medium`}>{money(l.hourly)}</td>
                          <td className={TH}>{money(l.casualHourly)}</td>
                          {SPOKE_HOURS.map((h) => (
                            <td key={h} className={TH}>{money(weeklyPay(l.casualHourly, h))}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray-light">
                  From the first full pay period starting on or after {NMW_ORDER.operativeFrom}, before tax, Monday&ndash;Friday rates. Which row applies to you, and how the award rows are worked out, is on the <Link href="/junior-pay-rates/#which-rate-applies" className="text-eucalyptus-dark hover:underline">junior pay rates</Link> page.
                </p>
              </div>
            </section>

            <section id="awards">
              <h2 style={H2}>Every Award Junior Scale at {age}</h2>
              <p>{awardSpreadText(age)}</p>
              <div className="not-prose my-6">
                <div className={TABLE_WRAP}>
                  <table className="w-full min-w-[30rem] text-left text-sm text-navy">
                    <caption className="sr-only">Award junior percentages for {aAge(age)} year old, grouped by percentage</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className={TH}>% of adult rate at {age}</th>
                        <th scope="col" className={TH}>Award (the band {aAge(age)}-year-old falls in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {percentRows.map((row) => (
                        <tr key={row.label}>
                          <th scope="row" className={`${TH} text-left font-semibold`}>{row.label}</th>
                          <td className={TH}>
                            {row.awards.map((a, i) => (
                              <span key={a.name}>
                                {i > 0 ? "; " : ""}
                                <Link href={a.href} className="text-eucalyptus-dark hover:underline">{a.name}</Link> <span className="text-warmgray">({a.band.toLowerCase()}{a.scope ? "*" : ""})</span>
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray-light">
                  * {scopeNotes(age)} Awards with no junior scale pay the adult rate at any age (<Link href="/junior-pay-rates/#awards-without-junior-rates" className="text-eucalyptus-dark hover:underline">which ones</Link>).
                </p>
              </div>
            </section>

            <section id="next-birthday">
              <h2 style={H2}>{birthday.heading}</h2>
              <p>{birthday.intro}</p>
              {birthday.rises.length > 0 && (
                <ul>
                  {birthday.rises.map((r) => (
                    <li key={r.step}><strong>{r.step}:</strong> {r.awards}</li>
                  ))}
                </ul>
              )}
              {birthday.dollars && <p>{birthday.dollars}</p>}
              {birthday.waits.length > 0 && (
                <ul>
                  {birthday.waits.map((w) => (
                    <li key={w.at}>{age + 1 === w.at ? "Rises" : `No rise until ${w.at}`}: {w.awards}</li>
                  ))}
                </ul>
              )}
              <p>
                {prev ? <><Link href={`/minimum-wage-by-age/${prev}/`}>Rates at {prev}</Link> · </> : null}
                {next ? <Link href={`/minimum-wage-by-age/${next}/`}>Rates at {next}</Link> : <Link href="/minimum-wage-australia/">Adult minimum wage at 21: {money(EMPLOYMENT.minimumWageHourly)} an hour</Link>}
                {age <= 16 ? <> · Under-18 rates are not touched by the Fair Work Commission&rsquo;s 2026 junior-rate decision (<Link href="/junior-pay-rates/#pending-change">what it changes</Link>).</> : null}
              </p>
            </section>

            {age === 17 && (
              <section id="phase-in">
                <h2 style={H2}>Turning 18 After {PHASE_IN.start}</h2>
                <p>
                  Rates for 17-year-olds are not changed by {PHASE_IN.decision}. The change waits for the 18th birthday: under Retail, Fast Food and Pharmacy, an 18-year-old with more than 6 months with the employer moves up in steps from the first full pay period on or after {PHASE_IN.start}, reaching 100% from 1 July 2029. So how long you have been with your employer when you turn 18 decides which 18-year-old rate you get. The FAQ below has the dollars, and every date is on the <Link href="/minimum-wage-by-age/18/#phase-in">18-year-old page</Link>.
                </p>
              </section>
            )}

            {phase && (
              <section id="phase-in">
                <h2 style={H2}>The {PHASE_IN.start} Phase-In for {age} Year Olds</h2>
                <div className="not-prose my-6 rounded-xl border-l-4 border-ochre bg-sandstone p-5">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-ochre" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-navy">
                      {PHASE_IN.inForce ? "In force" : "Decided, not yet in force"} ({PHASE_IN.decision}): a four-year phase-in for <strong>{PHASE_IN.serviceQualifier}</strong>, from the first full pay period on or after <strong>{PHASE_IN.start}</strong>, not a jump to the adult rate.
                    </p>
                  </div>
                </div>
                <div className="not-prose my-6">
                  <div className={TABLE_WRAP}>
                    <table className="w-full min-w-[26rem] text-left text-sm text-navy">
                      <caption className="sr-only">Phase-in percentages for {age} year olds with more than 6 months&rsquo; service</caption>
                      <thead className="bg-sandstone font-semibold text-navy">
                        <tr>
                          <th scope="col" className={TH}>From</th>
                          {phase.columns.map((c) => (
                            <th key={c.award} scope="col" className={TH}>
                              <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">{c.award}</a>
                              <span className="block text-xs font-normal text-warmgray">{c.determination}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                        {phase.dates.map((d, i) => (
                          <tr key={d}>
                            <th scope="row" className={`${TH} text-left font-medium`}>{d}</th>
                            {phase.columns.map((c) => (
                              <td key={c.award} className={TH}>{c.cells[i] == null ? "100%" : `${c.cells[i]}%`}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p>
                  {phaseInMeaning(age as 18 | 19 | 20)}{age < 20 ? <> Next column: <Link href={`/minimum-wage-by-age/${age + 1}/#phase-in`}>{age + 1}-year-olds</Link>.</> : null}
                </p>
              </section>
            )}

            {rules && (
              <section id="working-rules">
                <h2 style={H2}>{age === 14 ? "Can a 14 Year Old Work? State Rules for Under-15s" : "What Changes at 15: State Work Rules"}</h2>
                <p>
                  There is no national minimum working age: the Fair Work Ombudsman says it &ldquo;depends on the state or territory you&rsquo;re working in&rdquo;.{" "}
                  {age === 14
                    ? "Here is what each state's own government page says applies to a 14-year-old."
                    : "Most state limits stop at 15; here is what each state's own government page says about a 15-year-old."}
                </p>
                <div className="not-prose my-6">
                  <div className={TABLE_WRAP}>
                    <table className="w-full min-w-[30rem] text-left text-sm text-navy">
                      <caption className="sr-only">Work rules for {aAge(age)} year old by state and territory</caption>
                      <thead className="bg-sandstone font-semibold text-navy">
                        <tr>
                          <th scope="col" className={TH}>State</th>
                          <th scope="col" className={TH}>{age === 14 ? "Rules at 14" : "At 15"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                        {rules.map((r) => (
                          <tr key={r.jurisdiction}>
                            <th scope="row" className={`${TH} text-left font-medium`}>
                              <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">{r.jurisdiction}</a>
                            </th>
                            <td className={TH}>{r.text}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-xs text-warmgray-light">Read from each government page on {STATE_RULES_VERIFIED_ON}; each state name links to it.</p>
                </div>
              </section>
            )}

            {(age === 16 || age === 17) && (
              <section id="school-and-work">
                <h2 style={H2}>School and Work at {age}</h2>
                <p>
                  {age === 16 ? "Most state job, hours and permit rules stop at 15, so at 16 what limits work is mostly school. What the state pages say about 16-year-olds:" : "At 17 the limits left are about school and under-18 protections. What the state pages say about 17-year-olds:"}
                </p>
                <ul>
                  {schoolRulesForAge(age).map((r) => (
                    <li key={r.jurisdiction}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer"><strong>{r.jurisdiction}</strong></a>: {r.text}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {age === 18 && (
              <section id="under-18-rules">
                <h2 style={H2}>Under-18 Rules That Stop at 18</h2>
                <ul>
                  {schoolRulesForAge(18).map((r) => (
                    <li key={r.jurisdiction}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer"><strong>{r.jurisdiction}</strong></a>: {r.text}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {adult && (
              <section id="adult-rate">
                <h2 style={H2}>When {aAge(age)} Year Old Gets the Adult Rate</h2>
                {adult.newAt.length > 0 ? (
                  <>
                    <p><strong>New at {age}:</strong></p>
                    <ul>
                      {adult.newAt.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No award junior scale reaches 100% at {age}: turning {age} only moves you along the scales. The adult-rate rules from 18 still apply.</p>
                )}
                {adult.carried && <p>{adult.carried}</p>}
                {age === 18 ? (
                  <p>Every other award junior scale reaches 100% at 20 or 21; the <Link href="/minimum-wage-by-age/19/#adult-rate">19-year-old page</Link> lists which is which.</p>
                ) : (
                  <ul>
                    {adult.later.map((l) => (
                      <li key={l.at}><strong>Adult rate at {l.at}:</strong> {l.awards}</li>
                    ))}
                  </ul>
                )}
                <p>
                  <strong>{age === 19 ? "Trainees." : "Apprentices."}</strong> {apprenticeText(age as 18 | 19 | 20)} See <Link href="/apprentice-pay-rates/">apprentice pay rates</Link> and the Fair Work Ombudsman&rsquo;s <a href={APPRENTICE_TRAINEE.fwoApprenticeUrl} target="_blank" rel="noopener noreferrer">apprentice and trainee pay</a> page.
                </p>
              </section>
            )}

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
                  Each award&rsquo;s percentage of its Level 1 weekly rate, divided by {EMPLOYMENT.standardWeeklyHours}; full method on the <Link href="/junior-pay-rates/#how-calculated" className="text-eucalyptus-dark hover:underline">junior pay rates</Link> page.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sourcesFor(age)} lastVerified="10 October 2026" />
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
