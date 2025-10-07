using System.Text.Json.Serialization;

namespace Masal.Application.DTOs
{
    public class UserDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string FullName { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("subscriptionType")]
        public string SubscriptionType { get; set; } = string.Empty;

        [JsonPropertyName("subscriptionEndDate")]
        public DateTime? SubscriptionEndDate { get; set; }
    }
}
