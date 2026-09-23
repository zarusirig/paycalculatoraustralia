import json,glob,collections
us={}
for r in json.load(open("pay-calculator-australia.com.json")):
    if r["kw"] not in us or r["pos"]<us[r["kw"]]["pos"]: us[r["kw"]]=r
comp=collections.defaultdict(list)
for f in glob.glob("*.json"):
    if f.startswith("pay-calculator-australia"): continue
    for r in json.load(open(f)):
        if r["pos"]<=20: comp[r["kw"]].append(r)
gap=[]
for k,rs in comp.items():
    ours=us.get(k); op=ours["pos"] if ours else None
    if op is not None and op<=30: continue
    b=min(rs,key=lambda r:r["pos"])
    gap.append(dict(kw=k,vol=b["vol"] or 0,kd=b["kd"],ncomp=len({r["domain"] for r in rs}),best=b["domain"],bpos=b["pos"],burl=b["url"],our=op,oururl=ours["url"] if ours else ""))
gap.sort(key=lambda g:-g["vol"])
json.dump(gap,open("gap.json","w"))
print("gap kws",len(gap),"vol>=100:",sum(1 for g in gap if g["vol"]>=100))
for g in [g for g in gap if g["vol"]>=150][:260]:
    print(f'{g["vol"]:6} kd{str(g["kd"]):>4} n{g["ncomp"]} our{str(g["our"]):>4} | {g["kw"][:50]:50} | {g["best"]}#{g["bpos"]} {g["burl"].split("/",3)[-1][:45]}')
