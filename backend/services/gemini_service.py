import google.generativeai as genai
from config import GEMINI_API_KEY
import asyncio
from google.api_core.exceptions import ResourceExhausted

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

QUESTION_STARTERS = ("how", "why", "what happens")

def is_valid_student_response(text: str) -> bool:
    text_lower = text.lower()
    return (
        "?" in text
        and any(text_lower.strip().startswith(q) or f" {q} " in text_lower for q in QUESTION_STARTERS)
    )

async def generate_ai_response(prompt: str) -> str:
    for attempt in range(2):  # try twice
        try:
            response = await asyncio.to_thread(
                model.generate_content,
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "max_output_tokens": 500
                }
            )

            if not response or not response.text:
                continue

            text = response.text.strip()

            # ✅ ENFORCEMENT LAYER
            if is_valid_student_response(text):
                return text

            # ❌ If invalid, force correction
            prompt = (
                prompt
                + "\n\nYour previous response was INVALID because it did not ask a deep question. "
                  "Rewrite your response so that it challenges the teacher using a 'How', 'Why', "
                  "or 'What happens if' question."
            )

        except ResourceExhausted:
            return (
                "I want to challenge your explanation, but I've temporarily hit my usage limit. "
                "What happens if the training data is biased — how would that affect the model?"
            )

        except Exception as e:
            print("Gemini error:", e)
            break

    # Final fallback (never return summarization)
    return (
        "I think I understand your explanation at a high level, but how does the model actually "
        "decide which token to generate next when multiple choices are possible?"
    )
