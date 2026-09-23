import datetime
import logging

from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from app.core.security import hash_password
from app.db.database import Base, SessionLocal, engine
from app.models.db_user import DBUser

logger = logging.getLogger(__name__)

DEFAULT_PASSWORD = "Test@123"

DEFAULT_USERS = [
    {
        "user_id": "USR-CUST-001",
        "name": "Sarah Mitchell",
        "email": "sarah.mitchell@email.com",
        "role": "customer",
    },
    {
        "user_id": "USR-AGT-001",
        "name": "Alex Rivera",
        "email": "alex.rivera@insureassist.com",
        "role": "agent",
    },
    {
        "user_id": "USR-UW-001",
        "name": "Alex Vance",
        "email": "alex.vance@insureassist.com",
        "role": "underwriter",
    },
    {
        "user_id": "USR-ADM-001",
        "name": "Jordan Taylor",
        "email": "admin@insureassist.com",
        "role": "admin",
    },
]


def seed_default_users() -> None:
    """
    Insert the four demo accounts into the users table if they are not already present.
    Existing rows are left in place. A missing password hash is filled with Test@123.
    """
    if engine is None or SessionLocal is None:
        logger.warning("Database is not configured. Skipping default user seed.")
        return

    Base.metadata.create_all(bind=engine)
    password_hash = hash_password(DEFAULT_PASSWORD)
    now = datetime.datetime.utcnow()

    db = SessionLocal()
    inserted = 0
    try:
        for spec in DEFAULT_USERS:
            email = spec["email"].strip().lower()
            existing = db.query(DBUser).filter(func.lower(DBUser.email) == email).first()
            if existing:
                if not existing.password_hash:
                    existing.password_hash = password_hash
                    logger.info("Set default password for existing user %s.", email)
                continue

            if db.query(DBUser).filter(DBUser.user_id == spec["user_id"]).first():
                logger.warning(
                    "Skipping default user %s because user_id %s is already used.",
                    email,
                    spec["user_id"],
                )
                continue

            try:
                with db.begin_nested():
                    db.add(DBUser(
                        user_id=spec["user_id"],
                        name=spec["name"],
                        email=spec["email"],
                        password_hash=password_hash,
                        role=spec["role"],
                        created_at=now,
                    ))
                    db.flush()
                inserted += 1
            except IntegrityError:
                logger.info("Default user %s was inserted by another service. Skipping.", email)

        db.commit()
        logger.info("Default user seed complete. Inserted %s new user(s).", inserted)
    except Exception:
        db.rollback()
        logger.exception("Failed to seed default users.")
        raise
    finally:
        db.close()
