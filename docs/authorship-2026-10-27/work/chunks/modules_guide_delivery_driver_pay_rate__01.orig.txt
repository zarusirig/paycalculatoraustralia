import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD } from "@/lib/constants";
import {
  DELIVERY_MSO,
  DELIVERY_MSO_SOURCES,
  DELIVERY_MSO_VERIFIED_ON,
  DELIVERY_RATE_PERIODS,
  DELIVERY_VEHICLES,
  deliveryFloor,
  deliveryRate,
} from "@/lib/constants/delivery-minimum-pay";
import { CENTS_PER_KM_RATES, CURRENT_CPK_YEAR } from "@/lib/constants/cents-per-km";
import DeliveryPayCalculator from "@/modules/calculator/delivery-pay-calculator";
import { DELIVERY_DRIVER_FAQS } from "./delivery-driver-pay-rate-faqs";
import {
  ARTICLE_CLASS,
  Breadcrumbs,
  DataTable,
  FaqSection,
  H2,
  KeyFigures,
  PAGE_INNER,
  PAGE_WRAP,
  PageFooter,
  PageHeader,
  RelatedSidebar,
} from "./t3-shared";
import FeaturedImage from "@/components/common/featured-image";

// /delivery-driver-pay-rate/ (Oct 2026 trending set, item 1). Rules and sources:
// lib/constants/delivery-minimum-pay.ts. The worked examples are arithmetic on
// made-up figures, labelled as such; the page makes no claim about earnings.

const SOURCES_LIST: SourceLink[] = [
  { title: "Interim On-Demand Delivery Employee-like Worker Minimum Standards Order (11 August 2026)", url: DELIVERY_MSO_SOURCES.order, publisher: "Fair Work Commission" },
  { title: "Decision [2026] FWCFB 211", url: DELIVERY_MSO_SOURCES.decision, publisher: "Fair Work Commission" },
  { title: "On-demand delivery workers' minimum pay rates and other standards start today (17 August 2026)", url: DELIVERY_MSO_SOURCES.fwoRelease, publisher: "Fair Work Ombudsman" },
  { title: "New minimum standards for on-demand delivery work", url: DELIVERY_MSO_SOURCES.fwoGuidance, publisher: "Fair Work Ombudsman" },
  { title: "TWU minimum standards orders applications (MS2024/1-3)", url: DELIVERY_MSO_SOURCES.majorCase, publisher: "Fair Work Commission" },
  { title: "Cents per kilometre method", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/cars-transport-and-travel/motor-vehicle-and-car-expenses/expenses-for-a-car-you-own-or-lease/cents-per-kilometre-method", publisher: "Australian Taxation Office" },
];

const p26 = DELIVERY_RATE_PERIODS[0];
const p27 = DELIVERY_RATE_PERIODS[1];
const CPK = CENTS_PER_KM_RATES[CURRENT_CPK_YEAR];

// Worked example, made-up figures: a van driver, 12 engaged hours, paid $350, 120 km.
const EX = deliveryFloor({ vehicle: "car-or-van", period: "2026", engagedMinutes: 12 * 60, paid: 350, km: 120, costPerKm: CPK });

export default function DeliveryDriverPayRatePage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/gig-economy-pay-guide/", label: "Gig Economy" }, { label: "Delivery Driver Pay Rate" }]} />

      <PageHeader title="Delivery Driver Pay Rate in Australia: the $31.30 an Hour Minimum">
        <p>
          <strong>From {DELIVERY_MSO.commences}, on-demand food and grocery delivery workers have a legal pay floor of at least {formatAUD(deliveryRate("bicycle-or-none"), 2)} an hour of engaged time</strong> ({formatAUD(deliveryRate("motorcycle-or-scooter"), 2)} on a motorcycle or petrol scooter, {formatAUD(deliveryRate("car-or-van"), 2)} in a car or van). It comes from the Fair Work Commission&rsquo;s first Minimum Standards Order and applies to workers on apps like Uber Eats and DoorDash when the work fits the order. It is before your fuel, repairs and tax.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Bike, e-bike, on foot", v: formatAUD(deliveryRate("bicycle-or-none"), 2), s: "An hour of engaged time" },
          { k: "Motorcycle or scooter", v: formatAUD(deliveryRate("motorcycle-or-scooter"), 2), s: "Petrol scooter or motorcycle" },
          { k: "Car or small van", v: formatAUD(deliveryRate("car-or-van"), 2), s: "Up to 1 tonne capacity" },
          { k: "In force from", v: DELIVERY_MSO.commences, s: "Rates rise 1 January 2027" },
        ]}
      />

      <div className="mb-12"><DeliveryPayCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <FeaturedImage placement="content" className="mt-0" />
          <section>
            <H2 id="what-changed">What the Minimum Standards Order Changed</H2>
            <p>
              The Fair Work Commission made the Interim On-Demand Delivery Employee-like Worker Minimum Standards Order on {DELIVERY_MSO.made} and it started on {DELIVERY_MSO.commences}. It is the first order of its kind. It sets a minimum hourly rate for delivery workers on apps and puts a floor under the whole earnings period, so what you are paid across the period has to reach the rate for the time you were engaged.
            </p>
            <p>
              The mechanism is a top-up. The platform adds up your hours of engaged time in an earnings period (which it sets, up to {DELIVERY_MSO.maxEarningsPeriodDays} days), multiplies them by the hourly rate for your vehicle, and compares the result to what it paid you. If you were paid less, it owes you the difference in the next earnings period or within {DELIVERY_MSO.topUpDueDays} days after it. If you were paid more, nothing changes.
            </p>
          </section>

          <section>
            <H2 id="rates">Delivery Minimum Rates by Vehicle</H2>
            <p>The rate depends on how you deliver. The order&rsquo;s own classes are below, with the rate table that applies now and the one that starts on 1 January 2027.</p>
            <DataTable
              head={["Class of vehicle", p26.label, p27.label]}
              align={["l", "r", "r"]}
              rows={DELIVERY_VEHICLES.map((v) => [v.label, `${formatAUD(p26.rates[v.id], 2)} an hour`, `${formatAUD(p27.rates[v.id], 2)} an hour`])}
              caption={<>Fair Work Commission, Minimum Standards Order clause 14.2 ({p26.clause} and {p27.clause}), read {DELIVERY_MSO_VERIFIED_ON}. From {DELIVERY_MSO.nextIndexation} the rates move each year by the percentage the Commission adds to the National Minimum Wage.</>}
            />
          </section>

          <section>
            <H2 id="who">Who the Order Covers (and Who It Doesn&rsquo;t)</H2>
            <p>
              It covers &ldquo;employee-like workers&rdquo;: people engaged through an app or website run by a digital labour platform operator, whose work across an earnings period is mainly collecting and delivering food, drinks, alcohol or groceries that a customer ordered online, to be delivered as soon as possible. The Fair Work Ombudsman describes them as independent contractors who usually use a vehicle such as a car or bike. The order also binds the platform operators that engage them.
            </p>
            <ul>
              <li><strong>Covered:</strong> food, drink and grocery delivery on an app, on foot, by bike, e-bike, scooter, motorcycle, car or small van.</li>
              <li><strong>Not covered:</strong> anyone using a vehicle with a carrying capacity of more than 1 tonne.</li>
              <li><strong>Not covered by this order:</strong> passenger rideshare driving and parcel &ldquo;last mile&rdquo; delivery. The Commission is still considering applications for those, and says it will review this order if it publishes a draft for either.</li>
              <li><strong>Employees:</strong> if a restaurant or store employs you directly to deliver, you are an employee under an award or the <Link href="/minimum-wage-australia/">National Minimum Wage</Link>, and this order does not apply to you.</li>
            </ul>
            <p>
              Which brand you use matters less than what you do. Uber Eats, DoorDash and similar food and grocery apps are digital labour platforms. If the work you do through the app fits the coverage test above, the order applies to the platform that engages you. If you are not sure, ask the platform or call the Fair Work Infoline on 13 13 94.
            </p>
          </section>

          <section>
            <H2 id="engaged-time">What Counts as Engaged Time</H2>
            <p>
              The floor is calculated on <strong>engaged time</strong>, not on the time you spend logged in. Engaged time is the period recorded in the app from when you accept an order until you complete it. If you accept a second order while still on the first, the second engagement starts when the first one finishes. An engagement can include several orders dispatched at different times, running from the first accepted to the last completed.
            </p>
            <p>The order says engaged time does <em>not</em> include:</p>
            <ul>
              <li>time after the customer cancels and you are told, unless the platform requires you to do something (such as returning the items), in which case it runs until that is done;</li>
              <li>time after you abandon the engagement before completing it;</li>
              <li>time lost to breakdowns, accidents or breaks, or for any other reason outside the platform&rsquo;s control;</li>
              <li>&ldquo;non-engaged time&rdquo;: waiting or delaying after the food was ready or after you collected it where the platform has evidence of the delay, claiming a delivery complete late, or taking an unreasonable route, including a stop of more than 5 minutes unrelated to the delivery.</li>
            </ul>
            <p>
              Non-engaged time is policed in steps. The platform must send you a first notification with its evidence, then a second one for a later engagement. Only after the second can later engagements with non-engaged time be excluded, and the notifications expire after {DELIVERY_MSO.nonEngagedNoticeExpiryMonths} months. If it turns out an engagement did not include non-engaged time, the platform must withdraw the notice. You can dispute exclusions through the platform&rsquo;s process and then the Fair Work Commission.
            </p>
            <p>
              Time away from the app is your choice and unpaid: you decide whether and when to accept engagements. The platform must give you the hours of engaged time and the amounts paid at the end of each earnings period, and keep the records for 7 years, which is what you check your own numbers against.
            </p>
          </section>

          <section>
            <H2 id="before-expenses">The Rate Is Before Your Costs</H2>
            <p>
              The most important point for take-home pay: the order makes the worker responsible for their own vehicle. You pay for registration, fuel or charging, maintenance, repairs, compulsory third-party insurance, any licences or checks the platform requires, and fines unless the platform directed you to do what led to the fine. The platform must hold personal accident insurance for you. None of those costs is reimbursed through the floor.
            </p>
            <p>
              So the figure to compare with a wage is not the {formatAUD(deliveryRate("bicycle-or-none"), 2)} to {formatAUD(deliveryRate("car-or-van"), 2)} hourly rate itself but what is left after those costs and after tax. The ATO&rsquo;s cents-per-kilometre rate for {CURRENT_CPK_YEAR} is {Math.round(CPK * 100)}c a km (capped at 5,000 km under that method), a ready estimate of car running costs; see <Link href="/cents-per-km/">cents per km</Link>. For a full tax view, use the <Link href="/rideshare-delivery-earnings-after-tax/">rideshare and delivery earnings after tax calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="worked-example">Worked Example (Made-Up Figures)</H2>
            <p>
              These numbers are invented to show the arithmetic. They are not what any driver earns. A van driver has 12 hours of engaged time in an earnings period and the platform paid {formatAUD(350, 2)}. They drove 120 km.
            </p>
            <DataTable
              head={["Step", "Working", "Result"]}
              align={["l", "l", "r"]}
              rows={[
                ["Floor", `12 hours x ${formatAUD(EX.rate, 2)}`, formatAUD(EX.floor, 2)],
                ["Paid", "From the earnings statement", formatAUD(350, 2)],
                ["Top-up owed", `${formatAUD(EX.floor, 2)} − ${formatAUD(350, 2)}`, formatAUD(EX.topUp, 2)],
                ["Vehicle cost", `120 km x ${Math.round(CPK * 100)}c`, `−${formatAUD(EX.vehicleCost, 2)}`],
                ["Left before tax", `${formatAUD(EX.entitledTotal, 2)} − ${formatAUD(EX.vehicleCost, 2)}`, formatAUD(EX.profitBeforeTax, 2)],
                ["Per engaged hour", `${formatAUD(EX.profitBeforeTax, 2)} ÷ 12`, formatAUD(EX.profitPerEngagedHour, 2)],
              ]}
              caption={`The payout per engaged hour was ${formatAUD(EX.effectiveHourly, 2)} against a ${formatAUD(EX.rate, 2)} floor, so a top-up applied. After a car's running costs the hourly figure is lower again, which is why the floor is not the same as take-home pay.`}
            />
          </section>

          <section>
            <H2 id="check-statement">How to Check Your Own Statement</H2>
            <ol>
              <li>Take the earnings statement for one earnings period, with the dates and the total the platform paid.</li>
              <li>Find the hours of engaged time for the same period. The platform has to provide this, along with the gross and net amounts paid, at the end of every earnings period.</li>
              <li>Multiply those hours (to the nearest minute) by the rate for your vehicle in the table above.</li>
              <li>If your total pay is less, the difference is your top-up. It is due in the next earnings period or within 7 days after it.</li>
              <li>If the numbers do not match, ask the platform for its records (it must supply them on request), then use its internal dispute process. The Commission can mediate, conciliate or give a non-binding opinion if that fails.</li>
            </ol>
            <p>The calculator above does steps 3 and 4 for you. For help, the Fair Work Ombudsman&rsquo;s page on the order is linked below, and the Fair Work Infoline is 13 13 94.</p>
          </section>

          <section>
            <H2 id="tax">Tax, ABN and GST for Delivery Workers</H2>
            <p>
              Independent delivery workers usually work under an ABN, so no tax is withheld from payments. Everything you receive from the platform is assessable income to report in your tax return, with the expenses above deductible to the extent they relate to the work. You may owe tax at the end of the year, so setting money aside as you go is sensible. GST registration is only compulsory once your GST turnover reaches $75,000, unlike rideshare driving where registration is required from the first trip. The <Link href="/rideshare-delivery-earnings-after-tax/">after-tax guide</Link>, the <Link href="/gig-economy-pay-guide/">gig economy guide</Link> and the <Link href="/contractor-pay-calculator/">contractor pay calculator</Link> explain each step. To turn an hourly rate into an annual figure, use the <Link href="/hourly-to-annual-salary-calculator/">hourly to annual salary calculator</Link> and the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="whats-next">What Happens Next</H2>
            <p>
              The rates step up on 1 January 2027 ({formatAUD(p27.rates["bicycle-or-none"], 2)}, {formatAUD(p27.rates["motorcycle-or-scooter"], 2)} and {formatAUD(p27.rates["car-or-van"], 2)}). From {DELIVERY_MSO.nextIndexation} they are adjusted every year by the National Minimum Wage increase from the annual wage review. The order is described as interim: the Commission will review it if it publishes a notice of intent and draft order for the TWU&rsquo;s other applications covering employee-like workers and road transport contractors doing &ldquo;last mile&rdquo; delivery. Check the sources below for any change.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/rideshare-delivery-earnings-after-tax/">Rideshare &amp; Delivery Earnings After Tax</Link>: GST, tax and what to set aside</li>
              <li><Link href="/gig-economy-pay-guide/">Gig Economy Pay Guide</Link>: ABN, BAS and deductions</li>
              <li><Link href="/contractor-pay-calculator/">Contractor Pay Calculator</Link>: your rate as a salary equivalent</li>
              <li><Link href="/cents-per-km/">Cents per Km</Link>: the ATO car expense rate</li>
              <li><Link href="/hourly-to-annual-salary-calculator/">Hourly to Annual Salary Calculator</Link></li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link></li>
            </ul>
          </section>

          <FaqSection faqs={DELIVERY_DRIVER_FAQS} label="Delivery driver pay" />

          <PageFooter
            slug="delivery-driver-pay-rate"
            lastVerified={DELIVERY_MSO_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Earnings floor = hours of engaged time (to the nearest minute) x the hourly rate for your vehicle, as clause 14.1 of the order prescribes. Top-up = floor − amount paid, never below zero. Vehicle cost = kilometres x your cost per km (default: the ATO&rsquo;s {Math.round(CPK * 100)}c cents-per-kilometre rate for {CURRENT_CPK_YEAR}, a rough placeholder). The optional tax estimate repeats your period over 365 days, applies the 2026-27 resident rates, the low income offset and the Medicare levy, and shows the share for the days in your period.</p>
              <p>General information, not advice. The order is interim and can change. Whether the order applies to you depends on your work and your platform; check with the Fair Work Ombudsman. The worked example uses made-up figures and says nothing about what delivery workers earn.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/rideshare-delivery-earnings-after-tax/", label: "Earnings After Tax (Rideshare & Delivery)" },
          { href: "/gig-economy-pay-guide/", label: "Gig Economy Pay Guide" },
          { href: "/contractor-pay-calculator/", label: "Contractor Pay Calculator" },
          { href: "/cents-per-km/", label: "Cents per Km" },
          { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to Annual Salary" },
        ]} />
      </div>
    </div></div>
  );
}
