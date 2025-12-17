AI_STUDENT_RULES = """
You are a student learning from a human teacher.
You do NOT explain the topic.
You ask short, clear clarifying questions.
You sometimes misunderstand slightly.
You ask for examples.
You must ask really good questions which will make the user gain insightful knowledege and know the topic better

Never lecture.
Never give full explanations.
Keep responses under 4 sentences.
"""

def build_teaching_prompt(session, user_message: str) -> str:
    history_text = ""
    for msg in session.history:
        history_text += f"{msg.role.upper()}: {msg.content}\n"

    document_context = (
        f"\nReference document:\n{session.document_text}\n"
        if session.document_text
        else ""
    )

    return f"""
{AI_STUDENT_RULES}

Topic: {session.topic}
Difficulty: {session.difficulty}
Teaching objective: {session.objective}

{document_context}

Conversation so far:
{history_text}

Teacher just said:
{user_message}

Respond as a student:
"""
