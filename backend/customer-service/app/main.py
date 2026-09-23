import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import engine, Base
from app.db.seed import seed_database
from app.routes.customer import router as customer_router, agent_router, notification_router
from app.schemas.customer import HealthResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("customer_service")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    Initializes PostgreSQL tables and automatically seeds database if needed.
    """
    logger.info("Initializing InsureAssist Customer Service database tables...")
    Base.metadata.create_all(bind=engine)
    try:
        seed_database(force_reseed=False)
    except Exception as e:
        logger.error(f"Seeder notice: {e}")
    yield
    logger.info("InsureAssist Customer Service shutdown complete.")


# Initialize FastAPI application with Swagger metadata
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="InsureAssist Customer Microservice. Handles Customer Profile, Policy Portfolio, Coverage, Claims/FNOL Management, Renewal Approvals, and Notifications with PostgreSQL persistence.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Configure Cross-Origin Resource Sharing (CORS) for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "Content-Type", "Content-Length"],
)

# Register route modules
app.include_router(customer_router)
app.include_router(agent_router)
app.include_router(notification_router)



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
        service="customer-service",
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
        "service": "InsureAssist Customer Service",
        "status": "online",
        "documentation": "/docs",
        "health": "/health",
        "endpoints": {
            "customer_profile": "GET /customer/profile",
            "customer_policies": "GET /customer/policies",
            "customer_claims": "GET /customer/claims",
            "submit_fnol": "POST /customer/claims/fnol"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
