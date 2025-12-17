from fastapi import APIRouter, HTTPException
from models.session import StartSessionRequest
from services.session_manager import create_session
from fastapi import APIRouter, HTTPException
from services.session_manager import get_session, delete_session
from services.evaluation_engine import evaluate_teaching
from typing import Optional
# router = APIRouter(prefix="/session")



router = APIRouter(prefix="/session", tags=["Session"])
    
@router.post("/start")
async def start_session(payload: Optional[StartSessionRequest] = None):
    """
    Starts a new teaching session.
    If no payload is provided, defaults are used.
    """

    if payload is None:
        payload = StartSessionRequest(
            topic="General Topic",
            difficulty="beginner",
            objective="Teach the AI student"
        )


    session = create_session(payload)

    return {
        "session_id": session.session_id,
        "message": "Teaching session started",
        "session": {
            "topic": session.topic,
            "difficulty": session.difficulty,
            "objective": session.objective
        }
    }

@router.post("/end_teaching")
async def end_teaching(session_id: str):
    session = get_session(session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    evaluation = await evaluate_teaching(session)

    # Optional: cleanup session after evaluation
    delete_session(session_id)

    return evaluation
