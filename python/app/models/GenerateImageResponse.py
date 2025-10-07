from pydantic import BaseModel
from typing import Dict, List, Optional

class FileResponse(BaseModel):
    url: str
    content_type: Optional[str]
    file_name: Optional[str]
    file_size: Optional[int]

class GenerateImageResponse(BaseModel):
    images: List[FileResponse]
    description: Optional[str]