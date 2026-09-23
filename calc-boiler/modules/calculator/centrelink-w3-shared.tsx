"use client";

// Shared layout pieces for the W3 Centrelink pages (carer payment, carer
// allowance, advance payment, crisis payment, Centrelink debt, cost of living
// payment). Visual language matches modules/calculator/centrelink-shared.tsx.

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { FONT, H2, INPUT, LABEL, LINK, clamp } from "./centrelink-shared";
import type { W3Faq } from "./centrelink-w3-faqs";

export function W3Hero({ crumb, title, children }: { crumb: string; title: string; children: ReactNode }) {
  return (
    <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
      <nav aria-label="breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-warmgray">
          <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
          <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
          <li><Link href="/centrelink-income-test/" className="hover:text-eucalyptus-dark hover:underline">Centrelink Income Test</Link></li>
          <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
          <li><span className="font-medium text-navy" aria-current="page">{crumb}</span></li>
        </ol>
      </nav>
      <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">{title}</h1>
      <div className="text-lg text-warmgray space-y-3">{children}</div>
      <TrustBar className="mt-4" />
    </section>
  );
}

export function W3Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 style={FONT} className={H2}>{title}</h2>
      {children}
    </section>
  );
}

export function MoneyInput({ id, label, value, onChange, max = 1_000_000, step = 10, hint, prefix = "$" }: {
  id: string; label: string; value: number; onChange: (n: number) => void; max?: number; step?: number; hint?: string; prefix?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>{label}</label>
      <div className="flex items-center">
        {prefix ? <span className="text-warmgray-light mr-2">{prefix}</span> : null}
        <input type="number" id={id} min={0} max={max} step={step} value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value || 0), 0, max))} className={INPUT} />
      </div>
      {hint ? <p className="text-xs text-warmgray-light mt-1">{hint}</p> : null}
    </div>
  );
}

export function W3Faqs({ faqs, topic }: { faqs: readonly W3Faq[]; topic: string }) {
  return (
    <section>
      <h2 style={FONT} className={H2}>Frequently Asked Questions</h2>
      <div className="sr-only"><h3>{topic} questions and answers</h3>{faqs.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}</div>
      <Accordion type="multiple">
        {faqs.map((f) => (<AccordionItem key={f.q} value={f.q}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent><p>{f.a}</p></AccordionContent></AccordionItem>))}
      </Accordion>
    </section>
  );
}

export function W3Footer({ sources, lastVerified, authorKey }: { sources: SourceLink[]; lastVerified: string; authorKey: string }) {
  const a = getGuideAuthorship(authorKey);
  return (
    <>
      <SourceAttribution sources={sources} lastVerified={lastVerified} />
      {a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null}
    </>
  );
}

export type W3PageKey = "carer-payment" | "carer-allowance" | "advance" | "crisis" | "debt" | "col" | "ppl" | "dsp"; // "dsp": G3

export function W3Related({ current }: { current: W3PageKey }) {
  const items: { key: string; href: string; label: string; blurb: string }[] = [
    { key: "hub", href: "/centrelink-income-test/", label: "Centrelink income test guide", blurb: "free areas, tapers and cut-offs for every payment" },
    { key: "carer-payment", href: "/carer-payment-calculator/", label: "Carer Payment calculator", blurb: "the pension-rate payment with the 100-hour work rule" },
    { key: "dsp", href: "/disability-support-pension-calculator/", label: "Disability Support Pension calculator", blurb: "DSP rates, the 29-hour work rule and the income test" }, // G3
    { key: "carer-allowance", href: "/carer-allowance/", label: "Carer Allowance", blurb: "the fortnightly supplement and its $250,000 income limit" },
    { key: "advance", href: "/centrelink-advance-payment/", label: "Centrelink advance payment calculator", blurb: "how much you can borrow and what comes off each fortnight" },
    { key: "crisis", href: "/centrelink-crisis-payment/", label: "Crisis Payment", blurb: "the one-off payment after an extreme circumstance" },
    { key: "debt", href: "/centrelink-debt/", label: "Centrelink debt", blurb: "overpayments, refunds and the income apportionment scheme" },
    { key: "col", href: "/cost-of-living-payment-2026/", label: "Cost of living payment 2026", blurb: "what actually exists this year" },
    { key: "ppl", href: "/parental-leave-pay/", label: "Paid Parental Leave calculator", blurb: "26 weeks from 1 July 2026, days, split and super" },
    { key: "jobseeker", href: "/jobseeker-payment-calculator/", label: "JobSeeker payment calculator", blurb: "what you keep when you work part-time" },
    { key: "pension", href: "/age-pension-income-test-calculator/", label: "Age Pension income test calculator", blurb: "with the Work Bonus applied" },
    { key: "parenting", href: "/parenting-payment-calculator/", label: "Parenting Payment calculator", blurb: "single and partnered" },
    { key: "fn", href: "/fortnightly-pay-calculator/", label: "Fortnightly pay calculator", blurb: "the gross fortnightly figure Centrelink asks for" },
  ];
  return (
    <ul className="space-y-2 text-warmgray">
      {items.filter((i) => i.key !== current).map((i) => (
        <li key={i.key}><Link href={i.href} className={LINK}>{i.label}</Link> &mdash; {i.blurb}</li>
      ))}
    </ul>
  );
}

export function Note({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  const cls = tone === "warn" ? "border-ochre/40 bg-ochre/10" : "border-eucalyptus bg-eucalyptus-light/40 border-l-4";
  return <div className={`rounded-xl border p-4 text-sm text-navy ${cls}`}>{children}</div>;
}
