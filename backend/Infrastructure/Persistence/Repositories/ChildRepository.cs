using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class ChildRepository : GenericRepository<Child, int>, IChildRepository
    {
        public ChildRepository(MasalAppDbContext context) : base(context) { }

        public async Task<Child?> GetChildWithParentAsync(int childId)
        {
            return await _dbSet
                .Include(c => c.Parent)
                .FirstOrDefaultAsync(c => c.Id == childId);
        }
    }
}
