import csv, re, os, sys
from collections import defaultdict, OrderedDict
D = os.path.join(os.path.dirname(__file__), 'data', 'Pay AU Calc Data')
def load(f):
    rows = list(csv.DictReader(open(os.path.join(D, f))))
    for r in rows:
        for k in ('clicks','impressions'): r[k]=int(r[k])
        r['position']=float(r['position']); r['ctr']=float(r['ctr'])
    return rows
q = load('by_query.csv'); qp = load('by_query_page.csv'); pg = load('by_page.csv'); dt = load('by_date.csv')
strip = lambda u: u.replace('https://pay-calculator-australia.com','')

FAM = OrderedDict([
 ('bonus', r'\bbonus'),
 ('commission', r'commission'),
 ('backpay/underpaid', r'back ?pay|underpa|owed wages|arrears'),
 ('second job', r'second job|2nd job|two jobs|2 jobs|multiple jobs|side hustle|job 2'),
 ('leave payout', r'leave payout|leave pay out|annual leave|long service|sick leave|leave loading|leave calculator|parental leave|paid parental|maternity|cash out leave|unused leave|leave entitlement'),
 ('final pay', r'final pay|termination pay|last pay|resign'),
 ('redundancy/ETP', r'redundan|severance|\betp\b|genuine'),
 ('pay rise', r'pay ?rise|payrise|salary increase|raise calculator|pay increase|% increase|percent increase'),
 ('centrelink', r'centrelink|jobseeker|age pension|income test|family tax|parenting payment|youth allowance|austudy|rent assist|carer payment|disability support pension|\bdsp\b|income free area|work bonus'),
 ('hecs/help', r'hecs|\bhelp\b|stsl|study loan|student loan'),
 ('lito', r'\blito\b|low income tax offset|low income offset'),
 ('sapto', r'sapto|senior|pensioner tax'),
 ('zone offset', r'zone tax|zone offset|zone rebate|zone a|zone b|remote area'),
 ('medicare/MLS', r'medicare|\bmls\b|private health|hospital cover'),
 ('super', r'\bsuper|superannuation|\bsg\b|concessional|division 293|co-contribution|\bote\b|payday super'),
 ('salary sacrifice/novated/FBT', r'salary sacrific|novated|\bfbt\b|fringe|salary packag|packaging'),
 ('tax tables', r'tax table|withholding table|schedule [0-9]|nat ?[0-9]{4}|payg table|payg withholding|tax scale'),
 ('tax brackets/rates', r'tax bracket|tax rate|marginal rate|resident rate|tax threshold|tax free threshold|tax-free threshold|stage 3|tax cut'),
 ('amount: tax on / after tax / take home $X', r'(tax on|after tax|take home|net of|in hand|clear)\b.*\d|\d.*(after tax|take home|tax on|net pay|in hand|after taxes|clear\b)'),
 ('amount: salary → hourly', r'(a year|per year|annual|per annum|pa|salary)\b.*(hour|hr)|\d+k?\s*(a year|per year|annum).*hour|/\s*52|/\s*26|/\s*12\b|\bhourly rate (for|of|on)'),
 ('amount: hourly → salary', r'(an hour|per hour|hourly|\bhr\b|/hr|p\.?h)\b.*(year|annual|annum|salary|month|week|fortnight)|\d+\s*(an hour|per hour|hourly).*'),
 ('frequency calculators', r'fortnight|weekly|monthly|annual pay|per week|per month|pay period|pay cycle|pay frequency'),
 ('gross/net convert', r'gross|net to gross|net pay|reverse'),
 ('overtime/penalty/casual', r'overtime|penalty|casual loading|casual rate|public holiday rate|sunday rate|saturday rate|time and a half|double time|shift loading|night shift|weekend rate'),
 ('award rates', r'award|schads|hospitality rate|retail rate|clerks|fast food|nurses rate|aged care rate|children.?s services|restaurant|pharmacy rate|cleaning rate|security rate|manufacturing|road transport|horticulture|storage|vehicle|hair|beauty|fitness|real estate rate|legal services|banking|education services|health professional|medical practitioner|plumbing|electrical rate|joinery|timber|black coal|oil and gas|maritime|sacs|level [0-9] pay|pay point|pay grade|classification'),
 ('junior/apprentice', r'junior|apprentice|trainee|under 21|under 18|16 year|17 year|18 year|19 year|20 year|youth wage|minor'),
 ('minimum wage', r'minimum wage|min wage|national minimum|award wage|living wage|lowest wage|base rate'),
 ('occupation pay', r'nurse|nursing|teacher|teaching|police|doctor|gp\b|electrician|plumber|carpenter|truck driver|driver|miner|mining|fifo|aged care|childcare|child care|early childhood|disability support|paramedic|firefighter|fire fighter|defence|\badf\b|army|navy|pharmacist|physio|dentist|lawyer|solicitor|engineer|accountant|software|developer|chef|cook|barista|cleaner|security guard|bus|train|pilot|flight attendant|tradie|retail assistant|hospitality worker|uber|doordash|delivery|labourer|receptionist|admin|bookkeeper|social worker|psychologist|midwife|surgeon|anaesthet|radiograph|occupational therap|optometr|vet\b|veterinar|pharmacy assistant|warehouse|forklift|scaffold|crane|boilermaker|welder|mechanic|painter|tiler|plasterer|bricklayer|roofer|landscap|gardener|farm|shearer|fisher|deckhand|lifeguard|swim|personal trainer|hairdresser|beautician|tattoo|photograph|journalist|graphic|architect|surveyor|town planner|it support|data|analyst|consultant|manager|ceo|director|executive|public servant|aps\b|council|government job|teacher aide|education support|library|academic|lecturer|professor|researcher|scientist|lab|dental assistant|medical receptionist|practice manager|enrolled nurse|registered nurse|\brn\b|\ben\b|\bain\b|carer|support worker|youth worker|case manager|counsellor|chaplain|pastor|minister of religion|real estate agent|property manager|mortgage broker|financial adviser|financial planner|bank teller|call centre|customer service|sales|telemarket|courier|postie|australia post|woolworths|coles|aldi|kmart|bunnings|mcdonald|kfc|hungry jack|dominos|subway|guzman|jb hi|officeworks|big w|target|myer|david jones|qantas|virgin|jetstar|bhp|rio tinto|fortescue|telstra|optus|nbn|commbank|westpac|nab|anz|medibank|bupa'),
 ('state/city', r'\bnsw\b|new south wales|\bvic\b|victoria|\bqld\b|queensland|\bwa\b|western australia|\bsa\b|south australia|\btas\b|tasmania|\bact\b|canberra|\bnt\b|northern territory|sydney|melbourne|brisbane|perth|adelaide|hobart|darwin|gold coast|newcastle|wollongong|geelong|townsville|cairns|toowoomba'),
 ('payroll tax', r'payroll tax'),
 ('employer cost/on-costs', r'employer cost|on-?cost|cost of an employee|cost to employ|workers comp|workcover|cost of hiring|employee cost|payroll software|payroll calculator|employer super|employer contribution'),
 ('contractor/ABN/sole trader', r'contractor|\babn\b|sole trader|subcontract|\bgst\b|company vs|pty ltd|self employed|self-employed|freelanc|invoice|hnry|day rate|daily rate'),
 ('employment type', r'casual|part[- ]time|full[- ]time|permanent|employment type|pro rata|pro-rata|prorata|convert casual'),
 ('visa/non-resident', r'visa|whv|backpacker|417|462|482|working holiday|non-?resident|foreign resident|temporary resident|overseas|expat|migrant|student visa|departing australia|\bdasp\b|tax residency|resident for tax'),
 ('tax return/refund', r'tax return|refund|tax back|notice of assessment|\bnoa\b|lodge|mytax|tax time|tax owed|owe tax|tax bill|tax debt|amended|etax'),
 ('deductions/WFH', r'deduct|work from home|\bwfh\b|claim|uniform|laundry|car expense|logbook|cents per km|home office|self education|donation'),
 ('payslip/TFN/YTD', r'payslip|pay slip|\bytd\b|year to date|\btfn\b|tax file|payg summary|income statement|\bstp\b|single touch|pay stub|payment summary'),
 ('holidays/working days/calendar', r'public holiday|school holiday|working days|business days|fortnights in|weeks in a year|pay ?days in|financial year|\bfy\b|eofy|end of financial|how many (weeks|fortnights|months|days|hours)|pay periods in|paydays|calendar'),
 ('CGT/investment', r'capital gain|\bcgt\b|shares|crypto|dividend|investment property|negative gearing|rental income|etf|franking'),
 ('average salary/benchmark', r'average (salary|wage|income|pay)|median (salary|wage|income)|good salary|typical salary|salary by|how much do .* (earn|make)|earn in australia|salary range|top 10%|top 1%|percentile|high income'),
 ('mortgage/borrow', r'mortgage|home loan|borrow|repayment|lend|afford'),
 ('budget/cost of living', r'budget|cost of living|rent|living expenses|save|savings'),
 ('head term: pay/salary/tax calculator', r'^(the )?(best |free |online |ato |australian |aus |australia )?(pay|salary|wage|income tax|tax|take ?home( pay)?|net pay|paye|payg|income) ?(calc|calculator|calculators|calculater|calulator)( australia| aus| ato| 2026| 2025| 2027| 2026-27| 2025-26)?$|^(pay|tax|salary|wage|income tax) calculator( australia)?( 2026| 2027| 2026-27| 2025-26)?$|paycalculator|pay calc\b|salary calc\b|tax calc\b'),
])
CX = [(k, re.compile(p)) for k,p in FAM.items()]
def fam(qs):
    ql = qs.lower()
    for k,rx in CX:
        if rx.search(ql): return k
    return 'unclassified'

# per-query family
qfam = {r['query']: fam(r['query']) for r in q}
agg = defaultdict(lambda: {'clicks':0,'impr':0,'wpos':0.0,'n':0,'queries':[]})
for r in q:
    a = agg[qfam[r['query']]]
    a['clicks']+=r['clicks']; a['impr']+=r['impressions']; a['wpos']+=r['position']*r['impressions']; a['n']+=1; a['queries'].append(r)
# landing pages per family
fpage = defaultdict(lambda: defaultdict(lambda: [0,0]))
for r in qp:
    f = qfam.get(r['query'], fam(r['query']))
    fpage[f][strip(r['page'])][0]+=r['impressions']; fpage[f][strip(r['page'])][1]+=r['clicks']

TOT_I = sum(r['impressions'] for r in q); TOT_C = sum(r['clicks'] for r in q)
print(f"TOTAL: {TOT_C} clicks, {TOT_I} impressions, {len(q)} queries\n")
print("="*100)
print("FAMILY TABLE (sorted by impressions)")
print("="*100)
print(f"{'family':40s} {'clicks':>6s} {'impr':>8s} {'ctr':>6s} {'pos':>5s} {'#q':>6s}  {'%impr':>5s}")
for k,a in sorted(agg.items(), key=lambda kv:-kv[1]['impr']):
    pos = a['wpos']/a['impr'] if a['impr'] else 0
    print(f"{k:40s} {a['clicks']:6d} {a['impr']:8d} {100*a['clicks']/max(a['impr'],1):5.2f}% {pos:5.1f} {a['n']:6d}  {100*a['impr']/TOT_I:4.1f}%")

print("\n"+"="*100)
print("FAMILY DETAIL: top queries + landing pages")
print("="*100)
for k,a in sorted(agg.items(), key=lambda kv:-kv[1]['impr']):
    if a['impr'] < 1500: continue
    pos = a['wpos']/a['impr'] if a['impr'] else 0
    print(f"\n### {k}  — {a['clicks']} clicks / {a['impr']} impr / pos {pos:.1f} / {a['n']} queries")
    print("  top queries by impressions:")
    for r in sorted(a['queries'], key=lambda r:-r['impressions'])[:10]:
        print(f"    {r['clicks']:4d}c {r['impressions']:6d}i {100*r['ctr']:5.1f}% p{r['position']:5.1f}  {r['query']}")
    print("  landing pages (impr, clicks):")
    for p,(i,c) in sorted(fpage[k].items(), key=lambda kv:-kv[1][0])[:6]:
        print(f"    {i:7d}i {c:5d}c  {p}")

# question queries
print("\n"+"="*100)
print("QUESTION QUERIES (how/what/when/why/is/do/can/should/which/does/will/am) — top 40 by impressions")
print("="*100)
qq = [r for r in q if re.match(r'^(how|what|when|why|is|do|does|can|should|which|will|am|are|who|where)\b', r['query'].lower())]
print(f"count={len(qq)} clicks={sum(r['clicks'] for r in qq)} impr={sum(r['impressions'] for r in qq)}")
for r in sorted(qq, key=lambda r:-r['impressions'])[:40]:
    print(f"    {r['clicks']:4d}c {r['impressions']:6d}i p{r['position']:5.1f}  [{qfam[r['query']]}]  {r['query']}")

# temporal tokens
print("\n"+"="*100)
print("TEMPORAL: queries containing a year token")
print("="*100)
for tok in ['2024-25','2024/25','2025-26','2025/26','2026-27','2026/27','2025','2026','2027']:
    rows=[r for r in q if tok in r['query']]
    print(f"  {tok:8s} n={len(rows):5d} clicks={sum(r['clicks'] for r in rows):5d} impr={sum(r['impressions'] for r in rows):7d}")

# cannibalisation
print("\n"+"="*100)
print("CANNIBALISATION: query impr>=150, >=2 pages each holding >=20% of its impressions")
print("="*100)
byq = defaultdict(list)
for r in qp: byq[r['query']].append(r)
cann=[]
for qs, rows in byq.items():
    tot = sum(r['impressions'] for r in rows)
    if tot < 150: continue
    big = [r for r in rows if r['impressions'] >= 0.2*tot]
    if len(big) >= 2:
        cann.append((tot, qs, big))
for tot, qs, big in sorted(cann, key=lambda x:-x[0])[:40]:
    print(f"  {tot:6d}i  {qs}")
    for r in sorted(big, key=lambda r:-r['impressions']):
        print(f"           {r['impressions']:6d}i {r['clicks']:4d}c p{r['position']:5.1f}  {strip(r['page'])}")

# page-level low ctr
print("\n"+"="*100)
print("PAGES: impressions >= 8000 and CTR < 0.7% (title/snippet mismatch candidates)")
print("="*100)
for r in sorted(pg, key=lambda r:-r['impressions']):
    if r['impressions']>=8000 and r['ctr']<0.007:
        print(f"  {r['clicks']:5d}c {r['impressions']:7d}i {100*r['ctr']:5.2f}% p{r['position']:5.1f}  {strip(r['page'])}")

# dormant routes
print("\n"+"="*100)
print("DORMANT: live routes with < 300 impressions in 5.5 months")
print("="*100)
seen = {strip(r['page']).strip('/').split('/')[0]: r for r in pg}
# aggregate by first segment
seg = defaultdict(lambda:[0,0])
for r in pg:
    s = strip(r['page']).strip('/').split('/')[0] or '(home)'
    seg[s][0]+=r['impressions']; seg[s][1]+=r['clicks']
routes = [d for d in os.listdir('/Users/surajgiri/Desktop/paycalculatoraustralia/calc-boiler/app') if os.path.isdir(os.path.join('/Users/surajgiri/Desktop/paycalculatoraustralia/calc-boiler/app', d)) and not d.startswith('_') and d not in ('api',)]
for d in sorted(routes, key=lambda d: seg.get(d,[0,0])[0]):
    i,c = seg.get(d,[0,0])
    if i < 300: print(f"  {i:6d}i {c:4d}c  /{d}/")

# trend
print("\n"+"="*100)
print("TREND: 28-day windows (clicks / impressions / ctr / pos)")
print("="*100)
dt.sort(key=lambda r:r['date'])
def win(rows):
    c=sum(r['clicks'] for r in rows); i=sum(r['impressions'] for r in rows)
    p=sum(r['position']*r['impressions'] for r in rows)/max(i,1)
    return c,i,100*c/max(i,1),p
for label, rows in [('last 28d', dt[-28:]), ('prior 28d', dt[-56:-28]), ('28d before that', dt[-84:-56])]:
    c,i,ctr,p = win(rows); print(f"  {label:16s} {rows[0]['date']}→{rows[-1]['date']}  {c:5d}c {i:7d}i {ctr:5.2f}% p{p:5.2f}")
print("  weekly:")
for k in range(0, len(dt), 7):
    w = dt[k:k+7]; c,i,ctr,p = win(w)
    print(f"    {w[0]['date']}  {c:5d}c {i:7d}i {ctr:5.2f}% p{p:5.2f}")
