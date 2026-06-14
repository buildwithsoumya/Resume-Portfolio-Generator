from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.upload import router as upload_router
from app.routes.generate import router as generate_router
app = FastAPI(
    title="FolioSnap API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(upload_router)
app.include_router(generate_router)
@app.get("/")
async def root():
    return{
        "message" : "FolioSnap Backend Running"
    }