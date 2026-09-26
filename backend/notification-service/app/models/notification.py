import datetime
from sqlalchemy import Column, String, Integer, Float, Numeric, Date, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(50), default="Customer", nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=True)


class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.user_id"), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), index=True, nullable=False)
    mobile = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)


class Notification(Base):
    """
    SQLAlchemy ORM model representing InsureAssist notifications across all roles and entities.
    """
    __tablename__ = "notifications"

    notification_id = Column(String(64), primary_key=True, index=True)
    recipient_user_id = Column(String(64), nullable=True, index=True)
    recipient_role = Column(String(50), nullable=True, index=True)      # 'Customer', 'Agent', 'Underwriter', 'Adjuster', 'Admin'
    recipient_id = Column(String(64), nullable=True, index=True)        # backwards-compatibility alias
    notification_type = Column(String(100), nullable=True, index=True) # e.g. CLAIM_APPROVED, CLAIM_REJECTED
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    entity_type = Column(String(50), nullable=True, index=True)        # 'CLAIM', 'POLICY', 'APPLICATION', 'USER'
    entity_id = Column(String(100), nullable=True, index=True)         # e.g. 'CLM-1446', 'POL-12345'
    is_read = Column(Boolean, default=False, nullable=False)
    read_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Legacy workflow metadata fields preserved for zero-regression
    claim_id = Column(String(64), nullable=True, index=True)
    policy_id = Column(String(64), nullable=True)
    policy_number = Column(String(100), nullable=True)
    policy_type = Column(String(100), nullable=True)
    customer_name = Column(String(255), nullable=True)
    renewal_id = Column(String(64), nullable=True)
    renewal_date = Column(Date, nullable=True)
    renewal_premium = Column(Numeric(12, 2), nullable=True)
    status = Column(String(50), nullable=True)

    def __repr__(self):
        return f"<Notification(id='{self.notification_id}', type='{self.notification_type}', recipient='{self.recipient_user_id}', title='{self.title}')>"
