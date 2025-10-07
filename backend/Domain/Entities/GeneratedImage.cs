
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Masal.Domain.Entities
{
    public class GeneratedImage 
    {
        public long Id { get; set; }
        public int ResponseId { get; set; }

        public string ImageURL { get; set; } = string.Empty;
        public string PromptText { get; set; }
        public bool IsSavedToProfile { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        [ForeignKey("ResponseId")]
        public ActivityResponse ActivityResponse { get; set; } = null!;
    }
}
