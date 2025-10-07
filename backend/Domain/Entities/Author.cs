

namespace Masal.Domain.Entities
{
    public class Author 
    {
        public int Id { get; set; }
        public string AuthorName { get; set; } = default!;
        public string? Biography { get; set; }

        // Navigation
        public ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();
    }
}
