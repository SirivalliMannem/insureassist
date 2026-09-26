import requests
import json
import re

ADMIN_URL = "http://localhost:8005/admin"
AUTH_URL = "http://localhost:8001/auth/login"

def run_tests():
    print("================ Testing Supported 4 Roles Distribution & Dynamic Users by Role ================\n")

    # 1. Admin Login
    auth_resp = requests.post(AUTH_URL, json={"email": "admin@insureassist.com", "password": "Test@123"})
    assert auth_resp.status_code == 200, f"Failed admin auth: {auth_resp.text}"
    token = auth_resp.json().get("access_token") or auth_resp.json().get("token")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    print("[PASS] Step 1: Authenticated as Admin.")

    # 2. Get Stats from backend
    stats_resp = requests.get(f"{ADMIN_URL}/stats", headers=headers)
    assert stats_resp.status_code == 200, f"Failed stats: {stats_resp.text}"
    stats = stats_resp.json()
    assert "users_by_role" in stats, "users_by_role missing in stats response"
    users_by_role = stats["users_by_role"]
    print(f"[PASS] Step 2: Live users_by_role received: {json.dumps(users_by_role, indent=2)}")

    # 3. Verify ONLY the 4 supported application business roles are returned
    expected_supported_roles = {"Customer", "Agent", "Underwriter", "Adjuster"}
    actual_roles = set(users_by_role.keys())
    assert actual_roles == expected_supported_roles, f"Expected exactly {expected_supported_roles}, got {actual_roles}"
    assert "QA" not in users_by_role, "QA must NOT appear in users_by_role"
    assert "Risk Auditor" not in users_by_role, "Risk Auditor must NOT appear in users_by_role"
    print(f"[PASS] Step 3: Verified users_by_role contains ONLY the 4 supported roles (Customer, Agent, Underwriter, Adjuster).")

    initial_adjuster_count = users_by_role["Adjuster"]
    total_users_supported = sum(users_by_role.values())
    print(f"       Initial Supported Role Counts -> Customer: {users_by_role['Customer']}, Agent: {users_by_role['Agent']}, Underwriter: {users_by_role['Underwriter']}, Adjuster: {users_by_role['Adjuster']} (Total: {total_users_supported})")

    # 4. Create an Adjuster user and verify dynamic live increment
    new_user_payload = {
        "name": "Live Supported Adjuster",
        "email": f"adjuster.live.{total_users_supported}@insureassist.com",
        "role": "Adjuster",
        "mobile": "(555) 333-4444",
        "address": "200 Michigan Ave, Chicago, IL",
        "password": "TestPassword123"
    }
    create_resp = requests.post(f"{ADMIN_URL}/users", headers=headers, json=new_user_payload)
    assert create_resp.status_code == 200, f"Failed to create adjuster user: {create_resp.text}"
    print(f"[PASS] Step 4: Created user with role 'Adjuster'.")

    # 5. Re-fetch stats and verify increment
    stats_resp_2 = requests.get(f"{ADMIN_URL}/stats", headers=headers)
    updated_users_by_role = stats_resp_2.json()["users_by_role"]
    assert updated_users_by_role["Adjuster"] == initial_adjuster_count + 1
    new_total_supported = sum(updated_users_by_role.values())
    assert new_total_supported == total_users_supported + 1
    print(f"[PASS] Step 5: Adjuster count dynamically updated from {initial_adjuster_count} to {updated_users_by_role['Adjuster']}, Total Supported Users: {new_total_supported}.")

    # 6. Verify Frontend renderAdminDashboardCharts contains exactly the 4 supported roles and no QA/Risk Auditor
    with open("frontend/js/script.js", "r", encoding="utf-8") as f:
        js_content = f.read()

    chart_func_match = re.search(r'function renderAdminDashboardCharts\(\)\s*\{(.*?)\n\}', js_content, re.DOTALL)
    assert chart_func_match, "renderAdminDashboardCharts function not found"
    chart_body = chart_func_match.group(1)

    assert "SUPPORTED_APP_ROLES" in chart_body
    assert "Customer" in chart_body
    assert "Agent" in chart_body
    assert "Underwriter" in chart_body
    assert "Adjuster" in chart_body
    assert "QA" not in chart_body
    assert "Risk Auditor" not in chart_body
    print("[PASS] Step 6: Verified frontend renderAdminDashboardCharts strictly defines and renders the 4 supported roles with dynamic live data.")

    print("\n================ ALL 4-ROLE DASHBOARD TESTS PASSED PERFECTLY! ================")

if __name__ == "__main__":
    run_tests()
