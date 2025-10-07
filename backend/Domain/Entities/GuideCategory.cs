using System.ComponentModel.DataAnnotations;

namespace Masal.Domain.Entities
{
    public class GuideCategory
    {
        
        public int Id { get; set; }

        public string Title { get; set; } = default!;

        public int DisplayOrder { get; set; } = 1;

        // Navigation Property - Alt başlıklar (Guides)
        public ICollection<Guide> Guides { get; set; } = new List<Guide>();
    }
}
