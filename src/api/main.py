"""
FastAPI application entry point.
"""
from fastapi import FastAPI

app = FastAPI(title="Wildfire Monitoring System")

@app.get("/")
async def root():
    return {"message": "Welcome to Wildfire Monitoring System API"}
