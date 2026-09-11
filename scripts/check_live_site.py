import urllib.request
import json
import sys

routes = [
    ('/', 'Home Page'),
    ('/verify', 'Verify Products Fast'),
    ('/compliance', 'Compliance Roadmap'),
    ('/grievance', 'Consumer Grievance'),
    ('/assistant', 'Ask in One Place (Assistant)'),
    ('/standards', 'Standards & QCO Orders'),
    ('/laboratories', 'NABL Laboratories'),
    ('/admin', 'Admin Dashboard')
]

print('=== CHECKING FRONTEND PAGES (http://127.0.0.1:3000) ===')
all_frontend_ok = True
for route, name in routes:
    url = f'http://127.0.0.1:3000{route}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5)
        html = res.read().decode('utf-8', errors='ignore')
        print(f'[OK 200] {name:30} -> {len(html):>6} bytes')
    except Exception as e:
        print(f'[FAIL]   {name:30} -> {e}')
        all_frontend_ok = False

print('\n=== CHECKING BACKEND API ENDPOINTS (http://127.0.0.1:8000) ===')
all_backend_ok = True

# 1. Health
try:
    h = json.loads(urllib.request.urlopen('http://127.0.0.1:8000/health').read().decode())
    print(f'[OK 200] Health Check          : {h["status"]} (uptime: {h["uptime_seconds"]}s)')
except Exception as e:
    print(f'[FAIL] Health Check            : {e}')
    all_backend_ok = False

# 2. Product Verification API
try:
    v_req = urllib.request.Request(
        'http://127.0.0.1:8000/api/verify/product',
        data=json.dumps({'preset_id': 'cml_hawkins'}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    v_res = json.loads(urllib.request.urlopen(v_req).read().decode())
    print(f'[OK 200] Product Verification   : State={v_res["state"]}, License={v_res["registry_record"]["license_number"]}')
except Exception as e:
    print(f'[FAIL] Product Verification     : {e}')
    all_backend_ok = False

# 3. Compliance Roadmap API
try:
    c_req = urllib.request.Request(
        'http://127.0.0.1:8000/api/compliance/roadmap',
        data=json.dumps({'product_name': 'Domestic Pressure Cooker'}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    c_res = json.loads(urllib.request.urlopen(c_req).read().decode())
    print(f'[OK 200] Compliance Roadmap      : Std={c_res["applicable_standard"]}, Stages={len(c_res["roadmap"])}')
except Exception as e:
    print(f'[FAIL] Compliance Roadmap       : {e}')
    all_backend_ok = False

# 4. Grievance API
try:
    g_req = urllib.request.Request(
        'http://127.0.0.1:8000/api/grievance/create',
        data=json.dumps({'product_name': 'Pressure Cooker', 'seller_name': 'Store', 'description': 'Fake mark'}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    g_res = json.loads(urllib.request.urlopen(g_req).read().decode())
    print(f'[OK 200] Grievance Dossier       : Ref={g_res["complaint_ref_no"]}, Status={g_res["status"]}')
except Exception as e:
    print(f'[FAIL] Grievance Dossier        : {e}')
    all_backend_ok = False

# 5. Chat Assistant API
try:
    chat_req = urllib.request.Request(
        'http://127.0.0.1:8000/api/chat',
        data=json.dumps({'message': 'What standard applies to stainless steel water bottles?', 'language': 'en'}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    chat_res = json.loads(urllib.request.urlopen(chat_req).read().decode())
    print(f'[OK 200] Chat Assistant         : Intent={chat_res["intent"]}, Citations={len(chat_res["evidence"])}')
except Exception as e:
    print(f'[FAIL] Chat Assistant          : {e}')
    all_backend_ok = False

# 6. Gazette Supersessions API
try:
    gaz_res = json.loads(urllib.request.urlopen('http://127.0.0.1:8000/api/gazette/supersessions?standard_number=IS%202347').read().decode())
    print(f'[OK 200] Gazette Supersessions   : Superseded={gaz_res["is_amended_or_superseded"]}, ActiveOrder={gaz_res["current_active_order"]["order_number"]}')
except Exception as e:
    print(f'[FAIL] Gazette Supersessions    : {e}')
    all_backend_ok = False

print('=' * 60)
if all_frontend_ok and all_backend_ok:
    print('ALL FRONTEND ROUTES & BACKEND APIS ARE WORKING 100% PROPERLY!')
else:
    print('SOME CHECKS FAILED')
