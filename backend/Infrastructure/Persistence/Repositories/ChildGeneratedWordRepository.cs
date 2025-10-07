using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class ChildGeneratedWordRepository : GenericRepository<ChildGeneratedWord,int>, IChildGeneratedWordRepository
    {
        public ChildGeneratedWordRepository(MasalAppDbContext context) : base(context) { }

        public async Task<List<ChildGeneratedWord>> GetGeneratedWordsAsync(int childId, int activityId)
        {
            return await _dbSet
                .Where(w => w.ChildId == childId && w.ActivityId == activityId && w.IsActive)
                .Include(w => w.WordCategory) // Kategori adını alabilmek için
                .ToListAsync();
        }
    }
}
