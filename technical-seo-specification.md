# Technical SEO Specification
## Pay Calculator Australia | Generated: 2026-03-14

---

## 1. robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

Sitemap: https://paycalculatoraustralia.com.au/sitemap.xml
```

---

## 2. XML Sitemap

### Structure
Single `sitemap.xml` — 30+ pages is small enough for one file.

### Priority Weighting

| Page Type | Priority | Change Frequency |
|-----------|----------|-----------------|
| Homepage | 1.0 | weekly |
| Core Calculators (C1-C10) | 0.9 | monthly |
| Frequency Pages (C11-C14) | 0.7 | monthly |
| State Pages (C15-C18) | 0.7 | monthly |
| Guide Pages (G1-G12) | 0.8 | monthly |
| About / Contact / Privacy / Terms | 0.3 | yearly |
| Programmatic salary pages | 0.5 | monthly |

### Template
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://paycalculatoraustralia.com.au/</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://paycalculatoraustralia.com.au/income-tax-calculator/</loc>
    <lastmod>2026-03-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- ... all other pages ... -->
</urlset>
```

**Auto-generate**: `lastmod` should auto-update from file modification timestamps.

---

## 3. Canonical URLs

Every page must have a self-referencing canonical:

```html
<link rel="canonical" href="https://paycalculatoraustralia.com.au/[slug]/" />
```

**Rules**:
- Always include trailing slash
- Always HTTPS
- Always `www` or non-`www` — be consistent (recommend non-`www`)
- Programmatic pages (`/tax-on-80000/`) get their own canonical — no canonical to parent

---

## 4. Open Graph & Twitter Cards

### Template (Every Page)
```html
<!-- Open Graph -->
<meta property="og:title" content="[title tag]" />
<meta property="og:description" content="[meta description]" />
<meta property="og:url" content="https://paycalculatoraustralia.com.au/[slug]/" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://paycalculatoraustralia.com.au/og/[slug].png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="en_AU" />
<meta property="og:site_name" content="Pay Calculator Australia" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[title tag]" />
<meta name="twitter:description" content="[meta description]" />
<meta name="twitter:image" content="https://paycalculatoraustralia.com.au/og/[slug].png" />
```

### OG Image Strategy
Generate OG images programmatically (1200×630px):
- Background: brand gradient (dark navy → teal)
- Large text: Page title
- Subtext: "Free Australian Pay Calculator • FY2025-26"
- Logo in corner

---

## 5. Core Web Vitals Targets

| Metric | Target | How To Achieve |
|--------|--------|---------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Preload hero fonts, critical CSS inline, minimal JS |
| **FID/INP** (Interaction to Next Paint) | < 200ms | Calculator is pure JS — no server round-trips |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Set explicit dimensions on calculator, load fonts with `font-display: swap` |

### Performance Rules
- **No render-blocking JS** — calculator logic loads async or deferred
- **CSS**: Critical CSS inlined in `<head>`, rest loaded async
- **Fonts**: Preload primary font, use `font-display: swap`
- **Images**: WebP format, lazy loading (`loading="lazy"`) below the fold
- **No external dependencies** that block render (no jQuery, no heavy frameworks)
- **CDN**: Serve static assets from CloudFlare or Vercel Edge
- **Compression**: Brotli or gzip on all text assets

---

## 6. Mobile-First Requirements

- **Min breakpoint**: 320px (iPhone SE)
- **Calculator input**: Large touch targets (48px minimum)
- **Results display**: Stacks vertically on mobile, table becomes card layout
- **Navigation**: Hamburger menu on mobile with accessible toggle
- **Font size**: Never below 16px for body text (prevents iOS zoom)
- **Viewport meta**: `<meta name="viewport" content="width=device-width, initial-scale=1">`

---

## 7. URL Standards

| Rule | Example |
|------|---------|
| Lowercase only | `/tax-brackets/` not `/Tax-Brackets/` |
| Hyphens for separators | `/pay-calculator-nsw/` not `/pay_calculator_nsw/` |
| Trailing slash | `/income-tax-calculator/` not `/income-tax-calculator` |
| No file extensions | `/tax-brackets/` not `/tax-brackets.html` |
| No parameters for content | `/tax-on-80000/` not `/?salary=80000` |
| Max 5 words in slug | `/salary-sacrifice-calculator/` (3 words ✓) |

---

## 8. HTTP Headers

```
# Security
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;

# Caching
Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400
```

---

## 9. Analytics & Tracking

### Google Analytics 4
```html
<!-- GA4 — load async, don't block render -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure'
  });
</script>
```

### Custom Events to Track
| Event | When | Purpose |
|-------|------|---------|
| `calculator_used` | User clicks "Calculate" | Engagement metric |
| `salary_entered` | Salary input > 0 | Usage tracking |
| `results_copied` | User clicks "Copy" | Sharing behavior |
| `frequency_changed` | Toggle pay frequency | Feature usage |
| `hecs_toggled` | HECS checkbox toggled | Feature discovery |
| `guide_link_clicked` | Click from calc → guide | Content journey |
| `faq_expanded` | FAQ accordion opened | Content interest |

---

## 10. 404 Page

Custom 404 page with:
- Friendly message: "This page doesn't exist — but we can still calculate your pay"
- Link to homepage calculator
- Links to top 5 calculators
- Search functionality (optional)
- **Do NOT** redirect 404s to homepage (bad for SEO)

---

## 11. Redirects (Future-Proofing)

Set up 301 redirect rules for common patterns:
```
# Financial year redirects (when pages get updated)
/tax-brackets-2024-25  →  /tax-brackets/
/tax-brackets-2025-26  →  /tax-brackets/

# Common misspellings
/pay-calculater/  →  /
/pay-calcualtor/  →  /
/superannuation-calcualtor/  →  /superannuation-calculator/

# Alternative URL patterns
/calculator/  →  /
/tax/  →  /tax-brackets/
/super/  →  /superannuation-calculator/
```
