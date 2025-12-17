import google.generativeai as genai
from config import GEMINI_API_KEY
import asyncio

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("models/gemini-2.5-flash")


async def generate_ai_response(teacher_message: str) -> str:
    prompt = f"""
You are an AI STUDENT.

STRICT RULES:
- Ask EXACTLY ONE question.
- Do NOT explain.
- Do NOT summarize.
- Do NOT define concepts.
- Question MUST start with: How, Why, or What happens if
- End with a question mark (?).
- Output ONLY the question text.

Teacher explanation:
{teacher_message}
"""

    try:
        response = await asyncio.to_thread(
            model.generate_content,
            prompt,
            generation_config={
                "temperature": 0.3,
                "max_output_tokens": 1000
            }
        )

        if not response or not response.text:
            return "❌ Gemini returned empty response."

        return response.text.strip()

    except Exception as e:
        return f"❌ Gemini error: {str(e)}"
