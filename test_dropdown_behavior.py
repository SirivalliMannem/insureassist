import requests
import json
import psycopg2

BASE_URL = "http://localhost:8007"
AUTH_URL = "http://localhost:8001"
DB_PARAMS = {
    "dbname": "insureassist",
    "user": "insureassist",
    "password": "Test@123",
    "host": "localhost",
    "port": 5435
}

def get_token(email, password="Test@123"):
    resp = requests.post(f"{AUTH_URL}/auth/login", json={"email": email, "password": password})
    if resp.status_code == 200:
        data = resp.json()
        return data.get("access_token") or data.get("token")
    return None

def create_notification(user_id, role, title, msg, entity_type="CLAIM", entity_id="CLM-TEST"):
    headers = {
        "X-Internal-Service-Key": "insureassist-internal-service-secret-key-2026",
        "Content-Type": "application/json"
    }
    payload = {
        "recipient_user_id": user_id,
        "recipient_role": role,
        "recipient_id": user_id,
        "notification_type": "CLAIM_SUBMITTED",
        "title": title,
        "message": msg,
        "entity_type": entity_type,
        "entity_id": entity_id
    }
    resp = requests.post(f"{BASE_URL}/notifications", json=payload, headers=headers)
    assert resp.status_code == 201, f"Failed create: {resp.text}"
    return resp.json()["notification_id"]

def run_all_dropdown_tests():
    print("==================================================")
    print("VERIFYING NOTIFICATION DROPDOWN BEHAVIOR & PERSISTENCE")
    print("==================================================")

    # 1. Total DB count before test
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    cur.execute("SELECT count(*) FROM notifications;")
    initial_db_count = cur.fetchone()[0]
    print(f"Initial total notifications in database: {initial_db_count}")
    cur.close()
    conn.close()

    roles_to_test = [
        ("Customer", "sarah.mitchell@email.com"),
        ("Agent", "alex.rivera@insureassist.com"),
        ("Underwriter", "alex.vance@insureassist.com"),
        ("Adjuster", "adjuster@insureassist.com"),
        ("Admin", "admin@insureassist.com")
    ]

    for role_name, email in roles_to_test:
        print(f"\n--- Testing Dropdown Behavior for Role: {role_name} ({email}) ---")
        token = get_token(email)
        assert token, f"Could not login as {role_name}"
        headers = {"Authorization": f"Bearer {token}"}

        # Step A: Create 2 fresh unread notifications
        n1 = create_notification(email, role_name, f"{role_name} Notice 1", "Unread notice 1")
        n2 = create_notification(email, role_name, f"{role_name} Notice 2", "Unread notice 2")
        print(f"Created 2 notifications: {n1}, {n2}")

        # Step B: Fetch unread count
        resp_count = requests.get(f"{BASE_URL}/notifications/unread-count", headers=headers)
        assert resp_count.status_code == 200
        count_before = resp_count.json()["unread_count"]
        print(f"Unread count after creation: {count_before}")
        assert count_before >= 2

        # Step C: Reopening/refreshing dropdown with unread_only=true returns the unread notifications
        resp_unread = requests.get(f"{BASE_URL}/notifications?unread_only=true", headers=headers)
        assert resp_unread.status_code == 200
        unread_items = resp_unread.json()
        unread_ids = [it["notification_id"] for it in unread_items]
        assert n1 in unread_ids and n2 in unread_ids
        print(f"[PASS] Dropdown unread fetch returns {len(unread_items)} unread items (includes {n1}, {n2})")

        # Step D: Mark n1 as read
        resp_read = requests.patch(f"{BASE_URL}/notifications/{n1}/read", headers=headers)
        assert resp_read.status_code == 200
        assert resp_read.json()["is_read"] is True

        # Step E: Verify n1 is no longer in unread dropdown list, but n2 IS still in unread dropdown list
        resp_unread_after = requests.get(f"{BASE_URL}/notifications?unread_only=true", headers=headers)
        unread_ids_after = [it["notification_id"] for it in resp_unread_after.json()]
        assert n1 not in unread_ids_after, f"Notification {n1} should NOT appear in unread dropdown"
        assert n2 in unread_ids_after, f"Notification {n2} should still appear in unread dropdown"
        print(f"[PASS] Notification {n1} immediately excluded from unread dropdown; {n2} remains")

        # Step F: Verify n1 IS STILL PERSISTED in the database (NOT deleted)
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()
        cur.execute("SELECT notification_id, is_read, read_at FROM notifications WHERE notification_id = %s;", (n1,))
        row = cur.fetchone()
        assert row is not None, f"Notification {n1} was deleted from DB! Must be persisted."
        assert row[1] is True, f"Notification {n1} is_read is not True"
        assert row[2] is not None, f"Notification {n1} read_at is None"
        print(f"[PASS] Notification {n1} correctly persisted in DB with is_read=True, read_at={row[2]}")
        cur.close()
        conn.close()

        # Step G: "Mark all as read"
        resp_mark_all = requests.patch(f"{BASE_URL}/notifications/read-all", headers=headers)
        assert resp_mark_all.status_code == 200

        # Step H: Verify unread dropdown is now completely empty for this user
        resp_unread_final = requests.get(f"{BASE_URL}/notifications?unread_only=true", headers=headers)
        assert len(resp_unread_final.json()) == 0
        resp_count_final = requests.get(f"{BASE_URL}/notifications/unread-count", headers=headers)
        assert resp_count_final.json()["unread_count"] == 0
        print(f"[PASS] 'Mark all as read' cleared unread dropdown; unread count is 0")

        # Step I: Verify notifications still exist in DB (History preserved)
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM notifications WHERE notification_id IN (%s, %s);", (n1, n2))
        persisted_count = cur.fetchone()[0]
        assert persisted_count == 2, "Notifications were removed from DB!"
        print(f"[PASS] All {persisted_count} notifications safely persisted in DB history.")
        cur.close()
        conn.close()

    print("\n==================================================")
    print("ALL 5 ROLES PASSED DROPDOWN BEHAVIOR & PERSISTENCE VERIFICATION! [OK]")
    print("==================================================")

if __name__ == "__main__":
    run_all_dropdown_tests()
