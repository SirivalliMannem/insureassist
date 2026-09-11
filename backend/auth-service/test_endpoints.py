import sys
import os
from starlette.testclient import TestClient

service_dir = os.path.abspath('c:/Users/i-sirivalli.mannem/OneDrive - Feuji Software Solutions Pvt Ltd/Desktop/poc/backend/auth-service')
sys.path.insert(0, service_dir)

from app.main import app

client = TestClient(app)

print("=== FASTAPI AUTH SERVICE ENDPOINT VERIFICATION ===\n")

# 1. Health Check
res = client.get("/health")
assert res.status_code == 200, f"Health check failed: {res.text}"
data = res.json()
assert data["status"] == "ok"
assert data["service"] == "auth-service"
print(f"[PASS] GET /health -> {data}")

# 2. Service Root
res = client.get("/")
assert res.status_code == 200
print(f"[PASS] GET / -> {res.json()['service']} ({res.json()['status']})")

# 3. Demo Users Discovery
res = client.get("/auth/demo-users")
assert res.status_code == 200
users = res.json()
assert len(users) == 4
print(f"[PASS] GET /auth/demo-users -> Discovered {len(users)} demo accounts:")
for u in users:
    print(f"       • [{u['role'].upper()}] {u['name']} ({u['email']})")

# 4. Authentication for all 4 roles
roles_to_test = [
    ("sarah.mitchell@email.com", "Test@123", "customer"),
    ("alex.rivera@insureassist.com", "Test@123", "agent"),
    ("alex.vance@insureassist.com", "Test@123", "underwriter"),
    ("admin@insureassist.com", "Test@123", "admin"),
]

for email, password, expected_role in roles_to_test:
    login_payload = {"email": email, "password": password, "role": expected_role}
    res = client.post("/auth/login", json=login_payload)
    assert res.status_code == 200, f"Login failed for {email}: {res.text}"
    auth_data = res.json()
    assert "access_token" in auth_data
    assert auth_data["role"] == expected_role
    assert auth_data["token_type"] == "bearer"
    token = auth_data["access_token"]
    print(f"[PASS] POST /auth/login -> {expected_role.upper()} authenticated successfully! (Token length: {len(token)})")

    # 5. Test Profile verification with Bearer token
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/auth/me", headers=headers)
    assert me_res.status_code == 200, f"GET /auth/me failed: {me_res.text}"
    user_data = me_res.json()
    assert user_data["email"] == email
    assert user_data["role"] == expected_role
    print(f"       -> GET /auth/me verified: ID={user_data['id']}, Title='{user_data['title']}'")

# 6. Invalid credentials test
invalid_res = client.post("/auth/login", json={"email": "sarah.mitchell@email.com", "password": "wrongpassword"})
assert invalid_res.status_code == 401
print(f"[PASS] POST /auth/login (invalid password) -> Correctly returned 401 Unauthorized: '{invalid_res.json()['detail']}'")

print("\n*** ALL FASTAPI ENDPOINTS VERIFIED AND FULLY OPERATIONAL! ***")
