import requests
import json
import sys

AUTH_URL = "http://localhost:8001/auth/login"
CUSTOMER_SERVICE_URL = "http://localhost:8002"
AI_SERVICE_URL = "http://localhost:8006/api/v1"
UNDERWRITER_SERVICE_URL = "http://localhost:8004"

results = []

def record(test_num, name, passed, details=""):
    results.append({"num": test_num, "name": name, "passed": passed, "details": details})
    mark = "PASS" if passed else "FAIL"
    print(f"[{mark}] Test {test_num}: {name} - {details}")

def get_token(email, password="Test@123"):
    resp = requests.post(AUTH_URL, json={"email": email, "password": password})
    if resp.status_code == 200:
        data = resp.json()
        return data.get("access_token") or data.get("token")
    return None

def main():
    print("================ Starting Full Adjuster Test Suite ================\n")

    # 1. Adjuster Login
    adjuster_token = get_token("adjuster@insureassist.com")
    record(1, "Adjuster Login (adjuster@insureassist.com)", adjuster_token is not None, "Token received" if adjuster_token else "Failed to authenticate")
    if not adjuster_token:
        print("Aborting: Could not login as adjuster.")
        return

    adjuster_headers = {"Authorization": f"Bearer {adjuster_token}"}

    # 2. Agent & Customer & Underwriter Login
    agent_token = get_token("alex.rivera@insureassist.com")
    record(2, "Agent Login (alex.rivera@insureassist.com)", agent_token is not None)

    customer_token = get_token("sarah.mitchell@email.com")
    record(3, "Customer Login (sarah.mitchell@email.com)", customer_token is not None)

    underwriter_token = get_token("alex.vance@insureassist.com")
    record(4, "Underwriter Login (alex.vance@insureassist.com)", underwriter_token is not None)

    # 3. Adjuster Stats
    resp = requests.get(f"{CUSTOMER_SERVICE_URL}/adjuster/stats", headers=adjuster_headers)
    stats_ok = resp.status_code == 200
    stats_data = resp.json() if stats_ok else {}
    record(5, "GET /adjuster/stats", stats_ok and "total_claims" in stats_data, f"Stats: {stats_data}")

    # 4. Adjuster Claims List (Shared Queue)
    resp = requests.get(f"{CUSTOMER_SERVICE_URL}/adjuster/claims", headers=adjuster_headers)
    queue_ok = resp.status_code == 200
    claims_list = resp.json() if queue_ok else []
    record(6, "GET /adjuster/claims (Shared Queue)", queue_ok and isinstance(claims_list, list) and len(claims_list) > 0, f"Found {len(claims_list)} claims")

    if not claims_list:
        print("No claims found in database to test further. Creating/Checking...")
        return

    # Pick a test claim
    test_claim = claims_list[0]
    claim_id = test_claim["claim_id"]

    # 5. Search & Filter
    resp = requests.get(f"{CUSTOMER_SERVICE_URL}/adjuster/claims?status=Pending Review", headers=adjuster_headers)
    record(7, "GET /adjuster/claims?status=Pending Review", resp.status_code == 200, f"Returned {len(resp.json())} pending claims")

    resp = requests.get(f"{CUSTOMER_SERVICE_URL}/adjuster/claims?search={test_claim['claim_number']}", headers=adjuster_headers)
    search_results = resp.json() if resp.status_code == 200 else []
    record(8, f"GET /adjuster/claims?search={test_claim['claim_number']}", resp.status_code == 200 and len(search_results) >= 1, f"Found {len(search_results)} match")

    # 6. Detailed Claim Assessment View
    resp = requests.get(f"{CUSTOMER_SERVICE_URL}/adjuster/claims/{claim_id}", headers=adjuster_headers)
    detail_ok = resp.status_code == 200
    detail = resp.json() if detail_ok else {}
    has_policy = "policy_number" in detail and detail["policy_number"] is not None
    has_customer = "customer_name" in detail and detail["customer_name"] is not None
    has_coverages = "coverages" in detail and isinstance(detail["coverages"], list)
    has_exclusions = "exclusions" in detail and isinstance(detail["exclusions"], list)
    record(9, f"GET /adjuster/claims/{claim_id} (Full Assessment Data)", detail_ok and has_policy and has_customer and has_coverages, f"Policy: {detail.get('policy_number')}, Coverages: {len(detail.get('coverages', []))}, Exclusions: {len(detail.get('exclusions', []))}")

    # 7. AI Decision Support Chat Endpoint
    ai_payload = {
        "claim_id": claim_id,
        "message": "Analyze this claim against the policy coverages and deductibles, and recommend next steps.",
        "claim_context": {
            "claim_number": detail.get("claim_number"),
            "claim_type": detail.get("claim_type"),
            "claim_amount": detail.get("claim_amount"),
            "description": detail.get("description"),
            "policy_details": detail.get("policy_details"),
            "customer_profile": detail.get("customer_profile")
        }
    }
    ai_resp = requests.post(f"{AI_SERVICE_URL}/ai/adjuster/chat", json=ai_payload, headers=adjuster_headers)
    ai_ok = ai_resp.status_code == 200
    ai_data = ai_resp.json() if ai_ok else {}
    record(10, "POST /api/v1/ai/adjuster/chat", ai_ok and "response" in ai_data, f"AI Reply Length: {len(ai_data.get('response', ''))}")

    # 8. RBAC Test: Underwriter calling Adjuster Decision endpoint (MUST 403)
    if underwriter_token:
        uw_headers = {"Authorization": f"Bearer {underwriter_token}"}
        resp = requests.post(f"{CUSTOMER_SERVICE_URL}/adjuster/claims/{claim_id}/decision", 
                             json={"decision": "Approved", "approved_amount": 1000.0, "decision_notes": "UW Attempt"},
                             headers=uw_headers)
        record(11, "RBAC Security: Underwriter calling Adjuster Decision -> 403 Forbidden", resp.status_code == 403, f"Status code: {resp.status_code}")

    # 9. RBAC Test: Customer calling Adjuster Decision endpoint (MUST 403)
    if customer_token:
        cust_headers = {"Authorization": f"Bearer {customer_token}"}
        resp = requests.post(f"{CUSTOMER_SERVICE_URL}/adjuster/claims/{claim_id}/decision", 
                             json={"decision": "Approved", "approved_amount": 1000.0, "decision_notes": "Cust Attempt"},
                             headers=cust_headers)
        record(12, "RBAC Security: Customer calling Adjuster Decision -> 403 Forbidden", resp.status_code == 403, f"Status code: {resp.status_code}")

    # 10. Adjuster Decision: "More Information Required"
    more_info_payload = {
        "decision": "More Information Required",
        "requested_info": "Please upload the official police report and high-resolution photos of the vehicle bumper damage.",
        "decision_notes": "Pending collision verification from incident date."
    }
    resp = requests.post(f"{CUSTOMER_SERVICE_URL}/adjuster/claims/{claim_id}/decision", json=more_info_payload, headers=adjuster_headers)
    more_info_ok = resp.status_code == 200
    record(13, "Adjuster Decision: More Information Required", more_info_ok, f"Response: {resp.json().get('message') if more_info_ok else resp.text}")

    # Verify claim state and notifications for More Information
    resp_check = requests.get(f"{CUSTOMER_SERVICE_URL}/adjuster/claims/{claim_id}", headers=adjuster_headers).json()
    record(14, "State Verification: Claim Status == 'More Information Required'", resp_check.get("status") == "More Information Required" and resp_check.get("requested_info") is not None, f"Status: {resp_check.get('status')}")

    # 11. Adjuster Decision: "Approved"
    approve_payload = {
        "decision": "Approved",
        "approved_amount": 3200.50,
        "decision_notes": "Coverage verified. Deductible of $500 applied. Claim approved for settlement."
    }
    resp = requests.post(f"{CUSTOMER_SERVICE_URL}/adjuster/claims/{claim_id}/decision", json=approve_payload, headers=adjuster_headers)
    approve_ok = resp.status_code == 200
    record(15, "Adjuster Decision: Approved", approve_ok, f"Response: {resp.json().get('message') if approve_ok else resp.text}")

    resp_check = requests.get(f"{CUSTOMER_SERVICE_URL}/adjuster/claims/{claim_id}", headers=adjuster_headers).json()
    record(16, "State Verification: Claim Status == 'Approved' & Approved Amount Persisted", resp_check.get("status") == "Approved" and float(resp_check.get("approved_amount", 0)) == 3200.50, f"Status: {resp_check.get('status')}, Approved: ${resp_check.get('approved_amount')}")

    # 12. Adjuster Decision: "Rejected"
    reject_payload = {
        "decision": "Rejected",
        "rejection_reason": "Loss falls outside covered peril definition as per Policy Clause 7.2 (Gradual wear and tear).",
        "decision_notes": "Pre-existing mechanical wear documented by inspection."
    }
    resp = requests.post(f"{CUSTOMER_SERVICE_URL}/adjuster/claims/{claim_id}/decision", json=reject_payload, headers=adjuster_headers)
    reject_ok = resp.status_code == 200
    record(17, "Adjuster Decision: Rejected", reject_ok, f"Response: {resp.json().get('message') if reject_ok else resp.text}")

    resp_check = requests.get(f"{CUSTOMER_SERVICE_URL}/adjuster/claims/{claim_id}", headers=adjuster_headers).json()
    record(18, "State Verification: Claim Status == 'Rejected' & Rejection Reason Persisted", resp_check.get("status") == "Rejected" and resp_check.get("rejection_reason") is not None, f"Status: {resp_check.get('status')}, Reason: {resp_check.get('rejection_reason')}")

    # Reset claim back to Pending Review for demo freshness if desired or test next claim
    reset_payload = {
        "decision": "Pending Review",
        "decision_notes": "Reset for test suite."
    }
    requests.post(f"{CUSTOMER_SERVICE_URL}/adjuster/claims/{claim_id}/decision", json=reset_payload, headers=adjuster_headers)

    # 13. Zero-Regression Check: Customer claims API
    if customer_token:
        cust_headers = {"Authorization": f"Bearer {customer_token}"}
        resp = requests.get(f"{CUSTOMER_SERVICE_URL}/customer/claims", headers=cust_headers)
        record(19, "Zero-Regression: GET /customer/claims (Customer Endpoint)", resp.status_code == 200, f"Customer claims returned: {len(resp.json()) if resp.status_code == 200 else 'Err'}")

    # 14. Zero-Regression Check: Underwriter applications API
    if underwriter_token:
        uw_headers = {"Authorization": f"Bearer {underwriter_token}"}
        resp = requests.get(f"{UNDERWRITER_SERVICE_URL}/underwriter/stats", headers=uw_headers)
        record(20, "Zero-Regression: GET /underwriter/stats (Underwriter Endpoint)", resp.status_code == 200, f"Underwriter status: {resp.status_code}")

    print("\n================ Test Summary ================")
    total = len(results)
    passed = sum(1 for r in results if r["passed"])
    failed = total - passed
    print(f"Total Tests: {total} | Passed: {passed} | Failed: {failed}")
    if failed == 0:
        print("ALL TESTS PASSED PERFECTLY! System ready.")
    else:
        print("Some tests failed, please inspect above.")

if __name__ == "__main__":
    main()
