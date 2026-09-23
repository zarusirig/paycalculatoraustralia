import type { Metadata } from "next";
import Link from "next/link";
import { HourlyToSalary, ALL_RATES, annualFromHourly, hourlyRateSlug, hourlyRateFromSlug } from "@/modules/programmatic/hourly-to-salary";
import {
  calculatePayBreakdown,
  formatAUD,
  EMPLOYMENT,
  SITE_CONFIG,
} from "@/lib/constants/australian-tax";
import { AFTER_TAX_PART_TIME_HOURS, casualAfterTax, hourlyAfterTax } from "@/lib/constants/hourly-rates"; // G5
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { fitDescription } from "@/lib/seo-title";
import { withPageEnd } from "@/components/common/content-slots";

interface PageProps {
  params: Promise<{ rate: string }>;
}

export async function generateStaticParams() {
  return ALL_RATES.map((rate) => ({ rate: hourlyRateSlug(rate) }));
}

function figuresFor(rate: number) {
  const gross = annualFromHourly(rate);
  // No HECS: "after tax" is asked for someone without a study loan, and the
  // module's headline table uses the same basis.
  const breakdown = calculatePayBreakdown({ grossSalary: gross });
  return { gross, net: breakdown.takeHomePay, breakdown };
}

/** "$35" for whole-dollar rates, "$26.44" otherwise — matches how people search. */
function rateLabel(rate: number): string {
  return Number.isInteger(rate) ? formatAUD(rate) : formatAUD(rate, 2);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { rate: raw } = await params;
  const rate = hourlyRateFromSlug(raw);
  const { gross, net } = figuresFor(rate);

  return {
    // Leads with the answer in the searcher's phrasing ("$35 an hour is how
    // much a year"). "in Australia" separates us from US pages that answer on
    // a 40-hour week; the after-tax figure moves to the description.
    title: `${rateLabel(rate)} an Hour Is How Much a Year in Australia? ${formatAUD(gross)}`,
    description: fitDescription(
      `${rateLabel(rate)} an hour is ${formatAUD(gross)} a year before tax on a ${EMPLOYMENT.standardWeeklyHours}-hour week (${EMPLOYMENT.hoursPerYear.toLocaleString("en-AU")} hours), and ${formatAUD(net)} after tax (${formatAUD(hourlyAfterTax(rate).perWeek, 2)} a week) in ${SITE_CONFIG.financialYear}. Fortnightly, monthly, part-time and casual figures.`,
      `${rateLabel(rate)} an hour is ${formatAUD(gross)} a year before tax on a ${EMPLOYMENT.standardWeeklyHours}-hour week and ${formatAUD(net)} after tax (${formatAUD(hourlyAfterTax(rate).perWeek, 2)} a week) in ${SITE_CONFIG.financialYear}. Plus part-time and casual figures.`,
      `${rateLabel(rate)} an hour is ${formatAUD(gross)} a year before tax on a ${EMPLOYMENT.standardWeeklyHours}-hour week and ${formatAUD(net)} after tax (${formatAUD(hourlyAfterTax(rate).perWeek, 2)} a week) in ${SITE_CONFIG.financialYear}.`,
    ),
    alternates: { canonical: `${SITE_CONFIG.baseUrl}/hourly-to-salary/${raw}/` },
    openGraph: {
      title: `${formatAUD(rate, 2)} an Hour Is ${formatAUD(gross)} a Year`,
      description: `${formatAUD(net)} after tax on a ${EMPLOYMENT.standardWeeklyHours}-hour week.`,
      url: `${SITE_CONFIG.baseUrl}/hourly-to-salary/${raw}/`,
      siteName: SITE_CONFIG.name,
      type: "website",
      locale: "en_AU",
      images: ["/og-image.png"],
    },
  };
}

async function HourlyToSalaryPage({ params }: PageProps) {
  const { rate: raw } = await params;
  const rate = hourlyRateFromSlug(raw);
  const { gross, net } = figuresFor(rate);

  const BASE = SITE_CONFIG.baseUrl;
  const URL = `${BASE}/hourly-to-salary/${raw}/`;
  const hours = EMPLOYMENT.standardWeeklyHours;
  // G5
  const afterTax = hourlyAfterTax(rate);
  const casual = casualAfterTax(rate);

  const webApp: WithContext<WebApplication> = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${URL}#webpage`,
    url: URL,
    name: `${formatAUD(rate, 2)} an Hour to Annual Salary (Australia ${SITE_CONFIG.financialYear})`,
    description: `${formatAUD(rate, 2)} an hour is ${formatAUD(gross)} a year gross, ${formatAUD(net)} after tax.`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    creator: { "@type": "Organization", name: SITE_CONFIG.name },
    inLanguage: "en-AU",
  };

  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hourly to Annual Calculator",
        item: `${BASE}/hourly-to-annual-salary-calculator/`,
      },
      { "@type": "ListItem", position: 3, name: `${formatAUD(rate, 2)} an Hour to Salary`, item: URL },
    ],
  };

  // One list feeds both the visible FAQ section and the FAQPage markup, so the
  // two cannot drift. (Before, the markup's questions appeared nowhere on the
  // page, which Google's structured-data policy treats as hidden content.)
  const faqItems = [
    {
      q: `${formatAUD(rate, 2)} an hour is how much a year?`,
      a: `${formatAUD(rate, 2)} an hour is ${formatAUD(gross)} a year before tax, based on ${hours} hours a week over ${EMPLOYMENT.weeksPerYear} weeks. After income tax and the Medicare levy that is ${formatAUD(net)} a year.`,
    },
    {
      q: `${formatAUD(rate, 2)} an hour is how much a week?`,
      a: `On a ${hours}-hour week, ${formatAUD(rate, 2)} an hour is ${formatAUD(rate * hours, 2)} a week before tax.`,
    },
    {
      q: `How much is ${formatAUD(rate, 2)} an hour after tax?`,
      a: `${formatAUD(net)} a year, which works out to about ${formatAUD(net / EMPLOYMENT.hoursPerYear, 2)} an hour in the hand once income tax and the Medicare levy come out.`,
    },
    // G5: the after-tax phrasings ("$N an hour is how much a week after tax", fortnightly, casual)
    {
      q: `${rateLabel(rate)} an hour is how much a week after tax?`,
      a: `${formatAUD(afterTax.perWeek, 2)} a week after tax on a ${hours}-hour week, or ${formatAUD(afterTax.perFortnight, 2)} a fortnight and ${formatAUD(afterTax.perMonth, 2)} a month. At ${AFTER_TAX_PART_TIME_HOURS.map((h) => `${h} hours it is ${formatAUD(hourlyAfterTax(rate, h).perWeek, 2)}`).join(" and at ")} a week.`,
    },
    {
      q: `What is ${rateLabel(rate)} an hour casual after tax?`,
      a: `With a 25% casual loading the rate becomes ${formatAUD(casual.rate, 2)} an hour, which is ${formatAUD(casual.perWeek, 2)} a week after tax for ${hours} hours. The loading replaces paid leave, and some awards and agreements set it differently.`,
    },
  ];
  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(({ q, a }) => ({
      "@type": "Question" as const,
      name: q,
      acceptedAnswer: { "@type": "Answer" as const, text: a },
    })),
  };

  return (
    <>
      <JsonLd code={[webApp, breadcrumb, faq, ORGANIZATION_SCHEMA]} />

      <section className="bg-sandstone/30 pt-16 pb-12 border-b border-sandstone-dark/20">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-sm text-warmgray">
              <li>
                <Link href="/" className="hover:text-eucalyptus transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-warmgray/50">/</li>
              <li>
                <Link
                  href="/hourly-to-annual-salary-calculator/"
                  className="hover:text-eucalyptus transition-colors"
                >
                  Hourly to Annual Calculator
                </Link>
              </li>
              <li className="text-warmgray/50">/</li>
              <li className="text-navy font-medium">{formatAUD(rate, 2)} an Hour</li>
            </ol>
          </nav>

          <h1
            className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-6"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {rateLabel(rate)} an Hour Is How Much a Year?
          </h1>
          <p className="text-xl text-warmgray max-w-2xl mx-auto mb-8">
            {rateLabel(rate)} an hour is <strong className="text-navy">{formatAUD(gross)}</strong> a
            year before tax and <strong className="text-navy">{formatAUD(net)}</strong> after tax in{" "}
            {SITE_CONFIG.financialYear}, based on a {hours}-hour week.
          </p>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-12 pb-24">
        <HourlyToSalary rate={rate} />

        <section aria-labelledby="hourly-faq-heading" className="max-w-4xl mx-auto mt-16">
          <h2
            id="hourly-faq-heading"
            className="text-2xl font-bold text-navy mb-6"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Quick Answers
          </h2>
          <dl className="space-y-5">
            {faqItems.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-semibold text-navy">{q}</dt>
                <dd className="mt-1 text-warmgray leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}

export default withPageEnd(HourlyToSalaryPage, "/hourly-to-salary/[rate]/");
