# Programmatic SEO Templates
## Pay Calculator Australia | Generated: 2026-03-14
## Scale from 30 → 200+ Pages with Auto-Generated Salary Pages

---

## Strategy

Create auto-generated pages for specific salary queries like "tax on $75,000", "take home pay on $60,000". These capture **high-intent long-tail queries** that competitors ignore because they only have one generic calculator.

Each page is unique (different numbers, headings, comparisons) — not thin or duplicate content.

---

## Page Type 1: "Tax on $X" Pages

### URL Pattern
`/tax-on-{salary}/`

### Target Salaries (Generate These)

**Tier 1 — High Volume ($5K increments, $30K-$200K):**
```
/tax-on-30000/
/tax-on-35000/
/tax-on-40000/
/tax-on-45000/
/tax-on-50000/
/tax-on-55000/
/tax-on-60000/
/tax-on-65000/
/tax-on-70000/
/tax-on-75000/
/tax-on-80000/
/tax-on-85000/
/tax-on-90000/
/tax-on-95000/
/tax-on-100000/
/tax-on-110000/
/tax-on-120000/
/tax-on-130000/
/tax-on-140000/
/tax-on-150000/
/tax-on-160000/
/tax-on-170000/
/tax-on-180000/
/tax-on-190000/
/tax-on-200000/
```

**Total: ~35 pages** (can expand to $10K-$300K range = 50+ pages)

### Content Template

```markdown
# Tax on ${SALARY} in Australia — FY2025-26

On a ${SALARY} salary in Australia, you pay ${TAX_AMOUNT} in income tax for FY2025-26. 
Your effective tax rate is ${EFFECTIVE_RATE}%, and your marginal tax rate is ${MARGINAL_RATE}%.

## Your Complete Pay Breakdown on ${SALARY}

| Component | Annual | Weekly | Fortnightly | Monthly |
|-----------|--------|--------|-------------|---------|
| Gross Salary | ${SALARY} | ${WEEKLY_GROSS} | ${FN_GROSS} | ${MONTHLY_GROSS} |
| Income Tax | −${TAX} | −${WEEKLY_TAX} | −${FN_TAX} | −${MONTHLY_TAX} |
| Medicare Levy (2%) | −${MEDICARE} | −${WEEKLY_MEDICARE} | −${FN_MEDICARE} | −${MONTHLY_MEDICARE} |
| **Take-Home Pay** | **${NET}** | **${WEEKLY_NET}** | **${FN_NET}** | **${MONTHLY_NET}** |

Your employer also pays ${SUPER} in superannuation (12%), making your total package ${PACKAGE}.

## How Tax on ${SALARY} Is Calculated

Your ${SALARY} salary is taxed progressively across ${NUM_BRACKETS} tax brackets:

| Bracket | Income | Rate | Tax |
|---------|--------|------|-----|
| $0 – $18,200 | $18,200 | 0% | $0 |
| ${BRACKET_ROWS} |
| **Total** | **${SALARY}** | — | **${TAX}** |

→ [See all Australian tax brackets](/tax-brackets/)

## How Does ${SALARY} Compare?

| Salary | Income Tax | Take-Home | Difference |
|--------|-----------|-----------|-----------|
| ${SALARY_MINUS_10K} | ${TAX_MINUS_10K} | ${NET_MINUS_10K} | — |
| **${SALARY}** | **${TAX}** | **${NET}** | **You are here** |
| ${SALARY_PLUS_10K} | ${TAX_PLUS_10K} | ${NET_PLUS_10K} | +${DIFF_UP} |
| ${SALARY_PLUS_20K} | ${TAX_PLUS_20K} | ${NET_PLUS_20K} | +${DIFF_UP_20K} |

→ [Calculate any salary with our pay calculator](/)

## If You Have a HECS Debt on ${SALARY}

${IF salary >= 67000}
With a HECS debt, your compulsory repayment on ${SALARY} is ${HECS_AMOUNT} per year 
(${HECS_WEEKLY}/week). This reduces your take-home pay to ${NET_WITH_HECS}.
${ELSE}
On ${SALARY}, you are below the HECS repayment threshold of $67,000. 
No compulsory repayment is required.
${ENDIF}

→ [HECS-HELP repayment calculator](/hecs-help-calculator/)

## Frequently Asked Questions

### How much tax do I pay on ${SALARY}?
On ${SALARY}, you pay ${TAX} in income tax (${EFFECTIVE_RATE}% effective rate) plus 
${MEDICARE} in Medicare levy. Your take-home pay is ${NET} per year or ${WEEKLY_NET} per week.

### What is my marginal tax rate on ${SALARY}?
Your marginal tax rate on ${SALARY} is ${MARGINAL_RATE}%. This means each additional 
dollar you earn is taxed at ${MARGINAL_RATE}c.
```

### Title Tag Template
`Tax on $${SALARY} in Australia — Income Tax & Take-Home Pay (FY2025-26)`

### Meta Description Template
`On a $${SALARY} salary, you pay $${TAX} in income tax (${EFFECTIVE_RATE}% effective rate). Your take-home pay is $${NET}/year or $${WEEKLY_NET}/week. Full FY2025-26 breakdown.`

### Schema
- WebPage + FAQPage + BreadcrumbList
- **No** WebApplication (these aren't calculator pages — they're reference pages)

### Internal Links (Each Page)
- → `/` ("pay calculator")
- → `/tax-brackets/` ("Australian tax brackets")
- → `/income-tax-calculator/` ("income tax calculator")
- → `/take-home-pay-calculator/` ("take-home pay calculator")
- → `/hecs-help-calculator/` ("HECS calculator") — if salary ≥ $67K

---

## Page Type 2: "Salary to Hourly" Pages (Optional Expansion)

### URL Pattern
`/salary-{amount}-to-hourly/`

### Target Salaries
```
/salary-50000-to-hourly/
/salary-60000-to-hourly/
/salary-70000-to-hourly/
/salary-80000-to-hourly/
/salary-100000-to-hourly/
```

### Content Template
```markdown
# ${SALARY} Salary to Hourly — What's Your Hourly Rate?

A ${SALARY} annual salary equals ${HOURLY} per hour, based on a standard 
38-hour work week (${WEEKS} weeks per year).

| Frequency | Amount |
|-----------|--------|
| Annual | ${SALARY} |
| Monthly | ${MONTHLY} |
| Fortnightly | ${FORTNIGHTLY} |
| Weekly | ${WEEKLY} |
| Daily (7.6 hours) | ${DAILY} |
| Hourly | ${HOURLY} |

→ [Convert any salary with our hourly calculator](/hourly-to-annual-salary-calculator/)
```

---

## Implementation Guide for Coding Agent

### Data Generation Script (Pseudocode)

```javascript
const BRACKETS = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.16, base: 0 },
  { min: 45001, max: 135000, rate: 0.30, base: 4288 },
  { min: 135001, max: 190000, rate: 0.37, base: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, base: 51638 }
];

function calculateTax(salary) {
  let tax = 0;
  for (const bracket of BRACKETS) {
    if (salary > bracket.min) {
      const taxableInBracket = Math.min(salary, bracket.max) - bracket.min + (bracket.min === 0 ? 0 : 1);
      // Simplified — use bracket-based calculation
    }
  }
  return tax;
}

// Generate page data for each target salary
const salaries = [30000, 35000, 40000, ..., 200000];
const pages = salaries.map(salary => ({
  salary,
  tax: calculateTax(salary),
  medicare: salary * 0.02,
  super: salary * 0.12,
  net: salary - calculateTax(salary) - salary * 0.02,
  // ... all other template variables
}));
```

### Next.js Implementation

```
app/
  tax-on-[salary]/
    page.tsx           ← Dynamic route
    generateStaticParams()  ← Pre-generate all salary pages at build time
```

Use `generateStaticParams()` to pre-render all ~35 salary pages as static HTML at build time. Zero server cost, maximum performance.

### SEO Considerations
- Each page has **unique content** (different numbers, comparisons, HECS calculation)
- Each page has a **unique title tag and meta description**
- **Canonical is self-referencing** — these are NOT duplicates of the calculator page
- Add to **sitemap.xml** with priority 0.5
- **Internal link from tax brackets guide**: "See tax on specific salaries: [$50K](/tax-on-50000/), [$80K](/tax-on-80000/), [$100K](/tax-on-100000/)"

### What Makes This NOT Thin Content
1. Full bracket-by-bracket calculation breakdown (unique per salary)
2. Comparison table showing ±$10K and ±$20K neighbours
3. HECS impact section (changes based on salary level)
4. Different FAQ answers with salary-specific figures
5. ~400-500 words per page (sufficient for reference content)
