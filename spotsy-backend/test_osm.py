import httpx
import json

overpass_url = "https://overpass-api.de/api/interpreter"
query = """
[out:json][timeout:15];
(
  node["amenity"~"cafe|restaurant|fast_food|food_court"](around:10000,-7.2754,112.7912);
  way["amenity"~"cafe|restaurant|fast_food|food_court"](around:10000,-7.2754,112.7912);
  node["office"="coworking"](around:10000,-7.2754,112.7912);
  node["shop"="coffee"](around:10000,-7.2754,112.7912);
);
out center 25;
"""

headers = {"User-Agent": "SpotsyApp/1.0 (https://spotsy.app)"}
r = httpx.post(overpass_url, data={"data": query}, headers=headers, timeout=15.0)
print("STATUS:", r.status_code)
if r.status_code == 200:
    data = r.json()
    elements = data.get("elements", [])
    print("TOTAL ELEMENTS FOUND:", len(elements))
    names = [e.get("tags", {}).get("name") for e in elements if e.get("tags", {}).get("name")]
    print("NAMED PLACES FOUND:", len(names))
    for n in names[:15]:
        print(" -", n)
else:
    print("Response text:", r.text[:200])
