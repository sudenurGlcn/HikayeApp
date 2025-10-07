namespace Masal.Application.DTOs
{
    public class BookForCategoryDto
    {
        public int BookId { get; set; }
        public string Title { get; set; } = default!;
        public string CoverImageURL { get; set; } = default!;
        public List<string> AuthorNames { get; set; } = new List<string>();
    }
}
