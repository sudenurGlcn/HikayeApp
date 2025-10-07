namespace Masal.Application.DTOs
{
    
    public class ReadingPageDto
    {
        
        public int PageId { get; set; }

        
        public int PageNumber { get; set; }

        
        public string PageType { get; set; }

        
        public string BaseImageUrl { get; set; }

        
        public PageContentDto? Content { get; set; }

        
        public ActivityPageDto? Activity { get; set; }

        
        public double ProgressPercentage { get; set; }
    }
}
