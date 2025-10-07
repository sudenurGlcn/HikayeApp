from pydantic import BaseModel
from typing import Dict, List, Optional

class GeneratePromptResponse(BaseModel):
    promptText: str