

namespace Masal.Domain.Entities
{
    public class Category 
    {
        public int Id { get; set; }
        public string CategoryName { get; set; } = default!;
        public string? Icon { get; set; } = string.Empty;

        // Navigation
        public ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
    }
}
