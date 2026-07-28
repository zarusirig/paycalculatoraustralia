"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatPercent } from "@/lib/constants";
import {
  CGT_DISCOUNT_RATES,
  CGT_INCOME_YEAR,
  CGT_MINIMUM_OWNERSHIP_MONTHS,
  calculateCGT,
} from "@/lib/constants/capital-gains-tax";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
}

function Row({
  label,
  value,
  bold,
  muted,
  hint,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={muted ? "text-warmgray-light" : "text-warmgray"}>
        {label}
        {hint ? <span className="block text-xs text-warmgray-light">{hint}</span> : null}
      </span>
      <span className={`tabular-nums whitespace-nowrap ${bold ? "font-bold text-navy" : "text-navy"}`}>
        {value}
      </span>
    </div>
  );
}

const inputClass =
  "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";

function MoneyField({
  id,
  label,
  hint,
  value,
  onChange,
  max = 20_000_000,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy mb-1">
        {label}
      </label>
      <div className="flex items-center">
        <span className="text-warmgray-light mr-2">$</span>
        <input
          type="number"
          id={id}
          min={0}
          max={max}
          step={100}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value || 0), 0, max))}
          className={inputClass}
        />
      </div>
      {hint ? <p className="text-xs text-warmgray-light mt-1">{hint}</p> : null}
    </div>
  );
}

export default function CgtCalculator() {
  const [salePrice, setSalePrice] = useState(600_000);
  const [purchasePrice, setPurchasePrice] = useState(400_000);
  const [buyingCosts, setBuyingCosts] = useState(20_000);
  const [sellingCosts, setSellingCosts] = useState(15_000);
  const [ownershipCosts, setOwnershipCosts] = useState(0);
  const [capitalImprovements, setCapitalImprovements] = useState(0);
  const [otherIncome, setOtherIncome] = useState(100_000);
  const [currentYearLosses, setCurrentYearLosses] = useState(0);
  const [carriedForwardLosses, setCarriedForwardLosses] = useState(0);
  const [ownedAtLeast12Months, setOwnedAtLeast12Months] = useState(true);
  const [isAustralianResident, setIsAustralianResident] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const r = useMemo(
    () =>
      calculateCGT({
        salePrice,
        purchasePrice,
        buyingCosts,
        sellingCosts,
        ownershipCosts,
        capitalImprovements,
        otherIncome,
        currentYearLosses,
        carriedForwardLosses,
        ownedAtLeast12Months,
        isAustralianResident,
      }),
    [
      salePrice,
      purchasePrice,
      buyingCosts,
      sellingCosts,
      ownershipCosts,
      capitalImprovements,
      otherIncome,
      currentYearLosses,
      carriedForwardLosses,
      ownedAtLeast12Months,
      isAustralianResident,
    ],
  );

  // Same disposal, but qualifying for the discount — so the cost of missing the
  // 12-month test can be priced rather than asserted.
  const discountForgone = useMemo(() => {
    if (r.discountRate > 0 || r.grossGain <= 0) return 0;
    const eligible = calculateCGT({
      salePrice,
      purchasePrice,
      buyingCosts,
      sellingCosts,
      ownershipCosts,
      capitalImprovements,
      otherIncome,
      currentYearLosses,
      carriedForwardLosses,
      ownedAtLeast12Months: true,
      isAustralianResident: true,
    });
    return Math.max(0, r.totalTaxOnGain - eligible.totalTaxOnGain);
  }, [
    r.discountRate,
    r.grossGain,
    r.totalTaxOnGain,
    salePrice,
    purchasePrice,
    buyingCosts,
    sellingCosts,
    ownershipCosts,
    capitalImprovements,
    otherIncome,
    currentYearLosses,
    carriedForwardLosses,
  ]);

  return (
    <Card className="shadow-md not-prose">
      <CardContent className="p-6 md:p-8">
        <h2
          className="text-xl font-semibold text-navy mb-1"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Capital Gains Tax Calculator
        </h2>
        <p className="text-sm text-warmgray mb-6">
          Works out your net capital gain for the {CGT_INCOME_YEAR} income year using the ATO&rsquo;s
          own 8-step method, then taxes it at your marginal rate — because CGT is part of your income
          tax, not a separate tax with its own rate.
        </p>

        <div className="grid md:grid-cols-[1fr_1fr] gap-8">
          {/* Inputs */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <MoneyField
              id="cgt-sale"
              label="Sale price (capital proceeds)"
              hint="What you received. If you gave the asset away or sold it cheap to a friend, use market value."
              value={salePrice}
              onChange={setSalePrice}
            />
            <MoneyField
              id="cgt-purchase"
              label="Purchase price"
              hint="First element of the cost base — what you paid for the asset."
              value={purchasePrice}
              onChange={setPurchasePrice}
            />
            <MoneyField
              id="cgt-buying"
              label="Buying costs"
              hint="Stamp duty, conveyancing, legal fees, brokerage."
              value={buyingCosts}
              onChange={setBuyingCosts}
            />
            <MoneyField
              id="cgt-selling"
              label="Selling costs"
              hint="Agent's commission, legal and conveyancing fees, advertising."
              value={sellingCosts}
              onChange={setSellingCosts}
            />
            <MoneyField
              id="cgt-income"
              label="Your other taxable income"
              hint="Salary and other income for the year, before the gain. This decides your marginal rate."
              value={otherIncome}
              onChange={setOtherIncome}
              max={5_000_000}
            />

            <label className="flex items-start gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={ownedAtLeast12Months}
                onChange={(e) => setOwnedAtLeast12Months(e.target.checked)}
                className="mt-1 rounded border-sandstone-dark/40 text-eucalyptus focus:ring-eucalyptus/20"
              />
              <span>
                I owned it for at least {CGT_MINIMUM_OWNERSHIP_MONTHS} months
                <span className="block text-xs text-warmgray-light">
                  Count from the day after acquisition to the day before the CGT event. For a
                  contract sale the CGT event is the contract date, not settlement.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={isAustralianResident}
                onChange={(e) => setIsAustralianResident(e.target.checked)}
                className="mt-1 rounded border-sandstone-dark/40 text-eucalyptus focus:ring-eucalyptus/20"
              />
              <span>
                I am an Australian resident for tax purposes
                <span className="block text-xs text-warmgray-light">
                  Foreign and temporary residents cannot use the full discount for gains after 8 May
                  2012.
                </span>
              </span>
            </label>

            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="text-sm font-medium text-eucalyptus-dark hover:underline"
            >
              {showAdvanced ? "Hide" : "Add"} capital losses and holding costs
            </button>

            {showAdvanced && (
              <div className="space-y-5 border-t border-sandstone-dark/20 pt-5">
                <MoneyField
                  id="cgt-losses-current"
                  label="Capital losses this year"
                  hint="Losses on other assets sold in the same year."
                  value={currentYearLosses}
                  onChange={setCurrentYearLosses}
                />
                <MoneyField
                  id="cgt-losses-prior"
                  label="Capital losses carried forward"
                  hint="Unused net capital losses from earlier years. There is no time limit on carrying these forward."
                  value={carriedForwardLosses}
                  onChange={setCarriedForwardLosses}
                />
                <MoneyField
                  id="cgt-improvements"
                  label="Capital improvements"
                  hint="Fourth element — extensions and improvements, not repairs you have already deducted."
                  value={capitalImprovements}
                  onChange={setCapitalImprovements}
                />
                <MoneyField
                  id="cgt-ownership"
                  label="Non-deductible ownership costs"
                  hint="Third element — rates, land tax, insurance and interest ONLY where you could not claim a deduction. Leave at zero for a normal rental property."
                  value={ownershipCosts}
                  onChange={setOwnershipCosts}
                />
              </div>
            )}
          </form>

          {/* Results */}
          <div className="space-y-4">
            <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
              <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">
                {r.isCapitalLoss ? "Your capital loss" : "Tax on your capital gain"}
              </div>
              <div className="text-4xl font-extrabold text-navy mb-1">
                {formatAUD(r.isCapitalLoss ? Math.abs(r.grossGain) : r.totalTaxOnGain)}
              </div>
              <div className="text-sm text-warmgray mt-2">
                {r.isCapitalLoss
                  ? "No CGT is payable. Carry this loss forward against future capital gains — it cannot reduce tax on your salary."
                  : `Effective rate of ${formatPercent(r.effectiveRateOnGain)} on the ${formatAUD(r.grossGain)} gain, at a ${formatPercent(r.marginalRate, 0)} marginal rate.`}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
              <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">
                  How this is worked out
                </h3>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <Row label="Capital proceeds" value={formatAUD(r.capitalProceeds)} />
                <Row label="Cost base" value={`−${formatAUD(r.costBase)}`} />
                <div className="border-t border-sandstone-dark/10 pt-3" />
                <Row
                  label={r.isCapitalLoss ? "Capital loss" : "Capital gain"}
                  value={formatAUD(Math.abs(r.grossGain))}
                  bold
                />

                {!r.isCapitalLoss && (
                  <>
                    {r.lossesApplied > 0 && (
                      <>
                        <div className="border-t border-sandstone-dark/10 pt-3" />
                        <Row
                          label="Capital losses applied"
                          value={`−${formatAUD(r.lossesApplied)}`}
                          hint="Subtracted before the discount, as the ATO requires"
                        />
                        <Row label="Gain after losses" value={formatAUD(r.gainAfterLosses)} />
                      </>
                    )}
                    {r.lossesCarriedForward > 0 && (
                      <Row
                        label="Losses left to carry forward"
                        value={formatAUD(r.lossesCarriedForward)}
                        muted
                      />
                    )}

                    <div className="border-t border-sandstone-dark/10 pt-3" />
                    <Row
                      label={
                        r.discountRate > 0
                          ? `CGT discount (${formatPercent(r.discountRate, 0)})`
                          : "CGT discount"
                      }
                      value={r.discountRate > 0 ? `−${formatAUD(r.discountAmount)}` : "Not eligible"}
                      hint={
                        r.discountRate > 0
                          ? undefined
                          : !isAustralianResident
                            ? "Foreign and temporary residents miss out"
                            : `Held under ${CGT_MINIMUM_OWNERSHIP_MONTHS} months`
                      }
                    />
                    <Row label="Net capital gain" value={formatAUD(r.netCapitalGain)} bold />

                    <div className="border-t border-sandstone-dark/20 pt-3" />
                    <Row
                      label="Taxable income with the gain"
                      value={formatAUD(r.taxableIncomeWithGain)}
                      muted
                    />
                    <Row label="Income tax on the gain" value={formatAUD(r.incomeTaxOnGain)} />
                    <Row label="Medicare levy on the gain" value={formatAUD(r.medicareLevyOnGain)} />
                    <div className="border-t border-sandstone-dark/20 pt-3" />
                    <Row label="Total tax on the gain" value={formatAUD(r.totalTaxOnGain)} bold />
                  </>
                )}
              </div>
            </div>

            {!r.isCapitalLoss && r.grossGain > 0 && (
              <div
                className={`rounded-xl border p-4 text-sm ${
                  r.discountRate > 0
                    ? "border-eucalyptus/40 bg-eucalyptus-light/30"
                    : "border-ochre/50 bg-sandstone/60"
                }`}
              >
                {r.discountRate > 0 ? (
                  <p className="text-navy">
                    <strong>The {CGT_MINIMUM_OWNERSHIP_MONTHS}-month rule saved you{" "}
                    {formatAUD(r.discountSaving)}.</strong>{" "}
                    Without the {formatPercent(CGT_DISCOUNT_RATES.individual, 0)} discount the same
                    gain would cost {formatAUD(r.taxWithoutDiscount)} instead of{" "}
                    {formatAUD(r.totalTaxOnGain)}.
                  </p>
                ) : (
                  <p className="text-navy">
                    <strong>
                      Qualifying for the {formatPercent(CGT_DISCOUNT_RATES.individual, 0)} discount
                      would cut this by {formatAUD(discountForgone)}.
                    </strong>{" "}
                    There is no partial discount for holding an asset eleven months — it is all or
                    nothing.
                  </p>
                )}
              </div>
            )}

            <p className="text-xs text-warmgray-light">
              The gain is added to your taxable income and taxed at marginal rates — there is no
              separate CGT rate. Figures use the {CGT_INCOME_YEAR}{" "}
              <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">
                tax brackets
              </Link>{" "}
              and include the 2% Medicare levy, but not the Medicare levy surcharge, HECS-HELP or
              other offsets. For your full position see the{" "}
              <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">
                income tax calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
