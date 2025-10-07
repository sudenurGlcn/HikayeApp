

namespace Masal.Domain.Entities
{
    public class Activity 
    {
        public int Id { get; set; }
        public int PageId { get; set; }
        public string ActivityType { get; set; } = "WordSelection";
        public string QuestionText { get; set; } = default!;
        public string? LogicalValidationRule { get; set; }

        // Navigation
        public Page Page { get; set; } = default!;
        public ICollection<ActivityHint> ActivityHints { get; set; } = new HashSet<ActivityHint>();
        public ICollection<ActivityWordCategory> ActivityWordCategories { get; set; } = new List<ActivityWordCategory>();
        public ICollection<ChildGeneratedWord> ChildGeneratedWords { get; set; } = new List<ChildGeneratedWord>();
        public ICollection<ChildActivityStatus> ChildActivityStatuses { get; set; } = new List<ChildActivityStatus>();
        public ICollection<ActivityResponse> Responses { get; set; } = new List<ActivityResponse>();
    }
}
