import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.db.database import engine, Base
from app.api.agent import router as agent_router
from app.schemas.agent import HealthResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agent_service")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    Verifies PostgreSQL database connectivity, ensures tables exist,
    and initializes development agent assignments for verified records.
    """
    logger.info("Initializing InsureAssist Agent Service...")
    try:
        Base.metadata.create_all(bind=engine)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            
            # Development seed: Assign verified customers to Agent Aarav Nair (1321)
            seed_sql = text("""
                INSERT INTO customer_agent_assignments (assignment_id, agent_id, customer_id, status, assigned_at)
                SELECT 'ASG-1321-' || c.customer_id, '1321', c.customer_id, 'Active', CURRENT_TIMESTAMP
                FROM customers c
                WHERE c.customer_id IN ('50001', '50002', '50003', '50004', '50005', '50254')
                AND EXISTS (SELECT 1 FROM users WHERE user_id = '1321' AND role = 'Agent')
                ON CONFLICT (assignment_id) DO NOTHING;
            """)
            conn.execute(seed_sql)
            conn.commit()
        logger.info("PostgreSQL database connection and customer_agent_assignments initialized.")
    except Exception as e:
        logger.warning(f"Database initialization warning at startup: {e}")
    yield
    logger.info("InsureAssist Agent Service shutdown complete.")


# Initialize FastAPI application with Swagger metadata
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="InsureAssist Agent Microservice. Handles Agent Profile, Portfolio Management, Dashboard Metrics, and Customer/Policy Access with PostgreSQL persistence.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(agent_router)


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["System"],
    summary="Service Health Check",
    description="Returns service status, name, and version to verify microservice health."
)
async def health_check():
    """
    Health check endpoint for container orchestrators and monitoring tools.
    """
    return HealthResponse(
        status="ok",
        service="agent-service",
        version="1.0.0"
    )


@app.get(
    "/",
    tags=["System"],
    summary="Service Root",
    description="Quick service welcome and link to interactive API documentation."
)
async def root():
    """
    Root endpoint displaying service status and documentation link.
    """
    return {
        "service": "InsureAssist Agent Service",
        "status": "online",
        "documentation": "/docs",
        "health": "/health",
        "endpoints": {
            "agent_profile": "GET /agent/me",
            "agent_dashboard": "GET /agent/dashboard",
            "agent_customers": "GET /agent/customers",
            "agent_policies": "GET /agent/policies"
        }
    }
