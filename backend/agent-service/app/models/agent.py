import datetime
from sqlalchemy import Column, String, Integer, Float, Numeric, Date, DateTime, ForeignKey, Text, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.database import Base


class User(Base):
    """
    SQLAlchemy model representing a user account in PostgreSQL 'users' table.
    """
    __tablename__ = "users"

    user_id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(50), default="Agent", nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=True)

    # Relationship to Customer if linked
    customer = relationship("Customer", back_populates="user", uselist=False)

    def __repr__(self):
        return f"<User(user_id='{self.user_id}', name='{self.name}', role='{self.role}')>"


class Customer(Base):
    """
    SQLAlchemy model representing an insured customer profile in 'customers' table.
    """
    __tablename__ = "customers"

    customer_id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.user_id"), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), index=True, nullable=False)
    mobile = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)

    # Relationships
    user = relationship("User", back_populates="customer")
    policies = relationship("Policy", back_populates="customer", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="customer", cascade="all, delete-orphan")
    renewal_requests = relationship("RenewalRequest", back_populates="customer", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Customer(customer_id='{self.customer_id}', name='{self.name}', email='{self.email}')>"


class Policy(Base):
    """
    SQLAlchemy model representing an insurance policy in 'policies' table.
    """
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

    # Relationships
    customer = relationship("Customer", back_populates="policies")
    coverages = relationship("Coverage", back_populates="policy", cascade="all, delete-orphan")
    exclusions = relationship("Exclusion", back_populates="policy", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="policy", cascade="all, delete-orphan")
    renewal_requests = relationship("RenewalRequest", back_populates="policy", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Policy(policy_id='{self.policy_id}', policy_number='{self.policy_number}', status='{self.status}')>"


class Coverage(Base):
    """
    SQLAlchemy model representing coverages in 'coverages' table.
    """
    __tablename__ = "coverages"

    coverage_id = Column(String(64), primary_key=True, index=True)
    policy_id = Column(String(64), ForeignKey("policies.policy_id"), nullable=False, index=True)
    coverage_name = Column(String(255), nullable=False)
    coverage_limit = Column(Numeric(12, 2), nullable=True)
    deductible = Column(Numeric(12, 2), nullable=True)
    status = Column(String(50), default="Active", nullable=True)

    # Relationships
    policy = relationship("Policy", back_populates="coverages")


class Exclusion(Base):
    """
    SQLAlchemy model representing exclusions in 'exclusions' table.
    """
    __tablename__ = "exclusions"

    exclusion_id = Column(String(64), primary_key=True, index=True)
    policy_id = Column(String(64), ForeignKey("policies.policy_id"), nullable=False, index=True)
    exclusion_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Relationships
    policy = relationship("Policy", back_populates="exclusions")


class Claim(Base):
    """
    SQLAlchemy model representing claims in 'claims' table.
    """
    __tablename__ = "claims"

    claim_id = Column(String(64), primary_key=True, index=True)
    customer_id = Column(String(64), ForeignKey("customers.customer_id"), nullable=False, index=True)
    policy_id = Column(String(64), ForeignKey("policies.policy_id"), nullable=False, index=True)
    claim_number = Column(String(100), unique=True, index=True, nullable=False)
    incident_date = Column(Date, nullable=False)
    incident_type = Column(String(100), nullable=True)
    incident_description = Column(Text, nullable=False)
    location = Column(String(255), nullable=True)
    claim_status = Column(String(50), default="Under Review", nullable=False)
    claim_amount = Column(Numeric(12, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    customer = relationship("Customer", back_populates="claims")
    policy = relationship("Policy", back_populates="claims")


class RenewalRequest(Base):
    """
    SQLAlchemy model representing renewal approval requests in 'renewal_requests' table.
    """
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

    # Relationships
    customer = relationship("Customer", back_populates="renewal_requests")
    policy = relationship("Policy", back_populates="renewal_requests")


class Notification(Base):
    """
    SQLAlchemy model representing in-app workflow notifications in 'notifications' table.
    """
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
    """
    SQLAlchemy model representing customer assignments to insurance agents.
    """
    __tablename__ = "customer_agent_assignments"

    assignment_id = Column(String(64), primary_key=True, index=True)
    agent_id = Column(String(64), ForeignKey("users.user_id"), nullable=False, index=True)
    customer_id = Column(String(64), ForeignKey("customers.customer_id"), nullable=False, index=True)
    status = Column(String(50), default="Active", nullable=False)
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("agent_id", "customer_id", name="uq_agent_customer"),
    )

    # Relationships
    agent = relationship("User", foreign_keys=[agent_id])
    customer = relationship("Customer", foreign_keys=[customer_id])

    def __repr__(self):
        return f"<CustomerAgentAssignment(agent_id='{self.agent_id}', customer_id='{self.customer_id}')>"
