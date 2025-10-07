
namespace Masal.Application.DTOs
{
    public class GetBookPageRequestDto
    {
        public int BookId { get; set; }

        public int CurrentPageNumber { get; set; }

        // Yön bilgisi: "Next" veya "Previous"
        public string Direction { get; set; } = default!;
        // ✨ Bu satırı EKLEYİN! ✨
        public int ChildId { get; set; }

    }
}
