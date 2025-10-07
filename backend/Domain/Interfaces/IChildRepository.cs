using Masal.Domain.Entities;

namespace Masal.Domain.Interfaces
{
    public interface IChildRepository : IGenericRepository<Child,int>
    {
        Task<Child?> GetChildWithParentAsync(int childId);
    }
}
