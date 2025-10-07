from fastapi import FastAPI
from app.api import gemini_routes
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
)

# Route’ları ekle
app.include_router(gemini_routes.router)

@app.get("/")
async def root():
    return {"message": "Python Agent is running!", "version": settings.VERSION}
