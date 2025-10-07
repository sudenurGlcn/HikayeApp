using Masal.Domain.Entities;
using Masal.Domain.Interfaces;
using Masal.Infrastructure.Persistence.Context;

namespace Masal.Infrastructure.Persistence.Repositories
{
    public class ActivityResponseRepository : GenericRepository<ActivityResponse, int>, IActivityResponseRepository
    {
        public ActivityResponseRepository(MasalAppDbContext context) : base(context)
        {
        }
    }
}
