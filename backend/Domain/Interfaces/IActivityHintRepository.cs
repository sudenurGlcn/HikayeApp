using Masal.Domain.Entities;

namespace Masal.Domain.Interfaces
{
    public interface IActivityHintRepository : IGenericRepository<ActivityHint, int>
    {
        Task<ActivityHint?> GetHintByActivityIdAsync(int activityId);
    }
}
