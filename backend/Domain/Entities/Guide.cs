

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Masal.Domain.Entities
{
    public class Guide 
    {
        
        public int Id { get; set; }

        public int CategoryId { get; set; }

        public string Title { get; set; } = default!;

        public string? Content { get; set; }

        public int DisplayOrder { get; set; } = 1;

        // Navigation Property - Üst başlık (GuideCategory)
        public GuideCategory Category { get; set; } = default!;
    }
}
