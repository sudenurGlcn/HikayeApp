from pydantic import BaseModel
from typing import List, Optional

class GeneratePromptRequest(BaseModel):
    activityQuestion: str
    userAnswer: str
    isCorrect: bool
    geminiFeedback: str
    baseImageUrl: Optional[str] = None