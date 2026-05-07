from fastapi import APIRouter, Depends
from sqlalchemy import text 
from sqlalchemy.orm import Session

from app.db.database import get_db

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Secure Cloud Storage API is running"
    }

@router.get("/db")
def database_health_check(db: Session = Depends(get_db)): # Depends is used to call get_db to inject the database session first into the endpoint
    result = db.execute(text("SELECT 1")).scalar() # run a simple db query to check if the database connection is working
    
    return {
        "status": "ok",
        "database": "connected",
        "result": result
    }
