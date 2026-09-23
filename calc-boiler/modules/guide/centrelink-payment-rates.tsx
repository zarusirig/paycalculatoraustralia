import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD } from "@/lib/constants/australian-tax";
import {
  AGE_PENSION_RATES,
  AUSTUDY,
  CENTRELINK_SOURCES,
  JOBSEEKER_RATES,
  SEPTEMBER_2026,
  YOUTH_ALLOWANCE_JOBSEEKER,
  YOUTH_ALLOWANCE_STUDENT,
} from "@/lib/constants/centrelink-income-test";
import { DEEMING, DSP, MEANS_TEST_SOURCES } from "@/lib/constants/centrelink-means-test";
import { CARER_ALLOWANCE, CARER_PAYMENT, CARER_SUPPORT_SOURCES } from "@/lib/constants/centrelink-carer-and-support";
import {
  FAMILY_PAYMENT_SOURCES,
  FTB_A,
  FTB_B,
  PARENTING_PAYMENT,
  RENT_ASSISTANCE,
  RENT_ASSISTANCE_SITUATIONS,
} from "@/lib/constants/centrelink-family-payments";
import { CENTRELINK_PAYMENT_RATES_FAQS } from "./centrelink-payment-rates-faqs";
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

// /centrelink-payment-rates/ (J6, wave 4). One table page for every Centrelink
// payment the site already models. No figure is typed here: every number is
// read from lib/constants/centrelink-*.ts, which hold the verified sources.

const JS = JOBSEEKER_RATES[SEPTEMBER_2026];
const AP = AGE_PENSION_RATES[SEPTEMBER_2026];
const f2 = (n: number) => formatAUD(n, 2);
const pct = (r: number) => `${(r * 100).toFixed(2)}%`;
const LINK = "text-eucalyptus-dark hover:underline font-medium";

const SOURCES_LIST: SourceLink[] = [
  { title: CENTRELINK_SOURCES.dssRatesListTitle, url: CENTRELINK_SOURCES.dssRatesList, publisher: "Department of Social Services" },
  { title: "How much JobSeeker Payment you can get", url: CENTRELINK_SOURCES.jobseekerRates, publisher: "Services Australia" },
  { title: "How much Youth Allowance for students and apprentices you can get", url: CENTRELINK_SOURCES.youthAllowanceRates, publisher: "Services Australia" },
  { title: "How much Youth Allowance for job seekers you can get", url: CENTRELINK_SOURCES.youthAllowanceJobSeekerRates, publisher: "Services Australia" },
  { title: "How much Austudy you can get", url: CENTRELINK_SOURCES.austudyRates, publisher: "Services Australia" },
  { title: "How much Age Pension you can get", url: CENTRELINK_SOURCES.agePensionRates, publisher: "Services Australia" },
  { title: "Payment rates for Disability Support Pension", url: MEANS_TEST_SOURCES.dspRates, publisher: "Services Australia" },
  { title: "How much Carer Payment you can get", url: CARER_SUPPORT_SOURCES.carerPaymentRates, publisher: "Services Australia" },
  { title: "How much Carer Allowance you can get", url: CARER_SUPPORT_SOURCES.carerAllowanceRates, publisher: "Services Australia" },
  { title: "How much Parenting Payment you can get", url: FAMILY_PAYMENT_SOURCES.parentingPaymentRates, publisher: "Services Australia" },
  { title: "Family Tax Benefit Part A payment rates", url: FAMILY_PAYMENT_SOURCES.ftbARates, publisher: "Services Australia" },
  { title: "Family Tax Benefit Part B payment rates", url: FAMILY_PAYMENT_SOURCES.ftbBRates, publisher: "Services Australia" },
  { title: "How much Rent Assistance you can get", url: FAMILY_PAYMENT_SOURCES.rentAssistanceRates, publisher: "Services Australia" },
  { title: "Deeming", url: MEANS_TEST_SOURCES.deeming, publisher: "Services Australia" },
];

export default function CentrelinkPaymentRatesPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/centrelink-income-test/", label: "Centrelink" }, { label: "Centrelink Payment Rates" }]} />

      <PageHeader title="Centrelink Payment Rates from 20 September 2026">
        <p>
          <strong>From {JS.ratesFrom}, JobSeeker Payment is up to {f2(JS.maxFortnightly.single)} a fortnight for a single person, and the Age Pension is up to {f2(AP.maxFortnightly.single.total)} single or {f2(AP.maxFortnightly.coupleEach.total)} each for a couple, including supplements.</strong> The Disability Support Pension (21 and over) and Carer Payment are paid at the same pension rate. Student payments (Austudy and Youth Allowance) did not change in September because they are indexed on 1 January. Every rate below is the fortnightly maximum before the income and assets tests, and each payment links to a calculator that applies those tests to your income.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "JobSeeker (single)", v: f2(JS.maxFortnightly.single), s: "Per fortnight, from 20 Sep 2026" },
          { k: "Age Pension (single)", v: f2(AP.maxFortnightly.single.total), s: "Per fortnight, with supplements" },
          { k: "Parenting Payment Single", v: f2(PARENTING_PAYMENT.single.maxFortnightly), s: "Per fortnight, with Pension Supplement" },
          { k: "Next indexation", v: "20 Mar 2027", s: "Pensions, JobSeeker, Parenting Payment" },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="summary">All Centrelink Payment Rates at a Glance</H2>
            <p>The highest fortnightly rate for a single person on each payment, the date the rate applies from, and when it next changes.</p>
            <DataTable
              head={["Payment", "Maximum per fortnight", "Rates from", "Indexed", "Calculator"]}
              rows={[
                ["JobSeeker Payment", `${f2(JS.maxFortnightly.single)} single; ${f2(JS.maxFortnightly.partnered)} each partnered`, JS.ratesFrom, "20 Mar & 20 Sep", <Link key="js" href="/jobseeker-payment-calculator/" className={LINK}>JobSeeker</Link>],
                ["Youth Allowance (students)", `${f2(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.under18AtHome)} to ${f2(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.awayFromHome)}`, YOUTH_ALLOWANCE_STUDENT.ratesFrom, "1 Jan", <Link key="ya" href="/austudy-youth-allowance-calculator/" className={LINK}>Youth Allowance</Link>],
                ["Austudy", `${f2(AUSTUDY.maxFortnightly.singleNoChildren)} single, no children`, AUSTUDY.ratesFrom, "1 Jan", <Link key="au" href="/austudy-youth-allowance-calculator/" className={LINK}>Austudy</Link>],
                ["Age Pension", `${f2(AP.maxFortnightly.single.total)} single; ${f2(AP.maxFortnightly.coupleEach.total)} each couple`, AP.ratesFrom, "20 Mar & 20 Sep", <Link key="ap" href="/age-pension-income-test-calculator/" className={LINK}>Age Pension</Link>],
                ["Disability Support Pension (21+)", `${f2(DSP.rates21Plus.maxFortnightly.single.total)} single; ${f2(DSP.rates21Plus.maxFortnightly.coupleEach.total)} each couple`, DSP.ratesFrom, "20 Mar & 20 Sep", <Link key="dsp" href="/disability-support-pension-calculator/" className={LINK}>DSP</Link>],
                ["Carer Payment", `${f2(AP.maxFortnightly.single.total)} single; ${f2(AP.maxFortnightly.coupleEach.total)} each couple`, CARER_PAYMENT.ratesFrom, "20 Mar & 20 Sep", <Link key="cp" href="/carer-payment-calculator/" className={LINK}>Carer Payment</Link>],
                ["Carer Allowance", f2(CARER_ALLOWANCE.fortnightly), "1 January 2026", "1 Jan", <Link key="ca" href="/carer-allowance/" className={LINK}>Carer Allowance</Link>],
                ["Parenting Payment Single", `${f2(PARENTING_PAYMENT.single.maxFortnightly)} incl. Pension Supplement`, PARENTING_PAYMENT.ratesFrom, "20 Mar & 20 Sep", <Link key="pps" href="/parenting-payment-calculator/" className={LINK}>Parenting Payment</Link>],
                ["Parenting Payment Partnered", `${f2(PARENTING_PAYMENT.partnered.maxFortnightly)} each`, PARENTING_PAYMENT.ratesFrom, "20 Mar & 20 Sep", <Link key="ppp" href="/parenting-payment-calculator/" className={LINK}>Parenting Payment</Link>],
                ["Family Tax Benefit Part A", `${f2(FTB_A.maxFortnightly.age0to12)} per child 0–12; ${f2(FTB_A.maxFortnightly.age13to19)} per child 13–19`, `${FTB_A.financialYear} year`, "1 Jul", <Link key="ftba" href="/family-tax-benefit-calculator/" className={LINK}>FTB</Link>],
                ["Family Tax Benefit Part B", `${f2(FTB_B.maxFortnightly.youngestUnder5)} youngest under 5; ${f2(FTB_B.maxFortnightly.youngest5to18)} youngest 5–18`, `${FTB_B.financialYear} year`, "1 Jul", <Link key="ftbb" href="/family-tax-benefit-calculator/" className={LINK}>FTB</Link>],
                ["Rent Assistance", `Up to ${f2(RENT_ASSISTANCE.rows.single.max)} single, no children`, RENT_ASSISTANCE.ratesFrom, "20 Mar & 20 Sep", <Link key="ra" href="/rent-assistance-calculator/" className={LINK}>Rent Assistance</Link>],
              ]}
              caption={<>Fortnightly maximums before the income and assets tests. Read from the DSS rates list for the 20 September 2026 indexation and Services Australia&rsquo;s payment pages, verified {CENTRELINK_SOURCES.verifiedOn}.</>}
            />
          </section>

          <section>
            <H2 id="jobseeker">JobSeeker Payment Rates</H2>
            <p>
              JobSeeker is for people aged 22 to Age Pension age who are looking for work. These are the basic rates; the Energy Supplement is paid on top. Your payment reduces by 50 cents for each dollar of income between $150 and $256 a fortnight and by 60 cents above that.
            </p>
            <DataTable
              head={["Your situation", "Per fortnight"]}
              align={["l", "r"]}
              rows={[
                ["Single, no children", f2(JS.maxFortnightly.single)],
                ["Single, with a dependent child", f2(JS.maxFortnightly.singleWithChildren)],
                ["Single, 55 or older, on payment 9 months or more", f2(JS.maxFortnightly.singleOver55LongTerm)],
                ["Single, partial capacity to work", f2(JS.maxFortnightly.partialCapacity)],
                ["Single principal carer, exempt from mutual obligations", f2(JS.maxFortnightly.principalCarerExempt)],
                ["Partnered (each)", f2(JS.maxFortnightly.partnered)],
              ]}
              caption={<>From {JS.ratesFrom}. Services Australia, <a href={CENTRELINK_SOURCES.jobseekerRates} target="_blank" rel="noopener noreferrer">how much JobSeeker Payment you can get</a>.</>}
            />
            <p>
              A single person with no children stops getting any JobSeeker once their income reaches {f2(JS.publishedCutOff.single)} a fortnight. The <Link href="/jobseeker-payment-calculator/">JobSeeker payment calculator</Link> works out what you keep when you earn wages, and the <Link href="/centrelink-working-credit-calculator/">working credit calculator</Link> shows how credits protect your first higher fortnights.
            </p>
          </section>

          <section>
            <H2 id="students">Youth Allowance and Austudy Rates</H2>
            <p>
              Student payments are indexed on 1 January, so the rates from {YOUTH_ALLOWANCE_STUDENT.ratesFrom} still apply after the September indexation. Youth Allowance is for full-time students and Australian Apprentices aged 16 to 24; Austudy is for students aged 25 and over.
            </p>
            <DataTable
              head={["Youth Allowance (students and apprentices)", "Per fortnight"]}
              align={["l", "r"]}
              rows={[
                ["Single, under 18, living at home", f2(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.under18AtHome)],
                ["Single, 18 or older, living at home", f2(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.over18AtHome)],
                ["Single, living away from home", f2(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.awayFromHome)],
                ["Single, with children", f2(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.singleWithChildren)],
                ["Partnered, no children (each)", f2(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.coupleNoChildren)],
                ["Partnered, with children (each)", f2(YOUTH_ALLOWANCE_STUDENT.maxFortnightly.coupleWithChildren)],
              ]}
              caption={<>From {YOUTH_ALLOWANCE_STUDENT.ratesFrom}. Services Australia, <a href={CENTRELINK_SOURCES.youthAllowanceRates} target="_blank" rel="noopener noreferrer">Youth Allowance for students and apprentices</a>.</>}
            />
            <DataTable
              head={["Austudy", "Per fortnight"]}
              align={["l", "r"]}
              rows={[
                ["Single or partnered, no children", f2(AUSTUDY.maxFortnightly.singleNoChildren)],
                ["Single, with children", f2(AUSTUDY.maxFortnightly.singleWithChildren)],
                ["Partnered, with children", f2(AUSTUDY.maxFortnightly.coupleWithChildren)],
                ["Long-term income support, single, no children", f2(AUSTUDY.maxFortnightly.longTermSingleNoChildren)],
              ]}
              caption={<>From {AUSTUDY.ratesFrom}. Services Australia, <a href={CENTRELINK_SOURCES.austudyRates} target="_blank" rel="noopener noreferrer">how much Austudy you can get</a>.</>}
            />
            <p>
              Youth Allowance for job seekers (16 to 21, not studying full time) uses the same rates for the same situations, except the single principal carer exempt rate, which is {f2(YOUTH_ALLOWANCE_JOBSEEKER.maxFortnightly.singlePrincipalCarerExempt)} from {YOUTH_ALLOWANCE_JOBSEEKER.ratesFrom}. Students keep the full payment on income up to $539 a fortnight: see the <Link href="/austudy-youth-allowance-calculator/">Austudy and Youth Allowance calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="pensions">Age Pension, DSP and Carer Payment Rates</H2>
            <p>
              The Age Pension, Carer Payment and the Disability Support Pension for people 21 and over share one pension rate. The total is the basic rate plus the Pension Supplement and Energy Supplement.
            </p>
            <DataTable
              head={["Per fortnight", "Basic rate", "Pension Supplement", "Energy Supplement", "Total"]}
              align={["l", "r", "r", "r", "r"]}
              rows={[
                ["Single", f2(AP.maxFortnightly.single.basic), f2(AP.maxFortnightly.single.supplement), f2(AP.maxFortnightly.single.energy), f2(AP.maxFortnightly.single.total)],
                ["Couple (each)", f2(AP.maxFortnightly.coupleEach.basic), f2(AP.maxFortnightly.coupleEach.supplement), f2(AP.maxFortnightly.coupleEach.energy), f2(AP.maxFortnightly.coupleEach.total)],
                ["Couple (combined)", f2(AP.maxFortnightly.coupleCombined.basic), f2(AP.maxFortnightly.coupleCombined.supplement), f2(AP.maxFortnightly.coupleCombined.energy), f2(AP.maxFortnightly.coupleCombined.total)],
                ["Couple apart due to ill health (each)", f2(AP.maxFortnightly.coupleApartIllHealth.basic), f2(AP.maxFortnightly.coupleApartIllHealth.supplement), f2(AP.maxFortnightly.coupleApartIllHealth.energy), f2(AP.maxFortnightly.coupleApartIllHealth.total)],
              ]}
              caption={<>From {AP.ratesFrom}. DSS rates list for the 20 September 2026 indexation; Services Australia, <a href={CENTRELINK_SOURCES.agePensionRates} target="_blank" rel="noopener noreferrer">how much Age Pension you can get</a>.</>}
            />
            <p>
              A single pensioner&rsquo;s payment stops under the income test at {f2(AP.publishedCutOff.single)} a fortnight, and a couple&rsquo;s at {f2(AP.publishedCutOff.coupleCombined)} combined. The <Link href="/age-pension-income-test-calculator/">Age Pension income test calculator</Link> includes the Work Bonus, and the <Link href="/age-pension-assets-test-calculator/">assets test calculator</Link> shows which test sets your rate.
            </p>
            <DataTable
              head={["Disability Support Pension under 21, no children", "Per fortnight"]}
              align={["l", "r"]}
              rows={[
                ["Single, under 18, living at home", f2(DSP.under21.under18Dependent)],
                ["Single, under 18, independent", f2(DSP.under21.under18Independent)],
                ["Single, 18 to 20, living at home", f2(DSP.under21.age18to20Dependent)],
                ["Single, 18 to 20, independent", f2(DSP.under21.age18to20Independent)],
                ["Member of a couple, under 21 (each)", f2(DSP.under21.coupleUnder21)],
              ]}
              caption={<>Includes the Youth Disability Supplement; excludes Energy Supplement and Pharmaceutical Allowance. Indexed {DSP.under21IndexedOn}. Services Australia, <a href={MEANS_TEST_SOURCES.dspRates} target="_blank" rel="noopener noreferrer">payment rates for Disability Support Pension</a>.</>}
            />
            <p>
              Carer Payment recipients can also get Carer Allowance of {f2(CARER_ALLOWANCE.fortnightly)} a fortnight (indexed {CARER_ALLOWANCE.indexedOn}) and the yearly Carer Supplement of {formatAUD(CARER_ALLOWANCE.carerSupplementAnnual)}. See the <Link href="/carer-payment-calculator/">Carer Payment calculator</Link>, the <Link href="/carer-allowance/">Carer Allowance guide</Link> and the <Link href="/disability-support-pension-calculator/">DSP calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="families">Parenting Payment and Family Tax Benefit Rates</H2>
            <DataTable
              head={["Payment", "Per fortnight"]}
              align={["l", "r"]}
              rows={[
                ["Parenting Payment Single (basic rate)", f2(PARENTING_PAYMENT.single.basic)],
                ["Parenting Payment Single (with Pension Supplement)", f2(PARENTING_PAYMENT.single.maxFortnightly)],
                ["Parenting Payment Partnered (each)", f2(PARENTING_PAYMENT.partnered.maxFortnightly)],
                [`FTB Part A, maximum per child aged 0–12 (${FTB_A.financialYear})`, f2(FTB_A.maxFortnightly.age0to12)],
                [`FTB Part A, maximum per child aged 13–19 (${FTB_A.financialYear})`, f2(FTB_A.maxFortnightly.age13to19)],
                [`FTB Part A, base rate per child (${FTB_A.financialYear})`, f2(FTB_A.baseFortnightly)],
                [`FTB Part B, youngest child under 5 (${FTB_B.financialYear})`, f2(FTB_B.maxFortnightly.youngestUnder5)],
                [`FTB Part B, youngest child 5 to 18 (${FTB_B.financialYear})`, f2(FTB_B.maxFortnightly.youngest5to18)],
              ]}
              caption={<>Parenting Payment from {PARENTING_PAYMENT.ratesFrom}; Family Tax Benefit for the {FTB_A.financialYear} financial year. Services Australia, <a href={FAMILY_PAYMENT_SOURCES.parentingPaymentRates} target="_blank" rel="noopener noreferrer">Parenting Payment</a>, <a href={FAMILY_PAYMENT_SOURCES.ftbARates} target="_blank" rel="noopener noreferrer">FTB Part A</a> and <a href={FAMILY_PAYMENT_SOURCES.ftbBRates} target="_blank" rel="noopener noreferrer">FTB Part B</a>.</>}
            />
            <p>
              On top of the fortnightly rate, FTB Part A carries a yearly supplement of up to {formatAUD(FTB_A.supplementAnnual, 2)} per child (only when family income is {formatAUD(FTB_A.supplementIncomeLimit)} or less) and FTB Part B one of up to {formatAUD(FTB_B.supplementAnnual, 2)} per family, both paid after the year is balanced. Model your own family with the <Link href="/family-tax-benefit-calculator/">Family Tax Benefit calculator</Link> and the <Link href="/parenting-payment-calculator/">Parenting Payment calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="rent-assistance">Rent Assistance Rates</H2>
            <p>Rent Assistance pays 75 cents for each dollar of fortnightly rent above the threshold, up to the maximum. It is added to the payment you already get.</p>
            <DataTable
              head={["Your situation", "Rent threshold", "Maximum Rent Assistance", "Rent for the maximum"]}
              align={["l", "r", "r", "r"]}
              rows={RENT_ASSISTANCE_SITUATIONS.map((s) => {
                const row = RENT_ASSISTANCE.rows[s];
                return [row.label, f2(row.threshold), f2(row.max), f2(row.publishedMaxRent)];
              })}
              caption={<>Per fortnight, from {RENT_ASSISTANCE.ratesFrom}. Services Australia, <a href={FAMILY_PAYMENT_SOURCES.rentAssistanceRates} target="_blank" rel="noopener noreferrer">how much Rent Assistance you can get</a>.</>}
            />
            <p>Enter your rent in the <Link href="/rent-assistance-calculator/">Rent Assistance calculator</Link> to see your amount.</p>
          </section>

          <section>
            <H2 id="deeming">Deeming Rates</H2>
            <p>
              From {DEEMING.ratesFrom}, savings, shares and other financial assets are deemed to earn {pct(DEEMING.lowerRate)} up to the threshold and {pct(DEEMING.upperRate)} above it, whatever they actually earn. The deemed amount counts as income for pensions and allowances.
            </p>
            <DataTable
              head={["Situation", "Threshold", "Rate up to threshold", "Rate above"]}
              align={["l", "r", "r", "r"]}
              rows={[
                ["Single", formatAUD(DEEMING.thresholds.single), pct(DEEMING.lowerRate), pct(DEEMING.upperRate)],
                ["Pensioner couple (combined)", formatAUD(DEEMING.thresholds.pensionerCouple), pct(DEEMING.lowerRate), pct(DEEMING.upperRate)],
                ["Non-pensioner couple (each)", formatAUD(DEEMING.thresholds.nonPensionerCouple), pct(DEEMING.lowerRate), pct(DEEMING.upperRate)],
              ]}
              caption={<>Rates from {DEEMING.ratesFrom}; thresholds from {DEEMING.thresholdsFrom}. Services Australia, <a href={MEANS_TEST_SOURCES.deeming} target="_blank" rel="noopener noreferrer">deeming</a>.</>}
            />
            <p>See the <Link href="/deeming-rates/">deeming rates calculator</Link> for your own savings and the history of the rates.</p>
          </section>

          <section>
            <H2 id="indexation">When Centrelink Rates Change</H2>
            <DataTable
              head={["Indexed on", "Payments", "Next change"]}
              rows={[
                ["20 March and 20 September", "JobSeeker, Age Pension, DSP (21+), Carer Payment, Parenting Payment, Rent Assistance", "20 March 2027"],
                ["1 January", "Austudy, Youth Allowance (most rates), DSP under 21, Carer Allowance", "1 January 2027"],
                ["1 July", "Family Tax Benefit rates and income limits, deeming thresholds, income test free areas", "1 July 2027"],
              ]}
            />
            <p>
              Deeming rates are not indexed: they are set by {DEEMING.setBy}. The size of each increase follows inflation figures that are not yet published, so we do not forecast them. Your payment dates around public holidays are on the <Link href="/centrelink-payment-dates/">Centrelink payment dates</Link> page, and the <Link href="/centrelink-income-test/">Centrelink income test guide</Link> explains how earnings reduce each payment. JobSeeker, Youth Allowance, Austudy, Age Pension and Parenting Payment are taxable income; Family Tax Benefit is not. Put wages and payment together in the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> to see the year.
            </p>
          </section>

          <FaqSection faqs={CENTRELINK_PAYMENT_RATES_FAQS} label="Centrelink payment rates" />

          <PageFooter
            slug="centrelink-payment-rates"
            lastVerified={CENTRELINK_SOURCES.verifiedOn}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Every rate on this page is read from the same constants that drive the site&rsquo;s Centrelink calculators, which were checked against the Department of Social Services rates list for the 20 September 2026 indexation (published {CENTRELINK_SOURCES.dssRatesListPublished}) and the live Services Australia payment pages between 23 and 24 September 2026.</p>
              <p>Rates are fortnightly maximums before the income and assets tests. Energy Supplement and Pharmaceutical Allowance are shown only where the table says so. General information, not advice: Services Australia works out your actual payment.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/centrelink-income-test/", label: "Centrelink Income Test" },
          { href: "/jobseeker-payment-calculator/", label: "JobSeeker Calculator" },
          { href: "/age-pension-income-test-calculator/", label: "Age Pension Calculator" },
          { href: "/family-tax-benefit-calculator/", label: "Family Tax Benefit Calculator" },
          { href: "/rent-assistance-calculator/", label: "Rent Assistance Calculator" },
          { href: "/centrelink-payment-dates/", label: "Centrelink Payment Dates" },
        ]} />
      </div>
    </div></div>
  );
}
