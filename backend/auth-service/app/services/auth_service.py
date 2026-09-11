import logging
from typing import Dict, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.user import UserInDB, UserRole, parse_user_role
from app.models.db_user import DBUser
from app.db.database import SessionLocal
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from app.schemas.auth import LoginRequest, LoginResponse, UserInfo

logger = logging.getLogger(__name__)


class AuthService:
    """
    Authentication business logic and user management service.
    Integrates PostgreSQL 'users' table with fallback to in-memory demo accounts.
    """

    def __init__(self):
        # Default test password for all mock accounts: 'Test@123'
        default_hashed_pw = hash_password("Test@123")

        self._users_db: Dict[str, UserInDB] = {
            # Customer Account
            "sarah.mitchell@email.com": UserInDB(
                id="USR-CUST-001",
                name="Sarah Mitchell",
                email="sarah.mitchell@email.com",
                hashed_password=default_hashed_pw,
                role=UserRole.CUSTOMER,
                is_active=True,
                phone="(555) 234-5678",
                title="Policyholder"
            ),
            # Agent Account
            "alex.rivera@insureassist.com": UserInDB(
                id="USR-AGT-001",
                name="Alex Rivera",
                email="alex.rivera@insureassist.com",
                hashed_password=default_hashed_pw,
                role=UserRole.AGENT,
                is_active=True,
                phone="(555) 876-5432",
                title="Senior Account Executive"
            ),
            # Underwriter Account
            "alex.vance@insureassist.com": UserInDB(
                id="USR-UW-001",
                name="Alex Vance",
                email="alex.vance@insureassist.com",
                hashed_password=default_hashed_pw,
                role=UserRole.UNDERWRITER,
                is_active=True,
                phone="(555) 345-6789",
                title="Lead Risk Underwriter"
            ),
            # System Administrator Account
            "admin@insureassist.com": UserInDB(
                id="USR-ADM-001",
                name="Jordan Taylor",
                email="admin@insureassist.com",
                hashed_password=default_hashed_pw,
                role=UserRole.ADMIN,
                is_active=True,
                phone="(555) 999-0000",
                title="Platform Administrator"
            )
        }

    def _get_db_session(self, db: Optional[Session] = None):
        """
        Helper context-or-existing database session provider.
        """
        if db is not None:
            return db, False
        if SessionLocal is not None:
            try:
                return SessionLocal(), True
            except Exception as e:
                logger.warning(f"Could not open database session: {e}")
        return None, False

    def get_user_by_email(self, email: str, db: Optional[Session] = None) -> Optional[UserInDB]:
        """
        Retrieve a user record by email (case-insensitive) from PostgreSQL database first,
        falling back to mock demo store.
        """
        clean_email = email.strip().lower() if email else ""
        if not clean_email:
            return None

        # 1. Query PostgreSQL 'users' table
        session, should_close = self._get_db_session(db)
        if session:
            try:
                db_user = session.query(DBUser).filter(
                    func.lower(DBUser.email) == clean_email
                ).first()

                if db_user:
                    role_enum = parse_user_role(db_user.role)
                    hashed_pw = db_user.password_hash or ""
                    if not hashed_pw and clean_email in self._users_db:
                        hashed_pw = self._users_db[clean_email].hashed_password

                    return UserInDB(
                        id=str(db_user.user_id),
                        name=db_user.name,
                        email=db_user.email,
                        hashed_password=hashed_pw,
                        role=role_enum,
                        is_active=True,
                        phone=None,
                        title=f"{db_user.role.title()} Account" if db_user.role else None
                    )
            except Exception as e:
                logger.error(f"Error querying PostgreSQL user by email: {e}")
            finally:
                if should_close:
                    session.close()

        # 2. Fallback to in-memory demo store
        return self._users_db.get(clean_email)

    def get_user_by_id(self, user_id: str, db: Optional[Session] = None) -> Optional[UserInDB]:
        """
        Retrieve a user record by user ID from PostgreSQL database first,
        falling back to mock demo store.
        """
        if not user_id:
            return None

        target_id_str = str(user_id).strip()

        # 1. Query PostgreSQL 'users' table
        session, should_close = self._get_db_session(db)
        if session:
            try:
                db_user = session.query(DBUser).filter(
                    DBUser.user_id == target_id_str
                ).first()

                if db_user:
                    role_enum = parse_user_role(db_user.role)
                    hashed_pw = db_user.password_hash or ""
                    if not hashed_pw:
                        for demo_u in self._users_db.values():
                            if demo_u.id == target_id_str:
                                hashed_pw = demo_u.hashed_password
                                break

                    return UserInDB(
                        id=str(db_user.user_id),
                        name=db_user.name,
                        email=db_user.email,
                        hashed_password=hashed_pw,
                        role=role_enum,
                        is_active=True,
                        phone=None,
                        title=f"{db_user.role.title()} Account" if db_user.role else None
                    )
            except Exception as e:
                logger.error(f"Error querying PostgreSQL user by id: {e}")
            finally:
                if should_close:
                    session.close()

        # 2. Fallback to in-memory demo store
        for user in self._users_db.values():
            if user.id == target_id_str:
                return user
        return None

    def authenticate_user(self, login_data: LoginRequest, db: Optional[Session] = None) -> Optional[UserInDB]:
        """
        Validate email and password against stored hash.
        Authenticates against PostgreSQL database first, falling back to demo users.
        """
        user = self.get_user_by_email(login_data.email, db=db)
        if not user or not user.is_active:
            return None

        if not verify_password(login_data.password, user.hashed_password):
            return None

        return user

    def generate_login_response(self, user: UserInDB) -> LoginResponse:
        """
        Create a JWT token containing user identity and role claims, returning a LoginResponse.
        """
        token_claims = {
            "sub": str(user.id),
            "email": user.email,
            "name": user.name,
            "role": user.role.value
        }
        access_token = create_access_token(data=token_claims)

        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=UserInfo(
                id=str(user.id),
                name=user.name,
                email=user.email,
                role=user.role,
                phone=user.phone,
                title=user.title
            ),
            role=user.role
        )


auth_service = AuthService()
