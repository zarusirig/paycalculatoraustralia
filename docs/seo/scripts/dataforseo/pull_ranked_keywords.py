import json, urllib.request, sys, os, concurrent.futures as cf
import base64
AUTH="Basic "+base64.b64encode(f"{os.environ['DATAFORSEO_LOGIN']}:{os.environ['DATAFORSEO_PASSWORD']}".encode()).decode()
URL="https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live"
def call(domain, offset, limit=1000):
    body=[{"target":domain,"location_code":2036,"language_code":"en","limit":limit,"offset":offset,
           "load_rank_absolute":True,"order_by":["keyword_data.keyword_info.search_volume,desc"],
           "filters":[["keyword_data.keyword_info.search_volume",">=",30]]}]
    req=urllib.request.Request(URL,data=json.dumps(body).encode(),headers={"Authorization":AUTH,"Content-Type":"application/json"})
    r=json.load(urllib.request.urlopen(req,timeout=180))
    t=r["tasks"][0]
    if t["status_code"]!=20000: print(domain,offset,t["status_message"],file=sys.stderr); return [],0,0
    res=t["result"][0]; return res.get("items") or [], res.get("total_count",0), t.get("cost",0)
def rows(items,domain):
    out=[]
    for it in items:
        kd=it["keyword_data"]; ki=kd.get("keyword_info") or {}; kp=kd.get("keyword_properties") or {}
        se=it["ranked_serp_element"]["serp_item"]
        out.append({"domain":domain,"kw":kd["keyword"],"vol":ki.get("search_volume"),"cpc":ki.get("cpc"),
          "kd":kp.get("keyword_difficulty"),"intent":(kd.get("search_intent_info") or {}).get("main_intent"),
          "pos":se.get("rank_group"),"url":se.get("url"),"etv":se.get("etv")})
    return out
domains=sys.argv[1:]; total_cost=0
for d in domains:
    items,total,c=call(d,0); total_cost+=c; allr=rows(items,d)
    offs=list(range(1000,min(total,6000),1000))
    with cf.ThreadPoolExecutor(6) as ex:
        for its,_,c2 in ex.map(lambda o: call(d,o), offs): allr+=rows(its,d); total_cost+=c2
    json.dump(allr,open(f"{d}.json","w"))
    print(d,"total",total,"pulled",len(allr),file=sys.stderr)
print("cost",round(total_cost,3),file=sys.stderr)
