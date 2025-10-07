namespace Masal.Application.DTOs
{
    public class BookDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public string CoverImageURL { get; set; } = default!;
        public int? EstimatedReadingTimeMinutes { get; set; }
        public int? ActivityCount { get; set; }
        public int TotalPages { get; set; }
        // Kitap yazarları
        public List<string> Authors { get; set; } = new();
    }
}
