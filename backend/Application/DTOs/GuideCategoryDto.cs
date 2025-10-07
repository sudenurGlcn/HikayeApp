namespace Masal.Application.DTOs
{
    public class GuideCategoryDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public List<GuideDto> Guides { get; set; } = new List<GuideDto>();
    }
}
