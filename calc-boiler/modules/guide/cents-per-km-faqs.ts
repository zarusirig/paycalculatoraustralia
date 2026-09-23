import { formatAUD } from "@/lib/constants";
import { CPK_KM_CAP, CURRENT_CPK_RATE, CURRENT_CPK_YEAR, PREVIOUS_CPK_RATE } from "@/lib/constants/cents-per-km";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources in
// lib/constants/cents-per-km.ts (ATO, read 23 September 2026).

const c = (d: number) => `${Math.round(d * 100)} cents`;
const MAX = formatAUD(CURRENT_CPK_RATE * CPK_KM_CAP);

export const CENTS_PER_KM_FAQS: Faq[] = [
  {
    q: `What is the ATO cents per km rate for ${CURRENT_CPK_YEAR}?`,
    a: `${c(CURRENT_CPK_RATE)} per kilometre from 1 July 2026, up from ${c(PREVIOUS_CPK_RATE)} in 2024-25 and 2025-26. You can claim up to ${CPK_KM_CAP.toLocaleString("en-AU")} work-related kilometres per car, a maximum deduction of ${MAX}.`,
  },
  {
    q: "What rate do I use for my 2025-26 tax return?",
    a: `${c(PREVIOUS_CPK_RATE)} per kilometre. The ${c(CURRENT_CPK_RATE)} rate applies to kilometres travelled in the 2026-27 income year, which you claim in the return you lodge after 30 June 2027.`,
  },
  {
    q: "Is a car allowance taxed?",
    a: `A cents per km car allowance for work travel, paid at or below the ATO rate for up to ${CPK_KM_CAP.toLocaleString("en-AU")} km, has no tax withheld but is still income you declare. Tax is withheld from any part paid above the ATO rate or for kilometres beyond ${CPK_KM_CAP.toLocaleString("en-AU")}. An allowance for home-to-work travel is taxed like wages.`,
  },
  {
    q: "Do I need receipts for cents per km?",
    a: "No. You need to show how you worked out your work-related kilometres, for example a diary or the myDeductions tool in the ATO app, and that you own or lease the car.",
  },
  {
    q: "Can I claim fuel on top of cents per km?",
    a: "No. The rate covers all running costs, including fuel, registration, insurance, maintenance, repairs and depreciation. Nothing else can be added for the same car.",
  },
  {
    q: "Can I claim cents per km if my employer pays me a car allowance?",
    a: "Yes, if the travel is work travel. Declare the allowance as income, then claim your car expenses for those kilometres with the cents per km or logbook method.",
  },
];
