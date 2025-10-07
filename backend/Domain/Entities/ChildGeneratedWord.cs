
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Masal.Domain.Entities
{
    public class ChildGeneratedWord 
    {
        public int Id { get; set; }
        public int ChildId { get; set; }

        public int ActivityId { get; set; }

        public int WordCategoryId { get; set; }

        public string WordText { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Child Child { get; set; } = null!;
        public Activity Activity { get; set; } = null!;
        public WordCategory WordCategory { get; set; } = null!;
    }
}
