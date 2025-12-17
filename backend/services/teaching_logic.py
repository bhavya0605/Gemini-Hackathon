from typing import List
from models.session import TeachingSession, Message
from utils.prompt_templates import AI_STUDENT_RULES
from models.session import QuestionStage


MAX_HISTORY_MESSAGES = 8  # keep prompt short by default

def _history_to_text(history: List[Message], limit: int = MAX_HISTORY_MESSAGES) -> str:
    """
    Convert last `limit` messages to a compact string with roles.
    """
    recent = history[-limit:]
    lines = []
    for m in recent:
        role = m.role
        content = m.content.replace("\n", " ")
        lines.append(f"{role.upper()}: {content}")
    return "\n".join(lines)

def build_teaching_prompt(session: TeachingSession, latest_student_message: str) -> str:
    """
    Build a single string prompt to send to the LLM (Gemini).
    This enforces the 'AI as student' rules and supplies session context.
    """
    parts = []

    # 1) Rules: make AI behave like a curious, sometimes confused student
    parts.append("### AI STUDENT RULES")
    parts.append(AI_STUDENT_RULES.strip())

    # 2) Session context (topic, difficulty, objective)
    parts.append("\n### SESSION CONTEXT")
    parts.append(f"Topic: {session.topic}")
    parts.append(f"Difficulty: {session.difficulty}")
    parts.append(f"Teaching objective: {session.objective}")

    # 3) Document context if available (trim if long)
    if session.document_text:
        doc_preview = session.document_text[:4000]  # trim to keep prompt size reasonable
        parts.append("\n### DOCUMENT (preview)")
        parts.append(doc_preview)

    # 4) Recent conversation history
    parts.append("\n### RECENT CONVERSATION")
    history_text = _history_to_text(session.history, limit=MAX_HISTORY_MESSAGES)
    parts.append(history_text)

    # 5) Instruction for AI to respond in "teaching/student" mode
    parts.append("\n### INSTRUCTIONS for the AI")
    parts.append("""
You are a STUDENT being taught by a human.

Your goal is to TEST the teacher's understanding.

You MUST do ALL of the following in your response:

1. Briefly restate what you think the teacher is claiming (1 sentence max).
2. Identify ONE missing detail, assumption, or vague part in the explanation.
3. Ask ONE deep, specific question that would expose misunderstanding if the teacher answers poorly.

Question rules:
- Your question MUST start with "How", "Why", or "What happens if".
- Your question MUST NOT be definitional.
- Your question MUST require reasoning, not memorization.

Forbidden behaviors:
- Do NOT paraphrase without questioning.
- Do NOT agree without challenge.
- Do NOT explain the topic yourself.

If you do not ask a deep question, your response is INVALID.
""")
    parts.append("""Choose ONE question type to challenge the teacher:
    A. Edge case (when does this fail?)
    B. Mechanism (how exactly does this work internally?)
    C. Comparison (how is this different from a similar concept?)
    D. Limitation (what can this NOT do?)

    Pick ONE and ask accordingly.
    """)



    # 6) The student's latest utterance to be considered
    parts.append("\n### LATEST STUDENT MESSAGE")
    parts.append(latest_student_message)

    # 7) Finally, request the model to respond only with plain text (no JSON) for chat endpoint
    parts.append("\nRespond only as the AI student (plain text).")
    parts.append("Important: If you do not ask a question, your response is incorrect.")

    parts.append("Before responding, check: Does my question require the teacher to THINK? If not, rewrite it.")

    stage = session.question_stage

    if stage == QuestionStage.mechanism:
        question_instruction = """
        Ask a HOW or WHY question about the internal working or mechanism.
        Focus on how the system produces outputs.
        """

    elif stage == QuestionStage.edge_case:
        question_instruction = """
        Ask a WHAT HAPPENS IF question about unusual inputs, failures, or edge cases.
        """

    elif stage == QuestionStage.limitation:
        question_instruction = """
        Ask about limitations, trade-offs, or what the concept cannot do.
        """

    elif stage == QuestionStage.comparison:
        question_instruction = """
        Ask a comparison question with a related concept or alternative approach.
        """

    parts.append("### QUESTION FOCUS")
    parts.append(question_instruction)

    prompt = "\n\n".join(parts)
    return prompt
