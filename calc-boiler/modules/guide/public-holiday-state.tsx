// /public-holiday-pay/{state}/ — one page per state or territory (G4).
// The date tables are the supporting context; the pay rules, the prefilled
// calculator and the payslip links are the core.

import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import {
  PH_HUB_PATH,
  STATE_PUBLIC_HOLIDAYS,
  formatHolidayDate,
  getAwardPublicHolidayRate,
  partDays,
  pctLabel,
  publicHolidayRateRange,
  stateFaqs,
  stateHeading,
  statePath,
  statewideDays,
  yearOf,
  type StatePublicHolidays,
} from "@/lib/data/public-holidays";
import { PH_NES_SOURCES } from "@/lib/data/public-holidays/hub";
import PublicHolidayPayCalculator from "@/modules/calculator/public-holiday-pay-calculator";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink } from "./job-pay-shared";
import { AwardPublicHolidayTable, HolidayYearTable, RegionalTable } from "./public-holiday-shared";

export default function PublicHolidayStatePage({ state: s }: { state: StatePublicHolidays }) {
  const y26 = yearOf(s, 2026)!;
  const y27 = yearOf(s, 2027)!;
  const range = publicHolidayRateRange();
  const preset = s.calculatorPreset;
  const presetAward = getAwardPublicHolidayRate(preset.awardKey)!;
  const parts = [...partDays(y26), ...partDays(y27)];
  const partHours = Array.from(new Set(parts.map((p) => p.hours)));
  const regionalInList = [...y26.holidays, ...y27.holidays].filter((h) => h.kind === "regional");
  const authorship = getGuideAuthorship("public-holiday-pay");
  const faqs = stateFaqs(s);
  const others = STATE_PUBLIC_HOLIDAYS.filter((o) => o.slug !== s.slug);
  const lsl = `/long-service-leave-calculator/${s.slug}/`;
  const payCalc = `/pay-calculator-${s.slug}/`;
  const firstExtra = statewideDays(y26).find((h) => h.kind === "additional");

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          trail={[
            { href: "/", label: "Pay Calculator" },
            { href: PH_HUB_PATH, label: "Public Holiday Pay" },
            { label: `${s.code} Public Holidays` },
          ]}
        />

        <header className="mb-10 max-w-4xl lg:mb-14">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {stateHeading(s)}
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">{s.standfirst}</p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> {s.code} has {statewideDays(y26).length} whole-day public holidays in 2026 and{" "}
              {statewideDays(y27).length} in 2027
              {parts.length ? `, plus part-day holidays from ${partHours.join(" / ")}` : ""}. Work one and your award pays{" "}
              {pctLabel(range.permanentMin)} to {pctLabel(range.permanentMax)} of your base rate ({pctLabel(range.casualMin)} to{" "}
              {pctLabel(range.casualMax)} for casuals). Full-time and part-time staff who have the day off are still paid their base
              rate if it falls on a day they normally work.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <nav aria-label="On this page" className="not-prose mb-8 flex flex-wrap gap-2 text-sm">
              {[
                ["#dates-2026", "2026 dates"],
                ["#dates-2027", "2027 dates"],
                ...(s.regional.length ? [["#regional", "Regional holidays"]] : []),
                ["#pay", "Pay rates"],
                ["#calculator", "Calculator"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="rounded-full border border-sandstone-dark/30 px-3 py-1 text-navy hover:border-eucalyptus hover:text-eucalyptus-dark">
                  {label}
                </a>
              ))}
            </nav>

            <section id="dates-2026">
              <h2 style={HEADING_FONT}>{s.code} public holidays 2026</h2>
              <p>
                Every public holiday {s.inName} for 2026, as published by the {s.sources[0].publisher}.
                {firstExtra ? ` Additional days such as ${firstExtra.name} on ${formatHolidayDate(firstExtra.date)} are public holidays for pay too.` : ""}
              </p>
              <HolidayYearTable year={y26} code={s.code} />
            </section>

            <section id="dates-2027">
              <h2 style={HEADING_FONT}>{s.code} public holidays 2027</h2>
              <HolidayYearTable year={y27} code={s.code} />
            </section>

            {s.regional.length ? (
              <section id="regional">
                {s.regional.map((t) => (
                  <div key={t.id}>
                    <h2 style={HEADING_FONT}>{t.title}</h2>
                    <p>{t.intro}</p>
                    <RegionalTable table={t} />
                  </div>
                ))}
              </section>
            ) : null}

            <section id="pay">
              <h2 style={HEADING_FONT}>What you&rsquo;re paid on a {s.code} public holiday</h2>
              <p>
                The state decides which days are public holidays. Your award or enterprise agreement decides the rate. If you work
                the day, every hour is paid at the public holiday rate below. If you don&rsquo;t work it and it falls on a day you
                normally work, a full-time or part-time employee is paid their base rate for their ordinary hours. Casuals are paid
                only for hours they work.
              </p>
              <AwardPublicHolidayTable />
              <p>
                You can refuse a request to work a public holiday if the request is unreasonable or you have reasonable grounds. The{" "}
                <Link href={PH_HUB_PATH}>public holiday pay guide</Link> covers refusals, leave and substitute days in full.
              </p>
              {regionalInList.length ? (
                <p>
                  Holidays marked &ldquo;Part of state&rdquo; are public holidays only where your job is based in that area. Elsewhere
                  in {s.code} they are ordinary working days.
                </p>
              ) : null}
            </section>

            <section id="calculator" className="not-prose my-12">
              <PublicHolidayPayCalculator
                holidayName={preset.holidayName}
                stateCode={s.code}
                awardKey={preset.awardKey}
                employment={preset.employment}
                hours={preset.hours}
                partDayNote={
                  parts.length
                    ? `For ${Array.from(new Set(parts.map((p) => p.name))).join(" and ")}, enter only the hours worked from ${partHours.join(" / ")}; earlier hours are ordinary hours.`
                    : undefined
                }
              />
              <p className="mt-3 text-sm text-warmgray">
                Prefilled for a {preset.employment === "casual" ? "casual" : "permanent"} employee under the {presetAward.shortName}.
                Change the award, rate and hours to match your payslip.
              </p>
            </section>

            {s.specifics.map((sec) => (
              <section key={sec.id} id={sec.id}>
                <h2 style={HEADING_FONT}>{sec.heading}</h2>
                {sec.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </section>
            ))}

            <section id="your-pay">
              <h2 style={HEADING_FONT}>Your {s.code} pay, leave and payslip</h2>
              <p>
                Public holiday pay is taxed as ordinary income with the rest of your pay. To see what a pay period with a public holiday
                shift leaves you after tax, use the <Link href={payCalc}>{s.code} pay calculator</Link>. Long service leave is set by{" "}
                {s.code} law, not the National Employment Standards; the{" "}
                <Link href={lsl}>{s.code} long service leave calculator</Link> works out your entitlement. To check the public holiday line on your payslip, the{" "}
                <Link href="/understanding-your-payslip/">payslip guide</Link> explains each line, and the{" "}
                <Link href="/backpay-calculator/">back pay calculator</Link> totals an underpayment.
              </p>
              <div className="not-prose my-8 flex flex-wrap gap-3">
                <Link
                  href={payCalc}
                  className="inline-flex items-center gap-2 rounded-lg bg-eucalyptus-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-navy"
                >
                  <Calculator className="h-5 w-5" aria-hidden="true" />
                  {s.code} pay calculator
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={lsl}
                  className="inline-flex items-center gap-2 rounded-lg border border-eucalyptus-dark px-6 py-3 font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone"
                >
                  {s.code} long service leave
                </Link>
              </div>
            </section>

            <section id="faq">
              <h2 style={HEADING_FONT}>{s.code} public holiday pay questions</h2>
              <FaqList faqs={faqs} />
            </section>

            <section id="other-states">
              <h2 style={HEADING_FONT}>Public holidays in other states</h2>
              <div className="not-prose mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {others.map((o) => (
                  <SidebarLink key={o.slug} href={statePath(o.slug)} label={`${o.code} public holidays 2026 & 2027`} />
                ))}
                <SidebarLink href={PH_HUB_PATH} label="Public holiday pay — all states" />
              </div>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page is sourced">
                <p>
                  Every date was read from the {s.sources[0].publisher}&rsquo;s own public holidays page on {s.verifiedOn}. Each date is
                  stored alongside the text the government prints, and automated tests check the day, month and weekday against it.
                  Where the government has not yet published a date, the page says so instead of estimating it.
                </p>
                <p>
                  Public holiday pay rates are read from the site&rsquo;s award constants (Fair Work Commission award texts, rates from
                  the first full pay period on or after 1 July 2026). Rights when not working come from the Fair Work Ombudsman and the
                  Fair Work Act 2009 ss 114–116.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={[...s.sources, ...PH_NES_SOURCES]} lastVerified={s.verifiedOn} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">{s.code} at a glance</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Whole-day holidays 2026</dt>
                      <dd className="font-semibold text-navy">{statewideDays(y26).length}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Whole-day holidays 2027</dt>
                      <dd className="font-semibold text-navy">{statewideDays(y27).length}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Part-day holidays</dt>
                      <dd className="text-right font-semibold text-navy">{parts.length ? partHours.join(" / ") : "None"}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Verified</dt>
                      <dd className="font-semibold text-navy">{s.verifiedOn}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">Related</h3>
                  <div className="space-y-3">
                    <SidebarLink href={payCalc} label={`${s.code} Pay Calculator`} />
                    <SidebarLink href={lsl} label={`${s.code} Long Service Leave`} />
                    <SidebarLink href={PH_HUB_PATH} label="Public Holiday Pay Guide" />
                    <SidebarLink href="/overtime-penalty-rates-guide/" label="Penalty Rates Guide" />
                    <SidebarLink href="/award-rates/" label="Award Rates" />
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
