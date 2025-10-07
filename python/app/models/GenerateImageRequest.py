from pydantic import BaseModel
from typing import List, Optional

class GenerateImageRequest(BaseModel):

    prompt: str
    image_urls: Optional[List[str]] = None
    num_images: Optional[int] = 1
    output_format: Optional[str] = "jpeg"


