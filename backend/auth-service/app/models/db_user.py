from sqlalchemy import Column, String, DateTime
from app.db.database import Base


class DBUser(Base):
    """
    SQLAlchemy ORM model mapping to the PostgreSQL 'users' table.
    Contains user identity, credentials, role assignments, and lifecycle status.
    """
    __tablename__ = "users"

    user_id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(64), nullable=False)
    status = Column(String(50), default="Active", nullable=True)
    created_at = Column(DateTime, nullable=True)
