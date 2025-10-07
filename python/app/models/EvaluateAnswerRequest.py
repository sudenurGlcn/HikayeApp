from pydantic import BaseModel
from typing import List, Optional

class EvaluateAnswerRequest(BaseModel):
    activityQuestion: str
    validationLogic: Optional[str] = None
    userAnswer: str