from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class DifficultyLevel(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

class Message(BaseModel):
    role: str
    content: str

class StartSessionRequest(BaseModel):   # 👈 THIS MUST EXIST
    topic: str = Field(..., min_length=3)
    difficulty: DifficultyLevel
    objective: str = Field(..., min_length=10)

class QuestionStage(str, Enum):
    mechanism = "mechanism"
    edge_case = "edge_case"
    limitation = "limitation"
    comparison = "comparison"

class TeachingSession(BaseModel):
    session_id: str
    topic: str
    difficulty: DifficultyLevel
    objective: str
    document_text: Optional[str] = None
    history: List[Message] = []
    question_stage: QuestionStage = QuestionStage.mechanism

