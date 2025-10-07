using System.Text.Json.Serialization;

namespace Masal.Application.DTOs
{
    public class GeneratePromptResultDto
    {
        [JsonPropertyName("promptText")]
        public string PromptText { get; set; } = string.Empty;
    }
}
