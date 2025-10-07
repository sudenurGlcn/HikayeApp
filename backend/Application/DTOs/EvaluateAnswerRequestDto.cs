using System.Text.Json.Serialization;
namespace Masal.Application.DTOs
{
    public class EvaluateAnswerRequestDto
    {
        [JsonPropertyName("activityQuestion")]
        public string ActivityQuestion { get; set; } = string.Empty;

        [JsonPropertyName("validationLogic")]
        public string? ValidationLogic { get; set; }

        [JsonPropertyName("userAnswer")]
        public string UserAnswer { get; set; } = string.Empty;
    }
}
