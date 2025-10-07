namespace Masal.Application.DTOs
{
    public class ChildSummaryDto
    {
        public int Id { get; set; }
        public string ProfileName { get; set; } = default!;
        public string? ProfileAvatarURL { get; set; }
    }
}
