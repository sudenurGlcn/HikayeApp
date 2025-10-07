from pydantic import BaseModel
from typing import Dict, List, Optional

class EvaluateAnswerResponse(BaseModel):
    isCorrect: bool
    geminiFeedback: str