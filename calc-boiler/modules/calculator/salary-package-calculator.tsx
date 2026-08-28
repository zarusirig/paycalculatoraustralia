"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { calculatePayBreakdown, formatAUD, formatPercent, SITE_CONFIG, SOURCES, SUPER_GUARANTEE } from "@/lib/constants";
import { packageFromBase, splitPackage, type PackageSplit } from "@/lib/constants/salary-package";
import { SALARY_PACKAGE_FAQS } from "./salary-package-faqs";

// Why this page exists (GSC to 27 Aug 2026): 281 distinct queries — "how to
// calculate superannuation from total package", "75k including super", "whats
// 90 plus super", "base salary calculator" — were landing on the super
// guarantee calculator (0.24% CTR) and the homepage. Nothing answered them.

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Super guarantee rate and maximum contribution base", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay", publisher: SOURCES.ato.name },
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

type Mode = "package" | "base";
const TABLE_AMOUNTS = [50_000, 60_000, 70_000, 80_000, 90_000, 100_000, 110_000, 120_000, 130_000, 150_000, 175_000, 200_000, 250_000, 300_000];
const RATE_PCT = formatPercent(SUPER_GUARANTEE.rate, 0);
const DIVISOR = (1 + SUPER_GUARANTEE.rate).toFixed(2);

const H2 = "text-2xl font-semibold text-navy mb-4";
const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function takeHome(base: number) {
  return calculatePayBreakdown({ grossSalary: base });
}

export default function SalaryPackageCalculatorPage() {
  const [amount, setAmount] = useState(100_000);
  const [mode, setMode] = useState<Mode>("package");
  const authorship = getGuideAuthorship("salary-package-calculator");

  const result = useMemo(() => {
    const split: PackageSplit = mode === "package" ? splitPackage(amount) : packageFromBase(amount);
    const pay = takeHome(split.base);
    return { split, pay };
  }, [amount, mode]);

  const { split, pay } = result;
  const ex112 = splitPackage(112_000);
  const exBase100 = packageFromBase(100_000);
  const exPack100 = splitPackage(100_000);
  const thBase100 = takeHome(100_000);
  const thPack100 = takeHome(exPack100.base);
  const capExample = splitPackage(400_000);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Salary Package Calculator</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Salary Package Calculator — Including Super or Plus Super
          </h1>
          <p className="text-lg text-warmgray">
            &ldquo;{formatAUD(112_000)} package&rdquo;, &ldquo;{formatAUD(100_000)} plus super&rdquo; and &ldquo;{formatAUD(100_000)} including super&rdquo; are three different offers.
            Enter the number from the job ad and see the base salary, the {RATE_PCT} super, the total package and your {SITE_CONFIG.financialYear} take-home pay.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Split a Package Into Base Salary, Super and Take-Home</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <fieldset>
                    <legend className="block text-sm font-medium text-navy mb-2">The figure in the offer is</legend>
                    <div className="space-y-2 text-sm text-navy">
                      <label className="flex items-start gap-2">
                        <input type="radio" name="mode" value="package" checked={mode === "package"} onChange={() => setMode("package")} className="mt-1 accent-eucalyptus" />
                        <span><strong>A package that includes super</strong><br /><span className="text-warmgray">&ldquo;{formatAUD(amount)} package&rdquo;, &ldquo;including super&rdquo;, &ldquo;total remuneration&rdquo;</span></span>
                      </label>
                      <label className="flex items-start gap-2">
                        <input type="radio" name="mode" value="base" checked={mode === "base"} onChange={() => setMode("base")} className="mt-1 accent-eucalyptus" />
                        <span><strong>A base salary, super on top</strong><br /><span className="text-warmgray">&ldquo;{formatAUD(amount)} plus super&rdquo;, &ldquo;excluding super&rdquo;</span></span>
                      </label>
                    </div>
                  </fieldset>
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-navy mb-1">Amount (annual)</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="amount" min={0} max={1_000_000} step={1000} value={amount}
                        onChange={(e) => setAmount(clamp(Number(e.target.value || 0), 0, 1_000_000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={30_000} max={300_000} step={1000} value={clamp(amount, 30_000, 300_000)}
                      onChange={(e) => setAmount(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>
                </form>

                <div className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-5 text-center shadow-sm">
                      <div className="text-xs font-semibold text-ochre uppercase tracking-wider mb-2">Base salary</div>
                      <div className="text-2xl font-extrabold text-navy">{formatAUD(split.base)}</div>
                    </div>
                    <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-5 text-center shadow-sm">
                      <div className="text-xs font-semibold text-ochre uppercase tracking-wider mb-2">Super ({RATE_PCT})</div>
                      <div className="text-2xl font-extrabold text-navy">{formatAUD(split.superAmount)}</div>
                    </div>
                    <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-5 text-center shadow-sm">
                      <div className="text-xs font-semibold text-ochre uppercase tracking-wider mb-2">Total package</div>
                      <div className="text-2xl font-extrabold text-navy">{formatAUD(split.total)}</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Take-home pay on the {formatAUD(split.base)} base ({SITE_CONFIG.financialYear})</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Income tax (after LITO)" value={`-${formatAUD(pay.netIncomeTax)}`} />
                      <Row label="Medicare levy" value={`-${formatAUD(pay.medicareLevy)}`} />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label="Per year" value={formatAUD(pay.takeHomePay)} bold highlight />
                      <Row label="Per month" value={formatAUD(pay.monthly)} />
                      <Row label="Per fortnight" value={formatAUD(pay.fortnightly)} />
                      <Row label="Per week" value={formatAUD(pay.weekly)} />
                      <Row label="Effective tax rate" value={formatPercent(pay.effectiveTaxRate)} />
                    </div>
                  </div>

                  {split.capApplied && (
                    <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-xs text-navy">
                      <strong>Super cap applied.</strong> Employers only have to pay SG on base salary up to the maximum contribution base ({formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} a year), so super is held at {formatAUD(SUPER_GUARANTEE.maxSGAnnual)} and the rest of the package is base.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">
          <section>
            <h2 style={FONT} className={H2}>Package, Plus Super, Including Super — What Each One Means</h2>
            <p className={P}>Australian offers use three phrasings for the same {RATE_PCT} of employer super, and they are not interchangeable:</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className={TH}>The offer says</th>
                    <th scope="col" className={TH}>It means</th>
                    <th scope="col" className={TH + " text-right"}>Base</th>
                    <th scope="col" className={TH + " text-right"}>Super</th>
                    <th scope="col" className={TH + " text-right"}>Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr>
                    <td className={TD + " font-medium"}>{formatAUD(100_000)} plus super</td>
                    <td className={TD}>Base salary; super paid on top</td>
                    <td className={TD + " text-right"}>{formatAUD(exBase100.base)}</td>
                    <td className={TD + " text-right"}>{formatAUD(exBase100.superAmount)}</td>
                    <td className={TD + " text-right font-bold"}>{formatAUD(exBase100.total)}</td>
                  </tr>
                  <tr className="bg-eucalyptus-light/30">
                    <td className={TD + " font-medium"}>{formatAUD(100_000)} package / including super</td>
                    <td className={TD}>Super is inside the figure</td>
                    <td className={TD + " text-right"}>{formatAUD(exPack100.base)}</td>
                    <td className={TD + " text-right"}>{formatAUD(exPack100.superAmount)}</td>
                    <td className={TD + " text-right font-bold"}>{formatAUD(exPack100.total)}</td>
                  </tr>
                  <tr>
                    <td className={TD + " font-medium"}>{formatAUD(100_000)} (no mention of super)</td>
                    <td className={TD}>Almost always base — but ask</td>
                    <td className={TD + " text-right"}>{formatAUD(exBase100.base)}</td>
                    <td className={TD + " text-right"}>{formatAUD(exBase100.superAmount)}</td>
                    <td className={TD + " text-right font-bold"}>{formatAUD(exBase100.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>
              Your tax, your HECS repayment and your take-home pay are all worked out on the <strong>base</strong>. The super never reaches your bank account. So the first thing to do with any offer is find the base — then put it through the <Link href="/take-home-pay-calculator/" className={LINK}>take-home pay calculator</Link>.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>How to Work Out Base Salary From a Package Including Super</h2>
            <p className={P}>
              Divide the package by {DIVISOR}. Super is {RATE_PCT} <em>of the base</em>, so a package is 1 + {SUPER_GUARANTEE.rate} times the base — not base plus {RATE_PCT} of the package. Taking {RATE_PCT} off the top of the package understates your base.
            </p>
            <div className="bg-white rounded-xl border border-sandstone-dark/20 p-5 text-sm text-navy mb-4">
              <p className="font-medium mb-2">Worked example — {formatAUD(112_000)} package including super</p>
              <p>{formatAUD(112_000)} ÷ {DIVISOR} = <strong>{formatAUD(ex112.base)}</strong> base salary</p>
              <p>{formatAUD(112_000)} − {formatAUD(ex112.base)} = <strong>{formatAUD(ex112.superAmount)}</strong> super ({RATE_PCT} of the base)</p>
              <p className="text-warmgray mt-2">Wrong way: {formatAUD(112_000)} × {RATE_PCT} = {formatAUD(112_000 * SUPER_GUARANTEE.rate)} super and {formatAUD(112_000 - 112_000 * SUPER_GUARANTEE.rate)} base — {formatAUD(ex112.base - (112_000 - 112_000 * SUPER_GUARANTEE.rate))} short.</p>
            </div>
            <p className={P}>
              To go the other way — base to package — multiply the base by {DIVISOR}, or add {RATE_PCT} of it. The tables below do both for common amounts.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Package Including Super → Base Salary and Take-Home</h2>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className={TH}>Package (incl. super)</th>
                    <th scope="col" className={TH + " text-right"}>Base salary</th>
                    <th scope="col" className={TH + " text-right"}>Super</th>
                    <th scope="col" className={TH + " text-right"}>Take-home / year</th>
                    <th scope="col" className={TH + " text-right"}>Per fortnight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TABLE_AMOUNTS.map((amt, i) => {
                    const s = splitPackage(amt); const t = takeHome(s.base);
                    return (
                      <tr key={amt} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className={TD + " font-medium"}>{formatAUD(amt)}</td>
                        <td className={TD + " text-right"}>{formatAUD(s.base)}</td>
                        <td className={TD + " text-right"}>{formatAUD(s.superAmount)}{s.capApplied ? " *" : ""}</td>
                        <td className={TD + " text-right font-bold"}>{formatAUD(t.takeHomePay)}</td>
                        <td className={TD + " text-right"}>{formatAUD(t.fortnightly)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">* Super capped at the maximum contribution base. Take-home uses {SITE_CONFIG.financialYear} resident rates with LITO and the Medicare levy; no HECS, surcharge or salary sacrifice.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Base Salary Plus Super → Total Package</h2>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className={TH}>Base salary (plus super)</th>
                    <th scope="col" className={TH + " text-right"}>Super ({RATE_PCT})</th>
                    <th scope="col" className={TH + " text-right"}>Total package</th>
                    <th scope="col" className={TH + " text-right"}>Take-home / year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TABLE_AMOUNTS.map((amt, i) => {
                    const s = packageFromBase(amt); const t = takeHome(amt);
                    return (
                      <tr key={amt} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className={TD + " font-medium"}>{formatAUD(amt)}</td>
                        <td className={TD + " text-right"}>{formatAUD(s.superAmount)}{s.capApplied ? " *" : ""}</td>
                        <td className={TD + " text-right font-bold"}>{formatAUD(s.total)}</td>
                        <td className={TD + " text-right"}>{formatAUD(t.takeHomePay)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Why {formatAUD(100_000)} Package Is Not {formatAUD(100_000)} Plus Super</h2>
            <p className={P}>
              Same headline, {formatAUD(exBase100.total - 100_000)} apart. {formatAUD(100_000)} plus super is a {formatAUD(exBase100.total)} package; {formatAUD(100_000)} package is a {formatAUD(exPack100.base)} base. After tax in {SITE_CONFIG.financialYear} the difference is <strong>{formatAUD(thBase100.takeHomePay - thPack100.takeHomePay)} a year</strong> in your hand ({formatAUD(thBase100.takeHomePay)} versus {formatAUD(thPack100.takeHomePay)}), plus {formatAUD(exBase100.superAmount - exPack100.superAmount)} more going into super. When two offers look level, check which phrasing each one uses before comparing them.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>When the Super Cap Changes the Split</h2>
            <p className={P}>
              The super guarantee only has to be paid on base salary up to the <strong>maximum contribution base</strong> — {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} a year in {SITE_CONFIG.financialYear}, which caps SG at {formatAUD(SUPER_GUARANTEE.maxSGAnnual)}. Below that, ÷{DIVISOR} is exact. Above it, a package splits as package minus {formatAUD(SUPER_GUARANTEE.maxSGAnnual)}: a {formatAUD(400_000)} package is {formatAUD(capExample.base)} base and {formatAUD(capExample.superAmount)} super, not {formatAUD(Math.round(400_000 / (1 + SUPER_GUARANTEE.rate)))}. Some employers pay SG on the full base anyway; the calculator shows the legal minimum. See the <Link href="/superannuation-calculator/" className={LINK}>super guarantee calculator</Link> for the cap in detail.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>This Is Not Salary Packaging</h2>
            <p className={P}>
              A salary <em>package</em> is the total an employer pays you. Salary <em>packaging</em> (or salary sacrifice) is an arrangement where you give up part of your salary for a benefit — a novated lease, extra super, or an NFP living-expenses card — and it changes your tax. If that is what you are after, use the <Link href="/salary-sacrifice-calculator/" className={LINK}>salary sacrifice calculator</Link>, the <Link href="/salary-packaging-guide/" className={LINK}>salary packaging guide</Link> or the <Link href="/novated-lease-guide/" className={LINK}>novated lease guide</Link>.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Related Calculators</h2>
            <ul className="space-y-2 text-warmgray">
              <li><Link href="/take-home-pay-calculator/" className={LINK}>Take-home pay calculator</Link> &mdash; put the base through the full tax, Medicare and HECS calculation.</li>
              <li><Link href="/superannuation-calculator/" className={LINK}>Super guarantee calculator</Link> &mdash; check the {RATE_PCT} your employer should be paying.</li>
              <li><Link href="/gross-pay-calculator/" className={LINK}>Gross pay calculator</Link> &mdash; net to gross and gross to net.</li>
              <li><Link href="/pay-rise-calculator/" className={LINK}>Pay rise calculator</Link> &mdash; compare an offer against what you earn now.</li>
              <li><Link href="/salary-to-hourly/100000/" className={LINK}>{formatAUD(100_000)} salary as an hourly rate</Link> &mdash; the same base by the hour.</li>
            </ul>
          </section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>Package → base: base = package ÷ (1 + {SUPER_GUARANTEE.rate}), rounded to the dollar; super = package − base. Base → package: super = base × {SUPER_GUARANTEE.rate}, capped at {formatAUD(SUPER_GUARANTEE.maxSGAnnual)} once base exceeds the {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} maximum contribution base.</li>
              <li>Take-home uses the same engine as every calculator on this site: {SITE_CONFIG.financialYear} resident brackets, LITO and the 2% Medicare levy; no HECS, Medicare levy surcharge or salary sacrifice.</li>
              <li>Rate and cap are read from one constants file (<code>SUPER_GUARANTEE</code>) shared with the super guarantee calculator.</li>
            </ul>
          </MethodologyDisclosure>

          <section>
            <h2 style={FONT} className={H2}>Frequently Asked Questions</h2>
            <div className="sr-only">
              <h3>Salary package questions and answers</h3>
              {SALARY_PACKAGE_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
            </div>
            <Accordion type="multiple">
              {SALARY_PACKAGE_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent><p>{f.a}</p></AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
          {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center gap-4 ${highlight ? "bg-eucalyptus-light/40 -mx-2 px-2 py-1 rounded" : ""}`}>
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-navy" : "text-navy"}`}>{value}</span>
    </div>
  );
}
