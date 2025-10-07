namespace Masal.Application.DTOs
{
    public class GuideDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string? Content { get; set; }
    }
}
