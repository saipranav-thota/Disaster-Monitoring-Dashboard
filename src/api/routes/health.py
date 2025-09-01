"""
Health check endpoints.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from src.db.database import get_db
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["health"])

@router.get("/health")
async def health_check():
    """
    Basic health check endpoint.
    """
    return {
        "status": "healthy",
        "service": "disaster-monitoring-api"
    }

@router.get("/health/db")
async def database_health_check(db: Session = Depends(get_db)):
    """
    Database health check endpoint.
    """
    try:
        # Simple query to test database connectivity
        result = db.execute(text("SELECT 1")).scalar()
        if result == 1:
            return {
                "status": "healthy",
                "database": "connected"
            }
        else:
            return {
                "status": "unhealthy",
                "database": "connection_failed"
            }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {
            "status": "unhealthy",
            "database": "error",
            "error": str(e)
        }
