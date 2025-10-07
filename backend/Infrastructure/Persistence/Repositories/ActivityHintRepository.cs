using Masal.Domain.Interfaces;
using Masal.Domain.Entities;
using Masal.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class ActivityHintRepository : GenericRepository<ActivityHint, int>, IActivityHintRepository
    {
        public ActivityHintRepository(MasalAppDbContext context) : base(context)
        {
        }

        public async Task<ActivityHint?> GetHintByActivityIdAsync(int activityId)
        {
            return await _context.ActivityHints
                .FirstOrDefaultAsync(h => h.ActivityId == activityId);
        }
    }
}
