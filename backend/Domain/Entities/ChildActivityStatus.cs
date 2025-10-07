
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Masal.Domain.Entities
{
    public class ChildActivityStatus 
    {
        public int Id { get; set; }
        public int ChildId { get; set; }  
        public int ActivityId { get; set; }      
        public string Status { get; set; } = "Failed";
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Child Child { get; set; } = null!;
        public Activity Activity { get; set; } = null!;
    }
}
