// Static long-form content on /novated-lease-calculator/, in three slots around
// the sections that read the calculator inputs (payslip table, ECM vs statutory
// table, residual table), which stay in novated-lease-calculator.tsx. Server
// components, so they ship as HTML; the client module renders them via the
// `evExemption`, `hecsAndFbtRates` and `children` props.

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD, formatPercent, HECS_HELP, SITE_CONFIG } from "@/lib/constants";
import {
  EV_EXEMPTION,
  FBT,
  LUXURY_CAR_TAX,
  NOVATED_LEASE_SOURCES,
  NOVATED_LEASE_UNVERIFIED,
  fbtPayable,
  statutoryTaxableValue,
} from "@/lib/constants/novated-lease";
import { NOVATED_LEASE_FAQS, NOVATED_LEASE_SOURCE_LINKS } from "./novated-lease-faqs";

const H2 = "text-2xl font-semibold text-navy mb-4";
const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

/** The electric car exemption and PHEV cut-off sections. */
export function NovatedLeaseEvExemption() {
  return (
    <>
      <section>
        <h2 style={FONT} className={H2}>The Electric Car FBT Exemption, and Where It Stops</h2>
        <p className={P}>
          A battery electric or hydrogen fuel cell car is exempt from FBT when it was first held and used on or
          after {EV_EXEMPTION.firstHeldAndUsedFrom}, it is a car under one tonne with fewer than nine seats, and
          luxury car tax has <em>never</em> been payable on it. That last condition is the one that bites: the
          GST-inclusive value has to be at or under the LCT threshold for fuel-efficient vehicles at the first
          retail sale and at every later sale.
        </p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Financial year</th><th scope="col" className={TH + " text-right"}>Fuel-efficient vehicles</th><th scope="col" className={TH + " text-right"}>Other vehicles</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr className="bg-eucalyptus-light/30"><td className={TD}>{LUXURY_CAR_TAX.financialYear}</td><td className={TD + " text-right font-bold"}>{formatAUD(LUXURY_CAR_TAX.fuelEfficientThreshold)}</td><td className={TD + " text-right"}>{formatAUD(LUXURY_CAR_TAX.otherVehiclesThreshold)}</td></tr>
              <tr><td className={TD}>2025-26</td><td className={TD + " text-right"}>{formatAUD(LUXURY_CAR_TAX.fuelEfficientThresholdPrevious)}</td><td className={TD + " text-right"}>{formatAUD(LUXURY_CAR_TAX.otherVehiclesThresholdPrevious)}</td></tr>
            </tbody>
          </table>
        </div>
        <p className={P + " mt-4"}>
          From {LUXURY_CAR_TAX.fuelEfficientDefinitionFrom} a fuel-efficient car means combined fuel consumption of
          no more than {LUXURY_CAR_TAX.fuelEfficientLitresPer100km} litres per 100km, down from 7 litres. A battery
          electric car clears that on any reading; the threshold that matters to it is the dollar one. The
          government is due to review the exemption by {EV_EXEMPTION.reviewDue}.
        </p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Plug-In Hybrids: the {EV_EXEMPTION.phevExcludedFrom} Cut-Off</h2>
        <p className={P}>
          From {EV_EXEMPTION.phevExcludedFrom} a plug-in hybrid is not a zero or low emissions vehicle for FBT, so a
          PHEV novated lease entered into now is fully subject to FBT — on a {formatAUD(60_000)} car that is{" "}
          {formatAUD(statutoryTaxableValue(60_000))} of taxable value and{" "}
          {formatAUD(fbtPayable(statutoryTaxableValue(60_000)))} of FBT for a full FBT year, before any employee
          contribution.
        </p>
        <p className={P}>
          A PHEV keeps the exemption only where <strong>both</strong> of these are true: it was used, or available
          for use, before that date and that use was exempt; and there is a financially binding commitment to keep
          providing it. The ATO says plainly it has no discretion to extend the date, including where delivery was
          delayed. The exemption then ends the moment the commitment changes — an optional extension being taken up,
          a break in the novation, a change to the lease payments or the residual value, or a change of employer.
          Tick the box in the calculator only if that describes your arrangement.
        </p>
      </section>
    </>
  );
}

/** HECS-HELP / Medicare levy surcharge and FBT rates sections. */
export function NovatedLeaseHecsAndFbtRates() {
  return (
    <>
      <section>
        <h2 style={FONT} className={H2}>What a Novated Lease Does to HECS-HELP and the Medicare Levy Surcharge</h2>
        <p className={P}>
          This is the part most novated lease calculators leave out. A car fringe benefit with a taxable value over
          {" "}{formatAUD(FBT.reportableThreshold)} in an FBT year is reported on your income statement as a
          reportable fringe benefits amount, grossed up at the lower rate of {FBT.grossUpType2}. You are not taxed
          on it. But it is added to your income for the HECS-HELP repayment test, the Medicare levy surcharge, the
          private health insurance rebate, <Link href="/division-293-tax/" className={LINK}>Division 293 tax</Link> and
          family assistance payments.
        </p>
        <p className={P}>
          An FBT-<em>exempt</em> electric car is not exempt from that. The notional taxable value is still worked
          out and still reported — so an EV lease can cut your taxable income and raise your compulsory study loan
          repayment at the same time. A full employee contribution is the one thing that removes it: it takes the
          taxable value to nil, so there is nothing left to report. The repayment threshold is{" "}
          {formatAUD(HECS_HELP.minimumThreshold)} for {SITE_CONFIG.financialYear}; the{" "}
          <Link href="/hecs-help-calculator/" className={LINK}>HECS-HELP calculator</Link> shows the bands, and{" "}
          <Link href="/private-health-insurance-medicare/" className={LINK}>private health cover and the Medicare levy surcharge</Link>{" "}
          covers the surcharge tiers.
        </p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>FBT Rates for the Year Ending {FBT.yearEnding}</h2>
        <p className={P}>
          The FBT year runs {FBT.yearStart} to {FBT.yearEnd} — it is not the income year. A lease that starts in
          September is only available for part of the FBT year, and the statutory formula apportions by days, so
          your first year&apos;s FBT is smaller than a full year&apos;s.
        </p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Figure</th><th scope="col" className={TH + " text-right"}>{FBT.yearLabel}</th><th scope="col" className={TH}>What it is for</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>FBT rate</td><td className={TD + " text-right font-bold"}>{formatPercent(FBT.rate, 0)}</td><td className={TD}>Applied to the grossed-up taxable value</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Type 1 gross-up rate</td><td className={TD + " text-right font-bold"}>{FBT.grossUpType1}</td><td className={TD}>Where the employer can claim GST credits — the usual novated lease case</td></tr>
              <tr><td className={TD}>Type 2 gross-up rate</td><td className={TD + " text-right font-bold"}>{FBT.grossUpType2}</td><td className={TD}>No GST credits — and every reportable amount, whatever the type</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Statutory percentage</td><td className={TD + " text-right font-bold"}>{formatPercent(FBT.statutoryRate, 0)}</td><td className={TD}>Flat since 1 April 2014, regardless of kilometres</td></tr>
              <tr><td className={TD}>Reportable threshold</td><td className={TD + " text-right font-bold"}>{formatAUD(FBT.reportableThreshold)}</td><td className={TD}>Taxable value above this is reported ({formatAUD(FBT.reportableMinimumGrossedUp)} grossed up)</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>EV home charging rate</td><td className={TD + " text-right font-bold"}>{FBT.evHomeChargingCentsPerKm}c/km</td><td className={TD}>PCG 2024/2 shortcut for home-charged electricity (4.20c before this year)</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

/** Related links, methodology, FAQ, sources and author box. */
export default function NovatedLeaseCalculatorContent() {
  const authorship = getGuideAuthorship("novated-lease-calculator");
  return (
    <>
      <section>
        <h2 style={FONT} className={H2}>Related Calculators and Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/novated-lease-guide/" className="group rounded-xl border border-sandstone-dark/20 p-4 hover:border-eucalyptus transition-colors">
            <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">How a Novated Lease Works</h3>
            <p className="text-sm text-warmgray mt-1">The three-way agreement, what sits in the budget, and what happens if you leave your job.</p>
          </Link>
          <Link href="/salary-sacrifice-calculator/" className="group rounded-xl border border-sandstone-dark/20 p-4 hover:border-eucalyptus transition-colors">
            <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Salary Sacrifice Calculator</h3>
            <p className="text-sm text-warmgray mt-1">What any pre-tax deduction does to your take-home pay.</p>
          </Link>
          <Link href="/fringe-benefits-tax/" className="group rounded-xl border border-sandstone-dark/20 p-4 hover:border-eucalyptus transition-colors">
            <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Fringe Benefits Tax</h3>
            <p className="text-sm text-warmgray mt-1">How FBT works across benefit types, not just cars.</p>
          </Link>
          <Link href="/hecs-help-calculator/" className="group rounded-xl border border-sandstone-dark/20 p-4 hover:border-eucalyptus transition-colors">
            <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">HECS-HELP Calculator</h3>
            <p className="text-sm text-warmgray mt-1">Repayment income, the bands, and what a reported benefit adds.</p>
          </Link>
          <Link href="/take-home-pay-calculator/" className="group rounded-xl border border-sandstone-dark/20 p-4 hover:border-eucalyptus transition-colors">
            <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Take-Home Pay Calculator</h3>
            <p className="text-sm text-warmgray mt-1">Your pay after tax with and without the deduction.</p>
          </Link>
          <Link href="/salary-packaging-guide/" className="group rounded-xl border border-sandstone-dark/20 p-4 hover:border-eucalyptus transition-colors">
            <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Salary Packaging Guide</h3>
            <p className="text-sm text-warmgray mt-1">The other benefits that can be packaged, and their caps.</p>
          </Link>
        </div>
      </section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>Statutory formula taxable value = base value &times; {formatPercent(FBT.statutoryRate, 0)} &times; days available &divide; days in the FBT year, less the employee contribution. FBT = that value &times; {FBT.grossUpType1} &times; {formatPercent(FBT.rate, 0)}. Every figure here is a full FBT year of availability.</li>
          <li>Capital repaid a year = (purchase price &minus; the TD 93/142 minimum residual) &divide; the term. <strong>Finance charges are not modelled</strong> — the interest rate is set per deal and this site does not compare lease finance. Both sides of the buy-versus-lease comparison are therefore interest-free, and both are GST-inclusive.</li>
          <li>Under the employee contribution method the post-tax deduction is the statutory taxable value (capped at the year&apos;s lease cost), which reduces the taxable value, the FBT and the reportable amount to nil. Under the statutory method the FBT is funded from the pre-tax deduction.</li>
          <li>Reportable fringe benefits amount = taxable value &times; {FBT.grossUpType2}, reported only where the taxable value exceeds {formatAUD(FBT.reportableThreshold)}, and applied to FBT-exempt electric cars as well. HECS-HELP and the Medicare levy surcharge are then calculated on taxable income <em>plus</em> that amount, using the site&apos;s shared {SITE_CONFIG.financialYear} tax engine.</li>
          <li>Not modelled: {NOVATED_LEASE_UNVERIFIED.join("; ")}.</li>
          <li>{SITE_CONFIG.name} is not the ATO and this is not financial or tax advice. Rates and thresholds read from the ATO pages listed below on {NOVATED_LEASE_SOURCES.verifiedOn}; get your own quote and check it against your payslip.</li>
        </ul>
      </MethodologyDisclosure>

      <section>
        <h2 style={FONT} className={H2}>Frequently Asked Questions</h2>
        <div className="sr-only"><h3>Novated lease questions and answers</h3>{NOVATED_LEASE_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}</div>
        <Accordion type="multiple">
          {NOVATED_LEASE_FAQS.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent><p>{f.a}</p></AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <SourceAttribution sources={NOVATED_LEASE_SOURCE_LINKS} lastVerified={NOVATED_LEASE_SOURCES.verifiedOn} />
      {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
    </>
  );
}
