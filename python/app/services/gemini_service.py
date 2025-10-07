import google.generativeai as genai
from app.core.config import settings
from app.core.logger import logger

genai.configure(api_key=settings.GEMINI_API_KEY)

class GeminiService:
    @staticmethod
    def generate_words(prompt: str) -> str:
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(prompt)
            return response.text.strip() if response.text else ""
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return ""
