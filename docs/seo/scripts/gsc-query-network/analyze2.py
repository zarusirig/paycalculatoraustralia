import csv, re, os
from collections import defaultdict
D = os.path.join(os.path.dirname(__file__), 'data', 'Pay AU Calc Data')
def load(f):
    rows = list(csv.DictReader(open(os.path.join(D, f))))
    for r in rows:
        for k in ('clicks','impressions'): r[k]=int(r[k])
        r['position']=float(r['position']); r['ctr']=float(r['ctr'])
    return rows
q = load('by_query.csv'); qp = load('by_query_page.csv'); pg = load('by_page.csv')
strip = lambda u: u.replace('https://pay-calculator-australia.com','')
for r in qp: r['p']=strip(r['page'])
for r in pg: r['p']=strip(r['page'])

def show_page_queries(p, n=12):
    rows=[r for r in qp if r['p']==p]
    tot_i=sum(r['impressions'] for r in rows); tot_c=sum(r['clicks'] for r in rows)
    print(f"\n### {p}  (visible queries: {tot_c}c / {tot_i}i over {len(rows)} queries)")
    for r in sorted(rows, key=lambda r:-r['impressions'])[:n]:
        print(f"    {r['clicks']:4d}c {r['impressions']:6d}i {100*r['ctr']:5.1f}% p{r['position']:5.1f}  {r['query']}")

print("="*100); print("1. WHAT THE WEAK BIG PAGES RANK FOR"); print("="*100)
for p in ['/weekly-pay-calculator/','/working-holiday-tax/','/hecs-help-guide/','/superannuation-calculator/','/award-rates/','/income-tax-calculator/','/tax-brackets/','/fringe-benefits-tax/','/hourly-to-annual-salary-calculator/','/']:
    show_page_queries(p)

def family(name, pat, n=15):
    rx=re.compile(pat); rows=[r for r in q if rx.search(r['query'].lower())]
    i=sum(r['impressions'] for r in rows); c=sum(r['clicks'] for r in rows)
    wp=sum(r['position']*r['impressions'] for r in rows)/max(i,1)
    print(f"\n### {name}: {len(rows)} queries, {c} clicks, {i} impressions, pos {wp:.1f}")
    for r in sorted(rows, key=lambda r:-r['impressions'])[:n]:
        print(f"    {r['clicks']:4d}c {r['impressions']:6d}i p{r['position']:5.1f}  {r['query']}")
    lp=defaultdict(lambda:[0,0])
    for r in qp:
        if rx.search(r['query'].lower()): lp[r['p']][0]+=r['impressions']; lp[r['p']][1]+=r['clicks']
    print("  landing:")
    for p,(ii,cc) in sorted(lp.items(), key=lambda kv:-kv[1][0])[:5]: print(f"    {ii:6d}i {cc:4d}c {p}")
    return rows

print("\n"+"="*100); print("2. HIDDEN FAMILIES"); print("="*100)
family("PACKAGE / PLUS SUPER / INCLUSIVE OF SUPER", r'package|plus super|including super|incl(usive|\.)? (of )?super|super inclusive|base salary|excluding super|ex super|before super|with super|super on top|\+ ?super')
family("WEEKLY/FORTNIGHTLY/MONTHLY AMOUNT (number + per week/fortnight/month)", r'\$?\d[\d,\.]*\s*k?\s*(a|per|each|every|/)\s*(week|wk|fortnight|fn|month)|(week|weekly|fortnight|fortnightly|month|monthly)\s+(pay|wage|salary|income|earn)\w*\s+(of\s+)?\$?\d|\$\d[\d,]*\s*(weekly|fortnightly|monthly)|(weekly|fortnightly|monthly)\s.*\$\d')
family("CASUAL / PART-TIME PRO RATA amount", r'pro.?rata|casual.*\d+ hours|\d+ hours (a|per) week.*(salary|pay|earn|year)|part time.*\d+ (hours|days)|(3|4) days a week')
family("HOURS PER WEEK conversions (e.g. 38 hours, 30 hours a week)", r'\b\d\d? hours? (a|per) week|\b\d\d?hrs?')
family("SHIFT / ROSTER / SWING (FIFO-type calculators)", r'roster|swing|2:1|8/6|2 weeks on|shift calculator|shift pay|12 hour shift|night shift pay')
family("SUPER RETIREMENT PROJECTION intent", r'super.*(retire|at 65|by 65|projection|balance|how much will|grow|forecast|enough)|retire.*super')
family("ALLOWANCES (uniform, tool, travel, meal, site, laundry, car)", r'allowance')
family("TAX ON SPECIFIC INCOME TYPES (overtime/leave loading/commission/allowance/termination)", r'tax on (overtime|leave loading|commission|allowance|termination|annual leave|long service|unused leave|back ?pay|arrears)')
family("PENSIONER / AGE PENSION WORK", r'age pension.*(work|earn|income)|work bonus|pensioner.*(work|earn)')

print("\n"+"="*100); print("3. PROGRAMMATIC CLUSTER TOTALS (full page data)"); print("="*100)
clus=defaultdict(lambda:[0,0,0,0.0])
for r in pg:
    seg=r['p'].strip('/').split('/')
    key = '/'+seg[0]+'/*' if len(seg)>1 else r['p']
    if len(seg)>1:
        c=clus[key]; c[0]+=r['impressions']; c[1]+=r['clicks']; c[2]+=1; c[3]+=r['position']*r['impressions']
for k,(i,c,n,wp) in sorted(clus.items(), key=lambda kv:-kv[1][0]):
    print(f"  {k:24s} {n:3d} pages  {c:5d}c {i:7d}i  {100*c/max(i,1):5.2f}%  pos {wp/max(i,1):5.1f}")
print("  per-page detail /hourly-to-salary/*:")
for r in sorted([r for r in pg if r['p'].startswith('/hourly-to-salary/')], key=lambda r:-r['impressions'])[:12]:
    print(f"     {r['clicks']:4d}c {r['impressions']:6d}i p{r['position']:5.1f} {r['p']}")

print("\n"+"="*100); print("4. AMOUNT COVERAGE — demand vs existing pages"); print("="*100)
RATES={25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,42,44,45,46,48,50,52,55,60,65,70,75,80,100}
SAL_HR={30000,40000,45000,50000,55000,60000,65000,70000,75000,80000,85000,90000,95000,100000,110000,120000,130000,140000,150000,200000}
TAXON=set(range(30000,200001,5000))
def num(s):
    s=s.replace(',','').replace('$','')
    m=re.search(r'(\d+(?:\.\d+)?)\s*k\b', s)
    if m: return float(m.group(1))*1000
    m=re.search(r'(\d+(?:\.\d+)?)', s)
    return float(m.group(1)) if m else None
# hourly -> salary
hr=defaultdict(lambda:[0,0])
for r in q:
    ql=r['query'].lower()
    m=re.search(r'\$?(\d{2}(?:\.\d{1,2})?)\s*(an hour|per hour|/hr|hourly|p/h|ph|hr)\b', ql)
    if m and re.search(r'year|annual|annum|salary|month|fortnight|week', ql):
        v=float(m.group(1)); hr[v][0]+=r['impressions']; hr[v][1]+=r['clicks']
print("\n  HOURLY RATE demand (impr, clicks) — * = no page:")
tot_unc=0
for v,(i,c) in sorted(hr.items(), key=lambda kv:-kv[1][0])[:45]:
    flag='' if v in RATES else '*'
    if flag: tot_unc+=i
    print(f"    ${v:6.2f}/hr  {i:5d}i {c:3d}c {flag}")
print(f"  uncovered impressions in top45: {tot_unc};  total uncovered all rates: {sum(i for v,(i,c) in hr.items() if v not in RATES)} of {sum(i for i,c in hr.values())}")
# salary -> hourly
sh=defaultdict(lambda:[0,0])
for r in q:
    ql=r['query'].lower()
    if re.search(r'hour|hr\b|hourly', ql) and re.search(r'year|annual|annum|salary|pa\b|/52|/26|/12', ql):
        m=re.search(r'\$?(\d{2,3}(?:,\d{3})?(?:\.\d+)?)\s*k?\b|\$?(\d{2,3},?\d{3})', ql)
        v=num(ql)
        if v and 15000<=v<=400000: sh[int(v)][0]+=r['impressions']; sh[int(v)][1]+=r['clicks']
print("\n  SALARY→HOURLY demand — * = no /salary-to-hourly/ page:")
for v,(i,c) in sorted(sh.items(), key=lambda kv:-kv[1][0])[:40]:
    flag='' if v in SAL_HR else '*'
    print(f"    ${v:7d}  {i:5d}i {c:3d}c {flag}")
print(f"  uncovered: {sum(i for v,(i,c) in sh.items() if v not in SAL_HR)} of {sum(i for i,c in sh.values())}")
# tax on / take home
tx=defaultdict(lambda:[0,0])
for r in q:
    ql=r['query'].lower()
    if re.search(r'tax on|after tax|take home|net|in hand|how much tax', ql) and not re.search(r'hour|week|fortnight|month|bonus', ql):
        v=num(ql)
        if v and 10000<=v<=500000: tx[int(round(v/1000)*1000)][0]+=r['impressions']; tx[int(round(v/1000)*1000)][1]+=r['clicks']
print("\n  TAX-ON / TAKE-HOME annual amount demand — * = no page (rounded to $1k):")
for v,(i,c) in sorted(tx.items(), key=lambda kv:-kv[1][0])[:45]:
    flag='' if v in TAXON else '*'
    print(f"    ${v:7d}  {i:5d}i {c:3d}c {flag}")
print(f"  uncovered: {sum(i for v,(i,c) in tx.items() if v not in TAXON)} of {sum(i for i,c in tx.values())}")

print("\n"+"="*100); print("5. CENTRELINK SUB-TYPES"); print("="*100)
for name,pat in [('jobseeker',r'jobseeker|newstart'),('youth allowance',r'youth allowance'),('austudy/abstudy',r'austudy|abstudy'),('age pension',r'age pension|pension'),('parenting payment',r'parenting'),('family tax benefit',r'family tax|ftb'),('carer',r'carer'),('dsp',r'disability|dsp'),('rent assistance',r'rent assist'),('generic centrelink calc',r'centrelink (payment|pay|income|calc)')]:
    rx=re.compile(pat); rows=[r for r in q if 'centrelink' in r['query'].lower() or rx.search(r['query'].lower())]
    rows=[r for r in rows if rx.search(r['query'].lower())]
    i=sum(r['impressions'] for r in rows); c=sum(r['clicks'] for r in rows)
    wp=sum(r['position']*r['impressions'] for r in rows)/max(i,1)
    print(f"  {name:22s} {len(rows):4d}q {c:4d}c {i:6d}i pos {wp:5.1f}")

print("\n"+"="*100); print("6. OCCUPATION SUB-TYPES (impr >= 150)"); print("="*100)
occ={'fifo/mining':r'fifo|mining|miner','teacher':r'teacher|teaching','nurse':r'nurse|nursing|\brn\b|\ben\b','police':r'police','doctor/gp':r'doctor|\bgp\b|surgeon','electrician':r'electrician|sparky','plumber':r'plumber','carpenter':r'carpenter|chippy','truck/driver':r'truck|driver','aged care':r'aged care','childcare':r'childcare|child care|early childhood','disability':r'disability support','paramedic':r'paramedic','firefighter':r'firefighter|fire fighter','defence/adf':r'defence|\badf\b|army|navy|air force','pharmacist':r'pharmac','physio':r'physio','dentist':r'dentist|dental','lawyer':r'lawyer|solicitor','engineer':r'engineer','accountant':r'accountant','software/it':r'software|developer|\bit\b|programmer','chef/cook':r'chef|cook','barista/hospitality':r'barista|hospitality|waiter|bartender','cleaner':r'cleaner|cleaning','security':r'security','pilot/cabin':r'pilot|flight attendant|cabin crew','apprentice':r'apprentice','retail':r'retail|woolworths|coles|aldi|kmart|bunnings','fast food':r'mcdonald|kfc|hungry|fast food','warehouse':r'warehouse|forklift','labourer':r'labourer','admin/reception':r'admin|reception','support worker':r'support worker|carer','social worker':r'social worker|youth worker|case manager','public service':r'public serv|\baps\b|government','uber/gig':r'uber|doordash|delivery|gig'}
rowsocc=[]
for name,pat in occ.items():
    rx=re.compile(pat); rows=[r for r in q if rx.search(r['query'].lower())]
    i=sum(r['impressions'] for r in rows); c=sum(r['clicks'] for r in rows)
    if i>=150: rowsocc.append((i,c,len(rows),name))
for i,c,n,name in sorted(rowsocc, reverse=True): print(f"  {name:20s} {n:4d}q {c:4d}c {i:6d}i")

print("\n"+"="*100); print("7. NEWS cluster pages"); print("="*100)
for r in sorted([r for r in pg if r['p'].startswith('/news/')], key=lambda r:-r['impressions'])[:15]:
    print(f"     {r['clicks']:4d}c {r['impressions']:6d}i p{r['position']:5.1f} {r['p']}")
