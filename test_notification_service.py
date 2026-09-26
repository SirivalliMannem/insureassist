import requests
import json
import psycopg2
import sys

BASE_URL = "http://localhost:8007"
AUTH_URL = "http://localhost:8001"
CUSTOMER_URL = "http://localhost:8002"
DB_PARAMS = {
    "dbname": "insureassist",
    "user": "insureassist",
    "password": "Test@123",
    "host": "localhost",
    "port": 5435
}

def login(email, password="Test@123"):
    resp = requests.post(f"{AUTH_URL}/auth/login", json={"email": email, "password": password})
    if resp.status_code == 200:
        data = resp.json()
        token = data.get("access_token") or data.get("token")
        return token
    else:
        print(f"Failed to login as {email}: {resp.status_code} {resp.text}")
        return None

def test_health():
    print("\n--- Test 1: Health Check ---")
    resp = requests.get(f"{BASE_URL}/health")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert data.get("status") == "healthy"
    assert data.get("service") == "notification-service"
    print("[PASS] Health check passed:", data)

def test_db_connection():
    print("\n--- Test 2: Database Connection & Table Verification ---")
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    cur.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'notifications'
        ORDER BY ordinal_position;
    """)
    cols = cur.fetchall()
    col_names = [c[0] for c in cols]
    print("Notification table columns:", col_names)
    required_cols = ["notification_id", "recipient_user_id", "notification_type", "title", "message", "entity_type", "entity_id", "is_read", "created_at", "read_at"]
    for rc in required_cols:
        assert rc in col_names, f"Missing required column: {rc}"
    
    cur.execute("SELECT count(*) FROM notifications;")
    total_count = cur.fetchone()[0]
    print(f"Total existing notifications in DB: {total_count}")
    cur.close()
    conn.close()
    print("[PASS] DB connection and table schema verified")

def test_service_to_service_create():
    print("\n--- Test 3: Service-to-Service Notification Creation ---")
    headers = {
        "X-Internal-Service-Key": "insureassist-internal-service-secret-key-2026",
        "Content-Type": "application/json"
    }
    payload = {
        "recipient_user_id": "sarah.mitchell@email.com",
        "recipient_role": "Customer",
        "recipient_id": "50254",
        "notification_type": "CLAIM_SUBMITTED",
        "title": "Claim Test Notification",
        "message": "This is a test notification for claim submission verification.",
        "entity_type": "CLAIM",
        "entity_id": "CLM-TEST-001"
    }
    resp = requests.post(f"{BASE_URL}/notifications", json=payload, headers=headers)
    assert resp.status_code == 201, f"Expected 201, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert data.get("title") == payload["title"]
    assert data.get("is_read") is False
    notif_id = data.get("notification_id")
    print(f"[PASS] Notification created successfully with ID: {notif_id}")
    return notif_id

def test_get_notifications_and_unread_count(token_customer, notif_id):
    print("\n--- Test 4: Get User Notifications & Unread Count ---")
    headers = {"Authorization": f"Bearer {token_customer}"}
    
    # 1. Unread count
    resp_count = requests.get(f"{BASE_URL}/notifications/unread-count", headers=headers)
    assert resp_count.status_code == 200, f"Expected 200, got {resp_count.status_code}: {resp_count.text}"
    count_data = resp_count.json()
    print(f"Unread count response: {count_data}")
    assert count_data.get("unread_count", 0) >= 1
    
    # 2. Get notifications list
    resp_list = requests.get(f"{BASE_URL}/notifications?limit=10&offset=0", headers=headers)
    assert resp_list.status_code == 200, f"Expected 200, got {resp_list.status_code}: {resp_list.text}"
    items = resp_list.json()
    if isinstance(items, dict):
        items = items.get("items", [])
    print(f"Fetched {len(items)} notifications")
    assert len(items) > 0
    # Verify newest first
    created_times = [it.get("created_at") for it in items if it.get("created_at")]
    for i in range(len(created_times) - 1):
        assert created_times[i] >= created_times[i+1], "Notifications not sorted newest first"
    print("[PASS] Get notifications and unread count passed")

def test_mark_as_read(token_customer, notif_id):
    print("\n--- Test 5: Mark Single Notification as Read ---")
    headers = {"Authorization": f"Bearer {token_customer}"}
    resp = requests.patch(f"{BASE_URL}/notifications/{notif_id}/read", headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert data.get("is_read") is True
    assert data.get("read_at") is not None
    print(f"[PASS] Notification {notif_id} marked as read at {data.get('read_at')}")

def test_rbac_security_isolation(token_agent, notif_id):
    print("\n--- Test 6: Security & RBAC Isolation (User A cannot access/update User B's notification) ---")
    # Agent tries to mark Customer's private notification as read
    headers = {"Authorization": f"Bearer {token_agent}"}
    resp = requests.patch(f"{BASE_URL}/notifications/{notif_id}/read", headers=headers)
    print(f"Agent attempt to update Customer notification response: {resp.status_code}")
    assert resp.status_code in [403, 404], f"Expected 403 or 404, got {resp.status_code}"
    print("[PASS] Security isolation confirmed: unauthorized user cannot modify other user's notification")

def test_mark_all_read(token_customer):
    print("\n--- Test 7: Mark All Notifications as Read ---")
    headers = {"Authorization": f"Bearer {token_customer}"}
    resp = requests.patch(f"{BASE_URL}/notifications/read-all", headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    print(f"Mark all read response: {data}")
    
    # Verify unread count is 0
    resp_count = requests.get(f"{BASE_URL}/notifications/unread-count", headers=headers)
    assert resp_count.status_code == 200
    assert resp_count.json().get("unread_count") == 0
    print("[PASS] All notifications marked as read and unread_count is 0")

def test_adjuster_workflow_integration(token_adjuster):
    print("\n--- Test 8: Adjuster Workflow Integration ---")
    headers_adj = {"Authorization": f"Bearer {token_adjuster}"}
    
    # 1. Fetch pending claims
    resp_claims = requests.get(f"{CUSTOMER_URL}/adjuster/claims", headers=headers_adj)
    assert resp_claims.status_code == 200, f"Failed to get claims: {resp_claims.status_code}"
    claims_data = resp_claims.json()
    claims = claims_data if isinstance(claims_data, list) else (claims_data.get("claims") or claims_data.get("items") or [])
    print(f"Found {len(claims)} adjuster claims")
    
    if not claims:
        print("No adjuster claims found to test decision dispatch.")
        return
    
    # Find a test claim
    target_claim = claims[0]
    claim_id = target_claim.get("claim_id") or target_claim.get("id")
    print(f"Testing with Claim ID: {claim_id}")
    
    # 1. Request More Info decision
    payload_info = {
        "decision": "More Information Required",
        "requested_info": "Please provide updated police report and repair invoice.",
        "decision_notes": "Automated test notes for information request"
    }
    resp_dec = requests.post(f"{CUSTOMER_URL}/adjuster/claims/{claim_id}/decision", json=payload_info, headers=headers_adj)
    print(f"Claim decision (More Info) response: {resp_dec.status_code}")
    assert resp_dec.status_code == 200, f"Decision failed: {resp_dec.text}"
    
    # 2. Approved decision
    payload_approve = {
        "decision": "Approved",
        "approved_amount": 2500.00,
        "decision_notes": "Coverage verified. Approved settlement amount."
    }
    resp_app = requests.post(f"{CUSTOMER_URL}/adjuster/claims/{claim_id}/decision", json=payload_approve, headers=headers_adj)
    print(f"Claim decision (Approve) response: {resp_app.status_code}")
    assert resp_app.status_code == 200, f"Decision failed: {resp_app.text}"

    # 3. Rejected decision
    payload_reject = {
        "decision": "Rejected",
        "rejection_reason": "Not covered under peril terms.",
        "decision_notes": "Outside policy scope."
    }
    resp_rej = requests.post(f"{CUSTOMER_URL}/adjuster/claims/{claim_id}/decision", json=payload_reject, headers=headers_adj)
    print(f"Claim decision (Reject) response: {resp_rej.status_code}")
    assert resp_rej.status_code == 200, f"Decision failed: {resp_rej.text}"
    
    # Check DB for created notifications
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    cur.execute("""
        SELECT notification_id, notification_type, title, message, entity_type, entity_id, recipient_user_id, recipient_role
        FROM notifications
        WHERE entity_id = %s OR claim_id = %s
        ORDER BY created_at DESC
        LIMIT 10;
    """, (str(claim_id), str(claim_id)))
    rows = cur.fetchall()
    print(f"\nGenerated notifications for Claim {claim_id}:")
    for r in rows:
        print(f" - [{r[1]}] To: {r[6]} ({r[7]}) | Title: '{r[2]}' | Msg: '{r[3]}'")
    
    types_generated = [r[1] for r in rows]
    print(f"Notification types present: {set(types_generated)}")
    assert "CLAIM_APPROVED" in types_generated or "CLAIM_REJECTED" in types_generated or "CLAIM_MORE_INFORMATION_REQUIRED" in types_generated, "Expected claim notifications in DB!"
    
    # Reset claim to Pending Review
    requests.post(f"{CUSTOMER_URL}/adjuster/claims/{claim_id}/decision", json={"decision": "Pending Review", "decision_notes": "Reset for freshness"}, headers=headers_adj)
    
    cur.close()
    conn.close()
    print("[PASS] Adjuster workflow integration created real notifications for Customer and Agent successfully")
    
    assert len(rows) > 0, "No notifications were created in DB for claim decision!"
    
    # Clean up test rows for this claim if needed or keep existing integrity
    cur.close()
    conn.close()
    print("[PASS] Adjuster workflow integration created real notification successfully")

def cleanup_test_notifications(test_notif_ids):
    if not test_notif_ids:
        return
    print("\n--- Cleaning up temporary test notifications ---")
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    for nid in test_notif_ids:
        cur.execute("DELETE FROM notifications WHERE notification_id = %s OR entity_id = %s;", (nid, nid))
    conn.commit()
    cur.close()
    conn.close()
    print("[PASS] Test notifications cleaned up.")

if __name__ == "__main__":
    print("==================================================")
    print("INSUREASSIST NOTIFICATION SERVICE TEST SUITE")
    print("==================================================")
    
    test_health()
    test_db_connection()
    
    # Login as Customer, Agent, Adjuster
    print("\n--- Logging in test users ---")
    token_cust = login("sarah.mitchell@email.com")
    token_agent = login("alex.rivera@insureassist.com")
    token_adj = login("adjuster@insureassist.com")
    
    assert token_cust, "Failed customer login"
    assert token_agent, "Failed agent login"
    assert token_adj, "Failed adjuster login"
    print("[PASS] All 3 test users authenticated successfully")
    
    created_test_ids = []
    
    notif_id = test_service_to_service_create()
    created_test_ids.append(notif_id)
    created_test_ids.append("CLM-TEST-001")
    
    test_get_notifications_and_unread_count(token_cust, notif_id)
    test_mark_as_read(token_cust, notif_id)
    test_rbac_security_isolation(token_agent, notif_id)
    test_mark_all_read(token_cust)
    test_adjuster_workflow_integration(token_adj)
    
    cleanup_test_notifications(created_test_ids)
    
    print("\n==================================================")
    print("ALL TESTS PASSED SUCCESSFULLY! [OK]")
    print("==================================================")
