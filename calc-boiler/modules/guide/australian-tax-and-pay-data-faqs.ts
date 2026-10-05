// One array renders the visible FAQ (modules/guide/australian-tax-and-pay-data.tsx)
// and emits the FAQPage JSON-LD (app/australian-tax-and-pay-data/page.tsx), so the
// two cannot drift (npm run check:faq). Figures come from lib/data/open-data.
import type { FaqItem } from "@/lib/faq";
import { OPEN_DATA, DATA_FILES, JSON_FILE } from "@/lib/data/open-data";

export const OPEN_DATA_FAQS: readonly FaqItem[] = [
  {
    q: "Can I reuse these Australian tax and pay tables?",
    a: `Yes. The tables are free to copy, republish and build on under ${OPEN_DATA.licenseName}. The only condition is a link back to ${OPEN_DATA.url}. The underlying facts come from the ATO and the Fair Work Commission, so check those pages for anything you rely on for a decision.`,
  },
  {
    q: "How many files are there and what formats are they in?",
    a: `${DATA_FILES.length} CSV files, one per table, plus one combined JSON file (${JSON_FILE}) that carries every table with its sources. All use plain header rows, dollar amounts as numbers without currency symbols, and rates as decimals (0.15 means 15%).`,
  },
  {
    q: "Does the data include future tax rates?",
    a: "Only rates that are already law. The 2027-28 resident scale (14% on income from $18,201 to $45,000) is legislated but not yet in force, and each row carries the status legislated_not_in_force. Nothing proposed or announced but not passed is included.",
  },
  {
    q: "Why are the Medicare levy thresholds labelled 2025-26?",
    a: "Because that is the latest year the ATO had published when this was checked. The ATO releases levy low-income thresholds well after the income year starts, so the file labels each figure with the year it belongs to rather than assuming a newer one.",
  },
  {
    q: "How often is the data updated?",
    a: "Whenever a source changes: tax scales and super rates on 1 July, the National Minimum Wage after each Annual Wage Review, and HELP thresholds when the ATO publishes them. The page shows the version and the date it was last checked against the sources.",
  },
];
