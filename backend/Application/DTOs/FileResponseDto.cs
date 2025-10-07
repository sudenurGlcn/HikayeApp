using System.Text.Json.Serialization;

namespace Masal.Application.DTOs
{
    public class FileResponseDto
    {
        [JsonPropertyName("url")]
        public string Url { get; set; } = string.Empty;

        [JsonPropertyName("content_type")]
        public string? ContentType { get; set; }

        [JsonPropertyName("file_name")]
        public string? FileName { get; set; }

        [JsonPropertyName("file_size")]
        public int? FileSize { get; set; }
    }
}
