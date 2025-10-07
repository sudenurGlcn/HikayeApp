import json
from app.services.word_logic_service import WordLogicService
from app.services.gemini_service import GeminiService
from app.core.logger import logger


class EvaluateService:
    @staticmethod
    def evaluate_answer(activity_question: str, validation_logic: str | None, user_answer: str):
        prompt = f"""Soru: "{activity_question}"
Mantık: "{validation_logic or ''}"
Kullanıcı cevabı: "{user_answer}"
Bu cevabın mantık kurallarına göre doğru mu yanlış mı olduğunu kısa ve net söyle. Döndüreceğin JSON formatı:
{{ "isCorrect": true|false, "comment": "kısa yorum" }}"""

        raw = GeminiService.generate_words(prompt)
        try:
            cleaned = WordLogicService._clean_json_like(raw)
            obj = json.loads(cleaned)
            return {
                "isCorrect": bool(obj.get("isCorrect", False)),
                "comment": str(obj.get("comment", ""))
            }
        except Exception as e:
            logger.warning("Evaluate parse hatası: %s - raw: %s", e, raw)
            return {"isCorrect": False, "comment": "Değerlendirilemedi — tahmini: yanlış"}
