"""
Configuration management.
"""
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent.parent

# NASA FIRMS API settings
NASA_FIRMS_API_KEY = ""  # Add your API key here
NASA_FIRMS_BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/area"

# Database settings
DATABASE_URL = "postgresql://user:password@localhost:5432/wildfires"

# API settings
API_HOST = "0.0.0.0"
API_PORT = 8000
