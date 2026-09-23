"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronRight, CalendarClock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SOURCES, formatAUD } from "@/lib/constants";
import {
  QUALIFYING_EARNINGS,
  SUPER_GUARANTEE,
  SUPER_GUARANTEE_CHARGE,
} from "@/lib/constants/australian-tax";
import {
  PAYDAY_SUPER_LAW,
  PAYDAY_SUPER_SOURCES,
  PAYS_PER_YEAR,
  SBSCH_CLOSURE,
  earliestSgDueDate,
  formatDateAU,
  parseIsoDate,
  perPaySuper,
  type PayFrequency,
} from "@/lib/constants/payday-super";
import { PAYDAY_SUPER_FAQS } from "@/modules/guide/payday-super-faqs";

const C = SUPER_GUARANTEE_CHARGE.current;
const L = SUPER_GUARANTEE_CHARGE.legacy;
const RATE = `${SUPER_GUARANTEE.rate * 100}%`;
const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

const SOURCES_LIST: SourceLink[] = [
  { title: "About Payday Super", url: PAYDAY_SUPER_SOURCES.about, publisher: SOURCES.ato.name },
  { title: "Payment deadlines for Payday Super", url: PAYDAY_SUPER_SOURCES.deadlines, publisher: SOURCES.ato.name },
  { title: "What payments are qualifying earnings", url: QUALIFYING_EARNINGS.sourceUrl, publisher: SOURCES.ato.name },
  { title: "Unpaid super from your employer", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/unpaid-super-from-your-employer", publisher: SOURCES.ato.name },
  { title: "Pay slips", url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips", publisher: SOURCES.fwo.name },
  { title: `${PAYDAY_SUPER_LAW.act} (${PAYDAY_SUPER_LAW.actNumber})`, url: PAYDAY_SUPER_SOURCES.act, publisher: "Federal Register of Legislation (ATO legal database copy)" },
  { title: PAYDAY_SUPER_LAW.regulations, url: PAYDAY_SUPER_SOURCES.regulations, publisher: "Federal Register of Legislation" },
];

const FREQUENCIES: { id: PayFrequency; label: string }[] = [
  { id: "weekly", label: "Weekly" },
  { id: "fortnightly", label: "Fortnightly" },
  { id: "monthly", label: "Monthly" },
];

// Today's date on the client, "" during prerender — avoids a hydration
// mismatch between the build date and the visitor's date.
const noopSubscribe = () => () => {};
function useTodayIso(): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      const now = new Date();
      return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
    },
    () => "",
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function PerPaySuperCalculator() {
  const [salary, setSalary] = useState(85_000);
  const [freq, setFreq] = useState<PayFrequency>("fortnightly");
  const [paydayInput, setPaydayInput] = useState<string | null>(null);
  const [firstContribution, setFirstContribution] = useState(false);
  const today = useTodayIso();
  const payday = paydayInput ?? today;

  const r = useMemo(() => perPaySuper(salary, freq), [salary, freq]);
  const paydayDate = parseIsoDate(payday);
  const due = paydayDate ? earliestSgDueDate(paydayDate, firstContribution) : null;
  const days = firstContribution ? C.businessDaysNewEmployee : C.businessDaysToPay;

  return (
    <Card className="shadow-md">
      <CardContent className="p-6 md:p-8">
        <h2 style={H} className="mb-6 text-xl font-semibold text-navy">Payday Super calculator: super on each pay</h2>
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label htmlFor="ps-salary" className="mb-1 block text-sm font-medium text-navy">Annual salary (qualifying earnings)</label>
              <div className="flex items-center">
                <span className="mr-2 text-warmgray-light">$</span>
                <input id="ps-salary" type="number" min={0} max={1_000_000} step={1000} value={salary}
                  onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 1_000_000))}
                  className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
              </div>
              <p className="mt-1 text-xs text-warmgray-light">Base pay before tax. Leave out overtime, which usually isn&rsquo;t qualifying earnings.</p>
            </div>
            <fieldset>
              <legend className="mb-1 block text-sm font-medium text-navy">Pay frequency</legend>
              <div className="grid grid-cols-3 gap-2">
                {FREQUENCIES.map((f) => (
                  <button key={f.id} type="button" onClick={() => setFreq(f.id)} aria-pressed={freq === f.id}
                    className={`rounded-md border px-3 py-2 text-sm font-medium ${freq === f.id ? "border-eucalyptus-dark bg-eucalyptus-dark text-white" : "border-sandstone-dark/30 bg-white text-navy hover:bg-sandstone"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="ps-payday" className="mb-1 block text-sm font-medium text-navy">Payday</label>
              <input id="ps-payday" type="date" min="2026-07-01" value={payday}
                onChange={(e) => setPaydayInput(e.target.value)}
                className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
            </div>
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input type="checkbox" checked={firstContribution} onChange={(e) => setFirstContribution(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
              <span className="text-navy">First contribution for a new employee or to a new fund ({C.businessDaysNewEmployee} business days)</span>
            </label>
          </form>

          <div className="space-y-4" aria-live="polite">
            <div className="rounded-xl border border-sandstone-dark/20 bg-eucalyptus-light/30 p-6 text-center">
              <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-eucalyptus-dark">Super each {freq === "weekly" ? "week" : freq === "fortnightly" ? "fortnight" : "month"}</div>
              <div className="text-4xl font-extrabold text-navy">{formatAUD(r.sgPerPay, 2)}</div>
              <div className="mt-2 text-sm text-warmgray">{RATE} of {formatAUD(r.qualifyingEarningsPerPay, 2)} qualifying earnings &times; {PAYS_PER_YEAR[freq]} pays = {formatAUD(r.sgAnnual, 2)} a year</div>
            </div>
            <div className="rounded-xl border border-sandstone-dark/20 bg-white p-5">
              <div className="flex items-start gap-3">
                <CalendarClock className="mt-0.5 h-5 w-5 flex-shrink-0 text-eucalyptus-dark" aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-navy">Must reach your fund by</div>
                  <div className="text-2xl font-bold text-navy">{due ? formatDateAU(due) : "Pick a payday"}</div>
                  <p className="mt-1 text-xs text-warmgray">
                    {days} business days after payday, counting weekends only. Add one day for each public holiday in that window that covers a whole state or territory, in any state or territory.
                  </p>
                </div>
              </div>
            </div>
            {r.aboveMaxContributionBase && (
              <p className="rounded-lg border border-ochre/40 bg-sandstone p-3 text-sm text-navy">
                Your salary is above the {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} annual maximum contribution base. Your employer only has to pay SG up to {formatAUD(SUPER_GUARANTEE.maxSGAnnual, 2)} for the year. Your per-pay amount may stop once your year-to-date qualifying earnings reach the base.
              </p>
            )}
            {paydayDate && paydayDate.getTime() < Date.UTC(2026, 6, 1) && (
              <p className="rounded-lg border border-ochre/40 bg-sandstone p-3 text-sm text-navy">
                Earnings paid before {SUPER_GUARANTEE.paydaySuperStart} fall under the old quarterly rules, not Payday Super.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaydaySuperPage() {
  const authorship = getGuideAuthorship("payday-super");
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/superannuation-guide/" className="hover:text-eucalyptus-dark hover:underline">Superannuation</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Payday Super</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 style={H} className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl">
            Payday Super: Your Super Is Now Paid Every Payday
          </h1>
          <p className="mb-5 text-xl leading-relaxed text-warmgray">
            Since {SUPER_GUARANTEE.paydaySuperStart}, employers must pay the super guarantee with every pay run instead of once a quarter. Use the calculator to see how much super should go to your fund each payday and when it has to arrive.
          </p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> Under Payday Super, your employer must pay <strong>{RATE}</strong> of your qualifying earnings into your super fund for every payday. The money must be <strong>received by the fund within {C.businessDaysToPay} business days</strong> after payday, or {C.businessDaysNewEmployee} business days for a new employee or new fund. It applies to earnings paid from {SUPER_GUARANTEE.paydaySuperStart}.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section className="not-prose mb-10">
              <PerPaySuperCalculator />
            </section>

            <section id="what-changed">
              <h2 style={H}>What changed on {SUPER_GUARANTEE.paydaySuperStart}</h2>
              <p>Payday Super changed when employers pay super. The rate did not change. Here is the old quarterly system next to the new one.</p>
              <div className="not-prose overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-sandstone text-navy">
                    <tr><th className="px-4 py-3"> </th><th className="px-4 py-3">To 30 June 2026 (quarterly)</th><th className="px-4 py-3">From {SUPER_GUARANTEE.paydaySuperStart} (Payday Super)</th></tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 text-warmgray">
                    <tr><td className="px-4 py-3 font-medium text-navy">When super is due</td><td className="px-4 py-3">28 days after each quarter ends</td><td className="px-4 py-3">Received by the fund within {C.businessDaysToPay} business days of each payday</td></tr>
                    <tr><td className="px-4 py-3 font-medium text-navy">Calculated on</td><td className="px-4 py-3">Ordinary time earnings</td><td className="px-4 py-3">Qualifying earnings (OTE plus {QUALIFYING_EARNINGS.onlyChangeFromOTE})</td></tr>
                    <tr><td className="px-4 py-3 font-medium text-navy">Maximum contribution base</td><td className="px-4 py-3">{formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026)} a quarter</td><td className="px-4 py-3">{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} a year</td></tr>
                    <tr><td className="px-4 py-3 font-medium text-navy">Late payment</td><td className="px-4 py-3">Employer lodges an SGC statement; charge not deductible</td><td className="px-4 py-3">ATO assesses the charge; it is now tax-deductible</td></tr>
                    <tr><td className="px-4 py-3 font-medium text-navy">ATO clearing house</td><td className="px-4 py-3">Small Business Superannuation Clearing House</td><td className="px-4 py-3">Closed, no longer accessible</td></tr>
                  </tbody>
                </table>
              </div>
              <p>The June 2026 quarter was the last one under the old rules. Its payment was due {L.finalQuarterSGDue}, and the final quarterly SGC statement was due {L.finalQuarterStatementDue}.</p>
            </section>

            <section id="seven-day-rule">
              <h2 style={H}>The {C.businessDaysToPay}-business-day rule</h2>
              <p>
                The deadline runs from the <strong>QE day</strong>, which is the day your employer pays you qualifying earnings. That is usually your normal payday. The contribution counts as on time only when your fund <em>receives</em> it within {C.businessDaysToPay} business days, along with enough information to put it in your account. Clearing house processing time counts against your employer, which is why the ATO says best practice is to pay super on payday.
              </p>
              <p>
                Weekends are not business days. A public holiday that covers a whole state or territory is not a business day <strong>anywhere in Australia</strong>, even if your employer is in a different state. A holiday that covers only part of a state, such as Royal Hobart Show Day, still counts as a business day.
              </p>
              <p>
                Your employer gets {C.businessDaysNewEmployee} business days for the first contribution for a <strong>new employee</strong>. The same applies to the first contribution to a <strong>new fund</strong> after an existing employee switches funds. After that, each payday goes back to {C.businessDaysToPay} business days.
              </p>
            </section>

            <section id="qualifying-earnings">
              <h2 style={H}>What super is calculated on: qualifying earnings</h2>
              <p>
                Payday Super calculates the {RATE} on <strong>qualifying earnings</strong>. You may have read that super now applies to overtime and all bonuses. It doesn&rsquo;t. The ATO says the only new payment type is {QUALIFYING_EARNINGS.onlyChangeFromOTE}. Everything that attracted super before still does.
              </p>
              <div className="not-prose grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-sandstone-dark/20 bg-white p-5">
                  <h3 className="mb-2 font-semibold text-navy">Still included</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-warmgray">{QUALIFYING_EARNINGS.stillIncluded.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
                <div className="rounded-xl border border-sandstone-dark/20 bg-white p-5">
                  <h3 className="mb-2 font-semibold text-navy">Still excluded</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-warmgray">{QUALIFYING_EARNINGS.stillExcluded.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              </div>
            </section>

            <section id="late-super">
              <h2 style={H}>What happens when super is late</h2>
              <p>
                If your super isn&rsquo;t received on time, your employer owes the super guarantee charge. The charge is made up of the shortfall, notional earnings at the general interest charge rate compounded daily, an administrative uplift of up to {C.administrativeUpliftMax * 100}%, and a choice loading where choice-of-fund rules were broken. The ATO collects it and pays the super and interest into your fund. Each component is explained on our <Link href="/super-guarantee-charge/">super guarantee charge guide</Link>.
              </p>
            </section>

            <section id="clearing-house">
              <h2 style={H}>The Small Business Superannuation Clearing House has closed</h2>
              <p>
                The ATO&rsquo;s free Small Business Superannuation Clearing House (SBSCH) closed to new users on {SBSCH_CLOSURE.closedToNewUsers}. Existing users could keep using it until {SBSCH_CLOSURE.lastDayForExistingUsers}, and it is no longer accessible. Small employers now pay through their payroll software, a commercial clearing house or directly to funds. Whichever they use, it has to be fast enough to meet the {C.businessDaysToPay}-day deadline.
              </p>
            </section>

            <section id="legislation">
              <h2 style={H}>Payday Super legislation</h2>
              <p>
                Payday Super is law. The main Act is the <a href={PAYDAY_SUPER_SOURCES.act} target="_blank" rel="noopener noreferrer">{PAYDAY_SUPER_LAW.act}</a> ({PAYDAY_SUPER_LAW.actNumber}). It sits alongside the {PAYDAY_SUPER_LAW.companionAct}, which rebuilt the charge, and the <a href={PAYDAY_SUPER_SOURCES.regulations} target="_blank" rel="noopener noreferrer">{PAYDAY_SUPER_LAW.regulations}</a>. All of it commenced on {PAYDAY_SUPER_LAW.commencement}.
              </p>
            </section>

            <section id="employee-checks">
              <h2 style={H}>What employees should check</h2>
              <ol>
                <li><strong>Your payslip.</strong> Fair Work payslip rules require the super contribution for the pay period (or the amount your employer intends to pay) and the fund it goes to. Our <Link href="/understanding-your-payslip/">payslip guide</Link> shows where to find it.</li>
                <li><strong>Your fund account.</strong> Contributions should now arrive after every pay run, not once a quarter. Compare the deposits with your payslips. You can also see employer contributions reported to the ATO through myGov.</li>
                <li><strong>The amount.</strong> It should be {RATE} of your qualifying earnings. Check it with the calculator above or the <Link href="/superannuation-calculator/">superannuation calculator</Link>.</li>
                <li><strong>If money is missing.</strong> Ask your employer first. If that doesn&rsquo;t fix it, use the ATO&rsquo;s <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/unpaid-super-from-your-employer" target="_blank" rel="noopener noreferrer">unpaid super</a> steps to report it.</li>
              </ol>
              <div className="not-prose my-6 flex items-start gap-3 rounded-xl border-l-4 border-ochre bg-sandstone p-5">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-ochre" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-navy">
                  If you salary sacrifice, super now arrives more often. That can change how contributions fall across financial years, so check them against the {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap.
                </p>
              </div>
            </section>

            <section id="faq">
              <h2 style={H}>Payday Super FAQs</h2>
              <div className="sr-only">
                {PAYDAY_SUPER_FAQS.map((f) => (<div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {PAYDAY_SUPER_FAQS.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="rounded-lg border bg-white px-4">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page was verified">
                <p>
                  The SG rate, contribution base and deadlines come from the site&rsquo;s single tax-constants file, checked against the ATO&rsquo;s Payday Super pages. The clearing house dates come from &ldquo;About Payday Super&rdquo; (last updated 10 August 2026). The calculator counts {C.businessDaysToPay} business days by skipping weekends only. It is tested against the ATO&rsquo;s own worked examples, which land one day later wherever NT Picnic Day falls in the window. That is why the page tells you to add holidays yourself.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">Payday Super at a glance</h2>
                  <dl className="space-y-3 text-sm">
                    {[
                      { t: "Started", d: SUPER_GUARANTEE.paydaySuperStart },
                      { t: "SG rate", d: `${RATE} of qualifying earnings` },
                      { t: "Must reach the fund", d: `${C.businessDaysToPay} business days after payday` },
                      { t: "New employee or fund", d: `${C.businessDaysNewEmployee} business days` },
                      { t: "Max contribution base", d: `${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} a year` },
                      { t: "SBSCH", d: `Closed (last use ${SBSCH_CLOSURE.lastDayForExistingUsers})` },
                    ].map((row) => (
                      <div key={row.t} className="rounded-lg border border-sandstone-dark/20 bg-white p-3">
                        <dt className="font-medium text-navy">{row.t}</dt>
                        <dd className="text-warmgray">{row.d}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h2 className="mb-2 text-lg font-bold">Related tools</h2>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/superannuation-calculator/" className="text-white underline hover:text-eucalyptus-light">Superannuation calculator</Link></li>
                    <li><Link href="/super-guarantee-charge/" className="text-white underline hover:text-eucalyptus-light">Super guarantee charge</Link></li>
                    <li><Link href="/understanding-your-payslip/" className="text-white underline hover:text-eucalyptus-light">Understanding your payslip</Link></li>
                    <li><Link href="/salary-sacrifice-calculator/" className="text-white underline hover:text-eucalyptus-light">Salary sacrifice calculator</Link></li>
                    <li><Link href="/employer-cost-calculator/" className="text-white underline hover:text-eucalyptus-light">Employer cost calculator</Link></li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
