import type { Metadata } from "next";
import Link from "next/link";
import { HourlyToSalary, TIER_1_RATES, annualFromHourly } from "@/modules/programmatic/hourly-to-salary";
import {
  calculatePayBreakdown,
  formatAUD,
  EMPLOYMENT,
  HECS_HELP,
  SITE_CONFIG,
} from "@/lib/constants/australian-tax";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebApplication, WithContext } from "schema-dts";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";

interface PageProps {
  params: Promise<{ rate: string }>;
}

export async function generateStaticParams() {
  return TIER_1_RATES.map((rate) => ({ rate: rate.toString() }));
}

function figuresFor(rate: number) {
  const gross = annualFromHourly(rate);
  const breakdown = calculatePayBreakdown({
    grossSalary: gross,
    includeHECS: gross >= HECS_HELP.minimumThreshold,
  });
  return { gross, net: breakdown.takeHomePay, breakdown };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { rate: raw } = await params;
  const rate = Number(raw);
  const { gross, net } = figuresFor(rate);

  return {
    // Leads with the answer and carries both figures, per the /tax-on/ pattern.
    title: `${formatAUD(rate, 2)} an Hour Is How Much a Year? ${formatAUD(gross)} (${formatAUD(net)} After Tax)`,
    description: `${formatAUD(rate, 2)} an hour is ${formatAUD(gross)} a year before tax and ${formatAUD(net)} after tax in Australia, on a ${EMPLOYMENT.standardWeeklyHours}-hour week. Weekly, fortnightly and monthly figures plus part-time hours, FY${SITE_CONFIG.financialYear}.`,
    alternates: { canonical: `${SITE_CONFIG.baseUrl}/hourly-to-salary/${raw}/` },
    openGraph: {
      title: `${formatAUD(rate, 2)} an Hour Is ${formatAUD(gross)} a Year`,
      description: `${formatAUD(net)} after tax on a ${EMPLOYMENT.standardWeeklyHours}-hour week.`,
      url: `${SITE_CONFIG.baseUrl}/hourly-to-salary/${raw}/`,
      siteName: SITE_CONFIG.name,
      type: "website",
      locale: "en_AU",
    },
  };
}

export default async function HourlyToSalaryPage({ params }: PageProps) {
  const { rate: raw } = await params;
  const rate = Number(raw);
  const { gross, net } = figuresFor(rate);

  const BASE = SITE_CONFIG.baseUrl;
  const URL = `${BASE}/hourly-to-salary/${raw}/`;
  const hours = EMPLOYMENT.standardWeeklyHours;

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

  // Answer text in structured data as well as on the page — this family is the
  // one the gap analysis found had no FAQPage markup at all.
  const faq: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${formatAUD(rate, 2)} an hour is how much a year?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${formatAUD(rate, 2)} an hour is ${formatAUD(gross)} a year before tax, based on ${hours} hours a week over ${EMPLOYMENT.weeksPerYear} weeks. After income tax and the Medicare levy that is ${formatAUD(net)} a year.`,
        },
      },
      {
        "@type": "Question",
        name: `${formatAUD(rate, 2)} an hour is how much a week?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `On a ${hours}-hour week, ${formatAUD(rate, 2)} an hour is ${formatAUD(rate * hours, 2)} a week before tax.`,
        },
      },
      {
        "@type": "Question",
        name: `How much is ${formatAUD(rate, 2)} an hour after tax?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${formatAUD(net)} a year, which works out to about ${formatAUD(net / EMPLOYMENT.hoursPerYear, 2)} an hour in the hand once income tax and the Medicare levy come out.`,
        },
      },
    ],
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
            {formatAUD(rate, 2)} an Hour Is How Much a Year?
          </h1>
          <p className="text-xl text-warmgray max-w-2xl mx-auto mb-8">
            {formatAUD(rate, 2)} an hour is <strong className="text-navy">{formatAUD(gross)}</strong> a
            year before tax and <strong className="text-navy">{formatAUD(net)}</strong> after tax,
            based on a {hours}-hour week.
          </p>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-12 pb-24">
        <HourlyToSalary rate={rate} />
      </div>
    </>
  );
}
