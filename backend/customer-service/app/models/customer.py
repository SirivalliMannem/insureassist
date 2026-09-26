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
    applications = relationship("Application", back_populates="customer", cascade="all, delete-orphan")
    chat_conversations = relationship("ChatConversation", back_populates="customer", cascade="all, delete-orphan")

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
    claim_status = Column(String(50), default="Pending Review", nullable=False)
    claim_amount = Column(Numeric(12, 2), nullable=True)
    approved_amount = Column(Numeric(12, 2), nullable=True)
    rejection_reason = Column(Text, nullable=True)
    decision_notes = Column(Text, nullable=True)
    requested_info = Column(Text, nullable=True)
    decision_date = Column(DateTime, nullable=True)
    decision_by = Column(String(100), nullable=True)
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
    claim_id = Column(String(64), nullable=True, index=True)
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


class Application(Base):
    """
    SQLAlchemy model representing a customer's submitted insurance policy application.
    """
    __tablename__ = "applications"

    application_id = Column(String(64), primary_key=True, index=True)
    customer_id = Column(String(64), ForeignKey("customers.customer_id"), nullable=False, index=True)
    policy_type = Column(String(100), nullable=False)
    product_name = Column(String(255), nullable=False)
    coverage_tier = Column(String(50), default="Standard", nullable=False)
    coverage_limit = Column(Numeric(12, 2), nullable=True)
    deductible = Column(Numeric(12, 2), nullable=True)
    duration_months = Column(Integer, default=12, nullable=False)
    estimated_premium = Column(Numeric(12, 2), nullable=True)
    start_date = Column(Date, nullable=True)
    status = Column(String(50), default="Submitted", nullable=False, index=True)
    applicant_info = Column(Text, nullable=True)          # JSON-encoded contact/profile details
    policy_specific_data = Column(Text, nullable=True)    # JSON-encoded policy-specific responses
    documents = Column(Text, nullable=True)               # JSON-encoded list of uploaded document metadata
    policy_id = Column(String(64), nullable=True)         # Linked Pending Policy in policies table
    forwarded_by_agent_id = Column(String(64), nullable=True) # Agent who forwarded application
    forwarded_at = Column(DateTime, nullable=True)            # Forwarded timestamp
    agent_notes = Column(Text, nullable=True)                 # Agent review or more info notes
    verification_status = Column(String(50), default="Pending Verification", nullable=True) # Verification status
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    customer = relationship("Customer", back_populates="applications")

    def __repr__(self):
        return f"<Application(application_id='{self.application_id}', policy_type='{self.policy_type}', status='{self.status}')>"


class CustomerAgentAssignment(Base):
    """
    SQLAlchemy model representing static Customer to Agent assignments in PostgreSQL.
    """
    __tablename__ = "customer_agent_assignments"

    assignment_id = Column(String(64), primary_key=True, index=True)
    agent_id = Column(String(64), ForeignKey("users.user_id"), nullable=False, index=True)
    customer_id = Column(String(64), ForeignKey("customers.customer_id"), nullable=False, index=True)
    status = Column(String(50), default="Active", nullable=False)
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    agent = relationship("User", foreign_keys=[agent_id])
    customer = relationship("Customer", foreign_keys=[customer_id])

    def __repr__(self):
        return f"<CustomerAgentAssignment(id='{self.assignment_id}', agent='{self.agent_id}', customer='{self.customer_id}', status='{self.status}')>"


class ChatConversation(Base):
    """
    SQLAlchemy model representing a persistent Customer AI conversation session.
    """
    __tablename__ = "chat_conversations"

    conversation_id = Column(String(64), primary_key=True, index=True)
    customer_id = Column(String(64), ForeignKey("customers.customer_id"), nullable=False, index=True)
    title = Column(String(255), nullable=False, default="New Conversation")
    role = Column(String(50), default="customer", nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False, index=True)

    # Relationships
    customer = relationship("Customer", back_populates="chat_conversations")
    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan", order_by="ChatMessage.created_at.asc()")

    def __repr__(self):
        return f"<ChatConversation(id='{self.conversation_id}', customer_id='{self.customer_id}', title='{self.title}')>"


class ChatMessage(Base):
    """
    SQLAlchemy model representing individual messages within a persistent chat conversation.
    """
    __tablename__ = "chat_messages"

    message_id = Column(String(64), primary_key=True, index=True)
    conversation_id = Column(String(64), ForeignKey("chat_conversations.conversation_id"), nullable=False, index=True)
    sender_type = Column(String(20), nullable=False)  # 'user' or 'bot'
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)

    # Relationships
    conversation = relationship("ChatConversation", back_populates="messages")

    def __repr__(self):
        return f"<ChatMessage(id='{self.message_id}', conv_id='{self.conversation_id}', sender='{self.sender_type}')>"


