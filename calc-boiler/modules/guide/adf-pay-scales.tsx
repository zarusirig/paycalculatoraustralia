import Link from "next/link";
import { Info } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import {
  ADF_PAY_EFFECTIVE,
  ADF_PAY_VERIFIED_ON,
  ADF_SERVICE_LIST,
  ATO_MEDICARE_DEFENCE_URL,
  OFFICER_SALARIES,
  OTHER_RANK_SALARIES,
  PACMAN_URLS,
  SERVICE_WARRANT_OFFICER_SALARY,
  TRAINEE_SALARIES,
  WO1_SALARIES,
  adfTakeHome,
  categoriesAtPayGrade,
  formatCategory,
  salaryRange,
  tablesForService,
  type AdfService,
  type AdfServiceKey,
  type RankSalaryTable,
} from "@/lib/data/adf-pay";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink, TableShell } from "./job-pay-shared";

const PAY_GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const ADF_SOURCES: SourceLink[] = [
  { title: "PACMAN Chapter 3 Part 1: Salaries", publisher: "Department of Defence — ADF Pay and Conditions", url: PACMAN_URLS.salaries },
  { title: "Schedule B.12: Other rank salary rates", publisher: "Department of Defence — ADF Pay and Conditions", url: PACMAN_URLS.otherRanks },
  { title: "Schedule B.3: Officer salary rates", publisher: "Department of Defence — ADF Pay and Conditions", url: PACMAN_URLS.officers },
  { title: "Schedule B.10: Service Warrant Officer and Warrant Officer Class 1 salary rates", publisher: "Department of Defence — ADF Pay and Conditions", url: PACMAN_URLS.warrantOfficers },
  { title: "Schedule B.13: Trainee salary rates", publisher: "Department of Defence — ADF Pay and Conditions", url: PACMAN_URLS.trainees },
  { title: "Schedule B.11: Other rank pay grades", publisher: "Department of Defence — ADF Pay and Conditions", url: PACMAN_URLS.otherRankPayGrades },
  { title: "Category 1: Medical exemption from Medicare levy", publisher: "Australian Taxation Office", url: ATO_MEDICARE_DEFENCE_URL },
];

export const ADF_HUB_FAQS = [
  {
    q: "How much does a Private earn in the Australian Army?",
    a: `A Private in the Permanent Forces earns $79,096 a year at pay grade 1, rising to $126,292 at pay grade 10, under the PACMAN salary rates effective ${ADF_PAY_EFFECTIVE}. Your pay grade depends on your employment category (your job), not just your rank. The Navy (Seaman) and Air Force (Aircraftman) equivalents are on the same scale.`,
  },
  {
    q: "What do ADF recruits get paid during training?",
    a: `A normal entry recruit is paid $60,517 a year during basic recruit training. During initial trade or employment training the rate is $69,162 for the first 6 months, $72,621 from 6 to 12 months and $76,079 after 12 months (PACMAN Schedule B.13).`,
  },
  {
    q: "What is an ADF pay grade?",
    a: "Each employment category — Rifleman, Cook, Electrician, Aircraft Technician and so on — is assigned a pay grade from 1 to 10 in PACMAN Schedule B.11. Your salary is set by your rank, your pay grade and your increment within the rank. Two members of the same rank can be paid very differently because of their pay grade.",
  },
  {
    q: "How much does an ADF officer earn?",
    a: "A newly commissioned officer (Second Lieutenant, Acting Sub-Lieutenant or Pilot Officer) earns from $87,091 a year. A Lieutenant Colonel, Commander or Wing Commander earns $159,440 to $220,780, and a Colonel, Captain (Navy) or Group Captain up to $248,376, depending on pay grade and increment.",
  },
  {
    q: "Is ADF pay taxed?",
    a: "Yes. ADF salary is taxed at ordinary resident rates. A member who is entitled to full free medical treatment for all conditions under Defence Force arrangements may be exempt from all or half of the Medicare levy, depending on their dependants — claim it in your tax return. The take-home figures on this page show both cases.",
  },
  {
    q: "When did ADF pay last increase?",
    a: `The salary rates on this page are the rates PACMAN lists as effective ${ADF_PAY_EFFECTIVE}. We re-check PACMAN when Defence announces the next increase.`,
  },
];

function SalaryGrid({ table, service }: { table: RankSalaryTable; service?: AdfServiceKey }) {
  const title = service ? table.names[service] ?? table.pacmanHeading : table.pacmanHeading;
  return (
    <div className="not-prose my-6">
      <h4 className="mb-2 text-lg font-bold text-navy" style={HEADING_FONT} id={`rank-${table.id}`}>
        {title}
      </h4>
      <TableShell minWidth="56rem" caption={`${title} salary by increment and pay grade`}>
        <thead className="bg-sandstone text-xs font-semibold text-navy">
          <tr>
            <th scope="col" className="px-3 py-2">Increment</th>
            {PAY_GRADES.map((pg) => (
              <th key={pg} scope="col" className="px-3 py-2 text-right">PG {pg}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white text-xs">
          {table.rows.map((r) => (
            <tr key={r.increment}>
              <th scope="row" className="whitespace-nowrap px-3 py-2 text-left font-medium text-navy">{r.increment}</th>
              {r.salaries.map((v, i) => (
                <td key={i} className="px-3 py-2 text-right tabular-nums">{v === null ? "—" : formatAUD(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </TableShell>
    </div>
  );
}

function RankSummary({ tables, service }: { tables: RankSalaryTable[]; service?: AdfServiceKey }) {
  return (
    <TableShell minWidth="44rem" caption="ADF salary range by rank">
      <thead className="bg-sandstone font-semibold text-navy">
        <tr>
          <th scope="col" className="px-4 py-3">Rank</th>
          <th scope="col" className="px-4 py-3 text-right">Lowest salary</th>
          <th scope="col" className="px-4 py-3 text-right">Highest salary</th>
          <th scope="col" className="px-4 py-3 text-right">Take-home at lowest</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-sandstone-dark/20 bg-white">
        {tables.map((t) => {
          const { min, max } = salaryRange(t);
          const net = adfTakeHome(min);
          const name = service
            ? t.names[service]
            : [t.names.navy, t.names.army, t.names.airForce].filter((n, i, a) => n && a.indexOf(n) === i).join(" / ");
          return (
            <tr key={t.id}>
              <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
                <a href={`#rank-${t.id}`} className="hover:text-eucalyptus-dark hover:underline">{name}</a>
              </th>
              <td className="px-4 py-3 text-right">{formatAUD(min)}</td>
              <td className="px-4 py-3 text-right">{formatAUD(max)}</td>
              <td className="px-4 py-3 text-right">
                {formatAUD(net.net)}
                <span className="block text-xs text-warmgray">{formatAUD(net.netIfLevyExempt)} if levy-exempt</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </TableShell>
  );
}

function TakeHomeNote() {
  return (
    <p className="text-base">
      Take-home uses 2026–27 resident tax rates with the low income tax offset and the 2% Medicare levy, and no
      HECS-HELP. A member entitled to full free medical treatment under Defence arrangements may be{" "}
      <a href={ATO_MEDICARE_DEFENCE_URL} target="_blank" rel="noreferrer noopener">
        exempt from all or half of the Medicare levy
      </a>{" "}
      depending on their dependants, so we also show the figure with the levy fully exempted. Check any salary exactly
      with the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
    </p>
  );
}

function TraineeTable() {
  return (
    <TableShell minWidth="30rem" caption="ADF trainee salary rates">
      <thead className="bg-sandstone font-semibold text-navy">
        <tr>
          <th scope="col" className="px-4 py-3">Training stage</th>
          <th scope="col" className="px-4 py-3 text-right">Yearly salary</th>
          <th scope="col" className="px-4 py-3 text-right">Take-home</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-sandstone-dark/20 bg-white">
        {TRAINEE_SALARIES.map((t) => (
          <tr key={t.label}>
            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">{t.label}</th>
            <td className="px-4 py-3 text-right">{formatAUD(t.salary)}</td>
            <td className="px-4 py-3 text-right">{formatAUD(adfTakeHome(t.salary).net)}</td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

function Footer() {
  const authorship = getGuideAuthorship("adf-pay-scales");
  return (
    <div className="not-prose mt-12">
      <MethodologyDisclosure title="How this page is sourced">
        <p>
          Every salary was read from the ADF Pay and Conditions Manual (PACMAN), Chapter 3 Part 1, on{" "}
          {ADF_PAY_VERIFIED_ON}. PACMAN states the rates are the &ldquo;ADF Military Salary &ndash; {ADF_PAY_EFFECTIVE}
          &rdquo; rates. The large tables were extracted programmatically from PACMAN and checked against PACMAN&rsquo;s
          own published example (Lieutenant, pay grade 4, increment 1: $111,517). Nothing is estimated.
        </p>
        <p>
          Allowances are not included: PACMAN&rsquo;s allowance-rate pages could not be read when this page was checked,
          so we do not publish allowance amounts. Reserve members are paid daily rates, which are not shown.
        </p>
      </MethodologyDisclosure>
      <SourceAttribution sources={ADF_SOURCES} lastVerified={ADF_PAY_VERIFIED_ON} />
      {authorship ? (
        <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
      ) : null}
    </div>
  );
}

function Sidebar({ current }: { current?: string }) {
  return (
    <aside className="lg:w-1/3">
      <div className="sticky top-8 space-y-3">
        <h2 className="mb-2 text-base font-bold text-navy">ADF pay by service</h2>
        {current ? <SidebarLink href="/adf-pay-scales/" label="All ADF pay scales" /> : null}
        {ADF_SERVICE_LIST.filter((s) => s.slug !== current).map((s) => (
          <SidebarLink key={s.slug} href={`/adf-pay-scales/${s.slug}/`} label={`${s.name} pay scales`} />
        ))}
        <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
        <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
        <SidebarLink href="/public-service-pay-scales/" label="Public Service Pay Scales" />
        <SidebarLink href="/job-pay-rates/" label="Job Pay Rates" />
      </div>
    </aside>
  );
}

function Notices() {
  return (
    <div className="not-prose mb-8 flex gap-3 rounded-lg border border-sandstone-dark/30 bg-sandstone/50 p-4">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-eucalyptus-dark" aria-hidden="true" />
      <p className="text-sm text-navy">
        Permanent Forces salaries effective {ADF_PAY_EFFECTIVE}, from PACMAN. These are base salaries only —
        allowances such as the ADF Military Factor and location allowances can be paid on top and are not
        included.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hub: /adf-pay-scales/
// ---------------------------------------------------------------------------

export function AdfPayScalesHub() {
  const pte = OTHER_RANK_SALARIES.find((t) => t.id === "pte")!;
  const pteRange = salaryRange(pte);
  const o1 = salaryRange(OFFICER_SALARIES.find((t) => t.id === "o1")!);
  const otherRanks = [WO1_SALARIES, ...OTHER_RANK_SALARIES];

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs trail={[{ href: "/", label: "Pay Calculator" }, { label: "ADF Pay Scales" }]} />
        <header className="mb-10 max-w-4xl lg:mb-14">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            ADF Pay Scales 2026 — Army, Navy &amp; Air Force Salary by Rank
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">
            A Private, Seaman or Aircraftman in the Permanent Forces earns{" "}
            <strong className="text-navy">{formatAUD(pteRange.min)} to {formatAUD(pteRange.max)}</strong> a year
            depending on pay grade, and a newly commissioned officer from {formatAUD(o1.min)}. Recruits are paid{" "}
            {formatAUD(TRAINEE_SALARIES[0].salary)} during basic training. Every figure is from the ADF Pay and
            Conditions Manual, effective {ADF_PAY_EFFECTIVE}.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <Notices />

            <section id="how-adf-pay-works">
              <h2 style={HEADING_FONT}>How ADF pay works: rank, pay grade and increment</h2>
              <p>
                ADF salaries are set by the Defence Force Remuneration Tribunal and published in the ADF Pay and
                Conditions Manual (PACMAN). Three things decide your salary:
              </p>
              <ul>
                <li>
                  <strong>Rank</strong> — the same scale applies across the services, so a Navy Petty Officer, an Army
                  Sergeant and an Air Force Sergeant are paid from one table.
                </li>
                <li>
                  <strong>Pay grade (1 to 10)</strong> — set by your employment category, your job. PACMAN Schedule
                  B.11 places every category at a pay grade; technical and specialist trades sit higher.
                </li>
                <li>
                  <strong>Increment</strong> — a step within the rank. PACMAN lists the increments for each rank; the
                  rules for moving between them are in PACMAN Chapter 3.
                </li>
              </ul>
              <p>
                See which pay grade your job is on for the{" "}
                {ADF_SERVICE_LIST.map((s, i) => (
                  <span key={s.slug}>
                    {i > 0 ? (i === ADF_SERVICE_LIST.length - 1 ? " or " : ", ") : ""}
                    <Link href={`/adf-pay-scales/${s.slug}/`}>{s.name}</Link>
                  </span>
                ))}
                .
              </p>
            </section>

            <section id="salary-by-rank">
              <h2 style={HEADING_FONT}>ADF salary by rank, 2026</h2>
              <h3 style={HEADING_FONT}>Other ranks</h3>
              <RankSummary tables={otherRanks} />
              <h3 style={HEADING_FONT}>Officers</h3>
              <RankSummary tables={OFFICER_SALARIES} />
              <TakeHomeNote />
              <p>
                The Service Warrant Officer — the senior warrant officer position — is paid{" "}
                {formatAUD(SERVICE_WARRANT_OFFICER_SALARY)} a year (Schedule B.10).
              </p>
            </section>

            <section id="trainees">
              <h2 style={HEADING_FONT}>Recruit and trainee pay</h2>
              <TraineeTable />
              <p>
                Officer cadets, ADFA and university-sponsored trainees are paid from separate rows of Schedule B.13, which
                depend on the entry scheme and year of study; see{" "}
                <a href={PACMAN_URLS.trainees} target="_blank" rel="noreferrer noopener">PACMAN Schedule B.13</a>.
              </p>
            </section>

            <section id="full-tables">
              <h2 style={HEADING_FONT}>Full ADF pay scales by increment and pay grade</h2>
              <p>Yearly salary, Permanent Forces. Columns are pay grades 1 to 10; rows are increments, highest first.</p>
              <h3 style={HEADING_FONT}>Warrant Officer Class 1</h3>
              <SalaryGrid table={WO1_SALARIES} />
              <h3 style={HEADING_FONT}>Other ranks</h3>
              {OTHER_RANK_SALARIES.map((t) => (
                <SalaryGrid key={t.id} table={t} />
              ))}
              <h3 style={HEADING_FONT}>Officers</h3>
              {OFFICER_SALARIES.map((t) => (
                <SalaryGrid key={t.id} table={t} />
              ))}
            </section>

            <section id="not-shown">
              <h2 style={HEADING_FONT}>What this page does not show</h2>
              <ul>
                <li>Allowances, including the ADF Military Factor and location allowances.</li>
                <li>Reserve daily rates (Part 2 of each PACMAN schedule).</li>
                <li>
                  Specialist officer structures (medical, dental, legal, chaplain and aviation), senior officers of
                  one-star rank and above, and the nuclear-submariner and cyber warfare salary divisions.
                </li>
              </ul>
            </section>

            <section id="faq">
              <h2 style={HEADING_FONT}>ADF pay questions</h2>
              <FaqList faqs={ADF_HUB_FAQS} />
            </section>

            <Footer />
          </article>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Service spoke: /adf-pay-scales/{army,navy,air-force}/
// ---------------------------------------------------------------------------

export function serviceFaqs(service: AdfService) {
  const k = service.key;
  const pte = OTHER_RANK_SALARIES.find((t) => t.id === "pte")!;
  const sgt = OTHER_RANK_SALARIES.find((t) => t.id === "sgt")!;
  const o1 = OFFICER_SALARIES.find((t) => t.id === "o1")!;
  const pteR = salaryRange(pte);
  const sgtR = salaryRange(sgt);
  const o1R = salaryRange(o1);
  return [
    {
      q: `How much does a ${pte.names[k]} earn in the ${service.fullName}?`,
      a: `A ${pte.names[k]} earns ${formatAUD(pteR.min)} a year at pay grade 1 and ${formatAUD(pteR.max)} at pay grade 10 (PACMAN, effective ${ADF_PAY_EFFECTIVE}). The pay grade comes from your employment category.`,
    },
    {
      q: `How much does a ${sgt.names[k]} earn in the ${service.name}?`,
      a: `A ${sgt.names[k]} earns ${formatAUD(sgtR.min)} to ${formatAUD(sgtR.max)} a year, depending on pay grade and increment.`,
    },
    {
      q: `What does a new ${service.name} officer earn?`,
      a: `A ${o1.names[k]} earns from ${formatAUD(o1R.min)} a year, rising to ${formatAUD(o1R.max)} depending on pay grade and increment.`,
    },
    {
      q: `What pay grade is my ${service.name} job?`,
      a: `PACMAN Schedule B.11 lists every ${service.name} employment category against a pay grade from 1 to 10. This page reproduces that list — find your category in the pay-grade section above.`,
    },
  ];
}

export function AdfServicePage({ service }: { service: AdfService }) {
  const k = service.key;
  const ors = tablesForService([WO1_SALARIES, ...OTHER_RANK_SALARIES], k);
  const pte = OTHER_RANK_SALARIES.find((t) => t.id === "pte")!;
  const cpl = OTHER_RANK_SALARIES.find((t) => t.id === "cpl")!;
  const sgt = OTHER_RANK_SALARIES.find((t) => t.id === "sgt")!;
  const lowest = (t: RankSalaryTable, pg: number) => t.rows[t.rows.length - 1].salaries[pg - 1];
  const pteR = salaryRange(pte);

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          trail={[
            { href: "/", label: "Pay Calculator" },
            { href: "/adf-pay-scales/", label: "ADF Pay Scales" },
            { label: `${service.name} Pay Scales` },
          ]}
        />
        <header className="mb-10 max-w-4xl lg:mb-14">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {service.name} Pay Scales 2026 — {service.fullName} Salary by Rank &amp; Pay Grade
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">
            A {pte.names[k]} in the {service.fullName} earns{" "}
            <strong className="text-navy">{formatAUD(pteR.min)} to {formatAUD(pteR.max)}</strong> a year depending on
            the pay grade of their job. Below: salary by rank, which pay grade every {service.name} employment category
            sits on, and take-home pay — all from PACMAN, effective {ADF_PAY_EFFECTIVE}.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <Notices />

            <section id="salary-by-rank">
              <h2 style={HEADING_FONT}>{service.name} salary by rank</h2>
              <h3 style={HEADING_FONT}>Other ranks</h3>
              <RankSummary tables={ors} service={k} />
              <h3 style={HEADING_FONT}>Officers</h3>
              <RankSummary tables={OFFICER_SALARIES} service={k} />
              <TakeHomeNote />
            </section>

            <section id="pay-grades">
              <h2 style={HEADING_FONT}>{service.name} pay grades: which jobs are on which grade</h2>
              <p>
                From PACMAN Schedule B.11 Part {k === "navy" ? 1 : k === "army" ? 2 : 3}. Where PACMAN gives a grade within a
                category (for example &ldquo;Rifleman (Grade 2)&rdquo;), each grade of that category can sit at a
                different pay grade. The salaries shown are the lowest increment for each rank.
              </p>
              {PAY_GRADES.map((pg) => {
                const cats = categoriesAtPayGrade(k, pg);
                return (
                  <div key={pg} className="not-prose my-6 rounded-xl border border-sandstone-dark/20 p-5">
                    <h3 className="mb-2 text-lg font-bold text-navy" style={HEADING_FONT} id={`pay-grade-${pg}`}>
                      Pay grade {pg}
                    </h3>
                    <p className="mb-3 text-sm text-warmgray">
                      {pte.names[k]}: {formatAUD(lowest(pte, pg) ?? 0)} · {cpl.names[k]}: {formatAUD(lowest(cpl, pg) ?? 0)} ·{" "}
                      {sgt.names[k]}: {formatAUD(lowest(sgt, pg) ?? 0)}
                    </p>
                    <details>
                      <summary className="cursor-pointer text-sm font-semibold text-eucalyptus-dark">
                        {cats.length} employment {cats.length === 1 ? "category" : "categories"} at pay grade {pg}
                      </summary>
                      <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-warmgray sm:grid-cols-2">
                        {cats.map((c) => (
                          <li key={formatCategory(c)}>{formatCategory(c)}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                );
              })}
            </section>

            <section id="trainees">
              <h2 style={HEADING_FONT}>Recruit and trainee pay</h2>
              <TraineeTable />
            </section>

            <section id="full-tables">
              <h2 style={HEADING_FONT}>Full {service.name} pay scales by increment and pay grade</h2>
              {ors.map((t) => (
                <SalaryGrid key={t.id} table={t} service={k} />
              ))}
              {OFFICER_SALARIES.map((t) => (
                <SalaryGrid key={t.id} table={t} service={k} />
              ))}
            </section>

            <section id="faq">
              <h2 style={HEADING_FONT}>{service.name} pay questions</h2>
              <FaqList faqs={serviceFaqs(service)} />
            </section>

            <Footer />
          </article>
          <Sidebar current={service.slug} />
        </div>
      </div>
    </div>
  );
}
