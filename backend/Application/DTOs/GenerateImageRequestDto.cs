using System.Text.Json.Serialization;

namespace Masal.Application.DTOs
{
    public class GenerateImageRequestDto
    {
        [JsonPropertyName("prompt")]
        public string Prompt { get; set; } = string.Empty;

        [JsonPropertyName("image_urls")]
        public List<string>? ImageUrls { get; set; }

        [JsonPropertyName("num_images")]
        public int NumImages { get; set; } = 1;

        [JsonPropertyName("output_format")]
        public string OutputFormat { get; set; } = "jpeg";
    }
}
