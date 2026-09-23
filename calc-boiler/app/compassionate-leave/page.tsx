import type { Metadata } from "next";
import CompassionateLeavePage from "@/modules/guide/compassionate-leave";
import { COMPASSIONATE_LEAVE_FAQS } from "@/modules/guide/compassionate-leave-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";

// G3 (wave 4, 24 Sep 2026). Targets: compassionate leave 9.9k (KD 0),
// family and domestic violence leave 720 (DataForSEO, AU).

const SLUG = "compassionate-leave";
const TITLE = "Compassionate Leave Australia: 2 Days Paid Bereavement Leave";
const DESCRIPTION =
  "Compassionate leave is 2 days per occasion for a death or life-threatening illness in the family, stillbirth or miscarriage. Paid for permanent staff. Calculator.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://pay-calculator-australia.com/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://pay-calculator-australia.com/${SLUG}/`, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Compassionate Leave in Australia: 2 Days Bereavement Leave and Pay",
  crumbs: [{ name: "Leave", path: "/annual-leave-guide/" }, { name: "Compassionate Leave", path: `/${SLUG}/` }],
  faqs: COMPASSIONATE_LEAVE_FAQS,
  app: { name: "Compassionate Leave Pay Calculator", description: "Works out compassionate (bereavement) leave pay under the National Employment Standards: base rate × ordinary hours, up to 2 days per occasion; unpaid for casuals." },
  published: "2026-09-24",
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <CompassionateLeavePage />
    </>
  );
}
