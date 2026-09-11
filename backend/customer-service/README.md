# InsureAssist Customer Microservice (PostgreSQL Integrated)

The **Customer Service** is a dedicated backend microservice for the **InsureAssist** platform. It encapsulates all core business capabilities required by the **Customer** role (Policyholder) with persistent PostgreSQL storage and real insurance dataset modeling.

---

## 1. Responsibilities

1. **Customer Profile**: Personal contact info and policyholder summary from PostgreSQL.
2. **My Policies**: Schedule of active, expiring, and historical insurance policies linked to the customer.
3. **Coverage & Exclusions**: Policy terms, deductibles, limits, and exclusions.
4. **Report a Claim / FNOL**: First Notice of Loss digital intake with persistent claim storage.
5. **My Claims**: Real-time status, tracking, and details for customer-submitted claims.

---

## 2. Directory Structure

```
customer-service/
├── app/
│   ├── core/
│   │   ├── auth.py                 # JWT Bearer token authentication & customer resolution dependency
│   │   └── config.py               # Environment configuration, database URL & CORS settings
│   ├── db/
│   │   ├── database.py             # SQLAlchemy engine, session maker (SessionLocal), Base, get_db
│   │   └── seed.py                 # Excel workbook dataset importer (pc_insurance_large_dataset.xlsx)
│   ├── models/
│   │   └── customer.py             # SQLAlchemy ORM models (User, Customer, Policy, Coverage, Exclusion, Claim)
│   ├── routes/
│   │   └── customer.py             # Customer REST API route handlers
│   ├── schemas/
│   │   └── customer.py             # Pydantic validation & response schemas
│   ├── services/
│   │   └── customer_service.py     # Business logic layer with PostgreSQL operations
│   └── main.py                     # FastAPI application entrypoint, lifespan seeder & middleware
├── Dockerfile                      # Container definition for containerized deployment
├── requirements.txt                # Python package dependencies
└── README.md                       # Microservice documentation
```

---

## 3. Database Schema & Architecture

Customer Service uses PostgreSQL via SQLAlchemy ORM with the following relational models:

1. **`users`**: Account identity synced from `users` sheet (`user_id`, `name`, `email`, `password_hash`, `role`, `created_at`).
2. **`customers`**: Insured profile (`customer_id`, `user_id` FK -> `users.user_id`, `name`, `email`, `mobile`, `address`).
3. **`policies`**: Insurance contracts (`policy_id`, `customer_id` FK -> `customers.customer_id`, `policy_number`, `policy_type`, `status`, `start_date`, `end_date`, `premium`, `created_at`).
4. **`coverages`**: Line items per policy (`coverage_id`, `policy_id` FK -> `policies.policy_id`, `coverage_name`, `coverage_limit`, `deductible`, `status`).
5. **`exclusions`**: Exclusions per policy (`exclusion_id`, `policy_id` FK -> `policies.policy_id`, `exclusion_name`, `description`).
6. **`claims`**: Persistent FNOL claims table (`claim_id`, `customer_id` FK, `policy_id` FK, `claim_number`, `incident_date`, `incident_type`, `incident_description`, `location`, `claim_status`, `claim_amount`, `created_at`, `updated_at`).

---

## 4. How Customer Identity is Resolved from JWT

1. The client sends `Authorization: Bearer <token>` received from Auth Service.
2. `app.core.auth.get_current_customer` validates the JWT token using the shared `JWT_SECRET_KEY` and algorithm `HS256`.
3. Validates that the role is `Customer`.
4. Extracts `sub` (User ID) and `email` from the token.
5. Queries the PostgreSQL `customers` table matching `user_id == sub` or `customer_id == sub` (with fallback to `email`).
6. Scopes all subsequent database queries strictly to `current_customer.customer_id`, preventing cross-customer data leakage.

---

## 5. How to Run and Seed Locally

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Seed the Database (Optional - happens automatically on startup)
```bash
python -m app.db.seed
```

### Step 3: Run the Service
```bash
python -m app.main
```
Or:
```bash
uvicorn app.main:app --reload --port 8002
```

---

## 6. Interactive API Documentation

- **Swagger UI**: [http://127.0.0.1:8002/docs](http://127.0.0.1:8002/docs)
- **ReDoc**: [http://127.0.0.1:8002/redoc](http://127.0.0.1:8002/redoc)
