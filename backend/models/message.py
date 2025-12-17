from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    session_id: str
    message: str = Field(..., min_length=1)

class ChatResponse(BaseModel):
    ai_message: str
