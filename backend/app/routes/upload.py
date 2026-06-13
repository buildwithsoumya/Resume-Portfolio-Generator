from pathlib import Path
from fastapi import APIRouter
from fastapi import File
from fastapi import UploadFile
from fastapi import HTTPException
from app.services.pdf_service import extract_text_from_pdf
from app.models.resume import ResumeExtractionResponse
router = APIRouter(
    prefix="/api",
    tags=["Upload"]
)
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
@router.post("/upload", response_model=ResumeExtractionResponse)
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
    try:
        extracted_text = extract_text_from_pdf(
        str(file_path)
    )
    except Exception:
        raise HTTPException(
        status_code=400,
        detail="Could not extract text from PDF"
    )
    return {
        "filename": resume.filename,
        "text": extracted_text[:2000]
    }