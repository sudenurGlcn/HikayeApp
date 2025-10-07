

namespace Masal.Domain.Entities
{
    public class DidYouKnow 
    {
        public int Id { get; set; }
        public string InfoText { get; set; } = null!;
        public int DisplayWeight { get; set; } = 1;
    }
}
