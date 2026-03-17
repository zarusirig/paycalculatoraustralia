# Internal Linking Architecture & Anchor Text Strategy
## Skills 16 + 17 Output | Generated: 2026-03-14
## 30-Page Site | Flat Architecture | 1-Click Depth

---

## Linking Principles

1. **Every page links to the homepage** — via "pay calculator" anchor in nav + contextual link
2. **Every calculator links to its companion guide** (and vice versa)
3. **Every guide links to at least 2 calculators** — contextual relevance
4. **Anchor text uses natural variation** — never the same anchor twice on one page
5. **Minimum 5 internal links per page** — maximum 15
6. **No orphan pages** — every page receives at least 3 incoming links

---

## Complete Link Matrix

### Homepage `/` — Hub Node

| Links TO (outgoing) | Anchor Text |
|---------------------|-------------|
| /income-tax-calculator/ | "income tax calculator" |
| /take-home-pay-calculator/ | "take-home pay calculator" |
| /superannuation-calculator/ | "superannuation calculator" |
| /salary-sacrifice-calculator/ | "salary sacrifice calculator" |
| /hecs-help-calculator/ | "HECS-HELP calculator" |
| /pay-rise-calculator/ | "pay rise calculator" |
| /redundancy-pay-calculator/ | "redundancy pay calculator" |
| /contractor-vs-employee-calculator/ | "contractor vs employee calculator" |
| /gross-pay-calculator/ | "gross pay calculator" |
| /hourly-to-annual-salary-calculator/ | "hourly to annual salary" |
| /tax-brackets/ | "Australian tax brackets 2025-26" |
| /medicare-levy/ | "Medicare levy" |
| /low-income-tax-offset/ | "Low Income Tax Offset (LITO)" |
| /pay-calculator-nsw/ | "NSW" |
| /pay-calculator-qld/ | "QLD" |
| /pay-calculator-vic/ | "VIC" |
| /pay-calculator-wa/ | "WA" |

**Total outgoing: 17** | **Incoming from all other pages: 29**

---

### C1: Income Tax Calculator `/income-tax-calculator/`

| Links TO | Anchor Text | Context |
|----------|-------------|---------|
| / | "pay calculator" | "Use our [pay calculator] for the full breakdown" |
| /take-home-pay-calculator/ | "take-home pay calculator" | "See your net pay with all deductions" |
| /tax-brackets/ | "full tax brackets guide" | "See the [full tax brackets guide] with historical comparison" |
| /low-income-tax-offset/ | "low income tax offset" | "The [low income tax offset] can reduce this further" |
| /medicare-levy/ | "Medicare levy" | "Add the 2% [Medicare levy] for your total tax" |
| /hecs-help-calculator/ | "HECS repayment calculator" | "Calculate your [HECS repayment]" |
| /payg-withholding-tables/ | "ATO's tax tables" | "Based on the [ATO's tax tables]" |

**Receives links from**: /, C2, C4, C5, C6, C8, C9, G1, G3, G7 (10 incoming)

---

### C2: Take-Home Pay Calculator `/take-home-pay-calculator/`

| Links TO | Anchor Text | Context |
|----------|-------------|---------|
| / | "pay calculator" | Footer/nav CTA |
| /income-tax-calculator/ | "income tax calculator" | "See how [income tax] is calculated" |
| /salary-sacrifice-calculator/ | "salary sacrifice calculator" | "Compare pay before and after sacrifice" |
| /hecs-help-calculator/ | "HECS repayment calculator" | "Calculate your exact HECS impact" |
| /medicare-levy/ | "Medicare levy guide" | "Learn about the 2% levy" |
| /understanding-your-payslip/ | "understanding your payslip" | "See what every deduction means" |
| /superannuation-calculator/ | "super calculator" | "See your employer's super contribution" |

**Receives links from**: /, C1, C4, C5, C6, C10, C11-C14, G1, G5 (13 incoming)

---

### C3: Super Calculator `/superannuation-calculator/`

| Links TO | Anchor Text | Context |
|----------|-------------|---------|
| / | "pay calculator" | Nav CTA |
| /salary-sacrifice-calculator/ | "salary sacrifice calculator" | "Boost your super with sacrifice" |
| /superannuation-guide/ | "superannuation guide" | "Full guide to how super works" |
| /employer-cost-calculator/ | "employer cost calculator" | "See total employment cost including super" |

**Receives links from**: /, C2, C4, G2, G6, G8, G12 (7 incoming)

---

### C4: Salary Sacrifice Calculator `/salary-sacrifice-calculator/`

| Links TO | Anchor Text | Context |
|----------|-------------|---------|
| / | "pay calculator" | Nav CTA |
| /superannuation-calculator/ | "super calculator" | "See your base super contribution" |
| /salary-sacrifice-guide/ | "salary sacrifice guide" | "Full guide to how it works" |
| /income-tax-calculator/ | "income tax calculator" | "Check your marginal rate" |
| /superannuation-guide/ | "contribution caps" | "Watch the $30,000 concessional cap" |

**Receives links from**: /, C2, C3, C5, G2, G5, G6 (7 incoming)

---

### C5: HECS Calculator `/hecs-help-calculator/`

| Links TO | Anchor Text | Context |
|----------|-------------|---------|
| / | "pay calculator" | Nav CTA |
| /take-home-pay-calculator/ | "take-home pay calculator" | "See full pay breakdown" |
| /hecs-help-guide/ | "HECS-HELP guide" | "Complete guide to the new system" |
| /income-tax-calculator/ | "income tax" | "Your income tax is separate from HECS" |
| /salary-sacrifice-calculator/ | "salary sacrifice" | "Can salary sacrifice reduce HECS?" |

**Receives links from**: /, C1, C2, G5 (4 incoming)

---

### C6: Pay Rise Calculator `/pay-rise-calculator/`

| Links TO | Anchor Text | Context |
|----------|-------------|---------|
| / | "pay calculator" | Nav CTA |
| /income-tax-calculator/ | "income tax calculator" | "See your marginal rate impact" |
| /take-home-pay-calculator/ | "take-home pay calculator" | "Full breakdown at your new salary" |
| /tax-brackets/ | "tax brackets" | "Understand why your rise is taxed at the marginal rate" |
| /salary-sacrifice-calculator/ | "salary sacrifice" | "Consider sacrificing part of your rise into super" |

**Receives links from**: / (1 incoming — needs more; add from G1, C2)

---

### C7: Redundancy Calculator `/redundancy-pay-calculator/`

| Links TO | Anchor Text | Context |
|----------|-------------|---------|
| / | "pay calculator" | Nav CTA |
| /redundancy-pay-guide/ | "redundancy pay guide" | "Full guide to entitlements and tax" |
| /tax-brackets/ | "tax brackets" | "ETP taxed at marginal rates" |
| /income-tax-calculator/ | "income tax calculator" | "Tax on non-genuine redundancy" |

**Receives links from**: /, G11 (2 incoming)

---

### C8: Contractor Calculator `/contractor-vs-employee-calculator/`

| Links TO | Anchor Text | Context |
|----------|-------------|---------|
| / | "pay calculator" | Nav CTA |
| /contractor-vs-employee/ | "contractor vs employee guide" | "Full comparison guide" |
| /superannuation-calculator/ | "super calculator" | "Contractors must self-fund super" |
| /income-tax-calculator/ | "income tax calculator" | "Tax obligations differ" |

**Receives links from**: /, G10 (2 incoming)

---

### C9: Gross Pay Calculator `/gross-pay-calculator/`

| Links TO | Anchor Text | Context |
|----------|-------------|---------|
| / | "pay calculator" | Nav CTA |
| /take-home-pay-calculator/ | "take-home pay calculator" | "Full net pay breakdown" |
| /income-tax-calculator/ | "income tax calculator" | "See your tax by bracket" |
| /understanding-your-payslip/ | "understanding your payslip" | "What gross and net mean on your payslip" |

**Receives links from**: / (1 incoming)

---

### C10: Hourly Converter `/hourly-to-annual-salary-calculator/`

| Links TO | Anchor Text | Context |
|----------|-------------|---------|
| / | "pay calculator" | Nav CTA |
| /take-home-pay-calculator/ | "take-home pay calculator" | "See your take-home at this salary" |
| /award-rates/ | "award rates" | "Check if your hourly rate meets the minimum" |
| /weekly-pay-calculator/ | "weekly pay calculator" | "See your weekly breakdown" |

**Receives links from**: /, C11-C14, G9 (6 incoming)

---

### C11-C14: Frequency Pages — Shared Link Pattern

Each frequency page links to:
| Links TO | Anchor Text |
|----------|-------------|
| / | "pay calculator" |
| /take-home-pay-calculator/ | "take-home pay calculator" |
| /hourly-to-annual-salary-calculator/ | "convert between pay frequencies" |
| /tax-brackets/ | "tax brackets" |

Each receives links from: /, C10, and each other (4+ incoming)

---

### C15-C18: State Pages — Shared Link Pattern

Each state page links to:
| Links TO | Anchor Text |
|----------|-------------|
| / | "pay calculator Australia" |
| /income-tax-calculator/ | "income tax calculator" |
| /superannuation-calculator/ | "super calculator" |
| /employer-cost-calculator/ | "employer cost calculator" |
| Other state pages | "pay calculator [state]" |

Each receives links from: /, other state pages (5+ incoming)

---

### Guide Pages — Link Patterns

| Guide | Links TO (Primary) | Anchor Text |
|-------|--------------------|-------------|
| G1: Tax Brackets | /, /income-tax-calculator/, /low-income-tax-offset/, /take-home-pay-calculator/ | "pay calculator", "income tax calculator", "LITO", "take-home pay" |
| G2: Super Guide | /, /superannuation-calculator/, /salary-sacrifice-calculator/, /employer-cost-calculator/ | "pay calculator", "super calculator", "salary sacrifice", "employer cost" |
| G3: Medicare Levy | /, /income-tax-calculator/, /take-home-pay-calculator/ | "pay calculator", "income tax", "take-home pay" |
| G4: PAYG Tables | /, /income-tax-calculator/, /tax-brackets/ | "pay calculator", "income tax calculator", "tax brackets" |
| G5: HECS Guide | /, /hecs-help-calculator/, /take-home-pay-calculator/, /salary-sacrifice-calculator/ | "HECS calculator", "take-home pay", "salary sacrifice" |
| G6: Sal Sacrifice Guide | /, /salary-sacrifice-calculator/, /superannuation-calculator/, /superannuation-guide/ | "salary sacrifice calculator", "super calculator", "super guide" |
| G7: LITO | /, /income-tax-calculator/, /tax-brackets/ | "pay calculator", "income tax calculator", "tax brackets" |
| G8: Payslip Guide | /, /take-home-pay-calculator/, /superannuation-calculator/, /gross-pay-calculator/ | "take-home pay", "super calculator", "gross pay" |
| G9: Award Rates | /, /hourly-to-annual-salary-calculator/, /weekly-pay-calculator/ | "pay calculator", "hourly converter", "weekly calculator" |
| G10: Contractor Guide | /, /contractor-vs-employee-calculator/ | "pay calculator", "contractor calculator" |
| G11: Redundancy Guide | /, /redundancy-pay-calculator/, /tax-brackets/ | "redundancy calculator", "tax brackets" |
| G12: Employer Cost | /, /superannuation-calculator/, state pages | "pay calculator", "super calculator" |

---

## Link Coverage Audit

| Page | Outgoing Links | Incoming Links | Status |
|------|---------------|----------------|--------|
| Homepage `/` | 17 | 29 | ✅ Hub |
| Income Tax Calc | 7 | 10 | ✅ |
| Take-Home Pay Calc | 7 | 13 | ✅ |
| Super Calc | 4 | 7 | ✅ |
| Salary Sacrifice Calc | 5 | 7 | ✅ |
| HECS Calc | 5 | 4 | ✅ |
| Pay Rise Calc | 5 | 3 | ⚠️ Needs more incoming |
| Redundancy Calc | 4 | 3 | ⚠️ Needs more incoming |
| Contractor Calc | 4 | 3 | ⚠️ Needs more incoming |
| Gross Pay Calc | 4 | 3 | ⚠️ Needs more incoming |
| Hourly Converter | 4 | 6 | ✅ |
| Frequency Pages (4) | 4 each | 4+ each | ✅ |
| State Pages (4) | 5 each | 5+ each | ✅ |
| Guide Pages (12) | 3-4 each | 3-5 each | ✅ |

### Pages Needing Extra Incoming Links
- **Pay Rise Calculator**: Add links from Tax Brackets guide, Salary Sacrifice guide
- **Redundancy Calculator**: Add links from Award Rates guide, Employer Cost page
- **Contractor Calculator**: Add links from Super Guide, Employer Cost page
- **Gross Pay Calculator**: Add links from Payslip Guide, Income Tax Calculator

---

## Anchor Text Rules

1. **Primary anchor**: Use the exact target keyword (e.g., "income tax calculator")
2. **Variation anchors**: Use natural language (e.g., "calculate your income tax", "see how tax works")
3. **Never use**: "click here", "read more", "this page"
4. **Same-page limit**: Max 2 links to the same target from one page
5. **Anchor diversity**: Each page should receive links via at least 3 different anchor texts
6. **Nav links**: Don't count navigation links toward anchor text diversity — focus on in-content links
