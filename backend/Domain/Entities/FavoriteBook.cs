
using static System.Reflection.Metadata.BlobBuilder;

namespace Masal.Domain.Entities
{
    public class FavoriteBook 
    {
        public int Id { get; set; }
        public int ChildID { get; set; }
        public int BookID { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Child Child { get; set; } = null!;
        public Book Book { get; set; } = null!;
    }
}
