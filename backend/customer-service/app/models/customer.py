import datetime
from sqlalchemy import Column, String, Integer, Float, Numeric, Date, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base


class User(Base):
    """
    SQLAlchemy model representing a user account (reference/sync model from users sheet).
    """
    __tablename__ = "users"

    user_id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(50), default="Customer", nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=True)

    # Relationships
    customer = relationship("Customer", back_populates="user", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(user_id='{self.user_id}', email='{self.email}', role='{self.role}')>"


class Customer(Base):
    """
    SQLAlchemy model representing an insured customer profile (from customers sheet).
    """
    __tablename__ = "customers"

    customer_id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.user_id"), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), index=True, nullable=False)
    mobile = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True, default="124 Grand Avenue, Suite 400, Chicago, IL 60611")

    # Relationships
    user = relationship("User", back_populates="customer")
    policies = relationship("Policy", back_populates="customer", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="customer", cascade="all, delete-orphan")
    renewal_requests = relationship("RenewalRequest", back_populates="customer", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Customer(customer_id='{self.customer_id}', name='{self.name}', email='{self.email}')>"


class Policy(Base):
    """
    SQLAlchemy model representing an insurance policy contract (from policies sheet).
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
        return f"<Policy(policy_id='{self.policy_id}', policy_number='{self.policy_number}', type='{self.policy_type}')>"


class Coverage(Base):
    """
    SQLAlchemy model representing coverage line items under a policy (from coverages sheet).
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

    def __repr__(self):
        return f"<Coverage(coverage_id='{self.coverage_id}', name='{self.coverage_name}', limit={self.coverage_limit})>"


class Exclusion(Base):
    """
    SQLAlchemy model representing exclusions under a policy (from exclusions sheet).
    """
    __tablename__ = "exclusions"

    exclusion_id = Column(String(64), primary_key=True, index=True)
    policy_id = Column(String(64), ForeignKey("policies.policy_id"), nullable=False, index=True)
    exclusion_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    # Relationships
    policy = relationship("Policy", back_populates="exclusions")

    def __repr__(self):
        return f"<Exclusion(exclusion_id='{self.exclusion_id}', name='{self.exclusion_name}')>"


class Claim(Base):
    """
    SQLAlchemy model representing a persistent FNOL claim record.
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

    def __repr__(self):
        return f"<Claim(claim_id='{self.claim_id}', number='{self.claim_number}', status='{self.claim_status}')>"


class RenewalRequest(Base):
    """
    SQLAlchemy model representing a customer's policy renewal approval request.
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

    def __repr__(self):
        return f"<RenewalRequest(renewal_id='{self.renewal_id}', policy='{self.policy_number}', status='{self.status}')>"


class Notification(Base):
    """
    SQLAlchemy model representing in-app workflow notifications for Customers and Agents.
    """
    __tablename__ = "notifications"

    notification_id = Column(String(64), primary_key=True, index=True)
    recipient_role = Column(String(50), nullable=False, index=True)  # 'Agent', 'Customer'
    recipient_id = Column(String(64), nullable=True, index=True)      # customer_id or user_id or None
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

    def __repr__(self):
        return f"<Notification(notification_id='{self.notification_id}', role='{self.recipient_role}', title='{self.title}')>"

