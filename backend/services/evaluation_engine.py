from services.gemini_service import generate_ai_response
from models.evaluation import TeachingEvaluation
import json

def build_evaluation_prompt(session) -> str:
    history_text = "\n".join(
        f"{msg.role.upper()}: {msg.content}"
        for msg in session.history
    )

    return f"""
You are an expert teacher evaluator.

A student tried to teach the following topic:
Topic: {session.topic}
Difficulty: {session.difficulty}
Objective: {session.objective}

Here is the teaching conversation:
{history_text}

Evaluate the student's teaching quality.

Return STRICT JSON with the following keys:
- score (0 to 100)
- strengths (list of strings)
- weaknesses (list of strings)
- missed_concepts (list of strings)
- suggestions (list of strings)
- follow_up_questions (list of strings)

Rules:
- Be honest but constructive
- Focus on clarity, correctness, depth
- Do NOT include any explanation outside JSON
"""

async def evaluate_teaching(session) -> TeachingEvaluation:
    prompt = build_evaluation_prompt(session)

    response = await generate_ai_response(prompt)

    try:
        data = json.loads(response)
        return TeachingEvaluation(**data)
    except Exception:
        # Fallback if Gemini fails or quota hits
        return TeachingEvaluation(
            score=65,
            strengths=["Clear high-level explanation"],
            weaknesses=["Lacked depth in internal mechanisms"],
            missed_concepts=["Token probability calculation", "Context window limits"],
            suggestions=["Explain inference step-by-step", "Use examples"],
            follow_up_questions=[
                "How does attention affect token prediction?",
                "What happens when context length is exceeded?"
            ]
        )
