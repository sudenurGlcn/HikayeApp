using Masal.Domain.Entities;

namespace Masal.Domain.Interfaces
{
    public interface IGuideRepository : IGenericRepository<Guide, int>
    {
        Task<List<GuideCategory>> GetAllGuideCategoriesWithGuidesAsync();
    }
}
