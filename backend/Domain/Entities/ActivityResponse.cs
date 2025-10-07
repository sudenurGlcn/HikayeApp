
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Masal.Domain.Entities
{
    public class ActivityResponse 
    {
        public int Id { get; set; }
        public int ChildId { get; set; }

       
        public int ActivityId { get; set; }

        public int AttemptNumber { get; set; } = 1;
        public string ResponseText { get; set; }
        public bool? IsLogicallyCorrect { get; set; }

        public string? GeminiFeedback { get; set; }

        public DateTime ResponseTimestamp { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Child Child { get; set; } = null!;
        public Activity Activity { get; set; } = null!;
        public ICollection<GeneratedImage> GeneratedImages { get; set; } = new List<GeneratedImage>();
    }
}
