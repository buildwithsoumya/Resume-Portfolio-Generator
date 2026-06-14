from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Form
from fastapi import HTTPException
from app.services.pdf_service import (
    extract_text_from_pdf
)
from app.services.gemini_service import (
    extract_resume_structure
)
from app.services.portfolio_service import (
    generate_portfolio_html
)
from pathlib import Path
router = APIRouter(
    prefix="/api",
    tags=["Portfolio"]
)
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
@router.post("/generate")
async def generate_portfolio(
    resume: UploadFile = File(...),
    style: str = Form(...)
):
    file_path = UPLOAD_DIR / resume.filename
    with open(file_path, "wb") as f:
        f.write(await resume.read())
    text = extract_text_from_pdf(
        str(file_path)
    )
    try:
        structured_resume = extract_resume_structure(text)

        html = generate_portfolio_html(
            structured_resume,
            style
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    return {
        "html": html,
        "style": style
    }