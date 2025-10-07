

namespace Masal.Domain.Entities
{
    public class WordCategory 
    {
        public int Id { get; set; }
        public string CategoryName { get; set; } = null!;
        public bool IsDynamic { get; set; } = false;

        // Navigation Properties
        public ICollection<Word> Words { get; set; } = new List<Word>();
        public ICollection<ActivityWordCategory> ActivityWordCategories { get; set; } = new List<ActivityWordCategory>();
        public ICollection<ChildGeneratedWord> ChildGeneratedWords { get; set; } = new List<ChildGeneratedWord>();
    }
}
