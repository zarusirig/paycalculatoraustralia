// =============================================================================
// Long service leave FAQ copy.
//
// This module deliberately has NO "use client". The hub and spoke page.tsx are
// server components that build FAQPage JSON-LD from these arrays; importing a
// plain value across a "use client" boundary yields a client-reference proxy,
// not the array, and `.map` then fails at page-data collection. Same split as
// jobseeker-payment-faqs.ts.
//
// The rendered accordion and the structured data read the same array, so the
// two cannot drift.
// =============================================================================

import {
  LSL_JURISDICTIONS,
  LSL_TAX,
  accruedWeeks,
  serviceFromParts,
  type JurisdictionCode,
} from "@/lib/constants/long-service-leave";

/** Weeks, formatted for prose. */
export function weeks(n: number, dp = 2) {
  return n.toFixed(dp);
}

export interface Faq {
  q: string;
  a: string;
}

// =============================================================================
// FAQs — questions chosen from real AU search demand (DataForSEO keyword ideas
// for "long service leave calculator", August 2026): "how much long service
// leave after 7 years", "after 10 years", "payout on resignation", "tax on
// long service leave payout", "cashing out long service leave", "long service
// leave for casuals".
// =============================================================================

export const LSL_HUB_FAQS: Faq[] = [
  {
    q: "How much long service leave do you get in Australia?",
    a: "It depends on the state or territory, because long service leave is not part of the National Employment Standards. Six jurisdictions — NSW, Victoria, Queensland, WA, Tasmania and the ACT — accrue about 0.8667 weeks a year, which is 8.667 weeks (two months) after 10 years. South Australia and the Northern Territory accrue 1.3 weeks a year, which is 13 weeks after 10 years, half as much again.",
  },
  {
    q: "How much long service leave do you get after 10 years?",
    a: "In NSW, Queensland, WA and Tasmania, 10 years of continuous service with one employer earns 8.667 weeks of paid long service leave. In South Australia and the Northern Territory it is 13 weeks. In Victoria and the ACT you can already take leave at 7 years, and by 10 years about 8.67 weeks has accrued.",
  },
  {
    q: "How much long service leave do you get after 7 years?",
    a: "In Victoria and the ACT, 7 years is the qualifying period: Victoria gives about 6.07 weeks and the ACT 6.0667 weeks, and you can take it. Everywhere else 7 years earns nothing you can take yet, but it is the point at which a pro-rata payment becomes possible if the job ends — in Queensland, WA, SA, Tasmania and the NT. NSW opens that window earlier, at 5 years.",
  },
  {
    q: "Do you get long service leave paid out if you resign?",
    a: "In Victoria, WA and South Australia, yes — once you pass 7 years the accrued balance is paid however the employment ends, resignation included (WA and SA except where you are dismissed for serious misconduct). In NSW, Queensland, Tasmania and the NT a plain resignation only pays out once you reach 10 years; below that you have to fall inside a defined list, such as illness, incapacity, domestic or other pressing necessity, redundancy or death.",
  },
  {
    q: "How is a long service leave payout taxed?",
    a: `Long service leave you take as leave is taxed like ordinary pay. An unused balance paid out when the job ends follows the ATO's separate schedule. For service after 17 August 1993 — which is everyone who started in the last 33 years — the payout is taxed at your marginal rate. If you leave through genuine redundancy, invalidity or an early retirement scheme, everything accrued after 15 August 1978 is instead withheld at a flat ${LSL_TAX.flatRate * 100}%. Service between 16 August 1978 and 17 August 1993 is withheld at ${LSL_TAX.flatRate * 100}% whatever the reason, and only 5% of any pre-16 August 1978 service is taxed at all.`,
  },
  {
    q: "Can you cash out long service leave?",
    a: "It varies. NSW, Victoria and the Northern Territory prohibit it — in NSW and Victoria it is an offence to give or receive payment instead of taking the leave. WA and Tasmania allow it by agreement once the entitlement has accrued. Queensland allows it only where an award or agreement provides for it, or where the Queensland Industrial Relations Commission orders it on compassionate grounds or financial hardship. SafeWork SA and WorkSafe ACT do not address it in the guidance we verified, so check with them.",
  },
  {
    q: "Do casual employees get long service leave?",
    a: "Yes, in every state and territory, provided the service is continuous. NSW, Victoria, Queensland, WA, South Australia, Tasmania and the NT all name casuals in their coverage, and WorkSafe ACT says casuals may also be covered. What varies is how a gap between engagements is treated: Victoria breaks continuity at 12 weeks between engagements unless an exception applies, and Queensland at 3 months between contracts. Queensland also uses a different formula for casuals and regular part-timers — total ordinary hours ÷ 52 × 8.6667 ÷ 10.",
  },
  {
    q: "Does long service leave carry over if the business is sold?",
    a: "Yes. Every jurisdiction we verified treats a transfer of business as continuous service, and the new employer inherits the liability for your whole period of employment — including the years with the previous owner. Victoria explicitly warns that failing to recognise it is a criminal offence under its Act.",
  },
  {
    q: "Is long service leave the same as annual leave?",
    a: "No. Annual leave is federal and identical everywhere: four weeks a year (five for some shift workers) under the National Employment Standards, accruing from your first day. Long service leave comes from a separate state or territory Act, takes 7 to 10 years to qualify for, and accrues at 0.8667 or 1.3 weeks a year. They are paid out together in your final pay but calculated separately.",
  },
  {
    q: "What if my award or enterprise agreement covers long service leave?",
    a: "Then the Act may not apply to you. Every jurisdiction excludes employees whose long service leave comes from a federal enterprise agreement or a pre-reform federal award with its own long service leave terms. Portable schemes for building and construction, contract cleaning, community services, security and black coal mining also sit outside these Acts. The Fair Work Ombudsman on 13 13 94 can confirm which applies to you.",
  },
];

export function spokeFaqs(code: JurisdictionCode): Faq[] {
  const j = LSL_JURISDICTIONS[code];
  const at10 = accruedWeeks(code, serviceFromParts(10));
  const at7 = accruedWeeks(code, serviceFromParts(7));
  const conditional = j.proRataUnconditionalFromYears > j.proRataFromYears;

  return [
    {
      q: `How much long service leave do you get after 10 years ${j.inName}?`,
      a: `${weeks(at10)} weeks. ${j.act} accrues ${j.weeksPerYear.toFixed(4)} weeks for every year of continuous service, and ${j.takeAfterYears === 10 ? `10 years is the point at which you can take it — ${j.weeksAtQualifying} weeks` : `you could already take leave from ${j.takeAfterYears} years`}. ${j.thereafter.charAt(0).toUpperCase()}${j.thereafter.slice(1)}.`,
    },
    {
      q: `How much long service leave do you get after 7 years ${j.inName}?`,
      a:
        j.takeAfterYears <= 7
          ? `${weeks(at7)} weeks, and you can take it — ${j.abbr} is one of only two jurisdictions where the qualifying period is 7 years rather than 10.`
          : `${weeks(at7)} weeks has accrued, but ${j.abbr} does not let you take long service leave until ${j.takeAfterYears} years. Seven years does matter for another reason: it is ${j.proRataFromYears === 7 ? "the point at which a pro-rata payment becomes possible if the job ends" : `past the ${j.proRataFromYears}-year point at which a pro-rata payment becomes possible if the job ends`}.`,
    },
    {
      q: `Do you get long service leave paid out if you resign ${j.inName}?`,
      a: conditional
        ? `Only from ${j.proRataUnconditionalFromYears} years if you simply resign. Between ${j.proRataFromYears} and ${j.proRataUnconditionalFromYears} years ${j.abbr} pays a pro-rata amount only where one of these applies: ${j.proRataConditions.join("; ")}. From ${j.proRataUnconditionalFromYears} years the accrued balance is paid however the employment ends.`
        : `Yes. From ${j.proRataFromYears} years of continuous service ${j.abbr} pays the accrued balance however the employment ends — resignation, dismissal, redundancy or death${code === "wa" ? ", the only exception being dismissal for serious misconduct" : code === "sa" ? ", unless you are dismissed for serious and wilful misconduct or you end the contract unlawfully" : ""}.`,
    },
    {
      q: `How is long service leave calculated ${j.inName}?`,
      a: `${j.act} accrues ${j.weeksPerYear.toFixed(4)} weeks for each year of continuous service, paid at your ordinary weekly rate at the time you take the leave or the job ends. ${
        j.proRataBasis === "completed-years"
          ? "Part years are dropped: 8½ years is paid as 8."
          : j.proRataBasis === "completed-years-and-months"
            ? "It is worked out on completed years and months."
            : "Part years count, down to the day."
      }${code === "vic" ? " The Act words it as one week for every 60 weeks of employment, which is the same thing." : ""}${code === "qld" ? " Casual and regular part-time employees use a separate hours formula: total ordinary hours ÷ 52 × 8.6667 ÷ 10." : ""}`,
    },
    {
      q: `Do casual employees get long service leave ${j.inName}?`,
      a: j.casualsNote,
    },
    {
      q: `Can you cash out long service leave ${j.inName}?`,
      a: j.cashingOutNote,
    },
    {
      q: `How much tax do you pay on a long service leave payout ${j.inName}?`,
      a: `Tax is federal, so it is the same in every state. If your service started after 17 August 1993, the payout is taxed at your marginal rate when you resign, retire or are dismissed. If you leave through genuine redundancy, invalidity or an early retirement scheme, the ATO withholds a flat ${LSL_TAX.flatRate * 100}% instead. No tax is withheld from unused leave paid after an employee's death.`,
    },
    {
      q: `Who is not covered by ${j.act}?`,
      a: `${j.agency} lists: ${j.notCovered.join("; ")}. If you are in one of those groups, your long service leave comes from somewhere else — check with the Fair Work Ombudsman on 13 13 94 or your scheme.`,
    },
  ];
}
