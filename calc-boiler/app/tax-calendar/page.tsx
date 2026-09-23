import type { Metadata } from "next"; import TaxCalendarPage from "@/modules/guide/tax-calendar"; import { JsonLd } from "@/modules/seo/json-ld"; import type { BreadcrumbList, WebPage, WithContext } from "schema-dts"; import { SITE_CONFIG } from "@/lib/constants";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";
import { CALENDAR_YEAR } from "@/lib/constants/tax-calendar-2026-27";
const BASE = SITE_CONFIG.baseUrl; const URL = `${BASE}/tax-calendar/`;
const TITLE = `Australian Tax Calendar ${CALENDAR_YEAR.incomeYear} — Key Tax Dates & Deadlines`;
const DESCRIPTION = `Every key tax date for ${CALENDAR_YEAR.incomeYear}: ${RETURN_2026.incomeYear} tax returns due ${RETURN_2026.selfLodgeDueDate} (${RETURN_2026.agentDueDateMostPeople} via an agent), quarterly BAS and PAYG instalments, STP finalisation and Payday Super deadlines.`;
export const metadata: Metadata = { title: TITLE, description: DESCRIPTION, alternates: { canonical: URL }, openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "website", locale: "en_AU" } };
const breadcrumb: WithContext<BreadcrumbList> = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pay Calculator", item: BASE }, { "@type": "ListItem", position: 2, name: "Tax Calendar", item: URL }] };
const webPage: WithContext<WebPage> = { "@context": "https://schema.org", "@type": "WebPage", name: `Australian Tax Calendar ${CALENDAR_YEAR.incomeYear}`, description: DESCRIPTION, url: URL, publisher: { "@type": "Organization", name: SITE_CONFIG.name } };
export default function Page() { return (<><JsonLd code={[breadcrumb, webPage]} /><TaxCalendarPage /></>); }
