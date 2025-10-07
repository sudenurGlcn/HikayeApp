from pydantic import BaseModel
from typing import List, Optional

class GenerateWordsRequest(BaseModel):
    activityQuestion: str
    validationLogic: Optional[str] = None
    categoriesToGenerate: List[str]
