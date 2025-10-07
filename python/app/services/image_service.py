import asyncio
import fal_client
from app.models.GenerateImageRequest import GenerateImageRequest
from app.models.GenerateImageResponse import GenerateImageResponse, FileResponse
from app.core.logger import logger


class ExternalImageService:
    @staticmethod
    async def generate_image(prompt: str, image_urls=None, num_images: int = 1, output_format: str = "jpeg"):
        """
        Gemini 2.5 Flash Image Edit API'sini kullanarak görselleri düzenler veya oluşturur.
        """
        try:
            # API'ye gönderilecek argümanlar
            arguments = {
                "prompt": prompt,
                "num_images": num_images,
                "output_format": output_format
            }

            if image_urls:
                arguments["image_urls"] = image_urls

            logger.info(f"🖼️ Fal AI API isteği başlatılıyor... Prompt: {prompt}")

            # FAL API isteğini gönder
            handler = await fal_client.submit_async(
                "fal-ai/gemini-25-flash-image/edit",
                arguments=arguments
            )

            # Log eventlerini dinle
            async for event in handler.iter_events(with_logs=True):
                # Event sözlük tipindeyse
                if isinstance(event, dict):
                    if "message" in event:
                        logger.info(f"🪶 Fal Event: {event['message']}")
                    else:
                        logger.debug(f"🔸 Fal Event: {event}")
                else:
                    # Örneğin event 'Queued' veya 'InProgress' tipi olabilir
                    logger.debug(f"🔹 Fal Event Type: {type(event).__name__}, Value: {event}")

            # İşlem tamamlanana kadar bekle
            result = await handler.get()

            # Eğer hâlâ 'Queued' ya da 'InProgress' durumundaysa bekle
            while hasattr(result, "status") and result.status in ["QUEUED", "IN_PROGRESS"]:
                logger.info(f"⏳ Durum: {result.status}... Bekleniyor...")
                await asyncio.sleep(2)
                result = await handler.get()

            logger.info("✅ Fal API isteği tamamlandı.")

            # Sonucu kontrol et
            if not result or not isinstance(result, dict) or "images" not in result:
                logger.warning(f"⚠️ API sonucunda geçerli görüntü bulunamadı: {result}")
                return GenerateImageResponse(images=[], description="No valid image returned.")

            # Görselleri parse et
            images = [
                FileResponse(
                    url=img.get("url"),
                    content_type=img.get("content_type"),
                    file_name=img.get("file_name"),
                    file_size=img.get("file_size")
                )
                for img in result.get("images", [])
            ]

            description = result.get("description", "No description provided.")

            return GenerateImageResponse(images=images, description=description)

        except Exception as e:
            logger.error(f"🚨 Fal AI API isteği başarısız oldu: {e}", exc_info=True)
            return GenerateImageResponse(images=[], description=f"Error: {str(e)}")


# Manuel test
if __name__ == "__main__":
    async def main():
        req = GenerateImageRequest(
            prompt="make a photo of the man driving the car down the california coastline",
            image_urls=[
                "https://storage.googleapis.com/falserverless/example_inputs/nano-banana-edit-input.png"
            ],
            num_images=1,
            output_format="jpeg"
        )

        response = await ExternalImageService.generate_image(
            prompt=req.prompt,
            image_urls=req.image_urls,
            num_images=req.num_images,
            output_format=req.output_format
        )

        print(response.json(indent=2))

    asyncio.run(main())
