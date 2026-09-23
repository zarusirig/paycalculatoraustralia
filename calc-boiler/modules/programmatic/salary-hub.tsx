/**
 * Hub pages for the programmatic salary families (Wave 3 / T6):
 *   /take-home-pay-on/   /tax-on/   /salary-to-hourly/
 *
 * Each hub lists every salary in its grid, grouped by band, with the headline
 * figure beside each link so the hub is a usable table in its own right, not
 * just a link farm. Band summaries are computed from the tax engine.
 */
import React from "react";
import Link from "next/link";
import type { BreadcrumbList, CollectionPage, WithContext } from "schema-dts";
import {
  EMPLOYMENT,
  formatAUD,
  SITE_CONFIG,
  TAX_BRACKETS,
} from "@/lib/constants/australian-tax";
import {
  groupByBand,
  hubHref,
  salaryFacts,
  salaryHref,
  salaryList,
  type SalaryFamily,
} from "@/lib/data/salary-pages";
import { JsonLd } from "@/modules/seo/json-ld";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import TrustBar from "@/components/common/trust-bar";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";

const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus hover:text-navy transition-colors font-medium";

const SOURCES: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "ATO" },
  { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: "ATO" },
  { title: "Study and training support loans", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: "ATO" },
];

export interface HubCopy {
  family: SalaryFamily;
  h1: string;
  crumb: string;
  intro: React.ReactNode;
  /** The figure printed beside each salary link. */
  figure: (salary: number) => string;
  figureLabel: string;
  linkLabel: (salary: number) => string;
}

function bandSummary(family: SalaryFamily, salaries: number[]): string {
  const lo = salaries[0];
  const hi = salaries[salaries.length - 1];
  const a = salaryFacts(lo);
  const b = salaryFacts(hi);
  const rates = [...new Set([a.bracketIndex, b.bracketIndex])].map((i) => `${Math.round(TAX_BRACKETS[i].rate * 100)}%`);
  const bracketText =
    rates.length === 1 ? `all in the ${rates[0]} bracket` : `spanning the ${rates.join(" and ")} brackets`;
  if (family === "salary-to-hourly") {
    return `${salaries.length} salaries, ${formatAUD(lo / EMPLOYMENT.hoursPerYear, 2)} to ${formatAUD(hi / EMPLOYMENT.hoursPerYear, 2)} an hour before tax (${bracketText}).`;
  }
  if (family === "tax-on") {
    return `${salaries.length} salaries, ${bracketText}: income tax runs from ${formatAUD(a.breakdown.netIncomeTax)} to ${formatAUD(b.breakdown.netIncomeTax)}.`;
  }
  return `${salaries.length} salaries, ${bracketText}: take-home runs from ${formatAUD(a.breakdown.takeHomePay)} to ${formatAUD(b.breakdown.takeHomePay)} a year.`;
}

export function SalaryHub({ copy, related }: { copy: HubCopy; related: { href: string; label: string }[] }) {
  const { family } = copy;
  const list = salaryList(family);
  const groups = groupByBand(list);
  const BASE = SITE_CONFIG.baseUrl;
  const URL = `${BASE}${hubHref(family)}`;

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: copy.crumb, item: URL },
    ],
  };
  const collection: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${URL}#webpage`,
    url: URL,
    name: copy.h1,
    inLanguage: "en-AU",
    isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: BASE },
  };

  return (
    <>
      <JsonLd code={[breadcrumb, collection, ORGANIZATION_SCHEMA]} />
      <section className="bg-sandstone/30 pt-16 pb-12 border-b border-sandstone-dark/20">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus transition-colors">Home</Link></li>
              <li className="text-warmgray/50">/</li>
              <li className="text-navy font-medium">{copy.crumb}</li>
            </ol>
          </nav>
          <h1 style={H} className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-6">{copy.h1}</h1>
          <div className="text-lg text-warmgray max-w-2xl mx-auto">{copy.intro}</div>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-12 pb-24">
        <div className="max-w-5xl mx-auto space-y-10">
          <TrustBar />

          <nav aria-label="Jump to salary band" className="flex flex-wrap gap-2">
            {groups.map(({ band }) => (
              <a key={band.id} href={`#${band.id}`} className="rounded-md border border-sandstone-dark/20 px-3 py-1.5 text-sm text-navy hover:border-eucalyptus hover:text-eucalyptus">
                {band.title}
              </a>
            ))}
          </nav>

          {groups.map(({ band, salaries }) => (
            <section key={band.id} id={band.id} aria-labelledby={`${band.id}-h`}>
              <h2 id={`${band.id}-h`} style={H} className="text-2xl font-bold text-navy mb-2">{band.title}</h2>
              <p className="text-sm text-warmgray mb-4">{bandSummary(family, salaries)}</p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {salaries.map((s) => (
                  <li key={s}>
                    <a href={salaryHref(family, s)} className="flex items-baseline justify-between gap-2 rounded-md border border-sandstone-dark/20 px-3 py-2 text-sm hover:border-eucalyptus hover:bg-sandstone/40">
                      <span className="font-medium text-navy">{copy.linkLabel(s)}</span>
                      <span className="text-warmgray" title={copy.figureLabel}>{copy.figure(s)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <p className="text-sm text-warmgray">
            Figures beside each salary: {copy.figureLabel}. {SITE_CONFIG.financialYear} resident tax rates, Medicare levy included, no HECS-HELP and private hospital cover assumed. Every page has the per-period breakdown, the HECS-HELP case and super.
          </p>

          <section>
            <h2 style={H} className="text-xl font-bold text-navy mb-3">Related</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {related.map((r) => (
                <li key={r.href}><a href={r.href} className={LINK}>{r.label}</a></li>
              ))}
            </ul>
          </section>

          <SourceAttribution sources={SOURCES} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </>
  );
}
