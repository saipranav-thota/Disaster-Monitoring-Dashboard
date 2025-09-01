"""
Database query functions.
"""
from sqlalchemy import func, text
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from .models import ViirsLiveData
from .database import SessionLocal
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

def safe_float_conversion(value: str) -> Optional[float]:
    """
    Safely convert string to float.
    
    Args:
        value: String value to convert
        
    Returns:
        Float value or None if conversion fails
    """
    try:
        return float(value) if value and value.strip() else None
    except (ValueError, TypeError):
        return None

def get_wildfires(db: Session, limit: Optional[int] = None, days_back: int = 30) -> List[ViirsLiveData]:
    """
    Get recent wildfire data.
    
    Args:
        db: Database session
        limit: Optional limit for number of records
        days_back: Number of days to look back from the latest data
        
    Returns:
        List of ViirsLiveData records
    """
    try:
        # Get the latest date in the database
        latest_date = db.query(func.max(ViirsLiveData.time_bucket)).scalar()
        
        if latest_date:
            # Get data from the last N days from the latest available date
            query = (
                db.query(ViirsLiveData)
                .filter(ViirsLiveData.time_bucket >= text(f"'{latest_date}'::timestamp - interval '{days_back} days'"))
                .order_by(ViirsLiveData.time_bucket.desc())
            )
        else:
            # Fallback: get all data if no date found
            query = db.query(ViirsLiveData).order_by(ViirsLiveData.time_bucket.desc())
        
        if limit:
            query = query.limit(limit)
            
        return query.all()
    except SQLAlchemyError as e:
        logger.error(f"Error fetching wildfire data: {e}")
        db.rollback()
        raise

def get_wildfires_by_confidence(db: Session, min_confidence: float = 0.5, days_back: int = 30) -> List[ViirsLiveData]:
    """
    Get wildfire data filtered by confidence level.
    
    Args:
        db: Database session
        min_confidence: Minimum confidence threshold
        days_back: Number of days to look back from the latest data
        
    Returns:
        List of ViirsLiveData records
    """
    try:
        # Get the latest date in the database
        latest_date = db.query(func.max(ViirsLiveData.time_bucket)).scalar()
        
        if latest_date:
            return (
                db.query(ViirsLiveData)
                .filter(
                    # Cast text confidence to numeric for comparison, handle invalid values
                    text(f"confidence ~ '^[0-9]*\\.?[0-9]+$' AND CAST(confidence AS FLOAT) >= {min_confidence}"),
                    ViirsLiveData.time_bucket >= text(f"'{latest_date}'::timestamp - interval '{days_back} days'")
                )
                .order_by(ViirsLiveData.time_bucket.desc())
                .all()
            )
        else:
            return []
    except SQLAlchemyError as e:
        logger.error(f"Error fetching wildfire data by confidence: {e}")
        db.rollback()
        raise

def get_wildfire_stats(db: Session) -> dict:
    """
    Get aggregated wildfire statistics.
    
    Args:
        db: Database session
        
    Returns:
        Dictionary with statistics
    """
    try:
        # Get basic counts
        total_fires = db.query(ViirsLiveData).count()
        
        # Get the latest date to calculate relative statistics
        latest_date = db.query(func.max(ViirsLiveData.time_bucket)).scalar()
        earliest_date = db.query(func.min(ViirsLiveData.time_bucket)).scalar()
        
        recent_fires = 0
        avg_confidence = 0.0
        
        if latest_date:
            # Count fires in the last 24 hours from the latest available data
            recent_fires = (
                db.query(ViirsLiveData)
                .filter(ViirsLiveData.time_bucket >= text(f"'{latest_date}'::timestamp - interval '24 hours'"))
                .count()
            )
            
            # Calculate average confidence for recent data (simplified approach)
            recent_records = (
                db.query(ViirsLiveData.confidence)
                .filter(ViirsLiveData.time_bucket >= text(f"'{latest_date}'::timestamp - interval '3 days'"))
                .all()
            )
            
            # Calculate average confidence in Python
            valid_confidences = []
            for record in recent_records:
                conf_val = safe_float_conversion(record[0])
                if conf_val is not None:
                    valid_confidences.append(conf_val)
            
            avg_confidence = sum(valid_confidences) / len(valid_confidences) if valid_confidences else 0.0
            
            # avg_confidence is already calculated above
        
        return {
            "total_fires": total_fires,
            "recent_fires_24h": recent_fires,
            "avg_confidence_recent": avg_confidence,
            "date_range": {
                "earliest": earliest_date.isoformat() if earliest_date else None,
                "latest": latest_date.isoformat() if latest_date else None
            }
        }
    except SQLAlchemyError as e:
        logger.error(f"Error fetching wildfire statistics: {e}")
        db.rollback()
        raise

if __name__ == "__main__":
    # Example usage with proper session management
    db = SessionLocal()
    try:
        response = get_wildfires(db)
        print(f"Found {len(response)} wildfire records")
        
        stats = get_wildfire_stats(db)
        print(f"Statistics: {stats}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()