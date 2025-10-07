

namespace Masal.Domain.Entities
{
    public class DailyPageView 
    {
        public long Id { get; set; }
        public int ChildId { get; set; }
        public int PageId { get; set; }
        public DateTime ViewDate { get; set; }

        // Navigation Properties
        public Child Child { get; set; } = null!;
        public Page Page { get; set; } = null!;
    }
}
