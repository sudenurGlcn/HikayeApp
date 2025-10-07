using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class ParentRepository : GenericRepository<Parent,int>, IParentRepository
    {
        public ParentRepository(MasalAppDbContext context) : base(context)
        {
        }

        public async Task<Parent?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(p => p.Email == email);
        }

        // Navigation property dahil GetByIdAsync
        public async Task<Parent?> GetByIdWithChildrenAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Children) // Child’ları yükle
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
