namespace Masal.Application.DTOs
{
    public class ReadingProgressDto
    {
        public int TotalPages { get; set; }
        public int CurrentPageNumber { get; set; }
        public string Status { get; set; } // 'NotStarted', 'InProgress', 'Completed'
        public double ProgressPercentage => (double)CurrentPageNumber / TotalPages * 100;
    }
}
