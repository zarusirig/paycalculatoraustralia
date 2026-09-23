# Calculator QA — 24 September 2026

End-to-end check of ~72 calculator pages on a local static build (`npx next build --webpack`, `out/` served on :4173), plus a `next dev` pass to catch React dev-only errors.

## Method

- **Automated sweep** (Playwright, 1440px and 375px, every page in scope plus the other calculators in `modules/calculator`):
  - the default state renders
  - no console or page errors
  - no `NaN`, `Infinity`, `undefined`, `null` or `$-` in `<main>` or in any input value
  - no horizontal overflow at 375px (ignoring content inside scroll containers)
  - every visible input has a label
  - every text/number input tried with `0`, empty, `-5`, `5000000`, `1234.56`, `85,000`, `abc` and `99999999999`
  - every select option cycled, every checkbox, radio and pressed-button clicked
- **Toggle-effect check:** each select, toggle and date input must change the result text. Every "no effect" hit was traced to a legitimate cause:
  - Hospitality has a flat loading, so the shiftwork option changes nothing.
  - A car-allowance purpose does nothing while the allowance is $0.
  - MLS is not triggered below the threshold.
  - FBT method is disabled for an exempt EV.
  - Overtime rate does nothing at 0 overtime hours.
- **Engine agreement:** results were compared against `calculatePayBreakdown` and the other engines, compiled with the same `tsc` flags as `npm test`.
  - Home, fortnightly, weekly, monthly, annual, take-home, income-tax, HECS and the embed widget at $45k, $150k and $190k.
  - Bonus tax at $130k base + $25k bonus.
  - Gross-for-net: $2,000 a week needs $139,458 a year (checked).
  - Tax return 2025-26 and 2026-27 at $117k taxable income.
  - Payroll tax: VIC and NSW at $2.5m.
  - Pension age for DOBs 1930, 1952, 1957-06-30 and 1960-02-29.
  - Pay-date generator: fortnightly anchors (including an anchor years in the past or after 1 July), weekly (53-pay year) and monthly.
  - Hourly to annual: $45.50/hr × 38 hrs = $89,908, with $19,290 of tax and Medicare.
  - Second job: $60k + $25k.
- **Manual click-through** with the Playwright MCP browser at 375px, used to confirm the mobile fixes.

## Findings

| Page | Issue | Severity | Fixed? |
|---|---|---|---|
| /bonus-tax-calculator/ (top page, 3.1k clicks/28d) | The breakdown rows showed bonus × top marginal rate and bonus × 2%, so they did not add up to "Total Tax on Bonus" when the bonus crossed a bracket. Example: $130k + $25k showed $9,250 + $500 against a $9,400 total. | High | Yes. The rows now come from `bonusTaxSplit()`, the with/without-bonus difference, and are covered by tests. |
| /employer-cost-calculator/ | Clearing the salary field showed a `NaNx` multiplier. A negative payroll-tax or WorkCover % gave negative on-costs. | Medium | Yes. New `employerOnCosts()` clamps the inputs and shows a dash for the multiplier at $0. Tests added. |
| /employer-cost-calculator/ | The payroll tax hint rendered literal backticks: "if total wages \`>\` $1M". | Low | Yes |
| /embed/take-home-pay/ | `?period=` was concatenated into a CSS selector. A crafted value threw in `querySelector` and left the widget stuck at $0. | Medium | Yes. Period is now matched against the option values. Test added. |
| /embed/take-home-pay/ | A negative salary (typed, or `?salary=-5000`) showed a negative gross ("-$5,000"). | Low | Yes. The engine clamps to 0 and a negative `?salary=` is ignored. Test added. |
| /hourly-to-annual-salary-calculator/ | Horizontal overflow at 375px: the page was 406px wide because the implicit grid column grew to the width of the results table. | Medium | Yes |
| /centrelink-working-credit-calculator/ | Horizontal overflow at 375px: the page was 433px wide because of the form grid. | Medium | Yes |
| /payslip-generator/ | Horizontal overflow at 375px: the page was 391px wide because of the payslip tables. | Medium | Yes. The preview scrolls inside its card on phones. |
| All calculators with responsive grids (~98 grids in 64 files, including the FIFO, travel, MLS, EA-floor and pay-date calculators) | Same latent cause: the grids had no base `grid-cols-1`, so any wide child could push the page sideways on mobile. | Low (preventive) | Yes. `grid-cols-1` was added as the base. |
| /superannuation-calculator/ (and any page citing one URL twice) | React duplicate-key error in `SourceAttribution`: two sources shared the same ATO URL, which risks a dropped list item. | Low | Yes. The key now includes the index. |
| 34 range sliders (home, bonus, fortnightly/weekly/monthly/annual, take-home, HECS, super, salary sacrifice/package, novated, leave, backpay, overtime, redundancy, final pay, commission, employment type, SAPTO, Medicare, zone offset) | The sliders were `aria-hidden` but still focusable, so keyboard users tabbed onto controls a screen reader could not announce. | Low (a11y) | Yes. They now have `tabIndex={-1}`. The labelled number input next to each one is the keyboard control. |
| /tax-return-calculator/ | The income-year radios are `sr-only`, so keyboard focus was invisible. | Low (a11y) | Yes. The focus ring now shows on the label. |
| Fortnightly, weekly and monthly pay; Centrelink (age pension, carer payment, JobSeeker, parenting, Austudy/Youth Allowance) | Deduction rows show "-$0.00" when a deduction is nil (salary $0, or income under the free area). | Cosmetic | No. The prefixed minus is used in about 98 places. It is a display convention, not a wrong figure. |
| /payroll-tax-calculator/ | The wages text field removes everything except digits and dots. So "1.5e6" reads as $1.56 and "-500000" reads as $500,000. Commas and "$" paste correctly. | Cosmetic | No. The field hint asks for dollars and the result echoes the parsed wages. |

**Checked and found fine:**

- **Console errors:** none on the production build. The only dev-only error was the duplicate key above.
- **NaN / Infinity / undefined:** none after the fixes. Every number field clamps (the `clamp(...)`, `num()` and `MoneyInput` patterns).
- **Engine agreement:** every result listed under Method matched the engine to the dollar.
- **Selectors and date inputs:** the tax return year selector, payroll tax state selector, pension-age DOB (min/max bounds, empty shows "Enter a valid date"), the pay-date generator (including 27-pay and 53-pay years), the Centrelink selects and the embed URL params all behave correctly.
- **Labels:** every visible input has a label. The only unlabelled controls are the decorative sliders, which are now removed from the tab order.

## Verification

- `tsc --noEmit` is clean.
- `npm test` passes: 941 tests, 0 failures.
- ESLint on the changed files shows no errors. It shows two old unused-variable warnings, which were not introduced by this pass.
- Re-running the sweep on a fresh build finds no overflow, no NaN and no errors on any page.
