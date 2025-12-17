from fastapi import APIRouter, HTTPException
from models.chat import ChatRequest, ChatResponse
from services.session_manager import get_session
from models.session import Message
from services.teaching_logic import build_teaching_prompt
from services.gemini_service import generate_ai_response
from services.session_manager import advance_question_stage

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    """
    Steps:
      - validate session
      - append student message to history
      - build prompt with teaching logic & session context
      - call AI service
      - append AI message to history and return response
    """
    session = get_session(payload.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 1) Append student's message
    student_msg = Message(role="student", content=payload.message)
    session.history.append(student_msg)

    # 2) Build prompt for Gemini (teaching logic)
    prompt = build_teaching_prompt(session, payload.message)

    # 3) Call Gemini wrapper (async)
    ai_text = await generate_ai_response(prompt)

    # 4) Append AI response to history
    ai_msg = Message(role="ai", content=ai_text)
    session.history.append(ai_msg)
    advance_question_stage(session)

    # 5) Return AI text + full history (or a sliced history if very large)
    return ChatResponse(
        session_id=session.session_id,
        ai_message=ai_text,
        history=session.history
    )
