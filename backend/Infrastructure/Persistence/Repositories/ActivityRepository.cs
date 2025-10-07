using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class ActivityRepository : GenericRepository<Activity, int>, IActivityRepository
    {
        public ActivityRepository(MasalAppDbContext context) : base(context)
        {
        }
    }
}
