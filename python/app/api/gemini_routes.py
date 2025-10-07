from fastapi import APIRouter
from app.models.generate_words_request import GenerateWordsRequest
from app.models.generate_words_response import GenerateWordsResponse
from app.services.word_logic_service import WordLogicService
from app.services.evaluate_service import EvaluateService
from app.services.prompt_generator_service import PromptGeneratorService
from app.services.image_service import ExternalImageService
from app.models.GenerateImageRequest import GenerateImageRequest
from app.models.GenerateImageResponse import GenerateImageResponse
from app.models.GeneratePromptRequest import GeneratePromptRequest
from app.models.GeneratePromptResponse import GeneratePromptResponse
from app.models.EvaluateAnswerRequest import EvaluateAnswerRequest
from app.models.EvaluateAnswerResponse import EvaluateAnswerResponse
from app.core.logger import logger

router = APIRouter(prefix="/api/gemini", tags=["Gemini"])

@router.post("/generate-words", response_model=GenerateWordsResponse)
async def generate_words(request: GenerateWordsRequest):
    logger.info(f"🧩 Yeni kelime üretim isteği alındı. Soru: {request.activityQuestion}")

    words_dict = WordLogicService.generate_dynamic_words(
        request.activityQuestion,
        request.validationLogic,
        request.categoriesToGenerate
    )

    return {"words": words_dict}

@router.post("/evaluate", response_model=EvaluateAnswerResponse)
async def evaluate(req: EvaluateAnswerRequest):
    out = EvaluateService.evaluate_answer(req.activityQuestion, req.validationLogic, req.userAnswer)
    return {"isCorrect": out["isCorrect"], "geminiFeedback": out["comment"]}

@router.post("/generate-prompt", response_model=GeneratePromptResponse)
async def generate_prompt(req: GeneratePromptRequest):
    prompt = PromptGeneratorService.generate_prompt(req.activityQuestion, req.userAnswer, req.isCorrect, req.geminiFeedback, req.baseImageUrl)
    return {"promptText": prompt}

@router.post("/generate-image", response_model=GenerateImageResponse)
async def generate_image(req: GenerateImageRequest):
    return await ExternalImageService.generate_image(
        prompt=req.prompt,
        image_urls=req.image_urls,
        num_images=req.num_images,
        output_format=req.output_format
    )
