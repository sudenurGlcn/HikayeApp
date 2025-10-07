namespace Masal.Application.DTOs
{
    public class ChildProfileDto
    {
        public int ParentId { get; set; }
        public string ProfileName { get; set; } = default!;
        public DateTime? BirthDate { get; set; }
        public bool HasDyslexia { get; set; } = false;
        public string? ProfileAvatarURL { get; set; }
    }
}
