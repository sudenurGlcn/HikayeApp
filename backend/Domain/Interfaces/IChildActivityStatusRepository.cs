using Masal.Domain.Entities;

namespace Masal.Domain.Interfaces
{
    public interface IChildActivityStatusRepository : IGenericRepository<ChildActivityStatus,int>
    {
        Task<ChildActivityStatus?> GetStatusAsync(int childId, int activityId);
        void UpdateStatus(ChildActivityStatus status);
    }
}
