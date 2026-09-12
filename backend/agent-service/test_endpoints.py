import pytest
import jwt
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)


def generate_test_token(user_id="1321", email="aarav_nair1321@example.com", name="Aarav Nair", role="Agent"):
    """
    Helper to generate valid JWT token for tests.
    """
    payload = {
        "sub": user_id,
        "email": email,
        "name": name,
        "role": role
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def test_health():
    """
    Test public health check endpoint.
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "agent-service"
    assert data["version"] == "1.0.0"


def test_root():
    """
    Test root welcome endpoint.
    """
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "endpoints" in data


def test_unauthorized_endpoints():
    """
    Test that endpoints reject requests without token with 401.
    """
    for path in ["/agent/me", "/agent/dashboard", "/agent/customers", "/agent/policies"]:
        response = client.get(path)
        assert response.status_code == 401


def test_forbidden_role():
    """
    Test that non-agent users (e.g. Customer) are rejected with 403.
    """
    customer_token = generate_test_token(user_id="50254", email="pooja.verma@email.com", name="Pooja Verma", role="Customer")
    headers = {"Authorization": f"Bearer {customer_token}"}
    for path in ["/agent/me", "/agent/dashboard", "/agent/customers", "/agent/policies", "/agent/policies/100001"]:
        response = client.get(path, headers=headers)
        assert response.status_code == 403


def test_agent_policy_detail():
    """
    Test retrieving specific policy detail with valid agent token.
    """
    agent_token = generate_test_token()
    headers = {"Authorization": f"Bearer {agent_token}"}
    response = client.get("/agent/policies/100001", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["policy_id"] == "100001"
    assert data["policy_number"] == "POL-2025-0100001"
    assert data["customer_id"] == "50001"
    assert "coverages" in data
    assert "exclusions" in data


def test_agent_renewals_and_send_reminder():
    """
    Test listing approaching renewals and sending a client reminder.
    """
    agent_token = generate_test_token()
    headers = {"Authorization": f"Bearer {agent_token}"}

    # 1. Get renewals
    response = client.get("/agent/renewals", headers=headers)
    assert response.status_code == 200
    renewals = response.json()
    assert len(renewals) >= 1

    # 2. Send reminder for policy 100002
    resp_rem = client.post("/agent/policies/100002/send-reminder", headers=headers)
    assert resp_rem.status_code == 200
    rem_data = resp_rem.json()
    assert rem_data["success"] is True
    assert "notification_id" in rem_data

    # 3. Verify reminder_sent is persisted in renewals list
    response2 = client.get("/agent/renewals", headers=headers)
    assert response2.status_code == 200
    renewals2 = response2.json()
    policy_100002 = next((r for r in renewals2 if r["policy_id"] == "100002"), None)
    assert policy_100002 is not None
    assert policy_100002["reminder_sent"] is True

