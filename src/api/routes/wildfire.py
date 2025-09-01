"""
Wildfire endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from src.db.database import get_db
from src.db import queries
from typing import Optional
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["wildfires"])

@router.get("/wildfires")
async def get_wildfires(
    limit: Optional[int] = Query(None, ge=1, le=1000, description="Limit number of results"),
    db: Session = Depends(get_db)
):
    """
    Get wildfire data from the last 3 days.
    
    Args:
        limit: Optional limit for number of records (1-1000)
        db: Database session
        
    Returns:
        List of wildfire records
    """
    try:
        wildfires = queries.get_wildfires(db, limit=limit)
        return {
            "status": "success",
            "count": len(wildfires),
            "data": wildfires
        }
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_wildfires: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        logger.error(f"Unexpected error in get_wildfires: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/wildfires/by-confidence")
async def get_wildfires_by_confidence(
    min_confidence: float = Query(0.5, ge=0.0, le=1.0, description="Minimum confidence level"),
    db: Session = Depends(get_db)
):
    """
    Get wildfire data filtered by confidence level.
    
    Args:
        min_confidence: Minimum confidence threshold (0.0-1.0)
        db: Database session
        
    Returns:
        List of wildfire records above confidence threshold
    """
    try:
        wildfires = queries.get_wildfires_by_confidence(db, min_confidence=min_confidence)
        return {
            "status": "success",
            "count": len(wildfires),
            "min_confidence": min_confidence,
            "data": wildfires
        }
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_wildfires_by_confidence: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        logger.error(f"Unexpected error in get_wildfires_by_confidence: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/wildfires/stats")
async def get_wildfire_statistics(db: Session = Depends(get_db)):
    """
    Get aggregated wildfire statistics.
    
    Args:
        db: Database session
        
    Returns:
        Dictionary with wildfire statistics
    """
    try:
        stats = queries.get_wildfire_stats(db)
        return {
            "status": "success",
            "data": stats
        }
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_wildfire_statistics: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        logger.error(f"Unexpected error in get_wildfire_statistics: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/wildfires/h3-format")
async def get_wildfires_h3_format(
    limit: Optional[int] = Query(100, ge=1, le=1000, description="Limit number of results"),
    db: Session = Depends(get_db)
):
    """
    Get wildfire data in H3 format compatible with frontend mock data structure.
    Returns data with h3Index, frpIntensity, and timestamp fields.
    
    Args:
        limit: Optional limit for number of records (1-1000)
        db: Database session
        
    Returns:
        List of wildfire records in H3 format
    """
    try:
        wildfires = queries.get_wildfires(db, limit=limit)
        
        # Transform data to match frontend mock format
        h3_formatted_data = []
        for fire in wildfires:
            h3_formatted_data.append({
                "h3Index": fire.h3_cell,
                "frpIntensity": fire.frp if fire.frp is not None else 0.0,
                "timestamp": fire.time_bucket.isoformat() + "Z" if fire.time_bucket else None
            })
        
        return h3_formatted_data
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_wildfires_h3_format: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        logger.error(f"Unexpected error in get_wildfires_h3_format: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/wildfires/mock")
async def get_mock_wildfire_data():
    """
    Get mock wildfire data for testing frontend integration.
    Returns the exact mock data structure used in frontend development.
    
    Returns:
        List of mock wildfire records in H3 format
    """
    mock_fire_database = [
        {
            "h3Index": "8a2a1072b59ffff",
            "frpIntensity": 85.2,
            "timestamp": "2024-01-15T14:30:00Z"
        },
        {
            "h3Index": "8a2a1072b5bffff",
            "frpIntensity": 142.7,
            "timestamp": "2024-01-15T14:25:00Z"
        },
        {
            "h3Index": "8a2a1072b5dffff",
            "frpIntensity": 67.3,
            "timestamp": "2024-01-15T14:20:00Z"
        },
        {
            "h3Index": "8a2a1072b63ffff",
            "frpIntensity": 203.8,
            "timestamp": "2024-01-15T14:15:00Z"
        },
        {
            "h3Index": "8a2a1072b65ffff",
            "frpIntensity": 91.4,
            "timestamp": "2024-01-15T14:10:00Z"
        },
        {
            "h3Index": "8a2a1072b67ffff",
            "frpIntensity": 156.9,
            "timestamp": "2024-01-15T14:05:00Z"
        },
        {
            "h3Index": "8a2a1072b69ffff",
            "frpIntensity": 78.1,
            "timestamp": "2024-01-15T14:00:00Z"
        },
        {
            "h3Index": "8a2a1072b6bffff",
            "frpIntensity": 234.5,
            "timestamp": "2024-01-15T13:55:00Z"
        }
    ]
    
    return mock_fire_database
