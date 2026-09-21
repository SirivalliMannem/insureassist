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

    customer = relationship("Customer", back_populates="user", uselist=False)


class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.user_id"), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), index=True, nullable=False)
    mobile = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)

    user = relationship("User", back_populates="customer")
    policies = relationship("Policy", back_populates="customer")
    renewal_requests = relationship("RenewalRequest", back_populates="customer")


class Policy(Base):
    __tablename__ = "policies"

    policy_id = Column(String(64), primary_key=True, index=True)
    customer_id = Column(String(64), ForeignKey("customers.customer_id"), nullable=False, index=True)
    policy_number = Column(String(100), unique=True, index=True, nullable=False)
    policy_type = Column(String(100), nullable=False)
    status = Column(String(50), default="Active", nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    premium = Column(Numeric(12, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=True)

    customer = relationship("Customer", back_populates="policies")
    coverages = relationship("Coverage", back_populates="policy")
    exclusions = relationship("Exclusion", back_populates="policy")
    renewal_requests = relationship("RenewalRequest", back_populates="policy")


class Coverage(Base):
    __tablename__ = "coverages"

    coverage_id = Column(String(64), primary_key=True, index=True)
    policy_id = Column(String(64), ForeignKey("policies.policy_id"), nullable=False, index=True)
    coverage_name = Column(String(255), nullable=False)
    coverage_limit = Column(Numeric(12, 2), nullable=True)
    deductible = Column(Numeric(12, 2), nullable=True)
    status = Column(String(50), default="Active", nullable=True)

    policy = relationship("Policy", back_populates="coverages")


class Exclusion(Base):
    __tablename__ = "exclusions"

    exclusion_id = Column(String(64), primary_key=True, index=True)
    policy_id = Column(String(64), ForeignKey("policies.policy_id"), nullable=False, index=True)
    exclusion_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    policy = relationship("Policy", back_populates="exclusions")


class RenewalRequest(Base):
    __tablename__ = "renewal_requests"

    renewal_id = Column(String(64), primary_key=True, index=True)
    customer_id = Column(String(64), ForeignKey("customers.customer_id"), nullable=False, index=True)
    policy_id = Column(String(64), ForeignKey("policies.policy_id"), nullable=False, index=True)
    policy_number = Column(String(100), nullable=False)
    policy_type = Column(String(100), nullable=False)
    customer_name = Column(String(255), nullable=False)
    renewal_date = Column(Date, nullable=True)
    renewal_premium = Column(Numeric(12, 2), nullable=True)
    status = Column(String(50), default="Pending Approval", nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    customer = relationship("Customer", back_populates="renewal_requests")
    policy = relationship("Policy", back_populates="renewal_requests")


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(String(64), primary_key=True, index=True)
    recipient_role = Column(String(50), nullable=False, index=True)
    recipient_id = Column(String(64), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    policy_id = Column(String(64), nullable=True)
    policy_number = Column(String(100), nullable=True)
    policy_type = Column(String(100), nullable=True)
    customer_name = Column(String(255), nullable=True)
    renewal_id = Column(String(64), nullable=True)
    renewal_date = Column(Date, nullable=True)
    renewal_premium = Column(Numeric(12, 2), nullable=True)
    status = Column(String(50), default="Pending Approval", nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)


class CustomerAgentAssignment(Base):
    __tablename__ = "customer_agent_assignments"

    assignment_id = Column(String(64), primary_key=True, index=True)
    agent_id = Column(String(64), ForeignKey("users.user_id"), nullable=False, index=True)
    customer_id = Column(String(64), ForeignKey("customers.customer_id"), nullable=False, index=True)
    status = Column(String(50), default="Active", nullable=False)
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    agent = relationship("User", foreign_keys=[agent_id])
    customer = relationship("Customer", foreign_keys=[customer_id])

