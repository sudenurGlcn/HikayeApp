using System.Text.Json.Serialization;

namespace Masal.Application.DTOs
{
    public class GeneratePromptRequestDto
    {
        [JsonPropertyName("activityQuestion")]
        public string ActivityQuestion { get; set; } = string.Empty;

        [JsonPropertyName("userAnswer")]
        public string UserAnswer { get; set; } = string.Empty;

        [JsonPropertyName("isCorrect")]
        public bool IsCorrect { get; set; }

        [JsonPropertyName("geminiFeedback")]
        public string GeminiFeedback { get; set; } = string.Empty;

        [JsonPropertyName("baseImageUrl")]
        public string? BaseImageUrl { get; set; }
    }
}
