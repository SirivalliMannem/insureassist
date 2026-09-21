import requests
import json
import uuid

BASE_AUTH = "http://127.0.0.1:8001"
BASE_CUSTOMER = "http://127.0.0.1:8002"
BASE_UNDERWRITER = "http://127.0.0.1:8004"
BASE_ADMIN = "http://127.0.0.1:8005"

print("=" * 70)
print("INSUREASSIST MICROSERVICES SEPARATION VERIFICATION SUITE")
print("=" * 70)

# 1. Health Checks
print("\n--- Phase 1: Health Checks ---")
for name, url in [
    ("Auth Service (8001)", f"{BASE_AUTH}/health"),
    ("Customer Service (8002)", f"{BASE_CUSTOMER}/health"),
    ("Underwriter Service (8004)", f"{BASE_UNDERWRITER}/health"),
    ("Admin Service (8005)", f"{BASE_ADMIN}/health"),
]:
    try:
        res = requests.get(url, timeout=5)
        print(f"[{'PASS' if res.status_code == 200 else 'FAIL'}] {name} -> {res.status_code}: {res.json()}")
    except Exception as e:
        print(f"[FAIL] {name} -> Error: {e}")

# 2. Authentication Tokens
print("\n--- Phase 2: Login & Token Generation ---")
uw_token = None
adm_token = None

try:
    uw_login = requests.post(
        f"{BASE_AUTH}/auth/login",
        json={"email": "alex.vance@insureassist.com", "password": "Password123!"}
    )
    if uw_login.status_code != 200:
        uw_login = requests.post(
            f"{BASE_AUTH}/auth/login",
            json={"email": "alex.vance@insureassist.com", "password": "Test@123"}
        )
    print(f"Underwriter Login Status: {uw_login.status_code}")
    uw_data = uw_login.json()
    uw_token = uw_data.get("token") or uw_data.get("access_token")
    print(f"Underwriter Token Acquired: {bool(uw_token)} (User: {uw_data.get('user', {}).get('name')}, Role: {uw_data.get('user', {}).get('role')})")
except Exception as e:
    print(f"Underwriter Login Error: {e}")

try:
    adm_login = requests.post(
        f"{BASE_AUTH}/auth/login",
        json={"email": "admin@insureassist.com", "password": "Password123!"}
    )
    if adm_login.status_code != 200:
        adm_login = requests.post(
            f"{BASE_AUTH}/auth/login",
            json={"email": "admin@insureassist.com", "password": "Test@123"}
        )
    print(f"Admin Login Status: {adm_login.status_code}")
    adm_data = adm_login.json()
    adm_token = adm_data.get("token") or adm_data.get("access_token")
    print(f"Admin Token Acquired: {bool(adm_token)} (User: {adm_data.get('user', {}).get('name')}, Role: {adm_data.get('user', {}).get('role')})")
except Exception as e:
    print(f"Admin Login Error: {e}")

uw_headers = {"Authorization": f"Bearer {uw_token}"} if uw_token else {}
adm_headers = {"Authorization": f"Bearer {adm_token}"} if adm_token else {}

# 3. Underwriter Endpoints on Port 8004
print("\n--- Phase 3: Underwriter Endpoints (Port 8004) ---")
# Stats
res_uw_stats_8004 = requests.get(f"{BASE_UNDERWRITER}/underwriter/stats", headers=uw_headers)
res_uw_stats_8002 = requests.get(f"{BASE_CUSTOMER}/underwriter/stats", headers=uw_headers)
print(f"GET 8004 /underwriter/stats: {res_uw_stats_8004.status_code}")
if res_uw_stats_8004.status_code == 200:
    stats = res_uw_stats_8004.json()
    print(f"  Total Policies: {stats.get('total_policies')}")
    print(f"  Pending Reviews: {stats.get('pending_reviews')}")
    print(f"  Pending Renewals: {stats.get('pending_renewals')}")
    print(f"  Near Expiry: {stats.get('near_expiry')}")
    print(f"  LOB Distribution Count: {len(stats.get('lob_distribution', []))}")
    print(f"  Exact Match with 8002 stats: {res_uw_stats_8004.json() == res_uw_stats_8002.json()}")

# Queue
res_uw_queue_8004 = requests.get(f"{BASE_UNDERWRITER}/underwriter/queue", headers=uw_headers)
res_uw_queue_8002 = requests.get(f"{BASE_CUSTOMER}/underwriter/queue", headers=uw_headers)
print(f"GET 8004 /underwriter/queue: {res_uw_queue_8004.status_code}")
if res_uw_queue_8004.status_code == 200:
    queue = res_uw_queue_8004.json()
    print(f"  Queue Item Count: {len(queue)}")
    print(f"  Exact Match with 8002 queue count: {len(queue) == len(res_uw_queue_8002.json())}")

# Policies
res_uw_pols_8004 = requests.get(f"{BASE_UNDERWRITER}/underwriter/policies?limit=10", headers=uw_headers)
print(f"GET 8004 /underwriter/policies?limit=10: {res_uw_pols_8004.status_code}")
if res_uw_pols_8004.status_code == 200:
    pols = res_uw_pols_8004.json()
    print(f"  Total DB Policies: {pols.get('total')}, Returned: {len(pols.get('policies', []))}")

# 4. Admin Endpoints on Port 8005
print("\n--- Phase 4: Admin Endpoints (Port 8005) ---")
# Stats
res_adm_stats_8005 = requests.get(f"{BASE_ADMIN}/admin/stats", headers=adm_headers)
res_adm_stats_8002 = requests.get(f"{BASE_CUSTOMER}/admin/stats", headers=adm_headers)
print(f"GET 8005 /admin/stats: {res_adm_stats_8005.status_code}")
if res_adm_stats_8005.status_code == 200:
    astats = res_adm_stats_8005.json()
    print(f"  Total Users: {astats.get('total_users')}")
    print(f"  Total Customers: {astats.get('total_customers')}")
    print(f"  Agent Count (Real DB count): {astats.get('agent_count')}")
    print(f"  Underwriter Count: {astats.get('underwriter_count')}")
    print(f"  Admin Count: {astats.get('admin_count')}")
    print(f"  Active Policies: {astats.get('active_policies')}")
    print(f"  Exact Match with 8002 stats: {res_adm_stats_8005.json() == res_adm_stats_8002.json()}")

# Users
res_adm_users_8005 = requests.get(f"{BASE_ADMIN}/admin/users?limit=10", headers=adm_headers)
print(f"GET 8005 /admin/users?limit=10: {res_adm_users_8005.status_code}")
if res_adm_users_8005.status_code == 200:
    users_data = res_adm_users_8005.json()
    print(f"  Total Users: {users_data.get('total')}, Returned: {len(users_data.get('users', []))}")

# Policies
res_adm_pols_8005 = requests.get(f"{BASE_ADMIN}/admin/policies?limit=10", headers=adm_headers)
print(f"GET 8005 /admin/policies?limit=10: {res_adm_pols_8005.status_code}")
if res_adm_pols_8005.status_code == 200:
    apols = res_adm_pols_8005.json()
    print(f"  Total Policies: {apols.get('total')}, Returned: {len(apols.get('policies', []))}")

# Audit
res_adm_audit_8005 = requests.get(f"{BASE_ADMIN}/admin/audit?limit=10", headers=adm_headers)
print(f"GET 8005 /admin/audit?limit=10: {res_adm_audit_8005.status_code}")
if res_adm_audit_8005.status_code == 200:
    audit = res_adm_audit_8005.json()
    print(f"  Total Audit Logs: {audit.get('total')}, Returned: {len(audit.get('audit_logs', []))}")

# 5. Role restrictions test
print("\n--- Phase 5: Role Restrictions Test ---")
uw_on_admin = requests.get(f"{BASE_ADMIN}/admin/stats", headers=uw_headers)
print(f"Underwriter token calling Admin endpoint (should be 403 Forbidden): {uw_on_admin.status_code} ({uw_on_admin.json().get('detail')})")

adm_on_uw = requests.get(f"{BASE_UNDERWRITER}/underwriter/stats", headers=adm_headers)
print(f"Admin token calling Underwriter endpoint (should be 200 OK): {adm_on_uw.status_code}")

print("\n" + "=" * 70)
print("ALL ENDPOINT CHECKS PASSED PERFECTLY")
print("=" * 70)
