import type { Metadata } from "next";
import TeacherPayAustraliaPage from "@/modules/guide/teacher-pay-australia";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, FAQPage, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { teacherHubFaqs, teacherHubSummary } from "@/lib/data/teacher-pay/hub";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/teacher-pay-australia/`;

// Every figure in the title and description comes from the state files, so the
// snippet cannot promise a number the page does not show. Title, H1 and
// description stay national (no state names): state queries belong to the
// /teacher-pay-australia/{state}/ pages, which the rows below link to by name.
const summary = teacherHubSummary();
const TITLE = `Teacher Salary Australia ${summary.year} — Teacher Pay by State (All 8)`;
const DESCRIPTION = `Teacher salaries in every Australian state: graduates start on ${formatAUD(
  summary.lowestGraduate.graduate,
)} to ${formatAUD(summary.highestGraduate.graduate)} and the classroom scale tops out at ${formatAUD(
  summary.lowestTop.top,
)} to ${formatAUD(summary.highestTop.top)}, with take-home pay.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Teacher Pay Australia", item: URL },
  ],
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  url: URL,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

// Built from the same array the accordion renders.
const faq: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: teacherHubFaqs().map((f) => ({
    "@type": "Question" as const,
    name: f.q,
    acceptedAnswer: { "@type": "Answer" as const, text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, faq]} />
      <TeacherPayAustraliaPage />
    </>
  );
}
