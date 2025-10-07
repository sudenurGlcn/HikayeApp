

namespace Masal.Domain.Entities
{
    public class BookAuthor 
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public int AuthorId { get; set; }

        // Navigation
        public Book Book { get; set; } = default!;
        public Author Author { get; set; } = default!;
    }
}
