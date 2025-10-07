using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class GuideRepository : GenericRepository<Guide, int>, IGuideRepository
    {
        public GuideRepository(MasalAppDbContext context) : base(context)
        {
        }

        public async Task<List<GuideCategory>> GetAllGuideCategoriesWithGuidesAsync()
        {
            return await _context.GuideCategories
                .Include(c => c.Guides.OrderBy(g => g.DisplayOrder))
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();
        }
    }
}
