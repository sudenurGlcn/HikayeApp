

namespace Masal.Domain.Entities
{
    public class Page 
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public int PageNumber { get; set; }
        public string PageType { get; set; } = "Content";
        public string BaseImageURL { get; set; } = default!;

        // Navigation
        public Book Book { get; set; } = default!;
        public PageContent? PageContent { get; set; }
        public Activity? Activity { get; set; }
    }
}
