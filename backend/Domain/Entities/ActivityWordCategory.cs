
using System.ComponentModel.DataAnnotations.Schema;

namespace Masal.Domain.Entities
{
    public class ActivityWordCategory 
    {
        public int Id { get; set; }
        public int ActivityId { get; set; }
        public int WordCategoryId { get; set; }

        // Navigation Properties
        public Activity Activity { get; set; } = null!;
        public WordCategory WordCategory { get; set; } = null!;
    }
}
