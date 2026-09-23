// /public-holiday-pay/ — the hub of the G4 public holiday pay cluster.
// Core: what you are paid on a public holiday (worked or not) and the
// calculator. Supporting: the date lists, one page per state.

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import {
  PH_VERIFIED_ON,
  PUBLIC_HOLIDAY_AWARD_RATES,
  STATE_PUBLIC_HOLIDAYS,
  getAwardPublicHolidayRate,
  partDays,
  pctLabel,
  publicHolidayPay,
  publicHolidayRateRange,
  statePath,
  statewideDays,
  yearOf,
} from "@/lib/data/public-holidays";
import { PH_HUB_TITLE, PH_NES_SOURCES, hubFaqs } from "@/lib/data/public-holidays/hub";
import { AWARD_DIRECTORY } from "@/lib/constants/award-directory";
import PublicHolidayPayCalculator from "@/modules/calculator/public-holiday-pay-calculator";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink, TableShell } from "./job-pay-shared";
import { AwardPublicHolidayTable } from "./public-holiday-shared";

export default function PublicHolidayHub() {
  const range = publicHolidayRateRange();
  const retail = getAwardPublicHolidayRate("retail")!;
  const retailL1 = AWARD_DIRECTORY.find((a) => a.href === retail.href)!;
  const example = publicHolidayPay({
    baseHourly: retailL1.headlineHourly,
    hours: 8,
    employment: "permanent",
    permanentMultiple: retail.permanent,
    casualMultiple: retail.casual,
  });
  const exampleCasual = publicHolidayPay({
    baseHourly: retailL1.headlineHourly,
    hours: 8,
    employment: "casual",
    permanentMultiple: retail.permanent,
    casualMultiple: retail.casual,
  });
  const authorship = getGuideAuthorship("public-holiday-pay");
  const faqs = hubFaqs();

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs trail={[{ href: "/", label: "Pay Calculator" }, { label: "Public Holiday Pay" }]} />

        <header className="mb-10 max-w-4xl lg:mb-14">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {PH_HUB_TITLE}
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">
            Work a public holiday and your award pays <strong className="text-navy">{pctLabel(range.permanentMin)} to {pctLabel(range.permanentMax)}</strong> of
            your base rate for every hour ({pctLabel(range.casualMin)} to {pctLabel(range.casualMax)} for casuals). Stay home on a day you
            would normally work and you are still paid your base rate. Here is what that comes to for your shift, and which days count in
            your state.
          </p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> A permanent retail worker on the Level 1 rate of {formatAUD(retailL1.headlineHourly, 2)} an
              hour earns {formatAUD(example.holidayPay, 2)} for an 8-hour public holiday shift at {pctLabel(retail.permanent)}, against{" "}
              {formatAUD(example.ordinaryPay, 2)} on a weekday. A casual earns {formatAUD(exampleCasual.holidayPay, 2)} at{" "}
              {pctLabel(retail.casual)}. If the permanent worker has the day off instead, they are paid{" "}
              {formatAUD(example.dayOffPay, 2)} for not working.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="calculator" className="not-prose mb-12">
              <PublicHolidayPayCalculator />
            </section>

            <section id="award-rates">
              <h2 style={HEADING_FONT}>Public holiday penalty rates by award</h2>
              <p>
                The public holiday rate for hours worked, as a percentage of the award&rsquo;s minimum hourly rate, under the{" "}
                {PUBLIC_HOLIDAY_AWARD_RATES.length} awards this site publishes full rate tables for. Figures are read from each award&rsquo;s
                penalty table (rates from the first full pay period on or after 1 July 2026). Casual figures include the 25% casual
                loading.
              </p>
              <AwardPublicHolidayTable />
              <p>
                Most awards simply add the 25% casual loading to the permanent public holiday rate. Two do not: the Manufacturing and
                Nurses awards express the casual rate as a percentage of the <em>casual</em> hourly rate, so it compounds, and the Hair and
                Beauty Award pays casuals the same {pctLabel(getAwardPublicHolidayRate("hair-and-beauty")!.casual)} as everyone else. If
                you&rsquo;re on an enterprise agreement, its rate replaces the award&rsquo;s. Pick &ldquo;Enterprise agreement&rdquo; in the
                calculator and enter it.
              </p>
            </section>

            <section id="not-working">
              <h2 style={HEADING_FONT}>Paid for a public holiday you don&rsquo;t work</h2>
              <p>
                Every employee has the right to be absent from work on a public holiday (Fair Work Act s 114). If you are full-time or
                part-time and the holiday falls on a day you would normally work, you are paid your <strong>base pay rate</strong> for
                the ordinary hours you would have worked (s 116).
              </p>
              <ul>
                <li>
                  The base rate excludes penalty rates, loadings, allowances, bonuses, incentive payments and overtime. Overtime you
                  usually work that day is not paid.
                </li>
                <li>Your employer can&rsquo;t change your roster to avoid paying for the public holiday.</li>
                <li>
                  A part-timer who doesn&rsquo;t normally work that weekday gets nothing for it. The Fair Work Ombudsman&rsquo;s example
                  is a Monday-to-Wednesday employee who is not paid for a Friday Boxing Day.
                </li>
                <li>Casuals are not paid for a public holiday they don&rsquo;t work.</li>
              </ul>
            </section>

            <section id="asked-to-work">
              <h2 style={HEADING_FONT}>Being asked to work a public holiday</h2>
              <p>
                Your employer can ask you to work a public holiday, but the request must be reasonable. You can refuse if the request
                is unreasonable or you have reasonable grounds. Whether a request or a refusal is reasonable depends on:
              </p>
              <ul>
                <li>the nature of the workplace, and your role and the type of work you do</li>
                <li>your personal circumstances, including caring responsibilities</li>
                <li>whether you are full-time, part-time or casual</li>
                <li>whether you could reasonably expect to be asked to work public holidays</li>
                <li>any overtime, penalty rates or other payment you&rsquo;d receive</li>
                <li>how much notice you were given, and any other relevant factor.</li>
              </ul>
              <p>
                If the request is reasonable and you refuse unreasonably, you can be required to work. Once you do work, the award or
                agreement rate in the table above applies to every hour, and many awards set a minimum paid shift (for example 4 hours
                under the Clerks Award).
              </p>
            </section>

            <section id="leave">
              <h2 style={HEADING_FONT}>Public holidays during annual leave, sick leave and long service leave</h2>
              <p>
                A public holiday that falls on one of your normal working days while you are on paid annual leave or sick leave is paid
                as a public holiday and is <strong>not</strong> deducted from your leave balance. Ten days of annual leave that include
                a Monday public holiday use nine days of leave. Public holidays during unpaid leave, such as unpaid parental leave, are
                not paid. Long service leave is set by each state&rsquo;s law, so whether a public holiday extends it depends on where
                you work. See the{" "}
                <Link href="/long-service-leave-calculator/">long service leave calculator</Link> for your state&rsquo;s rules, and the{" "}
                <Link href="/annual-leave-guide/">annual leave guide</Link> for the rest.
              </p>
            </section>

            <section id="substitute-days">
              <h2 style={HEADING_FONT}>Substitute days and additional days</h2>
              <p>
                Two different things get called a substitute day. The first is set by the state: when Christmas Day, Boxing Day or New
                Year&rsquo;s Day lands on a weekend, most states declare an <em>additional</em> weekday public holiday. That day is a
                real public holiday for pay, and in most states the weekend day stays a public holiday too. Each state page below
                lists them.
              </p>
              <p>
                The second is agreed at work. An award or enterprise agreement can let you and your employer agree to swap a public
                holiday for another day. Award and agreement-free employees can agree to a swap directly with their employer (Fair Work
                Act s 115). The substitute day is then paid as the public holiday and the original day is an ordinary day. Some awards
                also offer a trade instead of the full rate. The Restaurant Award lets a permanent employee take 125% plus a day
                added to annual leave or a day off within 28 days, and the Aged Care Award lets employees elect to have the hours added
                to annual leave.
              </p>
            </section>

            <section id="part-day">
              <h2 style={HEADING_FONT}>Part-day public holidays</h2>
              <p>
                Queensland makes Christmas Eve a public holiday from 6pm to midnight. South Australia and the Northern Territory do the
                same for Christmas Eve and New Year&rsquo;s Eve from 7pm. Only the hours inside that window are paid at the public
                holiday rate, so an evening shift can change rate halfway through. Enter just the hours after the start time in the
                calculator, and work out the rest at your usual rate.
              </p>
            </section>

            <section id="by-state">
              <h2 style={HEADING_FONT}>Public holiday dates by state, 2026 and 2027</h2>
              <p>
                The public holiday rate only applies on a day that is a public holiday where your job is based, not where you happen
                to be working. A Melbourne-based employee sent to Sydney is still paid for Melbourne Cup Day. Each state page lists
                every 2026 and 2027 date from that state government&rsquo;s own page, plus regional and part-day holidays and the
                state&rsquo;s own pay rules.
              </p>
              <TableShell caption="Public holidays by state in 2026" minWidth="30rem">
                <thead className="bg-sandstone font-semibold text-navy">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      State or territory
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Whole-day holidays 2026
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Part-day holidays
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10 bg-white">
                  {STATE_PUBLIC_HOLIDAYS.map((s) => {
                    const y = yearOf(s, 2026)!;
                    const parts = partDays(y);
                    return (
                      <tr key={s.slug}>
                        <th scope="row" className="px-4 py-3 text-left font-medium">
                          <Link href={statePath(s.slug)} className="text-eucalyptus-dark hover:underline">
                            {s.code} public holidays
                          </Link>
                        </th>
                        <td className="px-4 py-3 text-navy">{statewideDays(y).length}</td>
                        <td className="px-4 py-3 text-navy">
                          {parts.length ? parts.map((p) => `${p.name} (${p.hours})`).join(", ") : "None"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </TableShell>
              <p className="text-sm">
                Whole-day counts include additional days for holidays that fall on a weekend. They leave out holidays that apply in
                only part of the state, such as show days.
              </p>
            </section>

            <section id="check-payslip">
              <h2 style={HEADING_FONT}>Checking the public holiday on your payslip</h2>
              <ol>
                <li>
                  Find the pay period that covers the holiday. Hours you worked on the holiday usually appear on their own line, marked public holiday or
                  paid at 2.25 or 2.5 times your ordinary rate, rather than inside ordinary hours.
                </li>
                <li>
                  Multiply those hours by your base rate and the percentage for your award above, or use the calculator. Casuals should
                  see one public holiday rate with the loading already in it, not the loading on top.
                </li>
                <li>
                  If you had the day off and it was a normal working day, check you were paid your ordinary hours for it and that it
                  wasn&rsquo;t taken out of your annual leave.
                </li>
                <li>
                  If the numbers don&rsquo;t match, raise it with payroll first. The{" "}
                  <Link href="/backpay-calculator/">back pay calculator</Link> totals what you&rsquo;re owed, and the{" "}
                  <Link href="/understanding-your-payslip/">payslip guide</Link> explains every other line.
                </li>
              </ol>
              <p>
                Public holiday pay is ordinary income for tax. It is taxed through PAYG with the rest of your pay. See your net figure
                in the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>, or the{" "}
                <Link href="/overtime-pay-calculator/">overtime pay calculator</Link> if you work past your ordinary hours on the day.
              </p>
            </section>

            <section id="faq">
              <h2 style={HEADING_FONT}>Public holiday pay questions</h2>
              <FaqList faqs={faqs} />
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page is sourced">
                <p>
                  Public holiday percentages are read from the site&rsquo;s award constants, which were transcribed from the Fair Work
                  Commission&rsquo;s consolidated award texts and apply from the first full pay period on or after 1 July 2026. Where an
                  award prints the casual rate as a percentage of the casual hourly rate, it is converted to a percentage of the base
                  rate so all 14 awards compare on one scale. The rights and pay for not working come from the Fair Work
                  Ombudsman&rsquo;s public holiday pages and the Fair Work Act 2009 ss 114–116.
                </p>
                <p>
                  Every date on the state pages was read from that state or territory government&rsquo;s own public holidays page on{" "}
                  {PH_VERIFIED_ON}. Each date is stored with the text the government prints, and automated tests check the day, month
                  and weekday against it. Dates a government has not yet published are marked as not yet published rather than
                  estimated.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={[...PH_NES_SOURCES]} lastVerified={PH_VERIFIED_ON} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">Public holiday dates by state</h3>
                  <div className="space-y-3">
                    {STATE_PUBLIC_HOLIDAYS.map((s) => (
                      <SidebarLink key={s.slug} href={statePath(s.slug)} label={`${s.code} public holidays 2026 & 2027`} />
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">Related</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/overtime-penalty-rates-guide/" label="Penalty Rates Guide" />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime Pay Calculator" />
                    <SidebarLink href="/casual-loading-calculator/" label="Casual Loading Calculator" />
                    <SidebarLink href="/award-rates/" label="Award Rates" />
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
