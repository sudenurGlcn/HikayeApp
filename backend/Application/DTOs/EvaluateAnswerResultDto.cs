using System.Text.Json.Serialization;

namespace Masal.Application.DTOs
{
    public class EvaluateAnswerResultDto
    {
        [JsonPropertyName("isCorrect")]
        public bool IsCorrect { get; set; }

        [JsonPropertyName("geminiFeedback")]
        public string GeminiFeedback { get; set; } = string.Empty;
    }
}
