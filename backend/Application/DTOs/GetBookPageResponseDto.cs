using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Masal.Application.DTOs
{
    public class GetBookPageResponseDto
    {
        // Sayfanın türünü belirtir: "Content" veya "Activity"
        public string PageType { get; set; } = default!;

        // Sayfa numarası
        public int PageNumber { get; set; }
        public int TotalPage { get; set; }

        public PageContentDto? ContentData { get; set; }
        public ActivityPageDto? ActivityData { get; set; }
    }
}
