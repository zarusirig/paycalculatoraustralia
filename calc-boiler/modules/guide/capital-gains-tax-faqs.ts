// Shared FAQ copy for /capital-gains-tax-calculator/.
//
// Read by both the rendered accordion and the FAQPage JSON-LD so the structured
// data cannot drift from the visible page. Every figure interpolates from the
// constants file — no rate is typed as a literal here.

import { formatAUD } from "@/lib/constants";
import {
  ABSENCE_RULE,
  CGT_AFFORDABLE_HOUSING,
  CGT_DISCOUNT_RATES,
  CGT_EXEMPT_THRESHOLDS,
  CGT_INCOME_YEAR,
  CGT_MINIMUM_OWNERSHIP_MONTHS,
  CGT_REFORM_2027,
  CGT_START_DATE,
  calculateCGT,
} from "@/lib/constants/capital-gains-tax";

const PCT = (n: number) => `${Number((n * 100).toFixed(2))}%`;

// Worked figures derived from the engine so the copy cannot drift from the
// calculator sitting above it.
const EXAMPLE = calculateCGT({
  purchasePrice: 400_000,
  buyingCosts: 20_000,
  sellingCosts: 15_000,
  salePrice: 600_000,
  ownedAtLeast12Months: true,
  otherIncome: 100_000,
});

const SHORT_HOLD = calculateCGT({
  purchasePrice: 400_000,
  buyingCosts: 20_000,
  sellingCosts: 15_000,
  salePrice: 600_000,
  ownedAtLeast12Months: false,
  otherIncome: 100_000,
});

export interface CgtFaq {
  q: string;
  a: string;
}

export const CGT_FAQS: readonly CgtFaq[] = [
  {
    q: "How much is capital gains tax in Australia?",
    a: `There is no fixed amount and no separate capital gains tax rate. The ATO is explicit that although it is called capital gains tax, "it's part of your income tax. It's not a separate tax." Your net capital gain is added to your taxable income and taxed at your marginal rate, so two people making the identical gain pay very different amounts. If you owned the asset for at least ${CGT_MINIMUM_OWNERSHIP_MONTHS} months you are generally taxed on only ${PCT(1 - CGT_DISCOUNT_RATES.individual)} of the gain. On a ${formatAUD(EXAMPLE.grossGain)} gain with ${formatAUD(100_000)} of other income, ${formatAUD(EXAMPLE.netCapitalGain)} is added to taxable income and the tax and Medicare levy come to about ${formatAUD(EXAMPLE.totalTaxOnGain)}.`,
  },
  {
    q: "What is the capital gains tax rate in Australia?",
    a: `There isn't one. This is the most common misconception about CGT. The gain is taxed at whatever marginal rate applies once it is stacked on top of your other income, which for ${CGT_INCOME_YEAR} means anywhere from 0% to 45% plus the 2% Medicare levy. Because the ${PCT(CGT_DISCOUNT_RATES.individual)} discount halves the taxable portion, the effective rate on the full gain for a top-bracket taxpayer works out at roughly ${PCT(0.45 * (1 - CGT_DISCOUNT_RATES.individual) + 0.02 * (1 - CGT_DISCOUNT_RATES.individual))} — but that is an outcome of the marginal rates, not a rate the ATO publishes.`,
  },
  {
    q: "How does the 50% CGT discount work?",
    a: `If you are an Australian resident for tax purposes and you owned the asset for at least ${CGT_MINIMUM_OWNERSHIP_MONTHS} months before the CGT event, you reduce the remaining capital gain by ${PCT(CGT_DISCOUNT_RATES.individual)} and report only that half. Two details catch people out. First, you exclude both the day you acquired the asset and the day of the CGT event when counting the ${CGT_MINIMUM_OWNERSHIP_MONTHS} months. Second, you must subtract any capital losses BEFORE applying the discount, not after — doing it the other way around understates your tax.`,
  },
  {
    q: `Do I pay capital gains tax if I sell within ${CGT_MINIMUM_OWNERSHIP_MONTHS} months?`,
    a: `Yes, and you get no discount at all. The ${PCT(CGT_DISCOUNT_RATES.individual)} discount is unavailable for any asset held less than ${CGT_MINIMUM_OWNERSHIP_MONTHS} months, so the entire gain is added to your taxable income. There is no partial or pro-rata discount for holding an asset for eleven months. On the same ${formatAUD(EXAMPLE.grossGain)} gain used above, selling early takes the tax from about ${formatAUD(EXAMPLE.totalTaxOnGain)} to about ${formatAUD(SHORT_HOLD.totalTaxOnGain)} — a difference of roughly ${formatAUD(SHORT_HOLD.totalTaxOnGain - EXAMPLE.totalTaxOnGain)} for the sake of the settlement date.`,
  },
  {
    q: "What can I include in the cost base?",
    a: "The cost base has five elements: what you paid for the asset; incidental costs of buying or selling it such as stamp duty, conveyancing, legal fees and agent's commission; costs of owning it such as rates, land tax, insurance and non-deductible interest; capital costs that increase or preserve its value, such as improvements; and capital costs of defending your title. The critical exclusion is that you cannot include anything you have claimed or can claim as a tax deduction. Capital works deductions in particular reduce your cost base rather than adding to it, which increases your gain.",
  },
  {
    q: "Is my home exempt from capital gains tax?",
    a: `Not automatically. The full main residence exemption requires all three conditions to hold: the dwelling was the home of you and your dependants for the whole period you owned it, it was never used to produce income, and it sits on ${ABSENCE_RULE.landLimitHectares} hectares or less. If you rented out a room, ran a business from home, or bought it to renovate and resell, you fall to a partial exemption and part of the gain becomes assessable. Being a foreign resident when you sell can remove the exemption entirely.`,
  },
  {
    q: "What is the 6-year rule for capital gains tax?",
    a: `If you move out of your home you can keep treating it as your main residence for CGT purposes — indefinitely if you leave it vacant or let a relative use it rent-free, but only for ${ABSENCE_RULE.incomeProducingYears} years if you use it to produce income such as rent. While the choice applies you cannot treat any other property as your main residence, except for up to ${ABSENCE_RULE.overlapMonths} months when you are moving house. The ${ABSENCE_RULE.incomeProducingYears}-year limit applies separately to each period of absence, so moving back in and later leaving again resets the clock.`,
  },
  {
    q: "Can capital losses reduce the tax on my salary?",
    a: "No. Capital losses can only be offset against capital gains, never against ordinary income like wages. If your losses exceed your gains you have a net capital loss, which you carry forward to reduce capital gains in future years. There is no time limit on how long you can carry a net capital loss forward, and you apply carried-forward losses in the order you made them. Losses on collectables can only be used against gains on other collectables, and losses on personal use assets or CGT-exempt assets such as your car cannot be used at all.",
  },
  {
    q: "Is the 50% CGT discount being abolished?",
    a: `It is changing, but not yet. The ${CGT_REFORM_2027.actName} received assent on ${CGT_REFORM_2027.assentDate} (${CGT_REFORM_2027.actNumber}). It replaces the ${PCT(CGT_DISCOUNT_RATES.individual)} discount for individuals, trusts and partnerships with cost base indexation plus a minimum tax rate of ${PCT(CGT_REFORM_2027.minimumTaxRate)}, for capital gains accruing on and after ${CGT_REFORM_2027.startDate}. It does not apply to gains accruing before that date, so for the whole of the ${CGT_INCOME_YEAR} income year the ${PCT(CGT_DISCOUNT_RATES.individual)} discount continues to apply exactly as this calculator applies it. The first affected year is ${CGT_REFORM_2027.firstAffectedYear}.`,
  },
  {
    q: "Do companies get the CGT discount?",
    a: `No. Companies cannot use the CGT discount at all, however long they held the asset. Individuals and Australian trusts discount an eligible gain by ${PCT(CGT_DISCOUNT_RATES.individual)}, and complying super funds by ${PCT(CGT_DISCOUNT_RATES.superFund)}. This is one reason holding an appreciating asset in a company is often less tax-effective than holding it personally, though there are many other considerations.`,
  },
  {
    q: "When does the CGT event happen — contract date or settlement?",
    a: "For a sale under a contract, the CGT event happens on the date of the contract, not when the sale settles. Property sales usually work this way and the distinction decides which financial year the gain falls in. The ATO's own example: if contracts are exchanged on 4 June 2026 and settlement happens on 6 July 2026, the gain belongs in the return for the year ending 30 June 2026. If there is no contract of sale, the CGT event happens at the time of sale.",
  },
  {
    q: "How is CGT calculated on shares?",
    a: "Exactly the same way as on property. Your capital proceeds are what you sold the shares for; your cost base is what you paid plus brokerage and stamp duty on both the purchase and the sale. Subtract the cost base from the proceeds to get the gain, subtract any capital losses, then apply the discount if you held the shares at least 12 months. Because shares are usually bought in parcels at different times, you need to track each parcel separately — parcels bought at different times have different costs and different holding periods.",
  },
  {
    q: "Do I get a bigger discount for affordable housing?",
    a: `Yes. Australian-resident individuals who provide affordable rental housing to people on low to moderate incomes can qualify for an additional CGT discount of up to ${PCT(CGT_AFFORDABLE_HOUSING.extraDiscount)}, which lifts the total discount to as much as ${PCT(CGT_AFFORDABLE_HOUSING.maxDiscount)} on that residential rental property. Conditions apply about how long and through whom the housing is provided.`,
  },
  {
    q: "Which assets are exempt from capital gains tax?",
    a: `Assets acquired before ${CGT_START_DATE} are pre-CGT and exempt. Your main residence is exempt if you meet all the conditions. Your car and motorcycle are exempt, as are depreciating assets used solely for taxable purposes, and collectables acquired for ${formatAUD(CGT_EXEMPT_THRESHOLDS.collectable)} or less. A personal use asset such as a boat or furniture is only subject to CGT if it cost more than ${formatAUD(CGT_EXEMPT_THRESHOLDS.personalUse)}. Note that exemption cuts both ways — if an asset is exempt from CGT you also cannot claim a capital loss on it.`,
  },
] as const;
