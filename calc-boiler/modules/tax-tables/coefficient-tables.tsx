import { formatAUD } from "@/lib/constants";
import {
  FREQUENCY_LABELS,
  PAYG_YEAR_INFO,
  SCALE_1_NO_TFT,
  SCALE_1_NO_TFT_2025_26,
  SCALE_2_TFT,
  SCALE_2_TFT_2025_26,
  type CoefficientBand,
  type PayFrequency,
  type PaygFinancialYear,
} from "@/lib/constants/payg-withholding";

// A static, crawlable copy of the ATO Schedule 1 coefficients, shown as
// "earnings in this pay period" bands so a payroll officer can read the table
// without running the lookup widget. The coefficient values are the ones the
// withholding engine uses (read digit for digit from the ATO, see
// lib/constants/payg-withholding.ts), so this table cannot drift from the
// lookup table below it.
//
// Band edges: the ATO converts pay to a weekly equivalent x and applies a band
// while x < lessThan. For weekly pay x = whole dollars + 0.99, fortnightly
// x = half the pay (whole dollars) + 0.99, monthly x = whole dollars of
// pay x 3 / 13 + 0.99. Each of those is "< lessThan" exactly when pay in the
// period is below lessThan x 1, x 2 or x 13/3.

const PERIOD_FACTOR: Record<PayFrequency, number> = { weekly: 1, fortnightly: 2, monthly: 13 / 3 };

const SCALES: Record<PaygFinancialYear, { tft: readonly CoefficientBand[]; noTft: readonly CoefficientBand[] }> = {
  "2026-27": { tft: SCALE_2_TFT, noTft: SCALE_1_NO_TFT },
  // One ATO edition for 1 July 2024 to 30 June 2026 (2024-25 and 2025-26).
  "2025-26": { tft: SCALE_2_TFT_2025_26, noTft: SCALE_1_NO_TFT_2025_26 },
};

const TH = "px-3 py-2 font-semibold text-navy";
const TD = "px-3 py-2 tabular-nums";

function money(lessThan: number, frequency: PayFrequency): string {
  return formatAUD(lessThan * PERIOD_FACTOR[frequency], frequency === "monthly" ? 2 : 0);
}

function bandLabel(bands: readonly CoefficientBand[], i: number, frequency: PayFrequency): string {
  const upper = bands[i].lessThan;
  if (i === 0) return `Less than ${money(upper, frequency)}`;
  const lower = money(bands[i - 1].lessThan, frequency);
  return Number.isFinite(upper) ? `${lower} to less than ${money(upper, frequency)}` : `${lower} and above`;
}

function BandTable({
  bands,
  frequency,
  caption,
}: {
  bands: readonly CoefficientBand[];
  frequency: PayFrequency;
  caption: string;
}) {
  const period = FREQUENCY_LABELS[frequency];
  return (
    <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full min-w-[22rem] text-left text-sm text-warmgray">
        <caption className="px-3 pt-3 pb-1 text-left text-sm font-semibold text-navy">{caption}</caption>
        <thead className="bg-sandstone">
          <tr>
            <th scope="col" className={TH}>Earnings per {period}</th>
            <th scope="col" className={`${TH} text-right`}>a</th>
            <th scope="col" className={`${TH} text-right`}>b</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
          {bands.map((band, i) => (
            <tr key={i}>
              <th scope="row" className={`${TD} font-medium text-navy`}>
                {bandLabel(bands, i, frequency)}
              </th>
              <td className={`${TD} text-right`}>{band.a === null ? "nil" : band.a.toFixed(4)}</td>
              <td className={`${TD} text-right`}>{band.a === null ? "nil" : band.b.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Both Schedule 1 coefficient tables (tax-free threshold claimed, and not
 * claimed) for one pay frequency and financial year.
 */
export default function CoefficientTables({
  frequency,
  fy,
  headingLevel = "h3",
}: {
  frequency: PayFrequency;
  fy: PaygFinancialYear;
  headingLevel?: "h3" | "h4";
}) {
  const info = PAYG_YEAR_INFO[fy];
  const scales = SCALES[fy];
  const Heading = headingLevel;
  return (
    <div className="not-prose my-6">
      <Heading className="mb-2 text-base font-bold text-navy">
        {`${frequency.charAt(0).toUpperCase()}${frequency.slice(1)} tax table ${info.label}: ATO Schedule 1 coefficients`}
      </Heading>
      <p className="mb-3 text-sm text-warmgray">
        Weekly equivalent x is worked out from your pay, then tax withheld = a &times; x &minus; b, rounded to the dollar
        (applies to {info.appliesTo}).{" "}
        <a href={info.schedule1Url} target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">
          Official ATO Schedule 1
        </a>
        .
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <BandTable bands={scales.tft} frequency={frequency} caption="Tax-free threshold claimed (Scale 2)" />
        <BandTable bands={scales.noTft} frequency={frequency} caption="No tax-free threshold (Scale 1)" />
      </div>
    </div>
  );
}
