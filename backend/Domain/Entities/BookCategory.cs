

namespace Masal.Domain.Entities
{
    public class BookCategory 
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public int CategoryId { get; set; }

        // Navigation
        public Book Book { get; set; } = default!;
        public Category Category { get; set; } = default!;
    }
}
