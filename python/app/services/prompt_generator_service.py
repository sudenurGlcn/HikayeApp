from app.services.gemini_service import GeminiService


class PromptGeneratorService:
    @staticmethod
    def generate_prompt(activity_question: str, user_answer: str, is_correct: bool, gemini_feedback: str,
                        base_image_url: str | None):
        correctness = "doğru" if is_correct else "yanlış"
        prompt = f"""Çocuk dostu tarzda bir illüstrasyon oluştur. 
Soru: {activity_question}
Kullanıcı cevabı: {user_answer} ({correctness})
Gemini yorumu: {gemini_feedback}
Stil: sıcak, çizgi film, yumuşak hatlar, pastel tonlar, çocuklara uygun.
Kullanıcı resmi referansı: {base_image_url or 'yok'}
İstenen çıktı: tek cümlelik, görseli oluşturacak detaylı prompt (2-3 kısa cümle)."""

        raw = GeminiService.generate_words(prompt)
        return raw.strip()
