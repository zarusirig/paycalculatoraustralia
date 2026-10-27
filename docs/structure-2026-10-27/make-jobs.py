import csv,json,re,collections,os
C='../../calc-boiler/'
rows={r['url'].replace('https://pay-calculator-australia.com',''):r for r in csv.DictReader(open('MAP.tsv'),delimiter='\t')}
audit={r['path']:r for r in csv.DictReader(open('AUDIT.tsv'),delimiter='\t')}
plan=[l.split('|')[1].strip() for l in open('PLAN.md').read().split('## 2.')[0].splitlines() if l.startswith('| /')]
sr=json.load(open('structure-requests.json'))
req=collections.defaultdict(list); unm=[]
for x in sr:
  p=re.sub(r'https://pay-calculator-australia.com','',x.get('page',''))
  (req[p].append(x.get('need','')) if p in rows else unm.append((p,x.get('need',''))))
skip={'/about/','/contact/','/disclaimer/','/news/'}
for p,n in unm:
  m=re.search(r'/[a-z0-9-]+/',p); pre=m.group(0) if m else None
  hit=next((q for q in rows if pre and q.startswith(pre) and q not in skip),None)
  if hit: req[hit].append(f'(applies to {p}) '+n)
pages=[p for p in dict.fromkeys(plan+list(req)) if p in rows and p not in skip]
LOCKED={'modules/seo/json-ld.tsx','modules/seo/related-searches.tsx','modules/guide/t3-seo.tsx','modules/guide/job-pay-shared.tsx','modules/guide/t3-shared.tsx','modules/calculator/t3-calc-shared.tsx'}
def files(p):
  r=rows[p]; fs=[r['page_file']]+[f for f in r['content_files'].split(',') if f]
  fs=[f for f in fs if f.startswith(('app/','modules/')) and f not in LOCKED]
  if p.startswith('/news/'):
    slug=p.strip('/').split('/')[-1]; a=f'modules/news/articles/{slug}.tsx'
    fs=[f for f in fs if not f.startswith('modules/news/articles/')]+([a] if os.path.exists(C+a) else [])
  return list(dict.fromkeys(fs))
# union-find pages through shared editable files
par={p:p for p in pages}
def find(x):
  while par[x]!=x: par[x]=par[par[x]]; x=par[x]
  return x
own={}
for p in pages:
  for f in files(p):
    if f in own: par[find(p)]=find(own[f])
    else: own[f]=p
cl=collections.defaultdict(list)
for p in pages: cl[find(p)].append(p)
groups=sorted(cl.values(),key=len,reverse=True)
print('groups',len(groups),'largest',[len(g) for g in groups[:8]])
# pack small groups to jobs of <= 5 pages
jobs=[];cur=[]
for g in groups:
  if len(g)>=5: jobs.append(g); continue
  if len(cur)+len(g)>5: jobs.append(cur); cur=[]
  cur+=g
if cur: jobs.append(cur)
names=[]
for i,ps in enumerate(jobs):
  fs=sorted(set(f for p in ps for f in files(p)))
  nm=f'st-{i+1:03d}-'+(ps[0].strip('/').replace('/','-')[:26] or 'home')
  pg=[]
  for p in ps:
    a=audit.get(p,{})
    pg.append({'path':p,'url':'https://pay-calculator-australia.com'+p,'inPlan':p in plan,'intent':a.get('intent'),'format_fit':a.get('format_fit'),'centerpiece':a.get('centerpiece'),'main_query':a.get('main_query'),'pre28_clicks':a.get('pre28_clicks'),'pre28_impr':a.get('pre28_impr'),'requests':req.get(p,[])})
  json.dump({'name':nm,'files':fs,'pages':pg,'lockedSharedFiles':sorted(LOCKED)},open(f'../structure-2026-10-27/jobs/{nm}.json','w'),indent=1)
  names.append(nm)
json.dump(names,open('../structure-2026-10-27/run-args.json','w'))
print('jobs',len(names),'max files',max(len(json.load(open(f'../structure-2026-10-27/jobs/{n}.json'))['files']) for n in names))
