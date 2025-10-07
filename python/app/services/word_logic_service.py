import json
import re
from typing import List, Dict
from app.services.gemini_service import GeminiService
from app.core.logger import logger


class WordLogicService:
    @staticmethod
    def generate_dynamic_words(activity_question: str, logic_rule: str, categories: List[str]) -> Dict[str, List[str]]:
        result = {}

        for category in categories:
            prompt = WordLogicService._build_prompt(activity_question, logic_rule, category)
            logger.info(f"🔹 Prompt oluşturuluyor: {category}")
            response_text = GeminiService.generate_words(prompt)

            # Terminale de yazdır
            print(f"\n📝 Gemini cevabı ({category}):\n{response_text}\n")

            # Fazlalıkları temizle
            cleaned = WordLogicService._clean_json_like(response_text)

            try:
                parsed = json.loads(cleaned)
                if isinstance(parsed, list):
                    result[category] = parsed[:10]
                elif isinstance(parsed, dict) and category in parsed:
                    result[category] = parsed[category][:10]
                else:
                    # Beklenen key yoksa ilk listeyi bul
                    first_list = next((v for v in parsed.values() if isinstance(v, list)), [])
                    result[category] = first_list[:10]
            except Exception as e:
                logger.warning(f"⚠️ JSON parse hatası ({category}): {e}")
                # JSON değilse, virgül veya satır ayırıcıyla böl
                result[category] = [w.strip() for w in re.split(r"[,\n]+", cleaned) if w.strip()][:10]

        return result

    @staticmethod
    def _clean_json_like(text: str) -> str:
        """
        Gemini bazen cevabı ```json ... ``` içinde döndürüyor.
        Bu fonksiyon fazlalıkları temizler ve geçerli JSON bırakır.
        """
        cleaned = text.strip()

        # Kod bloğu işaretlerini kaldır
        cleaned = re.sub(r"^```json", "", cleaned, flags=re.IGNORECASE).strip()
        cleaned = re.sub(r"```$", "", cleaned).strip()

        # Başta/sonda fazladan karakter varsa kırp
        if cleaned.startswith("[") and not cleaned.endswith("]"):
            cleaned += "]"
        if cleaned.startswith("{") and not cleaned.endswith("}"):
            cleaned += "}"

        return cleaned

    @staticmethod
    def _build_prompt(activity_question: str, logic_rule: str, category: str) -> str:
        return f"""
Soru: "{activity_question}"

Etkinlik Mantığı: "{logic_rule or 'Eğlenceli, çocuklara uygun kelimeler üret.'}"

Kategori: {category}

Açıklama:
- Eğer kategori "Karakter" ise, soruya uygun 10 kelime öner.
- Eğer kategori "Renk" ise, sadece çocuklara hitap eden rastgele 10 renk öner.
- Doğru cevap sayısı en fazla 4 olmalı, kalanlar yanlış veya eğlenceli alternatifler olabilir.
- Lütfen yalnızca geçerli JSON döndür, başka açıklama veya ```json``` etiketi ekleme.

Beklenen format:
{{
  "{category}": ["Örnek1", "Örnek2", "Örnek3", ...]
}}
"""
