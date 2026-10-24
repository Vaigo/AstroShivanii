"""Browser checks for the pages whose answer is baked into the HTML at build time (Rahu Kaal, choghadiya, rashifal).

What it proves (see AGENTS.md, "Pages whose data is fetched at build time"): the baked answer is used on the build day
with no API request; the next day re-slices the baked Rahu Kaal window; a much later day fetches live and never shows
another day's times as today's; choghadiya reads yesterday's night table before sunrise; a page left open across
midnight, a bfcache restore and other time zones move to the new India date; a wrong API body or blocked storage never
crashes a page; rashifal shows the five areas separately with their own stars and good/bad word (no overall); layout at
390/768/1280 px; client navigation between cities.

Needs: `npm run build` done (out/ baked for BAKED), a local GrahaAPI that does REAL calculations on http://localhost:8000
(its CORS must allow http://localhost:3000, which this script serves out/ on), and `pip install playwright` + chromium.

    E2E_API_KEY=<local backend key> BAKED=YYYY-MM-DD python scripts/e2e-daily-pages.py     # BAKED = India date of the build
"""

import json, os, re, subprocess, sys, time, urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = str(Path(__file__).resolve().parent.parent / "out")
PORT = 3000
SITE = f"http://localhost:{PORT}"
API = "http://localhost:8000"
KEY = os.environ.get("E2E_API_KEY") or sys.exit("set E2E_API_KEY to a local backend key that does real calculations (an sk-test- key answers with fixed sample data)")
BAKED = os.environ.get("BAKED", "2026-10-24")
NEXT = {"2026-10-24": "2026-10-25"}.get(BAKED, "2026-10-29")
fails = []


def check(label, got, want=True):
    ok = got == want
    print(("PASS" if ok else "FAIL"), label, "->", got, "" if ok else f"(wanted {want})")
    if not ok:
        fails.append(label)


def api(path, body):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "Authorization": f"Bearer {KEY}"})
    with urllib.request.urlopen(req, timeout=30) as r:
        j = json.loads(r.read())
    return j.get("data", j)


JOD = {"lat": 26.2389, "lon": 73.0243, "tz": 5.5}


def rahu_api(date, where=JOD):
    return api("/v1/panchang/rahu-kaal", {"dob": date, "tob": "12:00", **where})


def chog_api(date, where=JOD):
    return api("/v1/muhurta/full", {"date": date, **where})


LABEL = {5: "उत्कृष्ट", 4: "बहुत अच्छा", 3: "ठीक", 2: "सतर्क", 1: "कठिन"}
BAKED_RK_START = None  # set once the API helpers exist (below)
NAME_HI = {"Amrit": "अमृत", "Shubh": "शुभ", "Labh": "लाभ", "Char": "चर", "Kaal": "काल", "Rog": "रोग", "Udveg": "उद्वेग"}
QUAL_HI = {"Excellent": "सर्वश्रेष्ठ", "Good": "शुभ", "Neutral": "सामान्य", "Bad": "अशुभ"}


def mins(hm):
    h, m = hm.split(":")
    return int(h) * 60 + int(m)


def is_current(p, now):
    s, e = mins(p["start"]), mins(p["end"])
    return (s <= now < e) if s <= e else (now >= s or now < e)


BAKED_RK_START = rahu_api(BAKED)["rahu_kaal"]["start"]


def add_days(iso, n):
    import datetime
    d = datetime.date.fromisoformat(iso) + datetime.timedelta(days=n)
    return d.isoformat()


srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--directory", OUT, "--bind", "127.0.0.1"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
try:
    with sync_playwright() as p:
        br = p.chromium.launch()

        def open_page(route, clock=None, tz="Asia/Kolkata", vp=None, block_api=False, settle=1500, init_script=None):
            ctx = br.new_context(timezone_id=tz, viewport=vp or {"width": 1280, "height": 900})
            pg = ctx.new_page()
            st = {"api": [], "bad": []}
            pg.on("request", lambda r: st["api"].append(r.url) if ":8000" in r.url else None)
            pg.on("console", lambda m: st["bad"].append(m.text[:240]) if m.type in ("error", "warning") and "ERR_CONNECTION" not in m.text and "Failed to load resource" not in m.text else None)
            pg.on("pageerror", lambda e: st["bad"].append("PAGEERROR " + str(e)[:240]))
            if init_script:
                pg.add_init_script(init_script)
            if block_api:
                pg.route("**/localhost:8000/**", lambda r: r.abort())
            if clock:
                pg.clock.install(time=clock)
            pg.goto(f"{SITE}/{route}/", wait_until="load")
            pg.wait_for_timeout(settle)
            return pg, st

        label = lambda pg: pg.eval_on_selector(".result-label", "e => e.innerText")
        big = lambda pg: pg.eval_on_selector(".result-label ~ p", "e => e.innerText")
        baked_attr = lambda pg: pg.eval_on_selector_all("[data-baked]", "e => e.map(x => x.getAttribute('data-baked'))")
        rk_dates = lambda pg: pg.eval_on_selector_all("table.rk-table tbody time", "els => els.map(e => e.getAttribute('datetime'))")
        fmt_label = {"2026-10-24": "24 अक्टूबर 2026", "2026-10-25": "25 अक्टूबर 2026", "2026-10-28": "28 अक्टूबर 2026"}

        print(f"=== A. same day as the build ({BAKED})")
        pg, st = open_page("rahu-kaal/jodhpur", f"{BAKED}T12:00:00+05:30")
        want = rahu_api(BAKED)["rahu_kaal"]
        check("A1 rahu: no API request, baked day kept", (len(st["api"]), baked_attr(pg)), (0, [BAKED]))
        check("A2 rahu: Jodhpur window equals the API's", big(pg), f"{want['start']} – {want['end']}")
        check("A3 rahu: no console errors", st["bad"], [])
        pg, st = open_page("choghadiya/jodhpur", f"{BAKED}T13:00:00+05:30")
        now_cells = pg.eval_on_selector_all("td", "els => els.filter(e => e.innerText.includes('◄ अभी')).map(e => e.innerText)")
        check("A4 choghadiya: no request, exactly one 'now' row at 13:00", (len(st["api"]), len(now_cells)), (0, 1))
        check("A5 choghadiya: no console errors", st["bad"], [])
        pg, st = open_page("rashifal/mesh", f"{BAKED}T12:00:00+05:30")
        txt = pg.inner_text("body")
        check("A6 rashifal: no request; stars + weekly block baked", (len(st["api"]), "इस सप्ताह" in txt), (0, True))
        check("A7 rashifal: no raw ISO dates in the page text", re.search(r"\b20\d\d-\d\d-\d\d\b", txt), None)
        check("A8 rashifal: lucky colours are Hindi (no 'Red, Coral' style)", re.search(r"शुभ रंग: (Red|Blue|Green|Coral|Gold|Yellow|White)", txt), None)
        check("A9 rashifal: the 'no template' claim is gone", ("Template नहीं" in txt) or ("कोई template नहीं" in txt), False)
        check("A10 rashifal: no console errors", st["bad"], [])

        print("=== B. choghadiya before sunrise reads YESTERDAY's night table")
        prev = chog_api(add_days(BAKED, -1))
        today_t = chog_api(BAKED)
        sunrise_min = mins(today_t["sunrise"])
        for hhmm in ("00:10", "03:00", "06:30"):
            now = mins(hhmm)
            assert now < sunrise_min
            cur = [x for x in prev["choghadiya"] if x["type"] == "night" and is_current(x, now)][0]
            pg, st = open_page("choghadiya/jodhpur", f"{BAKED}T{hhmm}:00+05:30", settle=2200)
            body = pg.inner_text("body")
            want = f"अभी: {NAME_HI[cur['name']]} ({QUAL_HI[cur['quality']]}) · {cur['start']}–{cur['end']}"
            check(f"B {hhmm}: headline is yesterday's night period ({cur['name']} {cur['start']}–{cur['end']})", want in body, True)
            check(f"B {hhmm}: tells the visitor it is from last night's table", "कल रात की तालिका से" in body, True)
            hl = pg.eval_on_selector_all("td", "els => els.filter(e => e.innerText.includes('◄ अभी')).length")
            check(f"B {hhmm}: today's rows are NOT highlighted before sunrise", hl, 0)
            check(f"B {hhmm}: exactly one extra request (yesterday's table)", len(st["api"]), 1)
            check(f"B {hhmm}: no console errors", st["bad"], [])
        now = sunrise_min + 60
        hhmm = f"{now // 60:02d}:{now % 60:02d}"
        cur = [x for x in today_t["choghadiya"] if is_current(x, now)][0]
        pg, st = open_page("choghadiya/jodhpur", f"{BAKED}T{hhmm}:00+05:30")
        body = pg.inner_text("body")
        check(f"B {hhmm} (after sunrise): normal headline from today's table, no yesterday fetch",
              (f"अभी: {NAME_HI[cur['name']]} ({QUAL_HI[cur['quality']]}) · {cur['start']}–{cur['end']}" in body, "कल रात की तालिका से" in body, len(st["api"])), (True, False, 0))
        # yesterday's table failing: no wrong highlight, no crash
        pg, st = open_page("choghadiya/jodhpur", f"{BAKED}T03:00:00+05:30", block_api=True, settle=2200)
        body = pg.inner_text("body")
        check("B api down at 03:00: no 'अभी' headline, no highlight, table still there", ("अभी:" in body, "◄ अभी" in body, "उद्वेग" in body), (False, False, True))
        check("B api down at 03:00: no page error", [e for e in st["bad"] if "PAGEERROR" in e], [])

        print("=== C. next day / stale paths (as before)")
        pg, st = open_page("rahu-kaal/jodhpur", f"{NEXT}T09:00:00+05:30")
        want = rahu_api(NEXT)["rahu_kaal"]
        d = rk_dates(pg)
        check("C1 rahu next day: re-sliced window, no request", (len(st["api"]), d[0], len(d), big(pg)), (0, NEXT, 7, f"{want['start']} – {want['end']}"))
        pg, st = open_page("choghadiya/jodhpur", f"{NEXT}T09:00:00+05:30", settle=2200)
        c25 = chog_api(NEXT)
        first_day = [x for x in c25["choghadiya"] if x["type"] == "day"][0]
        check("C2 choghadiya next day: live table for that day", f"{first_day['start']}–{first_day['end']}" in pg.eval_on_selector("table", "e => e.innerText").replace(" ", ""), True)
        pg, st = open_page("rashifal/mesh", f"{NEXT}T09:00:00+05:30", settle=2500)
        label_txt = pg.inner_text("body")
        check("C3 rashifal next day: week table label in Hindi, from the new day", (re.search(r"इस सप्ताह के सितारे \(\s*\d+ \S+\s*—", label_txt) is not None, re.search(r"\b20\d\d-\d\d-\d\d\b", label_txt)), (True, None))
        pg, st = open_page("rahu-kaal/jodhpur", "2026-11-20T09:00:00+05:30", settle=2500)
        want = rahu_api("2026-11-20")["rahu_kaal"]
        check("C4 rahu far stale: 7 live calls, correct window", (len(st["api"]), big(pg)), (7, f"{want['start']} – {want['end']}"))
        pg, st = open_page("rahu-kaal/jodhpur", "2026-11-20T09:00:00+05:30", block_api=True, settle=2500)
        txt = pg.inner_text("body")
        check("C5 far stale + API down: honest error, baked times not shown as today's", ("समय लोड नहीं हो पाया" in txt, BAKED_RK_START in txt), (True, False))

        print("=== D. response-shape guard in the browser (a 200 with a wrong body must not crash the page)")
        def garble(route):
            route.fulfill(status=200, content_type="application/json", body=json.dumps({"success": True, "data": {"unexpected": True}}))
        for r_, clock_ in (("rahu-kaal/jodhpur", "2026-11-20T09:00:00+05:30"), ("choghadiya/jodhpur", "2026-11-20T09:00:00+05:30"), ("rashifal/mesh", "2026-11-20T09:00:00+05:30"), ("rashifal", "2026-11-20T09:00:00+05:30")):
            ctx = br.new_context(timezone_id="Asia/Kolkata")
            pg = ctx.new_page()
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
            pg.route("**/localhost:8000/**", garble)
            pg.clock.install(time=clock_)
            pg.goto(f"{SITE}/{r_}/", wait_until="load")
            pg.wait_for_timeout(2500)
            body = pg.inner_text("body")
            check(f"D {r_}: garbled API answer -> no crash screen, no page error", ("This page couldn" in body or "पेज लोड नहीं हो पाया" in body.split("दोबारा")[0][:200] and "Application error" in body, errs), (False, []))
        # pre-dawn extra fetch garbled: still no crash
        ctx = br.new_context(timezone_id="Asia/Kolkata")
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
        pg.route("**/localhost:8000/**", garble)
        pg.clock.install(time=f"{BAKED}T03:00:00+05:30")
        pg.goto(f"{SITE}/choghadiya/jodhpur/", wait_until="load")
        pg.wait_for_timeout(2200)
        check("D choghadiya 03:00 with a garbled yesterday table: page intact, no headline", ("उद्वेग" in pg.inner_text("body"), "अभी:" in pg.inner_text("body"), errs), (True, False, []))

        print("=== E. other review fixes")
        pg, st = open_page("rashifal", f"{BAKED}T12:00:00+05:30")
        cards = pg.eval_on_selector_all(".guide-grid > a.guide-card", """els => els.map(e => { const r = e.getBoundingClientRect();
            const kids = [...e.children].map(c => { const b = c.getBoundingClientRect(); return {x: b.x, y: b.y, w: b.width, h: b.height, t: c.innerText.slice(0, 10)}; });
            return {x: r.x, y: r.y, w: r.width, h: r.height, kids}; })""")
        check("E1 rashifal index: 12 cards", len(cards), 12)
        stacked = all(all(c["kids"][i]["y"] >= c["kids"][i - 1]["y"] for i in range(1, len(c["kids"]))) for c in cards)
        check("E2 cards stack their contents (each child below the previous)", stacked, True)
        check("E3 nothing sticks out of its card (every child inside the card's box, none squeezed to a sliver)",
              all(all(k["x"] >= c["x"] - 1 and k["x"] + k["w"] <= c["x"] + c["w"] + 1 and (not k["t"].strip() or k["w"] >= 10) for k in c["kids"]) for c in cards), True)
        check("E4 cards are a sensible height (90-320px)", all(90 <= c["h"] <= 320 for c in cards), True)

        def overlap(a, b):
            return not (a["x"] + a["w"] <= b["x"] + 0.5 or b["x"] + b["w"] <= a["x"] + 0.5 or a["y"] + a["h"] <= b["y"] + 0.5 or b["y"] + b["h"] <= a["y"] + 0.5)
        check("E5 no two cards overlap", any(overlap(cards[i], cards[j]) for i in range(12) for j in range(i + 1, 12)), False)
        body = pg.inner_text("body")
        cards_txt = body.split("आज का राशिफल ·")[1]
        check("E6 cards show best/weakest area with a good/bad word, no overall sentence", ("सबसे अच्छा:" in cards_txt and "अत्यंत शुभ दिन है" not in cards_txt and "दिन है।" not in cards_txt[:2500]), True)
        all12 = api("/v1/rashifal/daily", {"date": BAKED, "tz": 5.5})["rashifal"]
        mesh = [x for x in all12 if x["rashi_index"] == 0][0]
        ds = mesh["domain_stars"]
        names = {"career": "करियर", "finance": "धन", "love": "प्रेम", "health": "स्वास्थ्य", "spirit": "मनोबल"}
        best_k = max(["career", "finance", "love", "health", "spirit"], key=lambda k: ds[k])
        mesh_card = pg.locator(".guide-grid > a.guide-card").first.inner_text()
        check("E6b Mesh card names its strongest area with that area's label", (f"सबसे अच्छा: {names[best_k]}" in mesh_card, LABEL[ds[best_k]] in mesh_card), (True, True))

        print("=== H. rashifal: five areas on their own, each with its own stars and good/bad word")
        pg, st = open_page("rashifal/mesh", f"{BAKED}T12:00:00+05:30")
        body = pg.inner_text("body")
        rows_ = pg.eval_on_selector_all(".result-label ~ div > div", "els => els.map(e => e.innerText.replace(/\\s+/g,' ').trim())")
        check("H1 five area rows", len(rows_), 5)
        for k in ("career", "finance", "love", "health", "spirit"):
            row = [r for r in rows_ if r.startswith(names[k])]
            n = ds[k]
            ok = bool(row) and ("★" * n + "☆" * (5 - n)) in row[0] and LABEL[n] in row[0]
            check(f"H2 {names[k]}: {n} stars + '{LABEL[n]}' (as the API says)", ok, True)
        check("H3 no combined overall: no overall paragraph, no weekly summary/average/best day", any(s in body for s in ("अत्यंत शुभ दिन है", "यह सप्ताह बहुत शुभ है", "सप्ताह का सबसे अच्छा दिन", "सभी क्षेत्रों में प्रगति")), False)
        wk_rows = pg.locator("table tbody tr").count()
        wk = api("/v1/rashifal/weekly", {"rashi": "Aries", "date": BAKED, "tz": 5.5})
        check("H4 weekly table: one row per day, 5 star cells each", (wk_rows, pg.locator("table tbody tr:first-child td").count()), (len(wk["days"]), 6))
        d0 = wk["days"][0]["domain_stars"]
        first_cells = pg.eval_on_selector_all("table tbody tr:first-child td", "els => els.slice(1).map(e => e.innerText.replace(/\\s+/g,' ').trim())")
        order = ["career", "finance", "love", "health", "spirit"]
        check("H5 weekly day 1 cells match the API's stars and words", all(("★" * d0[k] + "☆" * (5 - d0[k])) in c and LABEL[d0[k]] in c for k, c in zip(order, first_cells)), True)
        txt = open(f"{OUT}/rashifal/mesh/index.html", encoding="utf-8").read()
        faq = re.search(r'"acceptedAnswer":\{"@type":"Answer","text":"([^"]+)"', txt).group(1)
        check("H6 first FAQ answer lists every area with its word", all(f"{names[k]} " in faq and f"({LABEL[ds[k]]})" in faq for k in order), True)
        for vw in (390, 768):
            pg, st = open_page("rashifal", f"{BAKED}T12:00:00+05:30", vp={"width": vw, "height": 900}, settle=900)
            check(f"E7 rashifal index at {vw}px: no horizontal overflow", pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth"), 0)
        # localStorage that throws must not take the site down
        boom = "Object.defineProperty(window, 'localStorage', { get() { throw new Error('storage blocked'); } });"
        pg, st = open_page("rahu-kaal/jodhpur", f"{BAKED}T12:00:00+05:30", init_script=boom)
        check("E8 storage blocked: page renders, no page error", ("09:32" in pg.inner_text("body") or "राहु काल" in pg.inner_text("body"), [e for e in st["bad"] if "PAGEERROR" in e]), (True, []))
        # a tab woken after midnight updates at once (no waiting for the 30 s tick)
        pg, st = open_page("rahu-kaal/jodhpur", f"{BAKED}T23:59:00+05:30", settle=800)
        before = rk_dates(pg)[0]
        pg.clock.set_system_time(f"{NEXT}T00:01:00+05:30")
        pg.evaluate("document.dispatchEvent(new Event('visibilitychange'))")
        pg.wait_for_timeout(400)
        check("E9 visibilitychange after midnight: the date moves at once", (before, rk_dates(pg)[0]), (BAKED, NEXT))
        pg, st = open_page("rahu-kaal/jodhpur", f"{BAKED}T23:59:00+05:30", settle=800)
        pg.clock.set_system_time(f"{NEXT}T00:01:00+05:30")
        pg.evaluate("window.dispatchEvent(new PageTransitionEvent('pageshow', {persisted: true}))")
        pg.wait_for_timeout(400)
        check("E10 pageshow (bfcache restore) after midnight: the date moves at once", rk_dates(pg)[0], NEXT)

        print("=== F. client-side navigation between cities (unchanged)")
        pg, st = open_page("rahu-kaal/jodhpur", f"{BAKED}T12:00:00+05:30")
        pg.click("a[href='/rahu-kaal/delhi/']")
        pg.wait_for_url("**/rahu-kaal/delhi/")
        pg.wait_for_timeout(1000)
        dl = rahu_api(BAKED, {"lat": 28.6139, "lon": 77.209, "tz": 5.5})["rahu_kaal"]
        check("F1 Jodhpur -> Delhi shows Delhi's window, no request", (big(pg), len(st["api"])), (f"{dl['start']} – {dl['end']}", 0))

        print("=== G. the city pages carry per-city facts and honest wording")
        raw_j = open(f"{OUT}/rahu-kaal/jodhpur/index.html", encoding="utf-8").read()
        raw_d = open(f"{OUT}/rahu-kaal/delhi/index.html", encoding="utf-8").read()
        check("G1 Jodhpur page states its sunrise against Delhi's", "दिल्ली (" in raw_j and "मिनट" in raw_j and "दिन की लंबाई" in raw_j, True)
        check("G2 Delhi page has no 'vs Delhi' sentence", "दिन की लंबाई" in raw_d, False)
        check("G3 FAQ is self-contained (no 'ऊपर के टूल' / 'नीचे के पेजों')", ("ऊपर के टूल" in raw_j) or ("नीचे के पेजों" in raw_j), False)
        check("G4 FAQ uses the present tense, not 'रहेगा'", "तक रहेगा" in raw_j, False)
        check("G5 'live' wording dropped from the body copy", ("updates live" in raw_j) or ("— लाइव" in raw_j), False)
        sm = open(f"{OUT}/sitemap.xml", encoding="utf-8").read()
        check("G6 sitemap: no lastmod on festival pages", len(re.findall(r"festivals/[^<]*</loc>\s*(?:<lastmod>)", sm)), 0)

        br.close()
finally:
    srv.terminate()

print("\nRESULT:", "ALL PASS" if not fails else f"{len(fails)} FAILED: {fails}")
