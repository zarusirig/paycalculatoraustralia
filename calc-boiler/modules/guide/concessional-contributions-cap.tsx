import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, SUPER_GUARANTEE, calculatePayBreakdown, formatAUD, formatPercent } from "@/lib/constants";
import {
  CARRY_FORWARD,
  CONCESSIONAL_CAP_BY_YEAR,
  CONTRIBUTIONS_TAX_RATE,
  DIVISION_293,
  ECC_MAX_RELEASE,
  annualSuperGuarantee,
  carryForwardWindow,
} from "@/lib/constants/super-contributions";
import ConcessionalCapCalculator from "@/modules/calculator/concessional-cap-calculator";
import { CONCESSIONAL_CAP_FAQS } from "@/modules/guide/concessional-contributions-cap-faqs";

const ATO_CAP =
  "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/concessional-contributions-cap";
const ATO_CAPS_TABLE = "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/contributions-caps";
const ATO_SACRIFICE =
  "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/salary-sacrificing-super";
const ATO_DIV293 =
  "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/division-293-tax-on-concessional-contributions-by-high-income-earners";
const ATO_SG = "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee";

const SOURCES_LIST: SourceLink[] = [
  { title: "Concessional contributions cap (QC19749)", url: ATO_CAP, publisher: SOURCES.ato.name },
  { title: "Key superannuation rates and thresholds – contributions caps", url: ATO_CAPS_TABLE, publisher: SOURCES.ato.name },
  { title: "Salary sacrificing super (QC23227)", url: ATO_SACRIFICE, publisher: SOURCES.ato.name },
  { title: "Division 293 tax on concessional contributions by high-income earners", url: ATO_DIV293, publisher: SOURCES.ato.name },
  { title: "Key superannuation rates and thresholds – super guarantee", url: ATO_SG, publisher: SOURCES.ato.name },
];

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const FY = SITE_CONFIG.financialYear;
const PREV_FY = SITE_CONFIG.previousFinancialYear;
const CAP = SUPER_GUARANTEE.concessionalCap;
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
const WINDOW = carryForwardWindow();
const WINDOW_TOTAL = WINDOW.reduce((a, x) => a + x.cap, 0);
const HISTORY = Object.entries(CONCESSIONAL_CAP_BY_YEAR).reverse();
const ROOM_SALARIES = [60_000, 80_000, 100_000, 120_000, 150_000, 200_000, SUPER_GUARANTEE.maxContributionBaseAnnual];
const SACRIFICE_SALARIES = [60_000, 90_000, 120_000, 180_000];
const SACRIFICE = 5_000;

const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} style={FONT}>{children}</h2>;

function sacrificeRow(salary: number) {
  const a = calculatePayBreakdown({ grossSalary: salary });
  const b = calculatePayBreakdown({ grossSalary: salary, salarySacrifice: SACRIFICE });
  const takeHomeDrop = a.takeHomePay - b.takeHomePay;
  const toSuper = SACRIFICE * (1 - CONTRIBUTIONS_TAX_RATE);
  return { taxSaved: a.totalDeductions - b.totalDeductions, takeHomeDrop, toSuper, gain: toSuper - takeHomeDrop };
}

export default function ConcessionalContributionsCapPage() {
  const authorship = getGuideAuthorship("concessional-contributions-cap");
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><Link href="/superannuation-guide/" className="hover:text-eucalyptus-dark hover:underline">Superannuation</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Concessional Contributions Cap</span></li></ol></nav>

      <header className="mb-10 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={FONT}>Concessional Contributions Cap {FY}: {formatAUD(CAP)}</h1>
        <p className="text-xl text-warmgray leading-relaxed mb-6">
          The concessional (before-tax) contributions cap is <strong>{formatAUD(CAP)}</strong> from 1 July 2026, up from {formatAUD(CONCESSIONAL_CAP_BY_YEAR[PREV_FY])}. It covers your employer&rsquo;s {SG} super guarantee, salary sacrifice and personal contributions you claim a deduction for, all taxed at {formatPercent(CONTRIBUTIONS_TAX_RATE, 0)} in your fund. With a total super balance under {formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)}, unused cap from the last five years can be carried forward.
        </p>
        <TrustBar className="!max-w-none" />
      </header>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 not-prose">
        {[
          { k: `Cap ${FY}`, v: formatAUD(CAP), s: `${formatAUD(CONCESSIONAL_CAP_BY_YEAR[PREV_FY])} in ${PREV_FY}` },
          { k: "Contributions tax", v: formatPercent(CONTRIBUTIONS_TAX_RATE, 0), s: `+${formatPercent(DIVISION_293.rate, 0)} Division 293 above ${formatAUD(DIVISION_293.threshold)}` },
          { k: "Carry-forward", v: `${CARRY_FORWARD.years} years`, s: `Total super balance under ${formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)}` },
          { k: "Super guarantee", v: SG, s: "Counts towards the cap first" },
        ].map((c) => (
          <div key={c.k} className="rounded-xl border border-sandstone-dark/20 bg-sandstone/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-warmgray">{c.k}</p>
            <p className="text-2xl font-extrabold text-navy tabular-nums" style={FONT}>{c.v}</p>
            <p className="text-xs text-warmgray-light">{c.s}</p>
          </div>
        ))}
      </div>

      <div className="mb-12"><ConcessionalCapCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          <section>
            <H2 id="what-counts">What Counts Towards the Concessional Cap</H2>
            <p>Concessional contributions are the ones made from before-tax money. Everything below is added together across all your super funds:</p>
            <ul>
              <li><strong>Employer super guarantee</strong> at {SG}, from every employer you have. See the <Link href="/super-guarantee-rate-history/">super guarantee rate</Link>.</li>
              <li><strong>Salary sacrifice</strong> contributions.</li>
              <li><strong>Personal contributions you claim a tax deduction for.</strong></li>
              <li><strong>Other employer contributions</strong>, including any super above the {SG} minimum and fund costs your employer pays for you, such as administration fees and insurance premiums.</li>
            </ul>
            <p>Contributions count in the year your fund <em>receives</em> them, not the year they were earned. That matters around 30 June: a sacrifice from your last June pay that reaches the fund in July counts in the next year.</p>
          </section>

          <section>
            <H2 id="history">Concessional Cap by Year</H2>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-4 py-3">Income year</th><th className="px-4 py-3 text-right">Concessional cap</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {HISTORY.map(([year, cap], i) => (
                <tr key={year} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}><td className="px-4 py-3 font-medium text-navy">{year}{year === FY ? " (current)" : ""}</td><td className="px-4 py-3 text-right tabular-nums">{formatAUD(cap)}</td></tr>
              ))}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">ATO, <a href={ATO_CAPS_TABLE} target="_blank" rel="noopener noreferrer" className="hover:underline">contributions caps</a>. The cap is indexed to average weekly ordinary time earnings in $2,500 steps.</p></div>
          </section>

          <section>
            <H2 id="room">How Much Room Your Employer&rsquo;s Super Leaves</H2>
            <p>The super guarantee uses up part of the cap before you contribute anything. What&rsquo;s left is the most you can salary sacrifice or claim as a deduction without going over (before any carry-forward).</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-4 py-3">Salary</th><th className="px-4 py-3 text-right">Employer SG ({SG})</th><th className="px-4 py-3 text-right">Room under {formatAUD(CAP)}</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {ROOM_SALARIES.map((sal, i) => {
                const sg = annualSuperGuarantee(sal);
                return (
                  <tr key={sal} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}><td className="px-4 py-3 font-medium text-navy tabular-nums">{formatAUD(sal)}{sal === SUPER_GUARANTEE.maxContributionBaseAnnual ? " (max. base)" : ""}</td><td className="px-4 py-3 text-right tabular-nums">{formatAUD(sg, sg % 1 ? 2 : 0)}</td><td className="px-4 py-3 text-right font-medium text-navy tabular-nums">{formatAUD(Math.max(0, CAP - sg), (CAP - sg) % 1 ? 2 : 0)}</td></tr>
                );
              })}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">One employer, SG on the full salary. From 1 July 2026 the maximum contribution base is an annual {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}, set so that {SG} of it sits just under the cap; employers don&rsquo;t have to pay SG on earnings above it.</p></div>
            <p>Two or more employers can push SG alone over the cap. If that&rsquo;s likely, the ATO lets you apply to opt out of SG from one or more of them.</p>
          </section>

          <section>
            <H2 id="carry-forward">Carry-Forward: Using Unused Cap From Past Years</H2>
            <p>If you contributed less than the cap in earlier years, you may be able to use the difference now. You need both:</p>
            <ul>
              <li>a <strong>total super balance under {formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)}</strong> at 30 June of the previous year (30 June 2026 for {FY}), and</li>
              <li><strong>unused cap amounts from up to {CARRY_FORWARD.years} previous years</strong>, counting from {CARRY_FORWARD.firstYear}.</li>
            </ul>
            <p>For {FY} the window is {WINDOW[0].year} to {WINDOW[WINDOW.length - 1].year}. Unused {previousOf(WINDOW[0].year)} amounts expired on 30 June 2026. The oldest amounts are used first, and you don&rsquo;t need to apply: the ATO applies them automatically once you go over the general cap. Your available amounts are in ATO online services under Super, Information, Carry forward concessional contributions.</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-4 py-3">Unused cap from</th><th className="px-4 py-3 text-right">General cap that year</th><th className="px-4 py-3">Expires unused after</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {WINDOW.map((w, i) => (
                <tr key={w.year} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}><td className="px-4 py-3 font-medium text-navy">{w.year}</td><td className="px-4 py-3 text-right tabular-nums">{formatAUD(w.cap)}</td><td className="px-4 py-3">{expiryYear(w.year)}</td></tr>
              ))}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">Someone who contributed nothing in those five years could in theory add {formatAUD(WINDOW_TOTAL)} of carry-forward to the {formatAUD(CAP)} cap. In practice you carry forward only what you didn&rsquo;t use each year.</p></div>
            <p>Carry-forward is useful in a year with a bonus, a capital gain or a return to work, when a large deductible contribution can cut tax at a high marginal rate. Contributions made using carried-forward amounts still count for <Link href="/division-293-tax/">Division 293</Link>.</p>
          </section>

          <section>
            <H2 id="salary-sacrifice">Salary Sacrifice Super, Within the Cap</H2>
            <p>Salary sacrifice sends part of your pre-tax pay to super instead of your bank account. You pay no income tax or Medicare levy on it, and the fund pays {formatPercent(CONTRIBUTIONS_TAX_RATE, 0)} instead. Your employer must still pay the full {SG} super guarantee as if you hadn&rsquo;t sacrificed; the sacrifice can&rsquo;t count towards it.</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-4 py-3">Salary</th><th className="px-4 py-3 text-right">Tax saved</th><th className="px-4 py-3 text-right">Take-home falls by</th><th className="px-4 py-3 text-right">Into super after 15%</th><th className="px-4 py-3 text-right">Net gain</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {SACRIFICE_SALARIES.map((sal, i) => {
                const r = sacrificeRow(sal);
                return (
                  <tr key={sal} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}><td className="px-4 py-3 font-medium text-navy tabular-nums">{formatAUD(sal)}</td><td className="px-4 py-3 text-right tabular-nums">{formatAUD(r.taxSaved)}</td><td className="px-4 py-3 text-right tabular-nums">{formatAUD(r.takeHomeDrop)}</td><td className="px-4 py-3 text-right tabular-nums">{formatAUD(r.toSuper)}</td><td className="px-4 py-3 text-right font-medium text-navy tabular-nums">{formatAUD(r.gain)}</td></tr>
                );
              })}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">Sacrificing {formatAUD(SACRIFICE)} a year, {FY} resident rates, no study loan. Net gain = extra super after contributions tax minus the fall in take-home pay. The money is preserved in super until you meet a condition of release.</p></div>
            <p>The saving grows with your marginal rate. Salary sacrifice still counts in some income tests: it&rsquo;s a reportable super contribution, so it&rsquo;s added back for the <Link href="/medicare-levy-surcharge-calculator/">Medicare levy surcharge</Link> and Division 293. Model your own pay with the <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link>.</p>
          </section>

          <section>
            <H2 id="tax">Tax on Super Contributions</H2>
            <ul>
              <li><strong>{formatPercent(CONTRIBUTIONS_TAX_RATE, 0)} contributions tax</strong> on concessional contributions, deducted by your fund.</li>
              <li><strong>Division 293: another {formatPercent(DIVISION_293.rate, 0)}</strong> if your income plus concessional contributions is over {formatAUD(DIVISION_293.threshold)}. It applies to the lesser of your concessional contributions and the amount over {formatAUD(DIVISION_293.threshold)}. See <Link href="/division-293-tax/">Division 293 tax</Link>.</li>
              <li><strong>Over the cap:</strong> the excess is added to your assessable income and taxed at your marginal rate, less a 15% offset for the tax the fund already paid. The old excess contributions charge stopped from 1 July 2021. You can release up to {formatPercent(ECC_MAX_RELEASE, 0)} of the excess from your fund to pay the bill; any you leave in counts towards the {formatAUD(SUPER_GUARANTEE.nonConcessionalCap)} non-concessional cap.</li>
            </ul>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link>: sacrifice per pay and what it does to take-home</li>
              <li><Link href="/superannuation-calculator/">Super Calculator</Link>: what your employer pays at {SG}</li>
              <li><Link href="/super-guarantee-rate-history/">Super Guarantee Rate</Link>: {SG} from 1 July 2025, and every rate since 1992</li>
              <li><Link href="/division-293-tax/">Division 293 Tax</Link>: the extra 15% above {formatAUD(DIVISION_293.threshold)}</li>
              <li><Link href="/superannuation-guide/">Superannuation Guide</Link>: how super works</li>
            </ul>
          </section>

          <section>
            <H2>Frequently Asked Questions</H2>
            <div className="sr-only">
              <h3>Concessional contributions cap questions and answers</h3>
              {CONCESSIONAL_CAP_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
            </div>
            <Accordion type="multiple" className="not-prose mt-6 space-y-3">
              {CONCESSIONAL_CAP_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <div className="mt-12 not-prose">
            <MethodologyDisclosure title="How this calculator works">
              <p>Employer super guarantee is {SG} of salary up to the annual maximum contribution base. Total concessional contributions are SG plus salary sacrifice, deductible personal contributions and other employer contributions, compared with the {FY} general cap plus any carry-forward you enter (counted only if your total super balance is under {formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)}). Tax saved comes from the same engine as our take-home pay and salary sacrifice calculators. The Division 293 figure uses taxable income and concessional contributions only; the ATO&rsquo;s test also adds fringe benefits and investment losses.</p>
              <p>General information, not financial advice. Check your contributions and carry-forward in ATO online services before making a large contribution.</p>
            </MethodologyDisclosure>
            <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
            {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
          </div>
        </article>

        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" /><SidebarLink href="/super-guarantee-rate-history/" label="Super Guarantee Rate" /><SidebarLink href="/division-293-tax/" label="Division 293 Tax" /><SidebarLink href="/superannuation-calculator/" label="Super Calculator" /><SidebarLink href="/superannuation-guide/" label="Superannuation Guide" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}

/** "2021-22" -> "2020-21". */
function previousOf(fy: string): string {
  const start = Number(fy.slice(0, 4)) - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

/** An unused amount from `fy` is last usable five years later. */
function expiryYear(fy: string): string {
  const start = Number(fy.slice(0, 4)) + CARRY_FORWARD.years;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
