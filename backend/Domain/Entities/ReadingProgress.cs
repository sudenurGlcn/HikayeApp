

namespace Masal.Domain.Entities
{
    public class ReadingProgress 
    {
        public int Id { get; set; }
        public int ChildId { get; set; }
        public int BookId { get; set; }
        public string Status { get; set; } = "NotStarted";
        public int LastReadPageNumber { get; set; } = 0;
        public DateTime? StartDate { get; set; }
        public DateTime? CompletionDate { get; set; }

        // Navigation
        public Child Child { get; set; } = default!;
        public Book Book { get; set; } = default!;
    }
}
