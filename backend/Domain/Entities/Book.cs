

namespace Masal.Domain.Entities
{
    public class Book 
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public string CoverImageURL { get; set; } = default!;
        public string? Topic { get; set; }
        public int? EstimatedReadingTimeMinutes { get; set; }
        public int? ActivityCount { get; set; }
        public bool IsPublished { get; set; } = false;
        public int TotalPage { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();
        public ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
        public ICollection<Page> Pages { get; set; } = new List<Page>();
        public ICollection<FavoriteBook> FavoriteBooks { get; set; } = new List<FavoriteBook>();
        public ICollection<ReadingProgress> ReadingProgresses { get; set; } = new List<ReadingProgress>();
    }
}
