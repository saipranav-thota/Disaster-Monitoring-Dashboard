"""
FastAPI application entry point.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from src.db.database import create_tables
from .routes import wildfire, health
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Disaster Monitoring API",
    description="API for disaster monitoring and wildfire data",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(wildfire.router)

# Add backward compatibility routes (without /api/v1 prefix)
@app.get("/wildfires")
async def legacy_wildfires():
    """Legacy endpoint - redirects to new API version."""
    return {
        "message": "This endpoint has moved",
        "new_url": "/api/v1/wildfires",
        "note": "Please update your client to use /api/v1/wildfires"
    }

@app.get("/health")
async def legacy_health():
    """Legacy health endpoint - redirects to new API version."""
    return {
        "message": "This endpoint has moved", 
        "new_url": "/api/v1/health",
        "note": "Please update your client to use /api/v1/health"
    }

@app.on_event("startup")
async def startup_event():
    """
    Initialize database tables on startup.
    """
    try:
        create_tables()
        logger.info("Database tables created successfully")
    except SQLAlchemyError as e:
        logger.error(f"Failed to create database tables: {e}")
        raise

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request, exc):
    """
    Global exception handler for SQLAlchemy errors.
    """
    logger.error(f"Database error: {exc}")
    return HTTPException(status_code=500, detail="Database error occurred")

@app.get("/")
async def root():
    """
    Root endpoint.
    """
    return {
        "message": "Disaster Monitoring API",
        "version": "1.0.0",
        "docs": "/docs"
    }
