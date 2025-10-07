namespace Masal.Application.DTOs
{
    public class FavoriteBookResponseDto
    {
        public int Id { get; set; }
        public int ChildId { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; } = default!;
        public string CoverImageURL { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public string Message { get; set; } = "Kitap favorilere eklendi.";
    }
}
