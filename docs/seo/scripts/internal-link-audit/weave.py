"""Cross-cluster weave check. usage: weave.py graph.json [verbose]"""
import json, sys
G = json.load(open(sys.argv[1]))
V = len(sys.argv) > 2
P = set(G)
ctx = {s: {t for t, _, r in L if r != "chrome" and t != s} for s, L in G.items()}

def S(f):
    return {p for p in P if f(p)}

sets = {
    "awards": S(lambda p: (p.endswith("-award-rates/") or p in ("/award-rates/", "/schads-award-pay-rates/"))),
    "jobs": S(lambda p: p.startswith("/job-pay-rates/")),
    "employers": S(lambda p: p.startswith("/pay-rates/")),
    "minwage_junior": S(lambda p: p.startswith("/minimum-wage") or p == "/junior-pay-rates/"),
    "payroll_tax": S(lambda p: p.startswith("/payroll-tax")),
    "employer_cost": {"/employer-cost-calculator/"},
    "state_pay": S(lambda p: p.startswith("/pay-calculator-")),
    "centrelink_spokes": {"/jobseeker-payment-calculator/", "/austudy-youth-allowance-calculator/", "/age-pension-income-test-calculator/", "/parenting-payment-calculator/", "/carer-payment-calculator/", "/centrelink-working-credit-calculator/", "/family-tax-benefit-calculator/", "/rent-assistance-calculator/", "/carer-allowance/", "/centrelink-advance-payment/", "/centrelink-crisis-payment/", "/centrelink-debt/", "/pension-age-australia/", "/cost-of-living-payment-2026/", "/parental-leave-pay/"} & P,
    "income_test_hub": {"/centrelink-income-test/"},
    "pay_calcs": {"/take-home-pay-calculator/", "/weekly-pay-calculator/", "/fortnightly-pay-calculator/", "/gross-pay-calculator/", "/annual-pay-calculator/", "/monthly-pay-calculator/", "/income-tax-calculator/", "/"},
    "entitlements": {"/time-in-lieu/", "/leave-loading-calculator/", "/enterprise-agreement/", "/travel-allowance/", "/cents-per-km/", "/gross-vs-net-pay/", "/centrelink-working-credit-calculator/"},
    "payslip_leave_ot": {"/understanding-your-payslip/", "/leave-calculator/", "/overtime-pay-calculator/", "/annual-leave-guide/", "/overtime-penalty-rates-guide/", "/payslip-generator/"},
    "tax_core": {"/tax-brackets/", "/tax-withheld-calculator/", "/low-income-tax-offset/", "/tax-free-threshold/", "/medicare-levy-surcharge-calculator/", "/medicare-levy/", "/payg-withholding-tables/"},
    "salary_pages": S(lambda p: p.startswith(("/take-home-pay-on/", "/tax-on/", "/salary-to-hourly/", "/hourly-to-salary/"))),
    "salary_hubs": {"/take-home-pay-on/", "/tax-on/", "/salary-to-hourly/", "/hourly-to-salary/"} & P,
    "calculators": {"/take-home-pay-calculator/", "/income-tax-calculator/", "/salary-to-hourly/", "/hourly-to-annual-salary-calculator/", "/pay-rise-calculator/", "/weekly-pay-calculator/", "/fortnightly-pay-calculator/"},
}
pairs = [
    ("awards", "jobs"), ("jobs", "awards"), ("awards", "employers"), ("employers", "awards"), ("jobs", "employers"), ("employers", "jobs"),
    ("awards", "minwage_junior"), ("minwage_junior", "awards"), ("jobs", "minwage_junior"), ("minwage_junior", "jobs"), ("employers", "minwage_junior"), ("minwage_junior", "employers"),
    ("payroll_tax", "employer_cost"), ("employer_cost", "payroll_tax"), ("payroll_tax", "state_pay"), ("state_pay", "payroll_tax"), ("state_pay", "employer_cost"),
    ("centrelink_spokes", "income_test_hub"), ("income_test_hub", "centrelink_spokes"), ("centrelink_spokes", "pay_calcs"), ("pay_calcs", "centrelink_spokes"),
    ("entitlements", "payslip_leave_ot"), ("payslip_leave_ot", "entitlements"),
    ("tax_core", "salary_pages"), ("salary_pages", "tax_core"),
    ("salary_hubs", "calculators"), ("calculators", "salary_hubs"),
]
for a, b in pairs:
    A, B = sets[a], sets[b]
    lacking = sorted(p for p in A if not (ctx[p] & (B - {p})))
    tgt_hit = {t for p in A for t in ctx[p] & B}
    print(f"{a:18} -> {b:18} sources lacking any link: {len(lacking):4}/{len(A):4}   targets reached: {len(tgt_hit)}/{len(B)}")
    if V and lacking:
        print("      ", lacking[:12])
    if V and len(B) <= 16:
        print("       unreached:", sorted(B - tgt_hit))
