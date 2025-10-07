using System.Text.Json.Serialization;

namespace Masal.Application.DTOs
{
    public class AuthResponseDto
    {
        [JsonPropertyName("token")]
        public string Token { get; set; } = string.Empty;

        [JsonPropertyName("user")]
        public UserDto User { get; set; } = new UserDto();
    }
}
