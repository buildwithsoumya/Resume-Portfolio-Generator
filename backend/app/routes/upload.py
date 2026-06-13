from pathlib import Path
from fastapi import APIRouter
from fastapi import File
from fastapi import UploadFile
from fastapi import HTTPException
router = APIRouter(
    prefix="/api",
    tags=["Upload"]
)
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
@router.post("/upload")
async def upload_resume(
    resume: UploadFile = File(...)
):
    if not resume.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )
    file_path = UPLOAD_DIR / resume.filename
    with open(file_path, "wb") as f:
        content = await resume.read()
        f.write(content)
    return {
        "filename": resume.filename,
        "saved_to": str(file_path)
    }