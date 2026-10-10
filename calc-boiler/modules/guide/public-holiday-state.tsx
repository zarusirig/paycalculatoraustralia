// /public-holiday-pay/{state}/ — one page per state or territory (G4).
// The page carries what differs by state: the state's own dates for 2026 and
// 2027, its part-day and regional holidays, which weekend days are holidays
// there (and so what a weekend shift pays), and the state's own rules. The
// rules that are the same everywhere (every award's rate, pay for a day off,
// refusing a shift, substitute days by agreement) get one line and a link to
// the /public-holiday-pay/ hub.

import Link from "next/link";
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
import { ordinaryWeekendDays, weekendHolidayRows } from "@/lib/data/public-holidays/weekend";
import PublicHolidayPayCalculator from "@/modules/calculator/public-holiday-pay-calculator";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink } from "./job-pay-shared";
import { HolidayYearTable, RegionalTable, WeekendHolidayTable } from "./public-holiday-shared";
import FeaturedImage from "@/components/common/featured-image";

const listOf = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

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
  const weekendRows = weekendHolidayRows(s);
  const ordinaryWeekend = ordinaryWeekendDays(s);
  const inState = s.inName.charAt(0).toUpperCase() + s.inName.slice(1);

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
              {pctLabel(range.permanentMin)} to {pctLabel(range.permanentMax)} of your base rate: {pctLabel(presetAward.permanent)} under
              the {presetAward.shortName} ({pctLabel(presetAward.casual)} for casuals).
            </p>
          </div>
          <TrustBar className="!max-w-none" />
          <FeaturedImage lazy className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <nav aria-label="On this page" className="not-prose mb-8 flex flex-wrap gap-2 text-sm">
              {[
                ["#dates-2026", "2026 dates"],
                ["#dates-2027", "2027 dates"],
                ...(s.regional.length ? [["#regional", "Regional holidays"]] : []),
                ["#weekends", "Weekend holidays"],
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
                {regionalInList.length ? ` Rows marked "Part of state" apply only where your job is based in that area.` : ""}
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

            <section id="weekends">
              <h2 style={HEADING_FONT}>Weekend holidays {s.inName}: which shift gets the public holiday rate</h2>
              <p>
                Whether the weekend day stays a holiday {s.inName}, and which weekday is added, decides which shift gets the public
                holiday rate.
                {ordinaryWeekend.length
                  ? ` ${inState}, ${listOf(ordinaryWeekend.map((r) => formatHolidayDate(r.date)))} ${ordinaryWeekend.length > 1 ? "are ordinary weekend days" : "is an ordinary weekend day"} for pay.`
                  : ` ${inState}, every one of those weekend days is itself a public holiday.`}
              </p>
              <WeekendHolidayTable rows={weekendRows} code={s.code} />
            </section>

            <section id="pay">
              <p>
                Every award&rsquo;s rate, pay for a day off and refusing a shift: see the{" "}
                <Link href={`${PH_HUB_PATH}#award-rates`}>public holiday pay guide</Link>.
              </p>
            </section>

            <section id="calculator" className="not-prose my-12">
              <PublicHolidayPayCalculator
                holidayName={preset.holidayName}
                stateCode={s.code}
                awardKey={preset.awardKey}
                employment={preset.employment}
                hours={preset.hours}
                compactAwardLabels
                intro={`Prefilled for a ${preset.employment === "casual" ? "casual" : "permanent"} ${presetAward.shortName} employee working ${preset.hours} hours. Change the award, base rate and hours to match your payslip.`}
                partDayNote={
                  parts.length
                    ? `For ${Array.from(new Set(parts.map((p) => p.name))).join(" and ")}, enter only the hours worked from ${partHours.join(" / ")}; earlier hours are ordinary hours.`
                    : undefined
                }
              />
            </section>

            {s.specifics.map((sec) => (
              <section key={sec.id} id={sec.id}>
                <h2 style={HEADING_FONT}>{sec.heading}</h2>
                {sec.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </section>
            ))}

            <section id="faq">
              <h2 style={HEADING_FONT}>{s.code} public holiday pay questions</h2>
              <FaqList faqs={faqs} />
            </section>

            <nav id="other-states" aria-label="Public holidays in other states" className="not-prose my-8 text-sm text-warmgray">
              Other states:{" "}
              {others.map((o, i) => (
                <span key={o.slug}>
                  {i ? " · " : ""}
                  <Link href={statePath(o.slug)} className="text-eucalyptus-dark hover:underline">
                    {o.code}
                  </Link>
                </span>
              ))}
            </nav>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page is sourced">
                <p>
                  {s.code} dates are tested against the {s.sources[0].publisher} page as printed on {s.verifiedOn}.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={[...s.sources, PH_NES_SOURCES[0]]} lastVerified={s.verifiedOn} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">Related</h3>
                  <div className="space-y-3">
                    <SidebarLink href={payCalc} label={`${s.code} Pay Calculator`} />
                    <SidebarLink href={lsl} label={`${s.code} Long Service Leave`} />
                    <SidebarLink href={PH_HUB_PATH} label="Public Holiday Pay Guide" />
                    <SidebarLink href="/understanding-your-payslip/" label="Payslip Guide" />
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
