import os
import datetime
import logging
from decimal import Decimal
import openpyxl
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.database import engine, SessionLocal, Base
from app.models.customer import User, Customer, Policy, Coverage, Exclusion, Claim

logger = logging.getLogger(__name__)


def parse_date(value):
    """Safely parse Excel cell value into Python date object."""
    if not value:
        return None
    if isinstance(value, datetime.datetime):
        return value.date()
    if isinstance(value, datetime.date):
        return value
    if isinstance(value, str):
        val_str = value.strip()
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y", "%Y/%m/%d"):
            try:
                return datetime.datetime.strptime(val_str, fmt).date()
            except ValueError:
                continue
    return None


def parse_datetime(value):
    """Safely parse Excel cell value into Python datetime object."""
    if not value:
        return datetime.datetime.utcnow()
    if isinstance(value, datetime.datetime):
        return value
    if isinstance(value, datetime.date):
        return datetime.datetime.combine(value, datetime.time.min)
    if isinstance(value, str):
        val_str = value.strip()
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y", "%Y/%m/%d"):
            try:
                return datetime.datetime.strptime(val_str, fmt)
            except ValueError:
                continue
    return datetime.datetime.utcnow()


def parse_numeric(value, default=0.0):
    """Safely parse numerical/currency/limit values into Decimal/Float."""
    if value is None:
        return default
    if isinstance(value, (int, float, Decimal)):
        return float(value)
    if isinstance(value, str):
        cleaned = value.replace("$", "").replace(",", "").replace("/yr", "").replace("/mo", "").strip()
        try:
            return float(cleaned)
        except ValueError:
            return default
    return default


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


def _hash_default_password():
    """Hash Test@123 with bcrypt when passlib is installed."""
    try:
        from passlib.context import CryptContext
        return CryptContext(schemes=["bcrypt"], deprecated="auto").hash(DEFAULT_PASSWORD)
    except Exception:
        logger.warning("passlib is not available. Default users will be inserted without a password hash.")
        return None


def ensure_default_users(db: Session) -> None:
    """
    Insert the four demo accounts into users when they are missing.
    Runs on every startup, including when the Excel import is skipped.
    """
    password_hash = _hash_default_password()
    now = datetime.datetime.utcnow()

    for spec in DEFAULT_USERS:
        email = spec["email"].strip().lower()
        existing = db.query(User).filter(func.lower(User.email) == email).first()
        if existing:
            if password_hash and not existing.password_hash:
                existing.password_hash = password_hash
            continue

        if db.query(User).filter(User.user_id == spec["user_id"]).first():
            logger.warning(
                "Skipping default user %s because user_id %s is already used.",
                email,
                spec["user_id"],
            )
            continue

        try:
            with db.begin_nested():
                db.add(User(
                    user_id=spec["user_id"],
                    name=spec["name"],
                    email=spec["email"],
                    password_hash=password_hash,
                    role=spec["role"],
                    created_at=now,
                ))
                db.flush()
        except IntegrityError:
            logger.info("Default user %s already exists. Skipping.", email)


def seed_database(excel_path: str = None, force_reseed: bool = False):
    """
    Imports real dataset from pc_insurance_large_dataset.xlsx into PostgreSQL.
    Creates tables if they don't exist.
    """
    # 1. Create tables
    Base.metadata.create_all(bind=engine)

    if not excel_path:
        excel_path = settings.EXCEL_DATASET_PATH

    # Check alternative paths if excel_path does not exist
    if not os.path.exists(excel_path):
        alt_paths = [
            r"C:\Users\i-sirivalli.mannem\Downloads\pc_insurance_large_dataset.xlsx",
            r"C:\Users\i-sirivalli.mannem\OneDrive - Feuji Software Solutions Pvt Ltd\pc_insurance_large_dataset.xlsx",
            os.path.join(os.getcwd(), "pc_insurance_large_dataset.xlsx"),
            os.path.join(os.getcwd(), "..", "pc_insurance_large_dataset.xlsx"),
            os.path.join(os.getcwd(), "..", "..", "pc_insurance_large_dataset.xlsx"),
        ]
        for p in alt_paths:
            if os.path.exists(p):
                excel_path = p
                break

    db: Session = SessionLocal()
    try:
        ensure_default_users(db)
        db.commit()
        logger.info("Default demo users are present in the users table.")

        cust_count = db.query(Customer).count()
        if cust_count > 0 and not force_reseed:
            logger.info(f"Database already seeded with {cust_count} customers. Skipping Excel import.")
            return

        if not os.path.exists(excel_path):
            logger.error(f"Excel dataset not found at {excel_path}!")
            return

        logger.info(f"Loading Excel workbook from: {excel_path}")
        wb = openpyxl.load_workbook(excel_path, data_only=True)

        # -------------------------------------------------------------
        # 1. Import Users Sheet
        # -------------------------------------------------------------
        if "users" in wb.sheetnames:
            ws_users = wb["users"]
            rows = list(ws_users.iter_rows(values_only=True))
            header = [str(col).strip().lower() if col is not None else "" for col in rows[0]]
            col_idx = {name: i for i, name in enumerate(header)}
            logger.info(f"Importing users: {len(rows)-1} rows...")

            for r in rows[1:]:
                if not r or not any(r):
                    continue
                user_id_val = str(r[col_idx["user_id"]]).strip() if "user_id" in col_idx and r[col_idx["user_id"]] is not None else None
                if not user_id_val:
                    continue
                name_val = str(r[col_idx.get("name", 1)] or "").strip()
                email_val = str(r[col_idx.get("email", 2)] or "").strip()
                pwd_hash_val = str(r[col_idx.get("password_hash", 3)] or "").strip()
                role_val = str(r[col_idx.get("role", 4)] or "Customer").strip()
                created_at_val = parse_datetime(r[col_idx.get("created_at", 5)]) if "created_at" in col_idx else datetime.datetime.utcnow()

                existing_user = db.query(User).filter(User.user_id == user_id_val).first()
                if not existing_user:
                    db.add(User(
                        user_id=user_id_val,
                        name=name_val,
                        email=email_val,
                        password_hash=pwd_hash_val,
                        role=role_val,
                        created_at=created_at_val
                    ))
            db.commit()

        # -------------------------------------------------------------
        # 2. Import Customers Sheet
        # -------------------------------------------------------------
        if "customers" in wb.sheetnames:
            ws_cust = wb["customers"]
            rows = list(ws_cust.iter_rows(values_only=True))
            header = [str(col).strip().lower() if col is not None else "" for col in rows[0]]
            col_idx = {name: i for i, name in enumerate(header)}
            logger.info(f"Importing customers: {len(rows)-1} rows...")

            for r in rows[1:]:
                if not r or not any(r):
                    continue
                cust_id_val = str(r[col_idx["customer_id"]]).strip() if "customer_id" in col_idx and r[col_idx["customer_id"]] is not None else None
                if not cust_id_val:
                    continue
                user_id_val = str(r[col_idx["user_id"]]).strip() if "user_id" in col_idx and r[col_idx["user_id"]] is not None else None
                name_val = str(r[col_idx.get("name", 2)] or "").strip()
                email_val = str(r[col_idx.get("email", 3)] or "").strip()
                mobile_val = str(r[col_idx.get("mobile", 4)] or "").strip()

                # Ensure user exists in users table to satisfy foreign key if user_id present
                if user_id_val:
                    user_obj = db.query(User).filter(User.user_id == user_id_val).first()
                    if not user_obj:
                        user_obj = User(
                            user_id=user_id_val,
                            name=name_val,
                            email=email_val,
                            role="Customer",
                            created_at=datetime.datetime.utcnow()
                        )
                        db.add(user_obj)
                        db.flush()

                existing_cust = db.query(Customer).filter(Customer.customer_id == cust_id_val).first()
                if not existing_cust:
                    db.add(Customer(
                        customer_id=cust_id_val,
                        user_id=user_id_val,
                        name=name_val,
                        email=email_val,
                        mobile=mobile_val,
                        address=f"124 Grand Avenue, Suite {str(cust_id_val)[-3:]}, Chicago, IL 60611"
                    ))
            db.commit()

        # -------------------------------------------------------------
        # 3. Import Policies Sheet
        # -------------------------------------------------------------
        if "policies" in wb.sheetnames:
            ws_pol = wb["policies"]
            rows = list(ws_pol.iter_rows(values_only=True))
            header = [str(col).strip().lower() if col is not None else "" for col in rows[0]]
            col_idx = {name: i for i, name in enumerate(header)}
            logger.info(f"Importing policies: {len(rows)-1} rows...")

            for r in rows[1:]:
                if not r or not any(r):
                    continue
                pol_id_val = str(r[col_idx["policy_id"]]).strip() if "policy_id" in col_idx and r[col_idx["policy_id"]] is not None else None
                if not pol_id_val:
                    continue
                cust_id_val = str(r[col_idx.get("customer_id", 1)]).strip()
                pol_num_val = str(r[col_idx.get("policy_number", 2)] or f"POL-{pol_id_val}").strip()
                pol_type_val = str(r[col_idx.get("policy_type", 3)] or "General Property Coverage").strip()
                status_val = str(r[col_idx.get("status", 4)] or "Active").strip()
                start_date_val = parse_date(r[col_idx.get("start_date", 5)]) if "start_date" in col_idx else None
                end_date_val = parse_date(r[col_idx.get("end_date", 6)]) if "end_date" in col_idx else None
                premium_val = parse_numeric(r[col_idx.get("premium", 7)]) if "premium" in col_idx else 0.0
                created_at_val = parse_datetime(r[col_idx.get("created_at", 8)]) if "created_at" in col_idx else datetime.datetime.utcnow()

                # Verify customer exists
                cust_obj = db.query(Customer).filter(Customer.customer_id == cust_id_val).first()
                if not cust_obj:
                    continue

                existing_pol = db.query(Policy).filter(Policy.policy_id == pol_id_val).first()
                if not existing_pol:
                    db.add(Policy(
                        policy_id=pol_id_val,
                        customer_id=cust_id_val,
                        policy_number=pol_num_val,
                        policy_type=pol_type_val,
                        status=status_val,
                        start_date=start_date_val,
                        end_date=end_date_val,
                        premium=premium_val,
                        created_at=created_at_val
                    ))
            db.commit()

        # -------------------------------------------------------------
        # 4. Import Coverages Sheet
        # -------------------------------------------------------------
        if "coverages" in wb.sheetnames:
            ws_cov = wb["coverages"]
            rows = list(ws_cov.iter_rows(values_only=True))
            header = [str(col).strip().lower() if col is not None else "" for col in rows[0]]
            col_idx = {name: i for i, name in enumerate(header)}
            logger.info(f"Importing coverages: {len(rows)-1} rows...")

            for r in rows[1:]:
                if not r or not any(r):
                    continue
                cov_id_val = str(r[col_idx["coverage_id"]]).strip() if "coverage_id" in col_idx and r[col_idx["coverage_id"]] is not None else None
                if not cov_id_val:
                    continue
                pol_id_val = str(r[col_idx.get("policy_id", 1)]).strip()
                cov_name_val = str(r[col_idx.get("coverage_name", 2)] or "").strip()
                cov_limit_val = parse_numeric(r[col_idx.get("coverage_limit", 3)]) if "coverage_limit" in col_idx else None
                deductible_val = parse_numeric(r[col_idx.get("deductible", 4)]) if "deductible" in col_idx else None
                status_val = str(r[col_idx.get("status", 5)] or "Active").strip()

                # Verify policy exists
                pol_obj = db.query(Policy).filter(Policy.policy_id == pol_id_val).first()
                if not pol_obj:
                    continue

                existing_cov = db.query(Coverage).filter(Coverage.coverage_id == cov_id_val).first()
                if not existing_cov:
                    db.add(Coverage(
                        coverage_id=cov_id_val,
                        policy_id=pol_id_val,
                        coverage_name=cov_name_val,
                        coverage_limit=cov_limit_val,
                        deductible=deductible_val,
                        status=status_val
                    ))
            db.commit()

        # -------------------------------------------------------------
        # 5. Import Exclusions Sheet
        # -------------------------------------------------------------
        if "exclusions" in wb.sheetnames:
            ws_ex = wb["exclusions"]
            rows = list(ws_ex.iter_rows(values_only=True))
            header = [str(col).strip().lower() if col is not None else "" for col in rows[0]]
            col_idx = {name: i for i, name in enumerate(header)}
            logger.info(f"Importing exclusions: {len(rows)-1} rows...")

            for r in rows[1:]:
                if not r or not any(r):
                    continue
                ex_id_val = str(r[col_idx["exclusion_id"]]).strip() if "exclusion_id" in col_idx and r[col_idx["exclusion_id"]] is not None else None
                if not ex_id_val:
                    continue
                pol_id_val = str(r[col_idx.get("policy_id", 1)]).strip()
                ex_name_val = str(r[col_idx.get("exclusion_name", 2)] or "").strip()
                desc_val = str(r[col_idx.get("description", 3)] or "").strip()

                # Verify policy exists
                pol_obj = db.query(Policy).filter(Policy.policy_id == pol_id_val).first()
                if not pol_obj:
                    continue

                existing_ex = db.query(Exclusion).filter(Exclusion.exclusion_id == ex_id_val).first()
                if not existing_ex:
                    db.add(Exclusion(
                        exclusion_id=ex_id_val,
                        policy_id=pol_id_val,
                        exclusion_name=ex_name_val,
                        description=desc_val
                    ))
            db.commit()

        # -------------------------------------------------------------
        # 6. Seed Sarah Mitchell Account (USR-CUST-001) for standard test login
        # -------------------------------------------------------------
        sarah_user = db.query(User).filter(User.user_id == "USR-CUST-001").first()
        if not sarah_user:
            sarah_user = User(
                user_id="USR-CUST-001",
                name="Sarah Mitchell",
                email="sarah.mitchell@email.com",
                role="Customer",
                created_at=datetime.datetime(2024, 1, 1, 0, 0, 0)
            )
            db.add(sarah_user)
            db.flush()

        sarah_cust = db.query(Customer).filter(Customer.customer_id == "CUST-001").first()
        if not sarah_cust:
            sarah_cust = Customer(
                customer_id="CUST-001",
                user_id="USR-CUST-001",
                name="Sarah Mitchell",
                email="sarah.mitchell@email.com",
                mobile="+1 (555) 234-5678",
                address="742 Evergreen Terrace, Springfield, OR"
            )
            db.add(sarah_cust)
            db.flush()

            # Add Sarah's standard policies
            p1 = Policy(
                policy_id="POL-HOM-2024-001",
                customer_id="CUST-001",
                policy_number="HOM-883920",
                policy_type="Homeowners Premier Protection",
                status="Active",
                start_date=datetime.date(2024, 1, 15),
                end_date=datetime.date(2025, 1, 15),
                premium=1450.00
            )
            p2 = Policy(
                policy_id="POL-AUT-2024-002",
                customer_id="CUST-001",
                policy_number="AUT-449120",
                policy_type="Comprehensive Auto Coverage",
                status="Active",
                start_date=datetime.date(2024, 3, 1),
                end_date=datetime.date(2025, 3, 1),
                premium=1120.00
            )
            p3 = Policy(
                policy_id="POL-UMB-2024-003",
                customer_id="CUST-001",
                policy_number="UMB-993021",
                policy_type="Personal Umbrella Liability",
                status="Active",
                start_date=datetime.date(2024, 4, 10),
                end_date=datetime.date(2025, 4, 10),
                premium=380.00
            )
            db.add_all([p1, p2, p3])
            db.flush()

            # Add Coverages
            db.add_all([
                Coverage(coverage_id="COV-001-1", policy_id="POL-HOM-2024-001", coverage_name="Dwelling Protection", coverage_limit=450000, deductible=1000, status="Active"),
                Coverage(coverage_id="COV-001-2", policy_id="POL-HOM-2024-001", coverage_name="Personal Liability", coverage_limit=300000, deductible=1000, status="Active"),
                Coverage(coverage_id="COV-002-1", policy_id="POL-AUT-2024-002", coverage_name="Bodily Injury Liability", coverage_limit=250000, deductible=500, status="Active"),
                Coverage(coverage_id="COV-003-1", policy_id="POL-UMB-2024-003", coverage_name="Excess Liability", coverage_limit=1000000, deductible=0, status="Active"),
            ])

            # Add Exclusions
            db.add_all([
                Exclusion(exclusion_id="EXC-001-1", policy_id="POL-HOM-2024-001", exclusion_name="Flood / Rising Water", description="Damage caused by flood or surface water is excluded."),
                Exclusion(exclusion_id="EXC-001-2", policy_id="POL-HOM-2024-001", exclusion_name="Earthquake", description="Ground movement and earthquake tremors are excluded."),
                Exclusion(exclusion_id="EXC-002-1", policy_id="POL-AUT-2024-002", exclusion_name="Commercial Delivery", description="Use of vehicle for commercial parcel delivery is excluded."),
            ])

            # Add initial Claim
            db.add(Claim(
                claim_id="CLM-2024-8831",
                customer_id="CUST-001",
                policy_id="POL-HOM-2024-001",
                claim_number="CLM-8831",
                incident_date=datetime.date(2024, 8, 28),
                incident_type="Water Damage",
                incident_description="Kitchen supply line burst causing floor and drywall water damage in kitchen and dining area.",
                location="Kitchen / Dining Area",
                claim_status="Under Review",
                claim_amount=4850.00,
                created_at=datetime.datetime(2024, 8, 28, 14, 30, 0),
                updated_at=datetime.datetime(2024, 8, 28, 14, 30, 0)
            ))
            db.commit()

        logger.info("Database seeding completed successfully.")

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}", exc_info=True)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    seed_database(force_reseed=True)
