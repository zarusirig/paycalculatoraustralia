import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG } from "@/lib/constants/australian-tax";
// T6: the take-home grid now has $1k steps from $40k-$150k, so link the exact
// nearest page from the shared grid rather than the old $5k step.
import { nearestSalary, salaryHref } from "@/lib/data/salary-pages";
import {
  AVERAGE_SALARY_VERIFIED_ISO,
  AVERAGE_SALARY_VERIFIED_ON,
  AWE_BY_INDUSTRY,
  AWE_BY_SECTOR,
  AWE_BY_STATE,
  AWE_HEADLINE,
  AWE_RELEASE,
  EEH_QUARTILES,
  EEH_RELEASE,
  EE_MEDIAN,
  EE_MEDIAN_BY_AGE,
  EE_MEDIAN_BY_INDUSTRY,
  EE_MEDIAN_BY_STATE,
  EE_PERCENTILES_ALL,
  EE_RELEASE,
  HEADLINE,
  HEADLINE_YEAR,
  NEXT_AWE_RELEASE,
  annualise,
  dollars,
  dollarsCents,
} from "@/lib/data/average-salary";
import AverageSalaryChecker from "@/modules/guide/average-salary-checker";
import { AVERAGE_SALARY_FAQS, AVERAGE_SALARY_GENDER_GAP_PCT, takeHome } from "@/modules/guide/average-salary-faqs";

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

const SOURCES_LIST: SourceLink[] = [
  { title: `Average Weekly Earnings, Australia, ${AWE_RELEASE.referencePeriod} (released ${AWE_RELEASE.released})`, url: AWE_RELEASE.url, publisher: "Australian Bureau of Statistics" },
  { title: `Employee Earnings, ${EE_RELEASE.referencePeriod} (released ${EE_RELEASE.released})`, url: EE_RELEASE.url, publisher: "Australian Bureau of Statistics" },
  { title: `Employee Earnings and Hours, Australia, ${EEH_RELEASE.referencePeriod} (released ${EEH_RELEASE.released})`, url: EEH_RELEASE.url, publisher: "Australian Bureau of Statistics" },
  { title: "Tax rates – Australian residents", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "Australian Taxation Office" },
];

/** An annual figure linked to its nearest /take-home-pay-on/N/ page, labelled honestly when not exact. */
function TakeHomeCell({ annual }: { annual: number }) {
  const nearest = nearestSalary("take-home", annual);
  const label = nearest === annual ? `Take-home pay on ${dollars(annual)}` : `Take-home pay on ${dollars(nearest)}, the nearest step to ${dollars(annual)}`;
  return (
    <Link href={salaryHref("take-home", nearest)} title={label} aria-label={label} className="underline decoration-eucalyptus/40 decoration-dotted underline-offset-4 hover:text-eucalyptus-dark">
      {dollars(takeHome(annual))}
    </Link>
  );
}

function Table({ caption, head, children, minWidth = 560 }: { caption: string; head: string[]; children: ReactNode; minWidth?: number }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full text-left text-sm text-navy" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-sandstone font-semibold">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">{children}</tbody>
      </table>
    </div>
  );
}

const td = "px-4 py-2.5";

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-warmgray">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-navy" style={HEADING_FONT}>{value}</p>
      <p className="mt-1 text-xs text-warmgray">{sub}</p>
    </div>
  );
}

export default function AverageSalaryAustraliaPage() {
  const authorship = getGuideAuthorship("average-salary-australia");
  const statesByAwe = [...AWE_BY_STATE].sort((a, b) => b.weekly - a.weekly);
  const medianByState = new Map(EE_MEDIAN_BY_STATE.map((r) => [r.code, r]));
  const industriesByAwe = [...AWE_BY_INDUSTRY].sort((a, b) => b.weekly - a.weekly);
  const medianByIndustry = new Map(EE_MEDIAN_BY_INDUSTRY.map((r) => [r.label, r.weekly]));
  const industriesOnlyInMedian = EE_MEDIAN_BY_INDUSTRY.filter((r) => !AWE_BY_INDUSTRY.some((a) => a.label === r.label));
  const peakAge = [...EE_MEDIAN_BY_AGE].sort((a, b) => b.fullTime - a.fullTime)[0];

  const afterTaxRows: { label: string; annual: number; note: string }[] = [
    { label: "Average full-time salary", annual: HEADLINE.averageAnnual, note: `AWE, ${AWE_RELEASE.referencePeriod}` },
    { label: "Median full-time salary", annual: HEADLINE.medianFullTimeAnnual, note: `EE, ${EE_RELEASE.referencePeriod}` },
    { label: "Median, all employees", annual: HEADLINE.medianAllAnnual, note: `EE, ${EE_RELEASE.referencePeriod}` },
    { label: "Average, all employees", annual: HEADLINE.averageAllEmployeesAnnual, note: `AWE, ${AWE_RELEASE.referencePeriod}` },
    ...EE_PERCENTILES_ALL.filter((p) => p.percentile >= 75).map((p) => ({
      label: `${p.percentile}th percentile, all employees`,
      annual: annualise(p.weekly),
      note: `EE, ${EE_RELEASE.referencePeriod}`,
    })),
  ];

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Average Salary Australia</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl lg:mb-14">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            Average Salary in Australia {HEADLINE_YEAR}: {dollars(HEADLINE.averageAnnual)} a Year
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">
            The average full-time salary in Australia is <strong className="text-navy">{dollars(HEADLINE.averageAnnual)}</strong> a year
            ({dollarsCents(AWE_HEADLINE.fullTimeOrdinaryWeekly)} a week), according to the ABS&apos;s {AWE_RELEASE.referencePeriod} figures
            released on {AWE_RELEASE.released}. The <strong className="text-navy">median</strong> — what the worker in the middle earns — is{" "}
            <strong className="text-navy">{dollars(HEADLINE.medianFullTimeAnnual)}</strong> for full-time employees and{" "}
            <strong className="text-navy">{dollars(HEADLINE.medianAllAnnual)}</strong> across all employees, part-time included.
          </p>
          <div className="not-prose mb-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Average, full-time" value={dollars(HEADLINE.averageAnnual)} sub={`${dollarsCents(AWE_HEADLINE.fullTimeOrdinaryWeekly)}/wk · ABS ${AWE_RELEASE.referencePeriod} · +${AWE_HEADLINE.fullTimeOrdinaryAnnualChangePct}% in a year`} />
            <Stat label="Median, full-time" value={dollars(HEADLINE.medianFullTimeAnnual)} sub={`${dollars(EE_MEDIAN.fullTime)}/wk · ABS ${EE_RELEASE.referencePeriod}`} />
            <Stat label="Median, all employees" value={dollars(HEADLINE.medianAllAnnual)} sub={`${dollars(EE_MEDIAN.allEmployees)}/wk · ABS ${EE_RELEASE.referencePeriod}`} />
          </div>
          <p className="mb-6 text-sm text-warmgray">
            Figures checked against the ABS releases on <time dateTime={AVERAGE_SALARY_VERIFIED_ISO}>{AVERAGE_SALARY_VERIFIED_ON}</time>. The
            next Average Weekly Earnings release ({NEXT_AWE_RELEASE.referencePeriod}) is due {NEXT_AWE_RELEASE.date}.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">

            <section id="checker">
              <h2 style={HEADING_FONT}>Is your salary above average?</h2>
              <p>
                Enter your salary to see what share of Australian employees earn less than you, using the ABS&apos;s full count of
                weekly earnings from {EE_RELEASE.referencePeriod}.
              </p>
              <AverageSalaryChecker />
            </section>

            <section id="average-vs-median">
              <h2 style={HEADING_FONT}>Average vs median salary in Australia</h2>
              <p>
                &ldquo;Average salary&rdquo; usually means the <strong>mean</strong>: total earnings divided by the number of workers. The ABS
                measures it twice a year in <a href={AWE_RELEASE.url} target="_blank" rel="noreferrer noopener">Average Weekly Earnings</a>,
                a survey of employers. The headline figure — full-time adult average weekly ordinary time earnings — is{" "}
                {dollarsCents(AWE_HEADLINE.fullTimeOrdinaryWeekly)} a week, or {dollars(HEADLINE.averageAnnual)} a year. It covers
                full-time adults only and excludes overtime and employer super.
              </p>
              <p>
                The <strong>median</strong> is the middle earner: half earn more, half earn less. It comes from a different survey, the
                household-based <a href={EE_RELEASE.url} target="_blank" rel="noreferrer noopener">Employee Earnings</a>, run each August.
                The full-time median of {dollars(EE_MEDIAN.fullTime)} a week ({dollars(HEADLINE.medianFullTimeAnnual)} a year) is{" "}
                {dollars(HEADLINE.averageAnnual - HEADLINE.medianFullTimeAnnual)} a year below the full-time average, because a minority
                of very high earners pull the mean up. Counting part-time workers too, the median drops to {dollars(EE_MEDIAN.allEmployees)}{" "}
                a week ({dollars(HEADLINE.medianAllAnnual)} a year).
              </p>
              <Table caption="Average and median earnings in Australia" head={["Measure", "Weekly", "Yearly", "Source"]}>
                <tr><th scope="row" className={`${td} font-medium`}>Average, full-time adults (ordinary time)</th><td className={td}>{dollarsCents(AWE_HEADLINE.fullTimeOrdinaryWeekly)}</td><td className={`${td} font-semibold`}>{dollars(HEADLINE.averageAnnual)}</td><td className={td}>AWE, {AWE_RELEASE.referencePeriod}</td></tr>
                <tr><th scope="row" className={`${td} font-medium`}>Average, full-time adults incl. overtime</th><td className={td}>{dollarsCents(AWE_HEADLINE.fullTimeTotalWeekly)}</td><td className={td}>{dollars(HEADLINE.averageFullTimeTotalAnnual)}</td><td className={td}>AWE, {AWE_RELEASE.referencePeriod}</td></tr>
                <tr><th scope="row" className={`${td} font-medium`}>Average, all employees (incl. part-time)</th><td className={td}>{dollarsCents(AWE_HEADLINE.allEmployeesTotalWeekly)}</td><td className={td}>{dollars(HEADLINE.averageAllEmployeesAnnual)}</td><td className={td}>AWE, {AWE_RELEASE.referencePeriod}</td></tr>
                <tr><th scope="row" className={`${td} font-medium`}>Median, full-time employees</th><td className={td}>{dollars(EE_MEDIAN.fullTime)}</td><td className={`${td} font-semibold`}>{dollars(HEADLINE.medianFullTimeAnnual)}</td><td className={td}>EE, {EE_RELEASE.referencePeriod}</td></tr>
                <tr><th scope="row" className={`${td} font-medium`}>Median, all employees</th><td className={td}>{dollars(EE_MEDIAN.allEmployees)}</td><td className={td}>{dollars(HEADLINE.medianAllAnnual)}</td><td className={td}>EE, {EE_RELEASE.referencePeriod}</td></tr>
                <tr><th scope="row" className={`${td} font-medium`}>Median, part-time employees</th><td className={td}>{dollars(EE_MEDIAN.partTime)}</td><td className={td}>{dollars(annualise(EE_MEDIAN.partTime))}</td><td className={td}>EE, {EE_RELEASE.referencePeriod}</td></tr>
              </Table>
              <p className="text-sm">
                Yearly figures are the ABS weekly figure × 52. The median rose {dollars(EE_MEDIAN.allEmployees - EE_MEDIAN.allEmployeesPrevYear)}{" "}
                a week (1.9%) in the year to {EE_RELEASE.referencePeriod}; average full-time earnings rose{" "}
                {AWE_HEADLINE.fullTimeOrdinaryAnnualChangePct}% in the year to {AWE_RELEASE.referencePeriod}.
              </p>
            </section>

            <section id="after-tax">
              <h2 style={HEADING_FONT}>Average salary after tax</h2>
              <p>
                On the average full-time salary of {dollars(HEADLINE.averageAnnual)}, take-home pay is{" "}
                <strong>{dollars(takeHome(HEADLINE.averageAnnual))}</strong> a year for {SITE_CONFIG.financialYear}, about{" "}
                {dollars(takeHome(HEADLINE.averageAnnual) / 26)} a fortnight. Each figure below links to the nearest full take-home breakdown.
              </p>
              <Table caption={`Take-home pay on average and median salaries, ${SITE_CONFIG.financialYear}`} head={["Salary", "Before tax", `Take-home ${SITE_CONFIG.financialYear}`, "Source"]}>
                {afterTaxRows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row" className={`${td} font-medium`}>{r.label}</th>
                    <td className={td}>{dollars(r.annual)}</td>
                    <td className={`${td} font-semibold`}><TakeHomeCell annual={r.annual} /></td>
                    <td className={td}>{r.note}</td>
                  </tr>
                ))}
              </Table>
              <p className="text-sm">
                Take-home assumes an Australian resident for the full year, no HECS/HELP debt and no Medicare levy surcharge, after income
                tax, the low income tax offset and the 2% Medicare levy. Super is paid on top. Use the{" "}
                <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> for your own situation, or browse{" "}
                <Link href="/take-home-pay-on/">take-home pay on every salary</Link> and{" "}
                <Link href="/salary-to-hourly/">every salary as an hourly rate</Link>.
              </p>
            </section>

            <section id="by-state">
              <h2 style={HEADING_FONT}>Average salary by state and territory</h2>
              <p>
                The ACT and Western Australia have the highest full-time average and full-time median. The average reflects the ACT&apos;s public service and WA&apos;s
                mining workforce; the median shows what a typical worker in each state earns.
              </p>
              <Table caption="Average and median salary by state" head={["State", "Average full-time (yearly)", "Median full-time (yearly)", "Median all employees (yearly)"]} minWidth={620}>
                {statesByAwe.map((s) => {
                  const m = medianByState.get(s.code!);
                  return (
                    <tr key={s.code}>
                      <th scope="row" className={`${td} font-medium`}>{s.label}</th>
                      <td className={td}>{dollars(annualise(s.weekly))} <span className="text-xs text-warmgray">({dollarsCents(s.weekly)}/wk)</span></td>
                      <td className={td}>{m ? dollars(annualise(m.fullTime)) : "—"}</td>
                      <td className={td}>{m ? dollars(annualise(m.all)) : "—"}</td>
                    </tr>
                  );
                })}
              </Table>
              <p className="text-sm">
                Average: ABS AWE {AWE_RELEASE.referencePeriod}, full-time adult ordinary time earnings, original series. Medians: ABS
                Employee Earnings {EE_RELEASE.referencePeriod}. Work out take-home pay in your state with the{" "}
                <Link href="/pay-calculator-nsw/">NSW</Link>, <Link href="/pay-calculator-vic/">VIC</Link>,{" "}
                <Link href="/pay-calculator-qld/">QLD</Link>, <Link href="/pay-calculator-wa/">WA</Link>,{" "}
                <Link href="/pay-calculator-sa/">SA</Link>, <Link href="/pay-calculator-tas/">TAS</Link>,{" "}
                <Link href="/pay-calculator-act/">ACT</Link> and <Link href="/pay-calculator-nt/">NT</Link> pay calculators.
              </p>
            </section>

            <section id="by-industry">
              <h2 style={HEADING_FONT}>Average salary by industry</h2>
              <p>
                Mining pays more than double accommodation and food services on both the average and the median. Industries with many
                part-time and casual workers — retail, hospitality — have far lower medians than averages, because the median counts
                part-time workers and the full-time average does not.
              </p>
              <Table caption="Average and median salary by industry" head={["Industry", "Average full-time (yearly)", "After tax", "Median all employees (yearly)"]} minWidth={640}>
                {industriesByAwe.map((r) => {
                  const annual = annualise(r.weekly);
                  const med = medianByIndustry.get(r.label);
                  return (
                    <tr key={r.label}>
                      <th scope="row" className={`${td} font-medium`}>{r.label}</th>
                      <td className={td}>{dollars(annual)}</td>
                      <td className={td}><TakeHomeCell annual={annual} /></td>
                      <td className={td}>{med !== undefined ? dollars(annualise(med)) : "—"}</td>
                    </tr>
                  );
                })}
                {industriesOnlyInMedian.map((r) => (
                  <tr key={r.label}>
                    <th scope="row" className={`${td} font-medium`}>{r.label}</th>
                    <td className={td}>—</td>
                    <td className={td}>—</td>
                    <td className={td}>{dollars(annualise(r.weekly))}</td>
                  </tr>
                ))}
              </Table>
              <p className="text-sm">
                Average: ABS AWE {AWE_RELEASE.referencePeriod}, original series (the AWE survey does not cover agriculture, forestry and
                fishing). Median: ABS Employee Earnings {EE_RELEASE.referencePeriod}. For pay by job, see{" "}
                <Link href="/job-pay-rates/">pay rates by occupation</Link>, <Link href="/mining-fifo-pay-guide/">mining and FIFO pay</Link>,{" "}
                <Link href="/tech-salary-guide-australia/">tech salaries</Link> and <Link href="/teacher-pay-australia/">teacher pay by state</Link>.
              </p>
            </section>

            <section id="by-age">
              <h2 style={HEADING_FONT}>Median salary by age</h2>
              <p>
                Full-time earnings climb through your twenties and thirties and peak at {peakAge.label}, where the full-time median is{" "}
                {dollars(peakAge.fullTime)} a week ({dollars(annualise(peakAge.fullTime))} a year). These are medians from the
                Employee Earnings survey, the ABS&apos;s most recent earnings-by-age data.
              </p>
              <Table caption="Median salary by age" head={["Age", "Median full-time (yearly)", "Men full-time", "Women full-time", "All employees"]} minWidth={620}>
                {EE_MEDIAN_BY_AGE.map((r) => (
                  <tr key={r.label}>
                    <th scope="row" className={`${td} font-medium`}>{r.label}</th>
                    <td className={`${td} font-semibold`}>{dollars(annualise(r.fullTime))} <span className="text-xs font-normal text-warmgray">({dollars(r.fullTime)}/wk)</span></td>
                    <td className={td}>{dollars(annualise(r.maleFullTime))}</td>
                    <td className={td}>{dollars(annualise(r.femaleFullTime))}</td>
                    <td className={td}>{dollars(annualise(r.all))}</td>
                  </tr>
                ))}
              </Table>
              <p className="text-sm">
                Source: ABS Employee Earnings {EE_RELEASE.referencePeriod}, Table 2 (median weekly earnings in main job, × 52).
                &ldquo;All employees&rdquo; includes part-time workers, which is why it is far lower for teenagers and over-65s.
              </p>
            </section>

            <section id="by-gender">
              <h2 style={HEADING_FONT}>Average salary by gender and sector</h2>
              <Table caption="Average and median salary by gender" head={["", "Men", "Women"]} minWidth={460}>
                <tr><th scope="row" className={`${td} font-medium`}>Average full-time (AWE, {AWE_RELEASE.referencePeriod})</th><td className={td}>{dollars(annualise(AWE_HEADLINE.maleFullTimeOrdinaryWeekly))}</td><td className={td}>{dollars(annualise(AWE_HEADLINE.femaleFullTimeOrdinaryWeekly))}</td></tr>
                <tr><th scope="row" className={`${td} font-medium`}>Median full-time (EE, {EE_RELEASE.referencePeriod})</th><td className={td}>{dollars(annualise(EE_MEDIAN.maleFullTime))}</td><td className={td}>{dollars(annualise(EE_MEDIAN.femaleFullTime))}</td></tr>
                <tr><th scope="row" className={`${td} font-medium`}>Median all employees (EE, {EE_RELEASE.referencePeriod})</th><td className={td}>{dollars(annualise(EE_MEDIAN.maleAll))}</td><td className={td}>{dollars(annualise(EE_MEDIAN.femaleAll))}</td></tr>
              </Table>
              <p>
                On the full-time average, women earn {AVERAGE_SALARY_GENDER_GAP_PCT}% less than men. That raw comparison does not adjust for
                occupation or hours, which the ABS notes can significantly affect the gap. By sector, full-time adults in the public sector
                average {dollars(annualise(AWE_BY_SECTOR.public))} a year against {dollars(annualise(AWE_BY_SECTOR.private))} in the private
                sector (AWE, {AWE_RELEASE.referencePeriod}, original).
              </p>
            </section>

            <section id="distribution">
              <h2 style={HEADING_FONT}>How salaries are spread: percentiles</h2>
              <p>
                The ABS publishes where employees sit across the whole earnings range. These cover every employee, full-time and part-time,
                in their main job.
              </p>
              <Table caption="Distribution of weekly earnings, all employees" head={["Percentile", "Weekly", "Yearly", "Meaning"]} minWidth={520}>
                {EE_PERCENTILES_ALL.map((p) => (
                  <tr key={p.percentile}>
                    <th scope="row" className={`${td} font-medium`}>{p.percentile}th</th>
                    <td className={td}>{dollars(p.weekly)}</td>
                    <td className={td}>{dollars(annualise(p.weekly))}</td>
                    <td className={td}>{p.percentile}% of employees earned less</td>
                  </tr>
                ))}
              </Table>
              <p>
                For full-time employees only, the biennial Employee Earnings and Hours survey ({EEH_RELEASE.referencePeriod}) puts the lower
                quartile at {dollars(EEH_QUARTILES.fullTime.q1)} a week ({dollars(annualise(EEH_QUARTILES.fullTime.q1))}), the median at{" "}
                {dollars(EEH_QUARTILES.fullTime.median)} ({dollars(annualise(EEH_QUARTILES.fullTime.median))}) and the upper quartile at{" "}
                {dollars(EEH_QUARTILES.fullTime.q3)} ({dollars(annualise(EEH_QUARTILES.fullTime.q3))}). That survey measures total cash
                earnings including overtime, so its median is higher than the {dollars(EE_MEDIAN.fullTime)} above.
              </p>
            </section>

            <section id="faq">
              <h2 style={HEADING_FONT}>Average salary questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {AVERAGE_SALARY_FAQS.map((f, i) => (
                  <AccordionItem key={f.q} value={`faq-${i}`} className="rounded-lg border bg-white px-4">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="Data sources and methodology">
                <p>
                  Every salary on this page is an Australian Bureau of Statistics figure. The average is full-time adult average weekly
                  ordinary time earnings from Average Weekly Earnings, {AWE_RELEASE.referencePeriod} (seasonally adjusted for the national
                  headline; original series for states, industries and sectors). Medians, percentiles and the checker use Employee Earnings,{" "}
                  {EE_RELEASE.referencePeriod} — median weekly earnings in main job, and the Table 7 count of employees in $100-a-week bands.
                  Full-time quartiles come from Employee Earnings and Hours, {EEH_RELEASE.referencePeriod}. Weekly figures are shown exactly
                  as published; yearly figures are weekly × 52. Take-home pay uses our {SITE_CONFIG.financialYear} resident tax engine, the
                  same one behind the take-home pay pages.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={AVERAGE_SALARY_VERIFIED_ON} />
              {authorship && (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={AVERAGE_SALARY_VERIFIED_ISO} />
              )}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">On this page</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      ["#checker", "Is my salary above average?"],
                      ["#average-vs-median", "Average vs median"],
                      ["#after-tax", "Average salary after tax"],
                      ["#by-state", "By state"],
                      ["#by-industry", "By industry"],
                      ["#by-age", "By age"],
                      ["#by-gender", "By gender and sector"],
                      ["#distribution", "Percentiles"],
                      ["#faq", "Questions"],
                    ].map(([href, label]) => (
                      <a key={href} href={href} className="block text-navy hover:text-eucalyptus-dark hover:underline">{label}</a>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">Pay by job</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/job-pay-rates/" label="Pay Rates by Occupation" />
                    <SidebarLink href="/public-service-pay-scales/" label="Public Service Pay Scales" />
                    <SidebarLink href="/teacher-pay-australia/" label="Teacher Pay" />
                    <SidebarLink href="/mining-fifo-pay-guide/" label="Mining & FIFO Pay" />
                    <SidebarLink href="/tech-salary-guide-australia/" label="Tech Salaries" />
                    <SidebarLink href="/minimum-wage-australia/" label="Minimum Wage" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold">Calculate your take-home pay</h3>
                  <p className="mb-4 text-sm text-eucalyptus-light">Enter your salary to see your pay after tax, Medicare and super.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50">
                    Take-Home Pay Calculator <ArrowRight className="ml-1 inline h-4 w-4" />
                  </Link>
                  <Link href="/pay-rise-calculator/" className="mt-3 block text-center text-sm text-eucalyptus-light underline hover:text-white">
                    Pay rise calculator
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

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 transition-all hover:border-eucalyptus/40 hover:shadow-sm">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}
