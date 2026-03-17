# Schema Markup Templates — Pay Calculator Australia
## Skill 24 Output | Generated: 2026-03-14
## JSON-LD Structured Data for All Page Types

---

## 1. Organization Schema (Site-Wide)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Pay Calculator Australia",
  "url": "https://paycalculatoraustralia.com.au",
  "logo": "https://paycalculatoraustralia.com.au/logo.png",
  "description": "Free Australian pay calculator with income tax, super, Medicare levy & HECS. Updated for FY2025-26.",
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "hello@paycalculatoraustralia.com.au"
  }
}
```

---

## 2. WebSite Schema (Homepage Only)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Pay Calculator Australia",
  "url": "https://paycalculatoraustralia.com.au",
  "description": "Free Australian pay calculator. Calculate take-home pay, income tax, super, Medicare & HECS for FY2025-26.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://paycalculatoraustralia.com.au/?salary={salary}",
    "query-input": "required name=salary"
  }
}
```

---

## 3. WebApplication Schema (All Calculator Pages)

Apply this to: Homepage, C1-C14, C15-C18, G12

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "[Calculator Name] — Pay Calculator Australia",
  "url": "https://paycalculatoraustralia.com.au/[slug]/",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "browserRequirements": "Requires JavaScript",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "AUD"
  },
  "creator": {
    "@type": "Organization",
    "name": "Pay Calculator Australia"
  },
  "dateModified": "[auto-update YYYY-MM-DD]",
  "inLanguage": "en-AU"
}
```

### Per-Calculator Customization

| Page | name | applicationCategory |
|------|------|-------------------|
| Homepage | "Pay Calculator Australia — Free Take-Home Pay Calculator" | FinanceApplication |
| Income Tax | "Income Tax Calculator Australia 2025-26" | FinanceApplication |
| Take-Home | "Take-Home Pay Calculator Australia" | FinanceApplication |
| Super | "Superannuation Calculator Australia" | FinanceApplication |
| Salary Sacrifice | "Salary Sacrifice Calculator Australia" | FinanceApplication |
| HECS | "HECS-HELP Repayment Calculator 2025-26" | FinanceApplication |
| Pay Rise | "Pay Rise Calculator — How Much Extra Take-Home" | FinanceApplication |
| Redundancy | "Redundancy Pay Calculator Australia" | FinanceApplication |
| Contractor | "Contractor vs Employee Calculator Australia" | FinanceApplication |
| Gross Pay | "Gross Pay Calculator — Gross to Net & Reverse" | FinanceApplication |
| Hourly Converter | "Hourly Rate to Annual Salary Converter" | FinanceApplication |
| Frequency Pages | "[Frequency] Pay Calculator Australia" | FinanceApplication |
| State Pages | "Pay Calculator [State] 2025-26" | FinanceApplication |
| Employer Cost | "Employer Cost Calculator Australia" | FinanceApplication |

---

## 4. FAQPage Schema (All Pages with FAQs)

Apply to: Every page that has a "Frequently Asked Questions" section.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer text]"
      }
    }
  ]
}
```

### Homepage FAQ Entries (6 Questions)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much tax do I pay on $80,000 in Australia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "On an $80,000 salary in FY2025-26, you pay $14,788 in income tax plus $1,600 in Medicare levy — a total of $16,388. Your take-home pay is approximately $63,612 per year, or $1,223.31 per week. Your employer also pays $9,600 into your super fund on top of your salary."
      }
    },
    {
      "@type": "Question",
      "name": "What is the tax-free threshold in Australia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The tax-free threshold is $18,200. You pay no income tax on the first $18,200 you earn. With the Low Income Tax Offset (LITO), the effective tax-free threshold increases to $22,575."
      }
    },
    {
      "@type": "Question",
      "name": "How much super does my employer pay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "From 1 July 2025, employers must pay 12% of your Ordinary Time Earnings into your super fund. On an $80,000 salary, that's $9,600 per year. This is paid on top of your salary — it doesn't reduce your take-home pay."
      }
    },
    {
      "@type": "Question",
      "name": "What is the Medicare levy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Medicare levy is 2% of your taxable income, collected to help fund Australia's public healthcare system. On $80,000, that's $1,600 per year. Low-income earners below approximately $27,222 may pay a reduced levy or be exempt."
      }
    },
    {
      "@type": "Question",
      "name": "How do HECS-HELP repayments work in 2025-26?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "From FY2025-26, HECS-HELP uses a new marginal repayment system. Compulsory repayments start when your income reaches $67,000, and you only pay on the amount above the threshold — not on your total income."
      }
    },
    {
      "@type": "Question",
      "name": "What's the difference between gross and net pay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gross pay is your total salary before any deductions. Net pay (or take-home pay) is what you actually receive after income tax, Medicare levy, and any HECS repayments are deducted. For example, $80,000 gross becomes approximately $63,612 net."
      }
    }
  ]
}
```

---

## 5. BreadcrumbList Schema (All Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Pay Calculator",
      "item": "https://paycalculatoraustralia.com.au/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "[Page Name]",
      "item": "https://paycalculatoraustralia.com.au/[slug]/"
    }
  ]
}
```

---

## 6. Article Schema (Guide Pages Only)

Apply to: G1-G12 (all guide/informational pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[H1 text]",
  "description": "[Meta description]",
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "author": {
    "@type": "Organization",
    "name": "Pay Calculator Australia"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Pay Calculator Australia",
    "logo": {
      "@type": "ImageObject",
      "url": "https://paycalculatoraustralia.com.au/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://paycalculatoraustralia.com.au/[slug]/"
  },
  "inLanguage": "en-AU"
}
```

---

## 7. Table Schema (Pages with Data Tables)

For featured snippet eligibility, wrap key data tables:

```json
{
  "@context": "https://schema.org",
  "@type": "Table",
  "about": "Australian Income Tax Brackets FY2025-26"
}
```

Apply to: Tax Brackets (G1), PAYG Tables (G4), Award Rates (G9), Super rates tables

---

## Schema Deployment Checklist

| Page Type | Schemas to Include |
|-----------|-------------------|
| Homepage | Organization + WebSite + WebApplication + FAQPage + BreadcrumbList |
| Calculator pages (C1-C18) | WebApplication + FAQPage + BreadcrumbList |
| Guide pages (G1-G12) | Article + FAQPage + BreadcrumbList |
| Employer Cost (G12) | WebApplication + Article + FAQPage + BreadcrumbList |

### Validation
- Test every page at [Google Rich Results Test](https://search.google.com/test/rich-results)
- No errors, no warnings
- `dateModified` must auto-update when content changes
