
using Masal.Domain.Enums;

namespace Masal.Domain.Entities
{
    public class Parent 
    {
        public int Id { get; set; }
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public string SubscriptionType { get; set; } = "Free";
        public DateTime? SubscriptionEndDate { get; set; }
        public string? AdaptyProfileID { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<Child> Children { get; set; } = new List<Child>();

        // ✅ Constructor
        public Parent(string fullName, string email, string passwordHash)
        {
            FullName = fullName;
            Email = email;
            PasswordHash = passwordHash;
        }

        // Parametresiz constructor (EF Core için gerekli)
        public Parent() { }
    }
}
