from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import db_models          # ensures tables are importable
from app.routes.upload import router as upload_router
from app.routes.generate import router as generate_router
from app.routes.auth import router as auth_router
from app.routes.portfolios import router as portfolios_router

# Create all tables on startup
db_models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FolioSnap API",
    version="2.0.0",
    description="AI-Powered Resume-to-Portfolio Generator with Authentication",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(generate_router)
app.include_router(auth_router)
app.include_router(portfolios_router)


@app.get("/")
async def root():
    return {"message": "FolioSnap API v2 — Running"}


@app.get("/api/health")
async def health():
    return {"status": "ok"}