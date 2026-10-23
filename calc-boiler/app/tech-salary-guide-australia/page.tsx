import type { Metadata } from "next";
import TechSalaryGuideAustraliaPage from "@/modules/guide/tech-salary-guide-australia";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, WithContext } from "schema-dts";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { fitTitle } from "@/lib/seo-title";
import { TECH_INCOME_YEAR, TECH_ROLE_ROWS } from "@/modules/guide/tech-salary-guide-australia-data";
import { faqPageSchema } from "@/lib/faq";
import { TECH_SALARY_FAQS } from "@/modules/guide/tech-salary-guide-australia-faqs";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/tech-salary-guide-australia/`;
// Meta intent pass, 23 Oct 2026: title had no year or figure while the tech
// salary SERPs all show "2026"; both ends of the range come from the table the
// page renders (ATO Table 15 medians).
const TOP = TECH_ROLE_ROWS.reduce((a, b) => (b.medianSalary > a.medianSalary ? b : a));
const LOW = TECH_ROLE_ROWS.reduce((a, b) => (b.medianSalary < a.medianSalary ? b : a));
const TITLE = fitTitle(
  `Tech Salary Guide Australia 2026: IT Medians ${formatAUD(LOW.medianSalary)} to ${formatAUD(TOP.medianSalary)}`,
  "Tech Salary Guide Australia 2026 - Developer & Engineer Pay",
);
const DESCRIPTION = `Median pay for ${TECH_ROLE_ROWS.length} tech jobs on ATO ${TECH_INCOME_YEAR.replace("–", "-")} tax returns runs from ${formatAUD(LOW.medianSalary)} (${LOW.title.toLowerCase()}) to ${formatAUD(TOP.medianSalary)} (${TOP.title.toLowerCase()}), plus contractor day rates.`;
export const metadata: Metadata = withFeaturedImage({ title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION } });
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "IT & Tech Salary Guide", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: "Tech Salary Guide Australia - Developer & Engineer Pay", url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
const faq = faqPageSchema(TECH_SALARY_FAQS);
function Page() { return (<><JsonLd code={[breadcrumb, webPage, faq]} /><TechSalaryGuideAustraliaPage /></>); }

export default withPageEnd(Page, "/tech-salary-guide-australia/");
