

namespace Masal.Domain.Entities
{
    public class Word 
    {
        public int Id { get; set; }
        public string WordText { get; set; } = null!;
        public int WordCategoryID { get; set; }
        // Navigation Property
        public WordCategory WordCategory { get; set; } = null!;
    }
}
