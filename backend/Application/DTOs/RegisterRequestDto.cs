using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Masal.Application.DTOs
{
    public class RegisterRequestDto
    {
        [Required]
        [StringLength(100)]
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;
    }
}
