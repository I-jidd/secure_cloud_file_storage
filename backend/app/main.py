from app.api.routes import health, auth, folders, files, activity_logs
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings


app = FastAPI(
    title= settings.APP_NAME,
    version = "0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials =True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(folders.router, prefix="/api")
app.include_router(files.router, prefix="/api")
app.include_router(activity_logs.router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Welcome to Secure Cloud Storage API"
    }