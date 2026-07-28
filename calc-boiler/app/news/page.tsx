import type { Metadata } from "next";
import { JsonLd } from "@/modules/seo/json-ld";
import type { BreadcrumbList, CollectionPage, WithContext } from "schema-dts";
import { SITE_CONFIG } from "@/lib/constants";
import { getAllNews } from "@/lib/news";
import NewsIndexPage from "@/modules/news/index-page";

const BASE = SITE_CONFIG.baseUrl;
const URL = `${BASE}/news/`;
const TITLE = "Australian Pay & Tax News — Wage, Super & Tax Changes";
const DESCRIPTION = "The latest Australian pay news: minimum wage decisions, tax changes, superannuation rules, HECS updates and Centrelink payment increases — with what each change means for your take-home pay.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const collection: WithContext<CollectionPage> = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: TITLE,
  url: URL,
  description: DESCRIPTION,
  publisher: { "@type": "Organization", name: SITE_CONFIG.name },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: getAllNews().map((a, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      url: `${BASE}/news/${a.slug}/`,
      name: a.headline,
    })),
  },
};

const breadcrumb: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE },
    { "@type": "ListItem", position: 2, name: "News", item: URL },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd code={[collection, breadcrumb]} />
      <NewsIndexPage />
    </>
  );
}
