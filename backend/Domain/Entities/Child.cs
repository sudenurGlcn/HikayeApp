

using System.ComponentModel.DataAnnotations.Schema;

namespace Masal.Domain.Entities
{
    public class Child
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public string ProfileName { get; set; } = default!;
        public DateTime? BirthDate { get; set; }
        public bool HasDyslexia { get; set; } = false;
        public string? ProfileAvatarURL { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Parent Parent { get; set; } = default!;
        public ICollection<ActivityResponse> ActivityResponses { get; set; } = new List<ActivityResponse>();
        public ICollection<FavoriteBook> FavoriteBooks { get; set; } = new List<FavoriteBook>();
        public ICollection<ReadingProgress> ReadingProgresses { get; set; } = new List<ReadingProgress>();
        public ICollection<ChildGeneratedWord> ChildGeneratedWords { get; set; } = new List<ChildGeneratedWord>();
        public ICollection<ChildActivityStatus> ChildActivityStatuses { get; set; } = new List<ChildActivityStatus>();
        public ICollection<DailyPageView> DailyPageViews { get; set; } = new List<DailyPageView>();
    }
}
