"""
Test suite for InsureAssist Customer Service endpoints using FastAPI TestClient.
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "customer-service"
    assert data["version"] == "1.0.0"
    print("[PASS] GET /health ->", data)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "InsureAssist Customer Service"
    assert data["status"] == "online"
    assert "documentation" in data
    print("[PASS] GET / ->", data)

def test_customer_profile():
    response = client.get("/customer/profile")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "USR-CUST-001"
    assert data["name"] == "Sarah Mitchell"
    assert data["active_policies_count"] >= 1
    print(f"[PASS] GET /customer/profile -> {data['name']} ({data['id']}), {data['active_policies_count']} policies")

def test_customer_policies():
    response = client.get("/customer/policies")
    assert response.status_code == 200
    policies = response.json()
    assert len(policies) >= 1
    print(f"[PASS] GET /customer/policies -> Retrieved {len(policies)} policies (e.g. {policies[0]['type']})")

def test_customer_claims():
    response = client.get("/customer/claims")
    assert response.status_code == 200
    claims = response.json()
    assert len(claims) >= 1
    print(f"[PASS] GET /customer/claims -> Retrieved {len(claims)} claims (e.g. {claims[0]['id']} status: {claims[0]['status']})")

def test_submit_fnol():
    payload = {
        "policy_id": "POL-HOM-2024-001",
        "incident_date": "2024-09-09",
        "incident_type": "Water Leak",
        "description": "Bathroom pipe leakage under sink causing cabinet water accumulation.",
        "location": "Master Bathroom",
        "estimated_damage": "$1,200"
    }
    response = client.post("/customer/claims/fnol", json=payload)
    assert response.status_code == 201
    result = response.json()
    assert result["status"] == "Submitted"
    assert "claim_id" in result
    print(f"[PASS] POST /customer/claims/fnol -> Created claim {result['claim_id']}: {result['message']}")

if __name__ == "__main__":
    print("\n=== FASTAPI CUSTOMER SERVICE ENDPOINT VERIFICATION ===\n")
    test_health()
    test_root()
    test_customer_profile()
    test_customer_policies()
    test_customer_claims()
    test_submit_fnol()
    print("\n*** ALL CUSTOMER SERVICE ENDPOINTS VERIFIED AND OPERATIONAL! ***\n")
