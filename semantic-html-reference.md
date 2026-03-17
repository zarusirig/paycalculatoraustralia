# Semantic HTML Reference
## Pay Calculator Australia | Generated: 2026-03-14
## How to Structure Every Page for Maximum Semantic Signal

---

## Why Semantic HTML Matters for SEO

Search engines parse HTML elements to understand page structure and content relationships. Using semantic HTML correctly tells Google *what* each piece of content is — not just how it looks.

---

## 1. Calculator Page Template

```html
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- SEO Meta -->
  <title>{title_tag}</title>
  <meta name="description" content="{meta_description}">
  <link rel="canonical" href="https://paycalculatoraustralia.com.au/{slug}/">
  
  <!-- Open Graph -->
  <meta property="og:title" content="{title_tag}">
  <meta property="og:description" content="{meta_description}">
  <meta property="og:url" content="https://paycalculatoraustralia.com.au/{slug}/">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://paycalculatoraustralia.com.au/og/{slug}.png">
  <meta property="og:locale" content="en_AU">
  <meta property="og:site_name" content="Pay Calculator Australia">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title_tag}">
  <meta name="twitter:description" content="{meta_description}">
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  
  <!-- Schema JSON-LD (from schema-markup-templates.md) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      { /* BreadcrumbList */ },
      { /* WebApplication */ },
      { /* FAQPage */ }
    ]
  }
  </script>
</head>

<body>
  <!-- HEADER — site-wide navigation -->
  <header role="banner">
    <nav aria-label="Main navigation">
      <a href="/" aria-label="Pay Calculator Australia — Home">
        <img src="/logo.svg" alt="Pay Calculator Australia" width="200" height="40">
      </a>
      
      <ul role="list">
        <li><a href="/" aria-current="{if_homepage}">Pay Calculator</a></li>
        <li><a href="/income-tax-calculator/">Tax Calculator</a></li>
        <li><a href="/superannuation-calculator/">Super Calculator</a></li>
        <li><a href="/take-home-pay-calculator/">Take-Home Pay</a></li>
        <li><a href="/tax-brackets/">Tax Brackets</a></li>
        <li>
          <button aria-expanded="false" aria-controls="guides-dropdown">
            Guides <span aria-hidden="true">▾</span>
          </button>
          <ul id="guides-dropdown" role="list" hidden>
            <li><a href="/superannuation-guide/">Superannuation Guide</a></li>
            <li><a href="/medicare-levy/">Medicare Levy</a></li>
            <li><a href="/hecs-help-guide/">HECS-HELP Guide</a></li>
            <li><a href="/salary-sacrifice-guide/">Salary Sacrifice Guide</a></li>
            <li><a href="/award-rates/">Award Rates</a></li>
            <li><a href="/understanding-your-payslip/">Understanding Your Payslip</a></li>
            <li><a href="/contractor-vs-employee/">Contractor vs Employee</a></li>
          </ul>
        </li>
        <li>
          <button aria-expanded="false" aria-controls="states-dropdown">
            By State <span aria-hidden="true">▾</span>
          </button>
          <ul id="states-dropdown" role="list" hidden>
            <li><a href="/pay-calculator-nsw/">NSW</a></li>
            <li><a href="/pay-calculator-qld/">QLD</a></li>
            <li><a href="/pay-calculator-vic/">VIC</a></li>
            <li><a href="/pay-calculator-wa/">WA</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>

  <!-- BREADCRUMB -->
  <nav aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Pay Calculator</a></li>
      <li aria-current="page">{page_name}</li>
    </ol>
  </nav>

  <!-- MAIN CONTENT -->
  <main id="main-content">
    
    <!-- Hero Section with Calculator -->
    <article>
      <header>
        <h1>{h1_text}</h1>
        <p class="lead">{introductory_paragraph}</p>
        
        <!-- Trust Bar -->
        <aside class="trust-signals" aria-label="Trust indicators">
          <ul role="list">
            <li>✓ Official ATO rates</li>
            <li>✓ Updated FY2025-26</li>
            <li>✓ Free forever</li>
            <li>✓ No signup required</li>
          </ul>
        </aside>
      </header>

      <!-- Calculator Widget -->
      <section aria-label="Pay calculator" id="calculator">
        <form id="pay-calculator-form" aria-label="Calculate your pay">
          
          <div role="group" aria-labelledby="salary-label">
            <label id="salary-label" for="gross-salary">
              Your Annual Gross Salary
            </label>
            <input 
              type="number" 
              id="gross-salary" 
              name="salary"
              inputmode="numeric"
              placeholder="e.g. 80000"
              min="0"
              max="10000000"
              step="1000"
              required
              aria-describedby="salary-hint"
            >
            <span id="salary-hint" class="hint">
              Enter your total annual salary before tax
            </span>
          </div>

          <fieldset>
            <legend>Pay Frequency</legend>
            <label><input type="radio" name="frequency" value="annual"> Annual</label>
            <label><input type="radio" name="frequency" value="monthly"> Monthly</label>
            <label><input type="radio" name="frequency" value="fortnightly"> Fortnightly</label>
            <label><input type="radio" name="frequency" value="weekly" checked> Weekly</label>
            <label><input type="radio" name="frequency" value="hourly"> Hourly</label>
          </fieldset>

          <div role="group">
            <label>
              <input type="checkbox" id="include-hecs" name="hecs">
              I have a HECS-HELP debt
            </label>
          </div>

          <button type="submit" id="calculate-btn">
            Calculate Your Take-Home Pay
          </button>
        </form>

        <!-- Results (initially hidden, populated by JS) -->
        <output id="results" aria-live="polite" role="status" hidden>
          <h2>Your Pay Breakdown</h2>
          
          <table aria-label="Pay breakdown">
            <thead>
              <tr>
                <th scope="col">Component</th>
                <th scope="col">Annual</th>
                <th scope="col">Per Week</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Gross Salary</th>
                <td id="result-gross"></td>
                <td id="result-gross-weekly"></td>
              </tr>
              <tr>
                <th scope="row">Income Tax</th>
                <td id="result-tax"></td>
                <td id="result-tax-weekly"></td>
              </tr>
              <tr>
                <th scope="row">Medicare Levy</th>
                <td id="result-medicare"></td>
                <td id="result-medicare-weekly"></td>
              </tr>
              <tr id="hecs-row" hidden>
                <th scope="row">HECS Repayment</th>
                <td id="result-hecs"></td>
                <td id="result-hecs-weekly"></td>
              </tr>
              <tr class="total-row">
                <th scope="row">Take-Home Pay</th>
                <td id="result-net"><strong></strong></td>
                <td id="result-net-weekly"><strong></strong></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Employer Super (12%)</th>
                <td id="result-super"></td>
                <td id="result-super-weekly"></td>
              </tr>
            </tfoot>
          </table>

          <p>
            Effective tax rate: <span id="result-effective-rate"></span> |
            Marginal tax rate: <span id="result-marginal-rate"></span>
          </p>

          <button id="copy-results" aria-label="Copy pay breakdown to clipboard">
            📋 Copy Results
          </button>
        </output>
      </section>

      <!-- Source Attribution -->
      <aside class="source-attribution" aria-label="Data sources">
        <p>Rates sourced from the 
          <a href="https://www.ato.gov.au" rel="noopener" target="_blank">
            Australian Taxation Office
          </a>. Last verified: 
          <time datetime="2026-03-14">14 March 2026</time>.
        </p>
      </aside>

      <!-- Below-Fold Content (from content/*.md files) -->
      <section aria-labelledby="how-it-works">
        <h2 id="how-it-works">{H2 from content brief}</h2>
        <p>{Content from content/*.md}</p>
      </section>

      <section aria-labelledby="section-2">
        <h2 id="section-2">{H2 from content brief}</h2>
        <!-- etc. — follow content-briefs-all-pages.md H-tag structure -->
      </section>

      <!-- FAQ Section -->
      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading">Frequently Asked Questions</h2>
        
        <div class="faq-list" itemscope itemtype="https://schema.org/FAQPage">
          <details itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
            <summary itemprop="name">{Question text}</summary>
            <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
              <p itemprop="text">{Answer text}</p>
            </div>
          </details>
          <!-- Repeat for each FAQ -->
        </div>
      </section>

      <!-- Methodology Disclosure -->
      <details class="methodology">
        <summary>How this calculator works</summary>
        <p>{Methodology text — see eeat-ymyl-compliance.md}</p>
      </details>

    </article>
  </main>

  <!-- FOOTER -->
  <footer role="contentinfo">
    <nav aria-label="Footer navigation">
      <div class="footer-column">
        <h3>Calculators</h3>
        <ul role="list">
          <li><a href="/">Pay Calculator</a></li>
          <li><a href="/income-tax-calculator/">Income Tax</a></li>
          <li><a href="/take-home-pay-calculator/">Take-Home Pay</a></li>
          <li><a href="/superannuation-calculator/">Super</a></li>
          <li><a href="/salary-sacrifice-calculator/">Salary Sacrifice</a></li>
          <li><a href="/hecs-help-calculator/">HECS-HELP</a></li>
          <li><a href="/pay-rise-calculator/">Pay Rise</a></li>
          <li><a href="/redundancy-pay-calculator/">Redundancy</a></li>
          <li><a href="/contractor-vs-employee-calculator/">Contractor vs Employee</a></li>
          <li><a href="/gross-pay-calculator/">Gross Pay</a></li>
          <li><a href="/hourly-to-annual-salary-calculator/">Hourly Converter</a></li>
          <li><a href="/employer-cost-calculator/">Employer Cost</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>Guides</h3>
        <ul role="list">
          <li><a href="/tax-brackets/">Tax Brackets 2025-26</a></li>
          <li><a href="/superannuation-guide/">Superannuation Guide</a></li>
          <li><a href="/medicare-levy/">Medicare Levy</a></li>
          <li><a href="/hecs-help-guide/">HECS-HELP Guide</a></li>
          <li><a href="/salary-sacrifice-guide/">Salary Sacrifice Guide</a></li>
          <li><a href="/low-income-tax-offset/">LITO</a></li>
          <li><a href="/payg-withholding-tables/">PAYG Tables</a></li>
          <li><a href="/understanding-your-payslip/">Payslip Guide</a></li>
          <li><a href="/award-rates/">Award Rates</a></li>
          <li><a href="/contractor-vs-employee/">Contractor vs Employee Guide</a></li>
          <li><a href="/redundancy-pay-guide/">Redundancy Guide</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>By State</h3>
        <ul role="list">
          <li><a href="/pay-calculator-nsw/">NSW</a></li>
          <li><a href="/pay-calculator-qld/">QLD</a></li>
          <li><a href="/pay-calculator-vic/">VIC</a></li>
          <li><a href="/pay-calculator-wa/">WA</a></li>
        </ul>
        <h3>Company</h3>
        <ul role="list">
          <li><a href="/about/">About</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/privacy/">Privacy Policy</a></li>
          <li><a href="/terms/">Terms of Use</a></li>
        </ul>
      </div>
    </nav>
    
    <div class="footer-disclaimer">
      <p>This calculator provides estimates based on official ATO tax tables for FY2025-26. 
      It is for informational purposes only and does not constitute financial, tax, or 
      legal advice. For personal advice, consult a registered tax agent.</p>
      <p>© 2026 Pay Calculator Australia. Not affiliated with the ATO.</p>
    </div>
  </footer>
</body>
</html>
```

---

## 2. Guide Page Template (Differences from Calculator)

Guide pages use `<article>` as the primary container and don't include the calculator `<section>`:

```html
<main id="main-content">
  <article>
    <header>
      <h1>{H1}</h1>
      <p class="lead">{Lead paragraph}</p>
      <aside class="source-attribution">
        <p>Sourced from <a href="https://www.ato.gov.au">ATO</a>. 
        Updated: <time datetime="2026-03-14">14 March 2026</time></p>
      </aside>
    </header>

    <section aria-labelledby="section-1">
      <h2 id="section-1">{H2}</h2>
      <p>{Content}</p>
      
      <!-- Data tables -->
      <table aria-label="{Table description}">
        <caption>{Table caption — helps accessibility AND SEO}</caption>
        <thead>...</thead>
        <tbody>...</tbody>
      </table>
    </section>

    <!-- Repeat sections per H2 in content brief -->
    
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading">Frequently Asked Questions</h2>
      <!-- FAQ details/summary pattern -->
    </section>
  </article>

  <!-- Related Calculators sidebar (optional) -->
  <aside aria-label="Related calculators">
    <h2>Related Calculators</h2>
    <ul>
      <li><a href="/{related_calc}/">{Calculator name}</a></li>
    </ul>
  </aside>
</main>
```

---

## 3. Semantic Element Reference

| Element | Use For | SEO Benefit |
|---------|---------|-------------|
| `<main>` | Primary content area (one per page) | Signals main content vs nav/footer |
| `<article>` | Self-contained content (guides, blog posts) | Indicates complete, standalone content |
| `<section>` | Thematic grouping with heading | Groups related content under H2s |
| `<aside>` | Tangential content (trust bar, related links) | Separates supplementary from core content |
| `<nav>` | Navigation blocks | Identifies navigation vs content links |
| `<header>` | Introductory content for article/section | Marks the intro zone |
| `<footer>` | Footer content, disclaimers | Signals non-primary content |
| `<details>/<summary>` | FAQs, collapsible sections | Native accessible accordion |
| `<output>` | Calculator results | Semantically marks computed output |
| `<time>` | Dates | Machine-readable date for freshness |
| `<table>` with `<caption>` | Data tables | Helps Google understand tabular data |
| `<fieldset>/<legend>` | Form groups | Accessibility + form semantics |

### Accessibility Attributes (Required)

| Attribute | Use On | Purpose |
|-----------|--------|---------|
| `aria-label` | Sections, nav, forms | Screen reader description |
| `aria-live="polite"` | Calculator results | Announces updates |
| `aria-current="page"` | Active nav link | Identifies current page |
| `aria-expanded` | Dropdown toggles | State indicator |
| `role="status"` | Dynamic content | Implicit live region |
| `scope="row"/"col"` | Table headers | Associates headers with data |

---

## 4. Heading Hierarchy Rules

```
<h1> — ONE per page. Contains primary keyword.
  <h2> — Major sections. Contains secondary keywords or entity names.
    <h3> — Subsections within H2. Attribute-level detail.
      <h4> — Rare. Only if H3 needs sub-detail.
```

**Never skip levels** (no H1 → H3). Every H2 must follow H1.

### Example: Income Tax Calculator Page
```
H1: Income Tax Calculator Australia 2025-26
  H2: Calculate Your Income Tax
  H2: Australian Tax Brackets 2025-26
  H2: How Marginal Tax Works
  H2: Tax Offsets That Reduce Your Tax
    H3: Low Income Tax Offset (LITO)
    H3: Seniors and Pensioners Tax Offset (SAPTO)
  H2: Tax on Common Salaries
  H2: Frequently Asked Questions
```
