from pydantic import BaseModel
from typing import Dict, List

class GenerateWordsResponse(BaseModel):
    words: Dict[str, List[str]]
