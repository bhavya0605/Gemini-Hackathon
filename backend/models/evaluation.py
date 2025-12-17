from pydantic import BaseModel
from typing import List

class TeachingEvaluation(BaseModel):
    score: int  # 0–100
    strengths: List[str]
    weaknesses: List[str]
    missed_concepts: List[str]
    suggestions: List[str]
    follow_up_questions: List[str]
