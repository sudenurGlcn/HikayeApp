namespace Masal.Application.DTOs
{
    public class ActivityResponseRequestDto
    {
        public int ChildId { get; set; }
        public int ActivityId { get; set; }
        public string ResponseText { get; set; } = string.Empty;
        
    }
}
