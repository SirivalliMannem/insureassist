from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes.auth import router as auth_router
from app.schemas.auth import HealthResponse

# Initialize FastAPI application with Swagger metadata
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="InsureAssist Central Authentication Microservice. Handles user authentication, JWT issuance, password hashing, and role-based permissions (Customer, Agent, Underwriter, Admin).",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure Cross-Origin Resource Sharing (CORS) for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local frontend dev servers, file://, and localhost origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(auth_router)


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
        service="auth-service",
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
    Root endpoint directing developers to Swagger documentation.
    """
    return {
        "service": settings.APP_NAME,
        "status": "online",
        "documentation": "/docs",
        "health": "/health",
        "endpoints": {
            "login": "POST /auth/login",
            "current_user": "GET /auth/me",
            "demo_accounts": "GET /auth/demo-users"
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
