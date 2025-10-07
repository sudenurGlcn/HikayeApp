namespace Masal.Application.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string CategoryName { get; set; } = default!;

        public string? Icon { get; set; } = string.Empty;
    }
}
