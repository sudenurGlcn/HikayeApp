import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    IMAGE_API_URL = os.getenv("IMAGE_API_URL", "https://api.example-image.com/generate")
    IMAGE_API_KEY: str = os.getenv("IMAGE_API_KEY", "")
    APP_NAME: str = "Masal Python Agent"
    VERSION: str = "1.0.0"

settings = Settings()
