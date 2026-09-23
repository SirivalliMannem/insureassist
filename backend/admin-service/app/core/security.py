from passlib.context import CryptContext

# Same bcrypt scheme the auth service uses to verify passwords.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DEFAULT_USER_PASSWORD = "Test@123"


def hash_password(password: str) -> str:
    """Hash a plain text password using bcrypt."""
    return pwd_context.hash(password)
