import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes.customer_ai import router as customer_ai_router
from app.routes.agent_ai import router as agent_ai_router
from app.routes.underwriter_ai import router as underwriter_ai_router
from app.routes.admin_ai import router as admin_ai_router
from app.schemas.customer_ai import HealthResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ai_service")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Logs startup configuration and cleanly handles shutdown.
    """
    logger.info(f"Starting {settings.APP_NAME} on port {settings.PORT}...")
    logger.info(f"LLM Configuration: URL={settings.GROQ_API_URL}, Model={settings.GROQ_MODEL}, MockMode={settings.is_mock_enabled()}")
    yield
    logger.info(f"{settings.APP_NAME} shutdown complete.")


# Initialize FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="InsureAssist AI Microservice. Provides intelligent policy assistance, terminology explanations, and customer guidance.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list if "*" not in settings.cors_origins_list else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(customer_ai_router)
app.include_router(agent_ai_router)
app.include_router(underwriter_ai_router)
app.include_router(admin_ai_router)


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["System"],
    summary="Service Health Check",
    description="Returns health status and service metadata without triggering external LLM API calls."
)
async def health_check():
    """
    Health check endpoint for container orchestrators and monitoring tools.
    """
    return HealthResponse(
        status="healthy",
        service="ai-service",
        version="1.0.0"
    )


@app.get(
    "/",
    tags=["System"],
    summary="Service Root",
    description="Root information and documentation links."
)
async def root():
    """
    Root endpoint returning service identity and available endpoints.
    """
    return {
        "service": settings.APP_NAME,
        "status": "online",
        "documentation": "/docs",
        "health": "/health",
        "endpoints": {
            "customer_chat": "POST /api/v1/ai/customer/chat",
            "health": "GET /health"
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
