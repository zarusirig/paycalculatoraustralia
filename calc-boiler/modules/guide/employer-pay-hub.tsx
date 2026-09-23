"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import { EMPLOYERS, entryRate, topRate } from "@/lib/data/employer-pay";
import { PAY_RATES_HUB_FAQS } from "@/modules/guide/employer-pay-hub-faqs";

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const money = (v: number) => formatAUD(v, 2);

export default function EmployerPayHubPage() {
  const authorship = getGuideAuthorship("pay-rates");
  const byEntry = [...EMPLOYERS].sort((a, b) => entryRate(b).hourly - entryRate(a).hourly);

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Pay Rates by Employer</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl lg:mb-16">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            Pay Rates by Employer 2026 — Coles, Woolworths, Bunnings, McDonald&rsquo;s &amp; More
          </h1>
          <p className="mb-4 text-xl leading-relaxed text-warmgray">
            What Australia&rsquo;s biggest retail, fast food and other large employers pay per hour, read from each
            one&rsquo;s enterprise agreement or, where staff are award-covered, the modern award. Every
            employer page lists rates by level and by age, penalty rates and weekly pay.
          </p>
          <p className="mb-6 text-sm text-warmgray">
            Pay Calculator Australia is independent and not affiliated with any employer listed here.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="employers">
              <h2 style={HEADING_FONT}>Entry-level adult pay rate at each employer</h2>
              <p>
                The adult hourly rate at each employer&rsquo;s entry level, the casual rate, and the
                highest classification rate we publish. Sorted by entry-level rate.
              </p>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full min-w-[44rem] text-left text-sm text-warmgray">
                  <caption className="sr-only">Hourly pay rates by employer</caption>
                  <thead className="bg-sandstone font-semibold text-navy">
                    <tr>
                      <th scope="col" className="px-4 py-3">Employer</th>
                      <th scope="col" className="px-4 py-3">Set by</th>
                      <th scope="col" className="px-4 py-3 text-right">Entry adult</th>
                      <th scope="col" className="px-4 py-3 text-right">Casual</th>
                      <th scope="col" className="px-4 py-3 text-right">Top level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {byEntry.map((e) => {
                      const entry = entryRate(e);
                      const top = topRate(e);
                      return (
                        <tr key={e.slug}>
                          <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
                            <Link href={`/pay-rates/${e.slug}/`} className="underline decoration-eucalyptus/40 underline-offset-4 hover:text-eucalyptus-dark">
                              {e.name} pay rates
                            </Link>
                          </th>
                          <td className="px-4 py-3 text-xs">
                            {e.instrument.kind === "modern-award" ? "Modern award" : "Enterprise agreement"}
                            <span className="block text-warmgray">{e.instrument.title}</span>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-navy">{money(entry.hourly)}</td>
                          <td className="px-4 py-3 text-right">{money(entry.casualHourly)}</td>
                          <td className="px-4 py-3 text-right">{money(top.hourly)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-sm">
                Rates are before tax and for adults. Junior rates, weekend and evening penalty rates are
                on each employer&rsquo;s page.
              </p>
            </section>

            <section id="agreement-vs-award">
              <h2 style={HEADING_FONT}>Enterprise agreement or award: why the rates differ</h2>
              <p>
                Large employers such as supermarkets and hardware chains usually bargain an enterprise
                agreement with their staff. It sets its own classifications, rates and penalty
                structure, and replaces the award while it operates. Fast food franchisees and many
                pharmacies instead pay the modern award directly, so every store under that award
                pays at least the same minimum.
              </p>
              <p>
                An agreement can never pay a base rate below the award rate for the same work. When the
                annual wage review lifts the award above an agreement&rsquo;s rate, the employer has to
                pay the award rate until the agreement catches up. The award minimums are on our{" "}
                <Link href="/retail-award-rates/">retail award rates</Link> and{" "}
                <Link href="/hospitality-award-rates/">hospitality award rates</Link> pages, and the
                age percentages on <Link href="/junior-pay-rates/">junior pay rates</Link>.
              </p>
            </section>

            <section id="check-your-pay">
              <h2 style={HEADING_FONT}>Check your own pay</h2>
              <p>
                Find your level on your payslip, match it to your employer&rsquo;s table, then enter the
                rate and hours in the weekly pay calculator to see what should land in your account
                after tax.
              </p>
              <div className="not-prose my-8">
                <Link
                  href="/weekly-pay-calculator/"
                  className="inline-flex items-center gap-2 rounded-lg bg-eucalyptus-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-navy"
                >
                  <Calculator className="h-5 w-5" />
                  Weekly pay calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            <section id="faq">
              <h2 style={HEADING_FONT}>Employer pay rate questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {PAY_RATES_HUB_FAQS.map((faq, index) => (
                  <AccordionItem key={faq.q} value={`faq-${index}`} className="rounded-lg border bg-white px-4">
                    <AccordionTrigger className="text-left font-semibold text-navy">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-warmgray">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How these pages are sourced">
                <p>
                  Each employer page names the agreement or award its figures come from, with the
                  Fair Work Commission reference, the date the rates took effect and the date we read
                  them. Nothing is estimated. Where we could not verify part of an agreement, the page
                  says so rather than filling the gap.
                </p>
              </MethodologyDisclosure>
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">Employers</h3>
                  <div className="space-y-2">
                    {EMPLOYERS.map((e) => (
                      <Link
                        key={e.slug}
                        href={`/pay-rates/${e.slug}/`}
                        className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 transition-all hover:border-eucalyptus/40 hover:shadow-sm"
                      >
                        <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{e.name}</span>
                        <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                      </Link>
                    ))}
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
