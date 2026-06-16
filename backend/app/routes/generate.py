from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pathlib import Path
from jose import JWTError

from app.database import get_db
from app.models.db_models import Portfolio, User
from app.services.pdf_service import extract_text_from_pdf
from app.services.gemini_service import extract_resume_structure, enhance_resume_content
from app.services.resume_validator import validate_resume
from app.services.portfolio_planner import generate_portfolio_plan
from app.services.portfolio_service import generate_portfolio_html
from app.services.quality_checker import check_portfolio_quality
from app.utils.auth import decode_access_token

router = APIRouter(prefix="/api", tags=["Portfolio"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Optional bearer — does NOT require auth, but saves to DB when authenticated
oauth2_optional = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


def _get_optional_user(
    token: str = Depends(oauth2_optional),
    db: Session = Depends(get_db),
) -> User | None:
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if user_id is None:
            return None
        return db.query(User).filter(User.id == int(user_id)).first()
    except JWTError:
        return None


@router.post("/generate")
async def generate_portfolio(
    resume: UploadFile = File(...),
    style: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(_get_optional_user),
):
    file_path = UPLOAD_DIR / resume.filename
    with open(file_path, "wb") as f:
        f.write(await resume.read())

    text = extract_text_from_pdf(str(file_path))

    try:
        structured_resume = extract_resume_structure(text)
        
        # Validate
        validation_report = validate_resume(structured_resume)
        
        # Enhance content
        enhanced_resume = enhance_resume_content(structured_resume)
        
        # Plan portfolio
        portfolio_plan = generate_portfolio_plan(enhanced_resume)
        
        html = ""
        quality_info = {}
        
        # Generation with retry based on quality
        for attempt in range(2):
            html = generate_portfolio_html(enhanced_resume, style, portfolio_plan)
            quality_info = check_portfolio_quality(html, enhanced_resume)
            if quality_info.get("is_acceptable", False):
                break
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Persist to DB when user is authenticated
    portfolio_id = None
    if current_user:
        portfolio = Portfolio(
            user_id=current_user.id,
            style=style,
            html_content=html,
            original_html=html,
            quality_score=quality_info.get("quality_score", 0),
            portfolio_type=portfolio_plan.get("portfolio_type", "Unknown")
        )
        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)
        portfolio_id = portfolio.id

    return {
        "html": html,
        "style": style,
        "portfolio_id": portfolio_id,
    }