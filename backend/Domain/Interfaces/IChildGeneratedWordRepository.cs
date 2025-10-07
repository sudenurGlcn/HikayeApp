using Masal.Domain.Entities;

namespace Masal.Domain.Interfaces
{
    // long ID kullandığımız için TKey = long
    public interface IChildGeneratedWordRepository : IGenericRepository<ChildGeneratedWord, int>
    {
        Task<List<ChildGeneratedWord>> GetGeneratedWordsAsync(int childId, int activityId);
    }
}
