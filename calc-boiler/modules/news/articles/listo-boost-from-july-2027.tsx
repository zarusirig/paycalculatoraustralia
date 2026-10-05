import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { LISTO_2027_28, LISTO_CURRENT } from "@/lib/constants/listo";
import { formatAUD } from "@/lib/constants";

export default function ListoBoostFromJuly2027() {
  return (
    <>
      <p className="lead">
        From 1 July 2027 the low income super tax offset (LISTO) income limit rises from{" "}
        <strong>{formatAUD(LISTO_CURRENT.incomeThreshold)} to {formatAUD(LISTO_2027_28.incomeThreshold)}</strong> and the maximum
        yearly payment from {formatAUD(LISTO_CURRENT.maxPayment)} to <strong>{formatAUD(LISTO_2027_28.maxPayment)}</strong>. The ATO lists the measure as law.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Income limit", before: formatAUD(LISTO_CURRENT.incomeThreshold), after: formatAUD(LISTO_2027_28.incomeThreshold) },
          { label: "Maximum payment", before: formatAUD(LISTO_CURRENT.maxPayment), after: formatAUD(LISTO_2027_28.maxPayment) },
          { label: "Starts", after: "1 July 2027" },
          { label: "Legislation", after: "Royal Assent 13 March 2026" },
        ]}
      />

      <h2>What LISTO does</h2>
      <p>
        LISTO is a government payment into the super fund of a low-income earner. It is 15% of the
        before-tax contributions paid for you, up to a yearly cap, so a low earner does not pay more
        tax on those contributions than on take-home pay. You do not apply, but your fund needs your
        tax file number.
      </p>

      <h2>What is changing</h2>
      <p>
        Treasury says the income threshold will match the top of the second income tax bracket, and
        the maximum rises to reflect the higher super guarantee rate. Workers with income between{" "}
        {formatAUD(LISTO_CURRENT.incomeThreshold + 1)} and {formatAUD(LISTO_2027_28.incomeThreshold)} become eligible for the first
        time, and those already eligible can receive a larger maximum.
      </p>
      <p>
        See what you would get now and from 2027 with the{" "}
        <Link href="/listo-calculator/">LISTO calculator</Link>, and the full rules in the{" "}
        <Link href="/superannuation-guide/">superannuation guide</Link>.
      </p>
    </>
  );
}
