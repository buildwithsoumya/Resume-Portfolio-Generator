from pydantic import BaseModel
class ResumeExtractionResponse(BaseModel):
    filename: str
    text: str