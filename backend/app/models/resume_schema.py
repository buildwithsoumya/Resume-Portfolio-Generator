from pydantic import BaseModel
from typing import List
class Project(BaseModel):
    name: str
    description: str
class Education(BaseModel):
    degree: str
    institution: str
class ResumeData(BaseModel):
    name: str
    title: str
    summary: str
    skills: List[str]
    education: List[Education]
    projects: List[Project]
    experience: List[str]
    links: List[str]