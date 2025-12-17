from typing import Dict
from models.session import TeachingSession, StartSessionRequest
from models.session import QuestionStage
import uuid

SESSION_STORE: Dict[str, TeachingSession] = {}

QUESTION_FLOW = [
    QuestionStage.mechanism,
    QuestionStage.edge_case,
    QuestionStage.limitation,
    QuestionStage.comparison,
]

def advance_question_stage(session):
    try:
        idx = QUESTION_FLOW.index(session.question_stage)
        if idx < len(QUESTION_FLOW) - 1:
            session.question_stage = QUESTION_FLOW[idx + 1]
    except ValueError:
        session.question_stage = QuestionStage.mechanism


def create_session(data: StartSessionRequest) -> TeachingSession:
    session_id = str(uuid.uuid4())

    session = TeachingSession(
        session_id=session_id,
        topic=data.topic,
        difficulty=data.difficulty,
        objective=data.objective,
        history=[]
    )

    SESSION_STORE[session_id] = session
    return session

def get_session(session_id: str) -> TeachingSession | None:
    return SESSION_STORE.get(session_id)

def delete_session(session_id: str):
    SESSION_STORE.pop(session_id, None)
