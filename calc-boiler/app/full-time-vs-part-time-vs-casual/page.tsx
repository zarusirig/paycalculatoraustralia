import type { Metadata } from "next";
import FullTimeVsPartTimeVsCasualPage from "@/modules/guide/full-time-vs-part-time-vs-casual";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, WebPage, Article, WithContext } from "schema-dts";
import { faqPageSchema } from "@/lib/faq";
import { EMPLOYMENT_TYPE_GUIDE_FAQS } from "@/modules/guide/full-time-vs-part-time-vs-casual-faqs";
import { SITE_CONFIG } from "@/lib/constants";
import { AUTHORS } from "@/lib/authors";
import { pageDateModified, pageDatePublished } from "@/lib/page-dates";
import { withPageEnd } from "@/components/common/content-slots";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/full-time-vs-part-time-vs-casual/`;
const TITLE = "Full-Time vs Part-Time vs Casual — Complete Comparison";
const DESCRIPTION = "Full-time vs part-time vs casual: leave entitlements, notice periods, the 25% casual loading, casual conversion and which type suits your situation.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "Full-Time vs Part-Time vs Casual", item: URL },
  ]
};

const webPage: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  url: URL,
  description: DESCRIPTION,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
};

const article: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  datePublished: pageDatePublished("full-time-vs-part-time-vs-casual"),
  dateModified: pageDateModified("full-time-vs-part-time-vs-casual"),
  headline: TITLE,
  description: DESCRIPTION,
  author: AUTHORS["penny-ward"].jsonLd,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name, logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` } },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const faq = faqPageSchema(EMPLOYMENT_TYPE_GUIDE_FAQS);

function Page() {
  return (
    <>
      <JsonLd code={[breadcrumb, webPage, article, faq]} />
      <FullTimeVsPartTimeVsCasualPage />
    </>
  );
}

export default withPageEnd(Page, "/full-time-vs-part-time-vs-casual/");
