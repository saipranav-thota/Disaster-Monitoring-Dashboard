"""
Logging configuration.
"""
import logging
from pathlib import Path

def setup_logger(name: str) -> logging.Logger:
    """
    Set up logger with file and console handlers.
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    return logger
