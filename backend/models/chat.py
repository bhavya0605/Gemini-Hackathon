from pydantic import BaseModel
from typing import List
from models.session import Message

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    session_id: str
    ai_message: str
    # re-use the Message model so frontend can render history easily
    history: List[Message]
