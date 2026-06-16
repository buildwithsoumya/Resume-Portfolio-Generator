from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()

    @field_validator("password")
    @classmethod
    def password_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Portfolio Schemas ────────────────────────────────────────────────────────

class PortfolioResponse(BaseModel):
    id: int
    user_id: int
    style: str
    html_content: str
    original_html: Optional[str] = None
    edited_html: Optional[str] = None
    quality_score: Optional[int] = None
    portfolio_type: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PortfolioSummary(BaseModel):
    """Lightweight list item — no html_content to keep payload small."""
    id: int
    user_id: int
    style: str
    quality_score: Optional[int] = None
    portfolio_type: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

class PortfolioUpdateRequest(BaseModel):
    edited_html: str
