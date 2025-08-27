"""
Wildfire endpoints.
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/wildfires")
async def get_wildfires():
    """
    Get list of wildfires.
    """
    return []
