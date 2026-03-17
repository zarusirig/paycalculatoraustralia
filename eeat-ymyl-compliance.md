# E-E-A-T & YMYL Compliance Specification
## Pay Calculator Australia | Generated: 2026-03-14

---

## Why This Matters

Pay calculators are **YMYL (Your Money, Your Life)** content. Google's Search Quality Rater Guidelines state that YMYL pages require the highest levels of E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) to rank. Without these signals, even perfect SEO strategy will underperform.

---

## 1. Trust Signals (Most Important for YMYL)

### Source Attribution — Every Page
Every page with financial figures must include:

```html
<aside class="source-attribution">
  <p>All rates on this page are sourced from the 
    <a href="https://www.ato.gov.au" rel="noopener">Australian Taxation Office</a> 
    and apply for FY2025-26 (1 July 2025 – 30 June 2026).</p>
  <p>Last verified: <time datetime="2026-03-14">14 March 2026</time></p>
</aside>
```

**Placement**: Below the H1, above the calculator. Visible, not hidden in a footer.

### Trust Bar — Homepage & Calculator Pages
```
✓ Official ATO rates  ✓ Updated FY2025-26  ✓ Free forever  ✓ No signup required
```

### Last Updated Date — Every Page
- Display `dateModified` prominently (not just in schema)
- Auto-update when content changes
- Format: "Last updated: 14 March 2026"

### Disclaimer — Footer (Site-Wide)
```
This calculator provides estimates based on official ATO tax tables for FY2025-26. 
It is for informational purposes only and does not constitute financial, tax, or 
legal advice. For personal advice, consult a registered tax agent or financial adviser. 
We are not affiliated with the Australian Taxation Office.
```

---

## 2. Expertise Signals

### About Page — `/about/`
**Must include** (this is a ranking signal for YMYL):

```markdown
# About Pay Calculator Australia

Pay Calculator Australia provides free, accurate pay calculation tools for 
Australian workers, employers, and HR professionals.

## Our Methodology

Every calculator on this site uses the official tax tables and rates published 
by the Australian Taxation Office (ATO), Fair Work Commission (FWC), and 
Services Australia. We update our calculators within 48 hours of any rate 
change announcement.

### How We Ensure Accuracy
1. All tax brackets, super rates, and thresholds are sourced directly from 
   ATO.gov.au and verified against published schedules
2. Calculator outputs are cross-checked against ATO's official simple tax 
   calculator at multiple salary levels
3. HECS-HELP repayment rates are verified against the ATO's study and 
   training loan repayment thresholds
4. Superannuation Guarantee rates are confirmed against Treasury legislation

### Our Data Sources
- Australian Taxation Office (ato.gov.au)
- Fair Work Commission (fwc.gov.au)
- Fair Work Ombudsman (fairwork.gov.au)
- Services Australia (servicesaustralia.gov.au)
- Australian Bureau of Statistics (abs.gov.au)

## Contact
Email: hello@paycalculatoraustralia.com.au
```

### Methodology Disclosure — Calculator Pages
Each calculator page should include a collapsible "How this calculator works" section:

```html
<details>
  <summary>How this calculator works</summary>
  <p>This calculator applies the FY2025-26 income tax rates published by the ATO. 
  Your tax is calculated progressively across each bracket. The Medicare levy 
  (2%) is applied to your full taxable income. HECS-HELP repayments use the 
  new marginal rate system effective from 1 July 2025.</p>
  <p>Source: <a href="https://www.ato.gov.au/rates/individual-income-tax-rates/">
  ATO Individual Income Tax Rates</a></p>
</details>
```

---

## 3. Authoritativeness Signals

### Outbound Links to Authoritative Sources
Every page must link to at least one official source:

| Topic | Link To | Anchor Text |
|-------|---------|-------------|
| Tax rates | ato.gov.au/rates | "ATO income tax rates" |
| Super rates | ato.gov.au/super | "ATO super guarantee" |
| Medicare | ato.gov.au/individuals/medicare-levy | "ATO Medicare levy" |
| HECS | ato.gov.au/help-repayment | "ATO HELP repayment" |
| Minimum wage | fairwork.gov.au/pay | "Fair Work pay rates" |
| Award rates | fairwork.gov.au/awards | "Fair Work awards" |
| Redundancy | fairwork.gov.au/ending-employment | "Fair Work redundancy" |

**Rule**: `rel="noopener"` on all external links. Open in new tab.

### Citation Format
When citing specific figures, use inline attribution:

> ✅ "The SG rate is 12% from 1 July 2025 ([ATO](https://www.ato.gov.au/super))."
> ❌ "The SG rate is 12%." (no source)

---

## 4. Experience Signals

### Real-World Scenarios
Every calculator page should include at least one "real person" scenario:

```markdown
### Example: Sarah, $85,000 salary in Melbourne

Sarah earns $85,000 as a marketing coordinator. Here's her pay breakdown:
- Income tax: $16,288 ($313.23/week)
- Medicare levy: $1,700 ($32.69/week)
- HECS repayment: $2,700 ($51.92/week) — she has a $28,000 student debt
- Take-home pay: $64,312 ($1,237.15/week)
- Her employer also pays $10,200 into her super fund
```

### Practical "What To Do Next" CTAs
Not just "calculate your pay" but actionable next steps:
- "Check that your payslip matches this calculation"
- "Talk to your employer if your super isn't being paid"
- "Consider salary sacrifice if your marginal rate is 30%+"
- "Download your pay breakdown to compare with your payslip"

---

## 5. Required Pages for E-E-A-T Compliance

| Page | URL | Purpose |
|------|-----|---------|
| About | `/about/` | Methodology, data sources, expertise |
| Contact | `/contact/` | Real contact details (email minimum) |
| Privacy Policy | `/privacy/` | Data handling (calculator inputs are client-side only) |
| Terms of Use | `/terms/` | Disclaimer, no financial advice |

**These are not optional.** Google's quality raters check for these pages on YMYL sites.

### Privacy Policy Key Points
```markdown
- We do not collect, store, or transmit your salary information
- All calculations happen in your browser — no data is sent to any server
- We use Google Analytics for anonymous usage statistics
- We do not sell personal data to third parties
```

---

## 6. Schema-Level E-E-A-T

### Organization Schema Enhancement
Add `knowsAbout` to Organization schema:

```json
{
  "@type": "Organization",
  "name": "Pay Calculator Australia",
  "knowsAbout": [
    "Australian income tax",
    "superannuation",
    "Medicare levy",
    "HECS-HELP repayments",
    "salary sacrifice",
    "Australian employment law",
    "pay calculation"
  ]
}
```

### Article Schema — Add `isBasedOn`
For guide pages, reference the authoritative source:

```json
{
  "@type": "Article",
  "isBasedOn": {
    "@type": "Legislation",
    "name": "Income Tax Assessment Act 1997",
    "url": "https://www.legislation.gov.au/Details/C2024C00342"
  }
}
```

---

## E-E-A-T Audit Checklist (Per Page)

- [ ] Source attribution visible (ATO/FWC reference)
- [ ] Last updated date displayed
- [ ] At least 1 outbound link to official source
- [ ] Methodology disclosure present (calculator pages)
- [ ] Real-world scenario included
- [ ] Actionable next-step CTA
- [ ] Disclaimer in footer
- [ ] About page linked from footer
- [ ] No unsubstantiated claims
- [ ] All figures match EAV Knowledge Base
