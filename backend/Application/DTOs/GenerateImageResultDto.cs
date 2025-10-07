using System.Text.Json.Serialization;

namespace Masal.Application.DTOs
{
    public class GenerateImageResultDto
    {
        [JsonPropertyName("images")]
        public List<FileResponseDto> Images { get; set; } = new List<FileResponseDto>();

        [JsonPropertyName("description")]
        public string? Description { get; set; }
    }
}
