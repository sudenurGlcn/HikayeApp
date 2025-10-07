using System.Text.Json.Serialization;

namespace Masal.Application.DTOs
{
    public class ParentDto
    {
        [JsonPropertyName("id")]
        public int ParentId { get; set; }

        [JsonPropertyName("fullName")]
        public string FullName { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("subscriptionType")]
        public string SubscriptionType { get; set; } = string.Empty;

        [JsonPropertyName("subscriptionEndDate")]
        public DateTime? SubscriptionEndDate { get; set; }

        [JsonPropertyName("adaptyProfileId")]
        public string? AdaptyProfileId { get; set; }

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}
