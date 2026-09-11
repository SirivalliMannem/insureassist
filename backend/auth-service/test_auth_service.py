import sys
import os

# Add auth-service to python path
service_dir = os.path.abspath('c:/Users/i-sirivalli.mannem/OneDrive - Feuji Software Solutions Pvt Ltd/Desktop/poc/backend/auth-service')
sys.path.insert(0, service_dir)

print(f"Testing Python import path: {service_dir}")

try:
    from app.core.config import settings
    print(f"[PASS] Settings loaded: {settings.APP_NAME} (Port {settings.PORT})")
    
    from app.models.user import UserRole, UserInDB
    print(f"[PASS] UserRole enum loaded: {[r.value for r in UserRole]}")
    
    from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
    pw = "Test@123"
    hashed = hash_password(pw)
    assert verify_password(pw, hashed), "Password verification failed"
    print("[PASS] Security password hashing & verification verified.")
    
    # Test JWT
    token = create_access_token({"sub": "USR-CUST-001", "role": "customer", "email": "sarah.mitchell@email.com", "name": "Sarah Mitchell"})
    decoded = decode_access_token(token)
    assert decoded["sub"] == "USR-CUST-001"
    assert decoded["role"] == "customer"
    print(f"[PASS] JWT token generation and decoding verified: role={decoded['role']}")
    
    from app.services.auth_service import auth_service
    from app.schemas.auth import LoginRequest
    
    # Test all 4 roles authentication
    test_accounts = [
        ("sarah.mitchell@email.com", "Test@123", UserRole.CUSTOMER),
        ("alex.rivera@insureassist.com", "Test@123", UserRole.AGENT),
        ("alex.vance@insureassist.com", "Test@123", UserRole.UNDERWRITER),
        ("admin@insureassist.com", "Test@123", UserRole.ADMIN),
    ]
    
    for email, password, expected_role in test_accounts:
        req = LoginRequest(email=email, password=password)
        user = auth_service.authenticate_user(req)
        assert user is not None, f"Failed to authenticate {email}"
        assert user.role == expected_role, f"Role mismatch for {email}: expected {expected_role}, got {user.role}"
        
        resp = auth_service.generate_login_response(user)
        assert resp.access_token is not None
        assert resp.role == expected_role
        print(f"[PASS] Successfully authenticated {expected_role.value.upper()}: {user.name} ({user.email})")
        
    from app.main import app
    print(f"[PASS] FastAPI application loaded successfully with {len(app.routes)} routes.")
    
    print("\n*** ALL BACKEND AUTH-SERVICE TESTS PASSED SUCCESSFULLY! ***")

except Exception as e:
    print(f"\n[FAIL] Error during testing: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
