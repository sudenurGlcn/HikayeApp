using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace Masal.Domain.Entities
{
    public class ActivityHint 
    {
        public int Id { get; set; }
        public int ActivityId { get; set; }
        public string HintText { get; set; }
        public int HintOrder { get; set; }

        // Navigation Property
        public Activity Activity { get; set; }
    }
}
